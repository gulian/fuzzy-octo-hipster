angular.module('fuzzyoctohipster', ['$strap.directives', 'fuzzyFilter','fuzzyServices','ngCookies']).config(function($compileProvider, $interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
	$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|file):/);
}).config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/',					{templateUrl: 'partials/list.html'}).
		when('/filter/:query',					{templateUrl: 'partials/list.html'}).
		when('/add',					{templateUrl: 'partials/add.html' }).
		when('/update/:id',				{templateUrl: 'partials/update.html' }).
		when('/delete/:id',				{templateUrl: 'partials/delete.html' }).
		when('/howto/',				{templateUrl: 'partials/howto.html' }).
		otherwise({redirectTo: '/'});
}])

angular.module('fuzzyFilter', [])
	.filter('trigram', function () {
		return function (text) {
			return text.slice(0,3).toUpperCase();
		};
	});

function navbarController($scope, $routeParams, $http, $modal, $cookies) {
	$scope.userEmail = "" ; // set this value at login in cookie to access it everywhere
	
	$http.get('credentials/').success(function(data){
		$scope.userEmail = data.email ; // set this value at login in cookie to access it everywhere
	});

}

function itemListController($scope, $routeParams, $http, $modal, $cookies, Item) {

	$scope.items = Item.all();

	$http.get('credentials/').success(function(data){
		$scope.connectedUserId = data._id ; // set this value at login in cookie to access it everywhere
	});

	$scope.query = $routeParams.query;

	// $http.get('item/').success(function(data){
	// 	$scope.items = data;
	// });

	$("#bookmarklet").attr("href", "javascript:void((function(d){var e=d.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','"+document.location.origin+"/bookmarklet.js');d.body.appendChild(e)})(document));");

	$scope.click = function(item){
		$http.put('item/clicked/'+item._id).success(function(data) {
			item.click = data.click;
		});
	};

	$scope.emailFilter = function(email){
		$scope.query = email ;
	};

	$scope.showComments = function(item, itemIndex){
		$scope.currentItemId = item.id ;
		$scope.currentItem = item ;
		$modal({
			template: 'partials/comments.html',
			show: true,
			backdrop: 'static',
			scope: $scope,
			persist : true
		});
	};
}

function commentsController($http,$scope){

	$scope.item = $scope.$parent.currentItem;

	$http.get('credentials/').success(function(data){
		$scope.connectedUserId = data._id ; // set this value at login in cookie to access it everywhere
	});


	$scope.addComment = function(){
		$scope.newComment.item = $scope.item._id;
		$http.post('comment/', $scope.newComment).success(function(data) {
			$scope.item.comments.push(data);
			$scope.newComment = {};
		});
	};

	$scope.deleteComment = function(id, index){
		$http.delete('comment/'+id).success(function(data){
			$scope.item.comments.splice(index, 1);
		});
	};

}

function itemAddController($scope, $routeParams, $http, $location, Item) {

	$scope.item = new Item({
		title:'',
		url: 'http://',
		tags: []
	});

	$scope.add = function(){

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length)
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});

		$scope.item.$save($location.path(''));
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

	$scope.item = {
		title:'',
		url: 'http://',
		tags: []
	};

	$http.get('item/'+$routeParams.id).success(function(data){
		$scope.item = data[0];
	});


	$scope.update = function(){

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length){
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});
		}

		delete $scope.item.tagsRepo;

		$http.put('item/'+$routeParams.id, $scope.item).success(function(data){
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

function itemDeleteController($scope,  $http, $routeParams, $location){
	$http.get('item/'+$routeParams.id).success(function(data){
		$scope.item = data[0];
	});

	$scope.delete = function(){
		$http.delete('item/'+$routeParams.id).success(function(data){
			$location.path('');
		});
	};
}
