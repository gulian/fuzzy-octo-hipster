angular.module('fuzzyoctohipster', ['$strap.directives']).config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}).config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/',					{templateUrl: 'partials/list.html'}).
		when('/filter/:query',					{templateUrl: 'partials/list.html'}).
		when('/add',					{templateUrl: 'partials/add.html' }).
		when('/update/:id',				{templateUrl: 'partials/update.html' }).
		when('/delete/:id',				{templateUrl: 'partials/delete.html' }).
		otherwise({redirectTo: '/'});
}]);

function itemListController($scope, $routeParams, $http) {

	$scope.query = $routeParams.query;

	$http.get('item/').success(function(data){
		$scope.items = data;
	});

	$scope.click = function(item){
		$http.put('item/clicked/'+item._id).success(function(data) {
			item.click = data.click;
		});
	};

	$scope.emailFilter = function(email){
		$scope.query = email ;
	};
}

function itemAddController($scope, $routeParams, $http, $location) {

	$scope.item = {
		title:'',
		url: 'http://',
		tags: []
	};

	$scope.add = function(){

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length)
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});

		delete $scope.item.tagsRepo;

		$http.post('item/', $scope.item).success(function(data) {
			$location.path('');
		});
	};

	$scope.handleTag = function(){
		if($scope.item.tagsRepo.indexOf(',') !== -1){
			$scope.item.tags.push({
				name : $scope.item.tagsRepo.slice(0,-1)
			});
			$scope.item.tagsRepo = '';
		}
	};

	$scope.removeTag = function(index){
		$scope.item.tags.splice(index, 1);
	};
}

function itemUpdateController($scope,  $http, $routeParams, $location){
	$http.get('item/'+$routeParams.id).success(function(data){
		$scope.item = data[0];
	});

	$scope.alert = {
		"type": "error",
		"title": "Modification interdite",
		"content": "<br>Vous n'êtes pas propriétaire de ce lien.<br><a href='#/'>Retour</a>",
		"hide" : true
    };

	$scope.update = function(){

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length)
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});

		delete $scope.item.tagsRepo;


		$http.put('item/'+$routeParams.id, $scope.item).success(function(data){
			$location.path('');
		}).error(function(response, code){
			if(code === 403){
				$scope.alert.hide = false;
			}
		});
	};

	$scope.handleTag = function(){
		if($scope.item.tagsRepo.indexOf(',') !== -1){
			$scope.item.tags.push({
				name : $scope.item.tagsRepo.slice(0,-1)
			});
			$scope.item.tagsRepo = '';
		}
	};

	$scope.removeTag = function(index){
		$scope.item.tags.splice(index, 1);
	};

}

function itemDeleteController($scope,  $http, $routeParams, $location){
	$http.get('item/'+$routeParams.id).success(function(data){
		$scope.item = data[0];
	});

	$scope.alert = {
		"type": "error",
		"title": "Suppression interdite",
		"content": "<br>Vous n'êtes pas propriétaire de ce lien.<br><a href='#/'>Retour</a>",
		"hide" : true
    };

	$scope.delete = function(){
		$http.delete('item/'+$routeParams.id).success(function(data){
			$location.path('');
		}).error(function(response, code){
			if(code === 403){
				$scope.alert.hide = false;
			}
		});
	};
}
