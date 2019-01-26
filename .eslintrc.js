module.exports ={
    "env": {
      "node": 1,
			"browser": 1,
			"es6": true
    },
    "globals": {
      "exampleGlobalVariable": true
    },
    "parserOptions": {
			"ecmaVersion": 2017
    },
    "rules": {
        "indent": [ "error",  "tab" ],
        "linebreak-style": [  "error",  "unix" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
    },
    "plugins": [ ]
};