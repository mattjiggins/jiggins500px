var express = require('express');
var router = express.Router();
var Q = require('q');

var api500 = require('../models/500px');

router.get('/', function (req, res, next) {
	
	function grabPhotos() {
	    var deferred = Q.defer();
		api500.photos.getByUsername('mattjiggins',{sort:'taken_at',image_size:'2'})
			.catch(console.error)
			.then(
				function(results) {
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
					deferred.resolve( results );
				}
			);

		return deferred.promise;
	}

	Q.all([
		grabPhotos(),
		grabCollections()
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
		res.render('home', {
			allLeads: leaders,
			allPhotos: thePhotos,
			allCollections: theGalleries
		});
		//res.send(data);
	})
	.done();
	

});

module.exports = router;
