angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            $('.progress-indicator').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
				$('.progress-indicator').hide();
                return response;
            }, function (response) {
				$('.progress-indicator').hide();
                return $q.reject(response);
            });
        };
    });


angular.module('drunkenbear', ['$strap.directives', 'SharedServices']).config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');

}).config(['$routeProvider', function($routeProvider) {

	$routeProvider.
		when('/movies',					{templateUrl: 'partials/movie-list.html'	}).
		when('/movies/search/:query',	{templateUrl: 'partials/movie-list.html'	}).
		when('/movies/add',				{templateUrl: 'partials/movie-add.html'		}).
		when('/movies/:movieId',		{templateUrl: 'partials/movie-details.html'	}).
		otherwise({redirectTo: '/movies'});

}]);

function moviesListController($scope, $routeParams, $http) {
	$scope.movies = JSON.parse(localStorage["moviesCache"] || '[]');

	$scope.orderProp = 'title';
	$scope.query = $routeParams.query;

	$http.get('item/').success(function(data) {
		$scope.movies = data;
		localStorage["moviesCache"] = JSON.stringify(data);
	});

}

function moviesDetailController($scope, $routeParams, $http, $location) {

	$scope.movieId = $routeParams.movieId;

	$http.get('item/'+$scope.movieId).success(function(data) {
		$scope.movie = data;
	});

	$scope.buy = function() {
		open($scope.movie.amazon_url,'_blank');
	};

	$scope.edit = function(){
		$http.put('item/'+$scope.movie._id, $scope.movie).success(function(data) {
			$scope.editSwitch=!$scope.editSwitch;
		});
	};

	$scope.delete = function(){
		$http.delete('item/'+$scope.movie._id).success(function(data) {
			$location.path('/movies');
		});
	};

}
function moviesAddController($scope, $routeParams, $http) {

	$scope.autocompleteSource = [];

	$scope.addEan = function(ean){
		$http.get('/item/add/'+ean).success(function(data) {
			$scope.addResult = data;
		});
	};

	$scope.importEsv = function(esv){
		$http.get('/item/import/'+esv).success(function(data) {
			document.location.reload();
		});
	};

	$scope.search = function(searchedText, callback){
		if(searchedText.length < 4)
			return ;
		$http.get('/item/autocomplete/'+searchedText).success(function(data) {
			callback(data);
		});
	};
}
