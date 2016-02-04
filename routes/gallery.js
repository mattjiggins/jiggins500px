var express = require('express');
var router = express.Router();

var Q = require('q');

var api500 = require('../models/500px');

router.get('/:gallery', function (req, res, next) {
	
	function grabGalleryItems(){
	    var deferred = Q.defer();
		api500.galleries.getItems('14865555',req.params.gallery,{
			sort:'position',
			sort_direction:'asc',
			image_size:[4,1600]
		})
			.catch(console.error)
			.then(
				function(results) {
		            deferred.resolve( results );
				}
			);
	    return deferred.promise;
	}
	
	function grabGallery(){
	    var deferred = Q.defer();
		api500.galleries.getByID('14865555',req.params.gallery,{
			sort:'position',
			sort_direction:'asc',
			image_size:4
		})
			.catch(console.error)
			.then(
				function(results) {
		            deferred.resolve( results );
				}
			);
	    return deferred.promise;
	}	

	Q.all([
		grabGallery(),
		grabGalleryItems()
	])
	.then(
		function(data) {
			var thePhotos = data[1].photos;
			var photos = []

			thePhotos.forEach(function(image){
				photos.push({
					id: image.id,
					name: image.name,
					taken_at: image.taken_at,
					description: image.description,
					url: image.url,
					width: image.width,
					height: image.height,
					custom_thumbnail: image.images[0].url,
					custom_full: image.images[1].url
				})
			});

			res.render('gallery', {
				layout:'main_gallery',
				gallery: data[0].gallery,
				photos: photos
			});
			// res.send(photos);
		}
	)


});

module.exports = router;
