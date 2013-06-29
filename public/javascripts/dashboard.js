angular.module('drunkenbear', []).config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}).config(['$routeProvider', function($routeProvider) {

	$routeProvider.
			when('/movies',				{templateUrl: 'partials/movie-list.html'	, controller: moviesListController}).
			when('/movies/:movieId',	{templateUrl: 'partials/movie-details.html'	, controller: moviesDetailController}).
			otherwise({redirectTo: '/movies'});

}]);


function moviesListController($scope, $http) {

	$scope.orderProp = 'title';

	$http.get('item/').success(function(data) {
		$scope.movies = data;
	});

	$scope.details = function(){
		console.log('detail');
	};

}

function moviesDetailController($scope, $routeParams, $http) {

	$scope.movieId = $routeParams.movieId;

	$http.get('item/'+$scope.movieId).success(function(data) {
		$scope.movie = data;
	});

	$scope.share = function() {
		window.open($scope.movie.amazon_url,'_blank');
	};

}
