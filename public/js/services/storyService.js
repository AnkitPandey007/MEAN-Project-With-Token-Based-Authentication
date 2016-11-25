angular.module('storyService', [])

.factory('Story', ['$http', function($http){
	
	var stroyFctory = {};

	stroyFctory.allStories = function() {
		return $http.get("/api/all_stories");
	}

	stroyFctory.create = function(storyData) {
		return $http.post("/api", storyData);
	}

	stroyFctory.allStory = function() {
		console.log("inside service");
		 return $http.get("/api");
	}

	return stroyFctory;
}])

.factory('socketio', ['$rootScope', function($rootScope) {

	var socket = io.connect();
	return{

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function(){
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}
}]);