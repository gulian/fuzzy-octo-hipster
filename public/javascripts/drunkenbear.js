angular.module('drunkenbear', ['ui.bootstrap']).config(function($interpolateProvider) {
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

	$scope.orderProp = 'title';
	$scope.query = $routeParams.query;
	$http.get('item/').success(function(data) {
		$scope.movies = data;
	});

}

function moviesDetailController($scope, $routeParams, $http, $location) {

	$scope.movieId = $routeParams.movieId;

	$http.get('item/'+$scope.movieId).success(function(data) {
		$scope.movie = data;
	});

	$scope.buy = function() {
		window.open($scope.movie.amazon_url,'_blank');
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
$scope.states = '';
	//$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	
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
	
	$scope.search = function(searchedText){
		$http.get('/item/autocomplete/'+searchedText).success(function(data) {
			console.log(data);
			$scope.states = data;
		});
	};
}
