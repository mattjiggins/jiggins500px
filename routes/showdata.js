var express = require('express');
var router = express.Router();

var Q = require('q');

var api500 = require('../models/500px');

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
		
	function grabPhotos() {
	    var deferred = Q.defer();
		api500.photos.getByUsername('mattjiggins',{sort:'taken_at'})
			.catch(console.error)
			.then(
				function(results) {
		            console.log('Finished with grabPhotos.');
		            deferred.resolve( results );
				}
			);
	    return deferred.promise;
	}

	function grabCollections() {
	    var deferred = Q.defer();

		api500.galleries.get('14865555',{sort:'position',sort_direction:'asc',kinds:'4'})
			.catch(console.error)
			.then(
				function(results) {
					console.log('Finished with grabCollections.');
					deferred.resolve( results );
				}
			);

		return deferred.promise;
	}

	Q.all([
		grabPhotos(),
		grabCollections(),
		grabUser()
	])
	.then(function(data){
		
		function checkport(portfolioID) {
			var keyPortfolios = [19540257,21189023];
			var keyGalleries = [21255247,21255347,21255665];
			if ( keyGalleries.indexOf(portfolioID) !== -1 ) {
				return 1;
			} else { return 0; }
		}
		function setImageClass(portfolioID) {
			var imageClass = "img-responsive ";
			if ( checkport(portfolioID) ===1 ) {
				imageClass += " img-large";
			}
			return imageClass;
		}
		function setListClass(portfolioID) {
			var listClass = "item ";
			if ( checkport(portfolioID) ===1 ) {
				listClass += " item--large";
			}
			return listClass;
		}
		

		var thePhotos = data[0].photos;
		var theGalleries = data[1].galleries;
		var theUser = data[2].user;

		var leaders = [];
		theGalleries.forEach(function(entry){
			if (entry.items_count > 0) {
				leaders.push({
					id: entry.thumbnail_photos[0].id,
					name: entry.thumbnail_photos[0].name,
					image_url: entry.thumbnail_photos[0].image_url,
					image_classes: setImageClass(entry.id),
					list_classes: setListClass(entry.id),
					portfolio_id: entry.id,
					portfolio_title: entry.name,
					portfolio_custom_path: entry.custom_path,
					portfolio_highlight: checkport(entry.id)
				})
			}

		});
		var collected = []
		collected.push({
			photos: thePhotos
		});
		collected.push({
			galleries: theGalleries
		});
		collected.push({
			user: theUser
		});
		collected.push({
			leaders: leaders
		});
		
		res.send(collected);
	})
	.done(
		function(){
			console.log("Done");
		}
	);
	

});

module.exports = router;