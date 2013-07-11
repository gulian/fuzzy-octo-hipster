angular.module('fuzzyoctohipster', ['$strap.directives']).config(function($compileProvider, $interpolateProvider) {
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
}]);

function itemListController($scope, $routeParams, $http, $modal) {

	$scope.showComments = false ;

	$scope.query = $routeParams.query;

	$http.get('item/').success(function(data){
		$scope.items = data;
	});

	$scope.bookmarklet  = "javascript:(function(){";
		$scope.bookmarklet += "function createCORSRequest(method, url){var x = new XMLHttpRequest();if ('withCredentials' in x)x.open(method, url, true);else if (typeof XDomainRequest != 'undefined') {x = new XDomainRequest();x.open(method, url);} else x = null;return x;}";
		$scope.bookmarklet += "var tags = prompt('Tags (séparés par des virgules)');";
		$scope.bookmarklet += "var h=new createCORSRequest(),url='"+document.location.origin+"/item/',params='title='+document.title+'&url='+document.location+'&tags='+tags;";
		$scope.bookmarklet += "h.withCredentials = true;";
		$scope.bookmarklet += "h.open('POST',url,true);";
		$scope.bookmarklet += "h.setRequestHeader('Content-type','application/x-www-form-urlencoded');";
		$scope.bookmarklet += "h.onreadystatechange = function() {if(h.readyState == 4 && h.status == 200){alert('Lien ajouté avec succés !');} else if(h.readyState == 4 && h.status == 403){alert(\"Vous n'êtes pas authentifié\");}};";
		$scope.bookmarklet += "h.send(params);";
	$scope.bookmarklet += "}());";

	$("#bookmarklet").attr("href", $scope.bookmarklet);

	$scope.click = function(item){
		$http.put('item/clicked/'+item._id).success(function(data) {
			item.click = data.click;
		});
	};

	$scope.emailFilter = function(email){
		$scope.query = email ;
	};

	$scope.showComments = function(id){
		$scope.currentItemId = id ;
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

	$http.get('item/'+$scope.$parent.currentItemId).success(function(data){
		$scope.item = data[0];
	});

	$scope.addComment = function(){
		$scope.newComment.item = $scope.$parent.currentItemId;
		$http.post('comment/', $scope.newComment).success(function(data) {
			data.user = {
				email : "You"
			};
			$scope.item.comments.push(data);
			$scope.newComment = {};
		});
	};

	$scope.deleteComment = function(id, index){
		$http.delete('comment/'+id).success(function(data){
			$scope.item.comments.splice(index, 1);
		}).error(function(response, code){
			if(code === 403){
				//TODO tell user that this is not his comment
			}
		});
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

	$scope.item = {
		title:'',
		url: 'http://',
		tags: []
	};

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

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length){
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});
		}

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
