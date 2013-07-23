angular.module('fuzzyoctohipster', ['$strap.directives', 'fuzzyFilter','fuzzyServices','ngCookies']).config(function($compileProvider, $interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
	$compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|file):/);
}).config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/',					{templateUrl: 'partials/list.html'}).
		when('/howto/',				{templateUrl: 'partials/howto.html' }).
		otherwise({redirectTo: '/'});
}])

angular.module('fuzzyFilter', [])
	.filter('trigram', function () {
		return function (text) {
			if(text)
			return text.slice(0,3).toUpperCase();
		};
	}).filter('timeago', function() {
        return function(input, p_allowFuture) {
            var substitute = function (stringOrFunction, number, strings) {
                    var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings= {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d days",
                    month: "about a month",
                    months: "%d months",
                    year: "about a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
            
                // var strings = this.settings.strings;
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
                
            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);

            return $.trim([prefix, words, suffix].join(separator));
            // conditional based on optional argument
            // if (somethingElse) {
            //     out = out.toUpperCase();
            // }
            // return out;
        }
    });

function navbarController($scope, $routeParams, $http, $modal, $cookies, $modal) {
	$scope.userEmail = "" ; // set this value at login in cookie to access it everywhere
	
	$http.get('credentials/').success(function(data){
		$scope.userEmail = data.email ; // set this value at login in cookie to access it everywhere
	});

	$scope.addModal = function(){
		$modal({
			template: 'partials/add.html',
			show: true,
			backdrop: 'static',
			persist : true
		});
	}
}

function itemListController($scope, $rootScope, $routeParams, $http, $modal, $cookies, Item) {

	$rootScope.items = Item.all();

	$http.get('credentials/').success(function(data){
		$scope.connectedUserId = data._id ; // set this value at login in cookie to access it everywhere
	});

	$scope.filterList = function(filter){
		$scope.query = filter ;
	}

	$("#bookmarklet").attr("href", "javascript:void((function(d){var e=d.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','"+document.location.origin+"/bookmarklet.js');d.body.appendChild(e)})(document));");

	$scope.click = function(item){
		$http.put('item/clicked/'+item._id).success(function(data) {
			item.click = data.click;
		});
	};

	$scope.emailFilter = function(email){
		$scope.query = email ;
	};

	$scope.updateModal = function(item, itemIndex){
		$scope.currentItemId = item.id ;
		$scope.currentItem = item ;
		$modal({
			template: 'partials/update.html',
			show: true,
			backdrop: 'static',
			scope: $scope,
			persist : true
		});
	}

	$scope.deleteModal = function(item, itemIndex){
		$scope.currentItemIndex = itemIndex ;
		$scope.currentItem = item ;
		$modal({
			template: 'partials/delete.html',
			show: true,
			backdrop: 'static',
			scope: $scope,
			persist : true
		});
	}

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

function itemAddController($scope, $rootScope, $routeParams, $http, $location, Item) {

	$scope.item = new Item({
		title:'',
		url: 'http://',
		tags: [], 
		tagsRepo : ''
	});

	$scope.add = function(){

		if($scope.item.tagsRepo.length)
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});

		$scope.item.$save(function(data){
			$rootScope.items.unshift(data);
			$scope.hide();
		});
	};

	$scope.handleTag = function(){
		if($scope.item.tagsRepo.indexOf(',') !== -1){
			$scope.item.tags.push({ name : $scope.item.tagsRepo.slice(0,-1)});
			$scope.item.tagsRepo = '';
		}
	};

	$scope.removeTag = function(index){
		$scope.item.tags.splice(index, 1);
	};
}

function itemUpdateController($scope,$rootScope, $http, $routeParams, $location){

	$scope.item = $scope.$parent.currentItem;
	var save = angular.copy($scope.item);

	$scope.update = function(){

		if($scope.item.tagsRepo && $scope.item.tagsRepo.length){
			$scope.item.tags.push({
				name : $scope.item.tagsRepo
			});
		}

		$http.put('item/' + $scope.item._id, $scope.item).success(function(data){
			$rootScope[$scope.$parent.currentItemIndex] = data;
			$scope.hide();
		});

	};

	$scope.cancelUpdate = function(){
		angular.copy(save, $scope.item);
		$scope.hide();
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

function itemDeleteController($scope, $rootScope, $http, $routeParams, $location){
	$scope.item = $scope.$parent.currentItem;
	$scope.delete = function(){
		$http.delete('item/'+$scope.$parent.currentItem._id).success(function(data){
			$rootScope.items.splice($scope.$parent.currentItemIndex, 1);
			$scope.hide(); 
		});
	};
}
