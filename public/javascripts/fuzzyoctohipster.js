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
	$http.get('item/').success(function(data){
		$scope.items = data;
	});

	$scope.dropdown = [
			{text: 'Another action', href: '#anotherAction'},
			{divider: true},
			{text: 'Separated link', href: '#',
				submenu: [
					{text: 'Second level link', href: '#'},
					{text: 'Second level link 2', href: '#'}
				]
			}
	];


}

function itemAddController($scope, $routeParams, $http) {

	$scope.item ={};
	$scope.item.title = '';
	$scope.item.url = 'http://';

	$scope.add = function(){
		$http.post('item/', $scope.item).success(function(data) {
			console.log(data);
		});
	}
}
