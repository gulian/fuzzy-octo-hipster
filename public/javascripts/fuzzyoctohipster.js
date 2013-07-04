angular.module('fuzzyoctohipster', ['$strap.directives']).config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}).config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('',					{templateUrl: 'partials/list.html'}).
		when('/add',				{templateUrl: 'partials/add.html' }).
		otherwise({redirectTo: ''});
}]);

function itemListController($scope, $routeParams, $http) {

}

function itemAddController($scope, $routeParams, $http) {

}
