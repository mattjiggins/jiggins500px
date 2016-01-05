var express = require('express');
var router = express.Router();
var api500 = require('../models/500px');

var Q = require('q');

router.get('/', function (req, res, next) {
	function grabUser(){
	    var deferred = Q.defer();
		api500.users.getById('14865555')
			.catch(console.error)
			.then(
				function(results) {
		            deferred.resolve( results );
				}
			);
	    return deferred.promise;
		
	}

	Q.all([
		grabUser()
	])
	.then(
		function(data) {
			res.render('about', {
				user: data[0].user
			});
			//res.send(data[0].user);
		}
	)


});

module.exports = router;
