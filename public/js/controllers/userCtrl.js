angular.module('userCtrl', ['userService'])

.controller('UserController', ['User', function(User){
	
	var vm = {};

	User.all()
		.success(function(data) {
			vm.users = data;
		})
}])

.controller('UserCreateController', ['$location', '$window', 'User', function($location, $window, User){
	
	var vm = this;
	//var vm.userData = {};
	vm.signupuser = function() {
		console.log("Now re are here - " + vm.userData.name);
		vm.message = '';
		User.create(vm.userData)
			.then(function(response) {
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			})
	}
}])