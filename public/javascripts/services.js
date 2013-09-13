angular.module('fuzzyServices', ['ngResource']).
    factory('Item', function($resource){
        return $resource('/item/', {}, {
            all: {method:'GET', isArray:true}
        });
    }).
    factory('Snippet', function($resource){
        return $resource('/snippet/', {}, {
            all: {method:'GET', isArray:true}
        });
    }).
    factory('Article', function($resource){
        return $resource('/article/', {}, {
            all: {method:'GET', isArray:true}
        });
    });
