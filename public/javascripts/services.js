angular.module('fuzzyServices', ['ngResource']).
	factory('Item', function($resource){
		return $resource('/item/', {}, {
			all: {method:'GET', isArray:true}
		});
	});
