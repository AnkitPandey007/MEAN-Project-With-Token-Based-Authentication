angular.module('mainCtrl', [])

.controller('MainController', ['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

		var vm = this;
		vm.loggedIn = Auth.isLoggedIn();

		$rootScope.$on('$routeChangeStart', function() {
			vm.loggedIn = Auth.isLoggedIn();
			Auth.getUser()
				.then(function(data) {
					vm.user = data.data;
				})
		});

		//Creting a new method
		vm.doLogin = function() {
			console.log("We are here");
			vm.processing = true;
			vm.error = '';
			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data) {

					vm.processing = false;
					Auth.getUser()
						.then(function(data) {
							console.log("Inside login Then");
							vm.user = data.data;
						});
					if(data.success) {
						console.log("Inside login success");
						$location.path("/");
					} else {
						vm.error = data.message;
					}
				});
		}

		vm.doLogout = function() {
			Auth.logout();
			console.log("Love you sapna");
			$location.path('/logout');
		}
}])