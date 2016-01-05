# Photography Website: 500px API

This node app / website uses the 500px API.

You will need to create your own "keys" file in modules/

Suggested syntax:


` var API500 = require('600px'),
`     api500 = new API500({
`       consumer_key: 'key from 500px.com',
`       consumer_secret: 'secret from 500px.com',
`       token: "",
`       token_secret: ""
`      });
` 	 
` module.exports = api500;