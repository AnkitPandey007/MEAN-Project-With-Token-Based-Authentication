angular.module('appRoutes', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/pages/home.html',
			controller: 'MainController',// Either we  can inject(write) controller here or we can write in home.html in the parent div to use their property
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'views/pages/signup.html'
		})
		.when('/logout', {
			templateUrl: 'views/pages/home.html'
		})
		.when('/allStories', {
			templateUrl: 'views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: { // If we not put this then entire thing will go slow
				stories: function(Story){
					return Story.allStories();
				}
			}

		})
		$locationProvider.html5Mode(true);
}])