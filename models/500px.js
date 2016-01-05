var API500 = require('600px'),
    api500 = new API500({
      consumer_key: process.env.FIVEHUNDRED_CONSUMER_KEY,
      consumer_secret: process.env.FIVEHUNDRED_CONSUMER_SECRET,
      token: process.env.FIVEHUNDRED_TOKEN,
      token_secret: process.env.FIVEHUNDRED_TOKEN_SECRET
     });
	 
module.exports = api500;