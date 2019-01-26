# Strumosa

An Azure NodeJS App.

This is a sample node.js app for an [Azure App Service Web App](https://docs.microsoft.com/azure/app-service-web).


## Workflow

Run locally
```
npm start
```


Prepare for deployment
```
zip -r myAppFiles.zip .
```

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

This [SO](https://stackoverflow.com/questions/36001552/eslint-parsing-error-unexpected-token) answer talks about the problems with a react file and ES5/6 differences.

As of now, we cannot ignore this setting as it is in some Google file we will have to find.



## Getting started

NodeJS [Azure getting started docs](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs)

Create an account and login to the [portal](https://portal.azure.com).

Install the CLI and log
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
```

Creates an App Service plan
```
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
```

Create a web app in the myAppServicePlan App Service plan 
```
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name>
```

Set the Node runtime to 8.11.1. To see all supported runtimes, run az webapp list-runtimes.
```
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITE_NODE_DEFAULT_VERSION=8.11.1
```

```
http://<app_name>.azurewebsites.net
```




## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.