# Strumosa

An Azure NodeJS App.

This is a sample node.js app for an [Azure App Service Web App](https://docs.microsoft.com/azure/app-service-web).


#
## Table of Contents

1. [Workflow](#workflow)
1. [Linting](#linting)
1. [Node best practices](#node-best-practices)
1. [Getting started](#getting-started)
1. [Contributing](#contributing)


#
## Workflow

Run locally
```
npm start
```

Lint the source
```
npm run lint
```

Prepare for deployment
```
zip -r myAppFiles.zip .
```

Drop the zip file into the [deployment page](https://strumosa.scm.azurewebsites.net/ZipDeployUI).


#
## Testing

Decided to go with [Jest](https://jestjs.io/docs/en/getting-started.html) due to the easy setup.  The actual tests themselves are very similar to Jasmine, Mocha & Chai.  Using [this source](https://medium.com/@ryanblahnik/setting-up-testing-with-jest-and-node-js-b793f1b5621e) to get started.  This requires switching to [Airbnb linting](https://www.npmjs.com/package/eslint-config-airbnb-base), which will change the linting section which was initially setup with Google, then went to custom.  Airbnb is super strict and is probably a good thing when trying to follow best practices.

After switching the linting and installing Jest and the Jest plugin we are ready to set up a first test as shown in the Jest getting started docs shown above and also shown in the Medium tut.




#
## Linting

The standard is [ESlint](https://eslint.org/docs/developer-guide/nodejs-api).  Setting it up goes something like this.

```
npm install eslint --save-dev
./node_modules/.bin/eslint --init
-bash: /node_modules/.bin/eslint: No such file or directory
npm run lint -- --init
? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? 
❯ Airbnb (https://github.com/airbnb/javascript) 
  Standard (https://github.com/standard/standard) 
  Google (https://github.com/google/eslint-config-google) 
```

Airbnb standard or Google?
*If you prefer a lighter touch from your linter, Google is probably the best choice. If you are interested in having a strongly opinionated linter that provides additional validation and React support out of the box, AirBnB is the style guide for you.* ([source](https://medium.com/@uistephen/style-guides-for-linting-ecmascript-2015-eslint-common-google-airbnb-6c25fd3dff0)).

I chose Google since this server app will be used with Angular.  If it was React then I would have gone for Airbnb.  Anyhow, running the linter for the first time results in this output:
```
$ npm run lint
> app-service-hello-world@0.0.1 lint /Users/tim/node/azure/nodejs-docs-hello-world-master
> eslint **/*.js
/Users/tim/node/azure/nodejs-docs-hello-world-master/index.js
   1:1   error  Unexpected var, use let or const instead      no-var
   3:1   error  Unexpected var, use let or const instead      no-var
   4:1   error  Expected indentation of 2 spaces but found 4  indent
   4:30  error  Strings must use singlequote                  quotes
   4:46  error  Strings must use singlequote                  quotes
   5:1   error  Expected indentation of 2 spaces but found 4  indent
   5:18  error  Strings must use singlequote                  quotes
   8:1   error  Unexpected var, use let or const instead      no-var
  11:13  error  Strings must use singlequote                  quotes
✖ 9 problems (9 errors, 0 warnings)
  6 errors and 0 warnings potentially fixable with the `--fix` option.
npm ERR! Darwin 18.2.0
npm ERR! argv "/Users/tim/.nvm/versions/node/v6.9.2/bin/node" "/Users/tim/.nvm/versions/node/v6.9.2/bin/npm" "run" "lint"
npm ERR! node v6.9.2
npm ERR! npm  v3.10.9
npm ERR! code ELIFECYCLE
npm ERR! app-service-hello-world@0.0.1 lint: `eslint **/*.js`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the app-service-hello-world@0.0.1 lint script 'eslint **/*.js'.
```

Since the reporting is set for errors not warnings, npm exits.  Probably we want to change this.
First of all, any lib using var in 2019 has problems.  So right out of the box I am questioning Microsoft's ability to keep up.  Yes, they made VSCode which I'm using right now.  But that's one team out of many.  The people running Azure don't pay much attention to NodeJS to ship an example app using var.

Rant over.  I would prefer tabs of 4 spaces but couldn't easily figure out how to modify the Google style guide and am not that attached to it.  Single quotes, of course.

But still getting this error:
```
  3:1  error  Parsing error: The keyword 'const' is reserved
```

Changed const to let and got this error:
```
  1:5  error  Parsing error: Unexpected token http
```

This [SO](https://stackoverflow.com/questions/36001552/eslint-parsing-error-unexpected-token) answer says unexpected token errors in ESLint parsing occur due to incompatibility between the development environment and ESLint's current parsing capabilities with the ongoing changes with JavaScripts.

As of now, we cannot ignore this setting as it is in some Google file we will have to find.

The recomended fix for the const keyword error is this in the eslintrc file:
```
{
    "parserOptions": {
        "ecmaVersion": 2017
    },

    "env": {
        "es6": true
    }
}
```

But this doesn't work for us.
Then I realized that my answer to use a JS style of lint file in the init process created another .eslintrc file with a .js extension, and my changes the the .eslintrc were not taking effect.  Removed the Google styles and configured them manually and now it works.

Next is making it run as part of a build pipeline.

But when adding Jest testing, it was decided to go with Airbnb after all for its super strict approach.  This was done using this command:
```
npx install-peerdeps --dev eslint-config-airbnb-base
```

We changed the ```.eslintrc.js``` file to include the Jest plugin.  After the first run we get this:
```
/Users/tim/node/azure/nodejs-docs-hello-world-master/index.js
   3:34  warning  Unexpected unnamed function                       func-names
   3:34  error    Unexpected function expression                    prefer-arrow-callback
   3:42  error    Missing space before function parentheses         space-before-function-paren
   4:1   error    Expected indentation of 2 spaces but found 1 tab  indent
   4:2   error    Unexpected tab character                          no-tabs
   4:26  error    A space is required after '{'                     object-curly-spacing
   4:55  error    A space is required before '}'                    object-curly-spacing
   5:1   error    Expected indentation of 2 spaces but found 1 tab  indent
   5:2   error    Unexpected tab character                          no-tabs
  11:1   warning  Unexpected console statement                      no-console
✖ 10 problems (8 errors, 2 warnings)
  6 errors and 0 warnings potentially fixable with the `--fix` option.
```

Wow, that is super strict.  Changing this
```
http.createServer(function(request, response) {
```

To this
```
http.createServer((request, response) => {
```

Got us down to ```7 problems (6 errors, 1 warning)```.  Going to try the --fix option now.
```
  11:1  warning  Unexpected console statement  no-console
✖ 1 problem (0 errors, 1 warning)
```

That was great.  Might leave that flag in the package.json script for good.

Another thing we need to do is create the src directory and move our code there.  That's a basic best practice.  But, not sure how having the index file in a sub directory will affect our Azure deployment, so going to hold off on moving the index file there for now.  Everything else can go there.



#
## Node Best practices

In an effort to better define the code in the server app, we're going to be applying the Node best practices described [here](https://github.com/i0natan/nodebestpractices).  Below are some notes to get started with.


### Code structure

Put modules/libraries in a folder, place an index.js file that exposes the module's internals so every consumer will pass through it. This serves as an 'interface' and eases future changes without breaking the contract.

Instead of this:
```
module.exports.SMSProvider = require('./SMSProvider/SMSProvider.js');
module.exports.SMSNumberResolver = require('./SMSNumberResolver/SMSNumberResolver.js');
```

Do this:
```
module.exports.SMSProvider = require('./SMSProvider');
module.exports.SMSNumberResolver = require('./SMSNumberResolver');
```

Component folder example
```
index
model
modelAPI
modelController
modelDAL
modelError
modelService
modelTesting
```

Separate the Express definition to at least two files: 
1. the API declaration (app.js) 
2. the networking concerns (WWW). 

Locate API declarations within components.

keys can be read from file and from environment variable.
secrets are kept outside committed code
config is hierarchical for easier findability. 
(example packages: rc, nconf and config)



### Async error handling
Async-await instead enables a much more compact code syntax like try-catch.

```
var userDetails;
function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.github.com/users/narenaryan',
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
     // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}
```
[[source](https://medium.com/@tkssharma/writing-neat-asynchronous-node-js-code-with-promises-async-await-fa8d8b0bcd7c)]


### Use async/await and promises

Add some helper functions
```
throwError = (code, errorType, errorMessage) => error => {
  if (!error) error = new Error(errorMessage || 'Default Error')
  error.code = code
  error.errorType = errorType
  throw error
}
throwIf = (fn, code, errorType, errorMessage) => result => {
  if (fn(result)) {
    return throwError(code, errorType, errorMessage)()
  }
  return result
}
sendSuccess = (res, message) => data => {
  res.status(200).json({type: 'success', message, data})
}
sendError = (res, status, message) => error => {
  res.status(status || error.status).json({
    type: 'error', 
    message: message || error.message, 
    error
  })
}
// handle both Not Found and Error cases in one command
const user = await User
  .findOne({where: {login: req.body.login}})
  .then(
    throwIf(r => !r, 400, 'not found', 'User Not Found'),
    throwError(500, 'sequelize error')
  )
//<-- After that we can use `user` variable, it's not empty
```
[[source](https://codeburst.io/node-express-async-code-and-error-handling-121b1f0e44ba)]



### CI Choices

Jenkins - complex setup 
CircleCI - flexible CI pipeline without the burden of managing the whole infrastructure


### Testing

Test should run when a developer saves or commits a file, full end-to-end tests usually run when a new pull request is submitted

tagging tests with keywords like #cold #api #sanity so you can grep with your testing harness and invoke the desired subset. For example, this is how you would invoke only the sanity test group with Mocha: mocha --grep 'sanity'

### Code coverage tools 

Like 
```
Istanbul
NYC
```

### Static analysis 

Tools for the CI build should fail when it finds code smells. 
For example, detect duplications, perform advanced analysis (e.g. code complexity) and follow the history and progress of code issues. 

Options:
```
Sonarqube (2,600+ stars)
Code Climate (1,500+ stars)
```

# 
## Getting started

NodeJS [Azure getting started docs](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs)

Create an account and login to the [portal](https://portal.azure.com).

Install the CLI and login
```
brew update && brew install azure-cli
...
az login
```

To see all supported locations for App Service in Free tier, run the 
```
az app service list-locations --sku FREE
```

Create a resource group
```
az group create --name myResourceGroup --location "South Central US"
{
  "id": "/subscriptions/ad130dfc-ad9f-4c52-adf9-ea9bfa73670e/resourceGroups/myResourceGroup",
  "location": "southcentralus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

Creates an App Service plan
```
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
{
  "adminSiteName": null,
  "freeOfferExpirationTime": null,
  "geoRegion": "South Central US",
  "hostingEnvironmentProfile": null,
  "hyperV": false,
  "id": "/subscriptions/ad130dfc-ad9f-4c52-adf9-ea9bfa73670e/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "isSpot": false,
  "isXenon": false,
  "kind": "app",
  "location": "South Central US",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  "numberOfSites": 0,
  "perSiteScaling": false,
  "provisioningState": "Succeeded",
  "reserved": false,
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capabilities": null,
    "capacity": 0,
    "family": "F",
    "locations": null,
    "name": "F1",
    "size": "F1",
    "skuCapacity": null,
    "tier": "Free"
  },
  "spotExpirationTime": null,
  "status": "Ready",
  "subscription": "ad130dfc-ad9f-4c52-adf9-ea9bfa73670e",
  "tags": null,
  "targetWorkerCount": 0,
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

Create a web app in the myAppServicePlan App Service plan 
```
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name strumosa
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "strumosa.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "strumosa.azurewebsites.net",
    "strumosa.scm.azurewebsites.net"
  ],
  "ftpPublishingUrl": "ftp://waws-prod-sn1-151.ftp.azurewebsites.windows.net/site/wwwroot",
  "hostNameSslStates": [
    {
      "hostType": "Standard",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "strumosa.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIp": null
    },
    {
      "hostType": "Repository",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "strumosa.scm.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIp": null
    }
  ],
  "hostNames": [
    "strumosa.azurewebsites.net"
  ],
  "hostNamesDisabled": false,
  "hostingEnvironmentProfile": null,
  "httpsOnly": false,
  "hyperV": false,
  "id": "/subscriptions/ad130dfc-ad9f-4c52-adf9-ea9bfa73670e/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/strumosa",
  "identity": null,
  "isDefaultContainer": null,
  "isXenon": false,
  "kind": "app",
  "lastModifiedTimeUtc": "2019-01-26T21:41:07.523333",
  "location": "South Central US",
  "maxNumberOfWorkers": null,
  "name": "strumosa",
  "outboundIpAddresses": "13.66.38.99,13.66.35.170,13.66.36.236,13.66.32.249,52.171.63.58",
  "possibleOutboundIpAddresses": "13.66.38.99,13.66.35.170,13.66.36.236,13.66.32.249,52.171.63.58,40.124.44.122,70.37.55.197,70.37.50.96",
  "repositorySiteName": "strumosa",
  "reserved": false,
  "resourceGroup": "myResourceGroup",
  "scmSiteAlsoStopped": false,
  "serverFarmId": "/subscriptions/ad130dfc-ad9f-4c52-adf9-ea9bfa73670e/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "siteConfig": null,
  "slotSwapStatus": null,
  "state": "Running",
  "suspendedTill": null,
  "tags": null,
  "targetSwapSlot": null,
  "trafficManagerHostNames": null,
  "type": "Microsoft.Web/sites",
  "usageState": "Normal"
}
```

Set the Node runtime to 8.11.1. To see all supported runtimes, run az webapp list-runtimes.
```
az webapp config appsettings set --resource-group myResourceGroup --name strumosa --settings WEBSITE_NODE_DEFAULT_VERSION=8.11.1
[
  {
    "name": "WEBSITE_NODE_DEFAULT_VERSION",
    "slotSetting": false,
    "value": "8.11.1"
  }
]
```

The website should be available at
```
http://strumosa.azurewebsites.net
```

Deploying the site after doing the zip of the project as described previously can be accomplished following [this link](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs#deploy-zip-file) which says you can drag the zip to the file explorer area on the web page.  The web page I'm assuming is the Azure dashboard.  However, going to the website address of the deployment, we don't seem to get the message from the node app.

Re-reading the deployment page it shows we can go to our [deployment page](https://strumosa.scm.azurewebsites.net/ZipDeployUI) and drop the zip there.  It took a while to unpack, but now the server is serving.  Time for lunch.


#
## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.