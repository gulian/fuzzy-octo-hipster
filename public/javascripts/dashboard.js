angular.module('drunkenbear', []).config(function($interpolateProvider) {

	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');

}).config(['$routeProvider', function($routeProvider) {

	$routeProvider.
		when('/movies',				{templateUrl: 'partials/movie-list.html'	, controller: moviesListController}).
		when('/movies/search/:query',	{templateUrl: 'partials/movie-list.html'	, controller: moviesListController}).
		when('/movies/:movieId',	{templateUrl: 'partials/movie-details.html'	, controller: moviesDetailController}).
		otherwise({redirectTo: '/movies'});

}]);


function moviesListController($scope, $routeParams, $http) {

	$scope.orderProp = 'title';
	$scope.query = $routeParams.query;

	$http.get('item/').success(function(data) {
		$scope.movies = data;
	});

	$scope.details = function(){
	};

}

function moviesDetailController($scope, $routeParams, $http) {

	$scope.movieId = $routeParams.movieId;

	$http.get('item/'+$scope.movieId).success(function(data) {
		$scope.movie = data;
	});

	$scope.buy = function() {
		window.open($scope.movie.amazon_url,'_blank');
	};

}
