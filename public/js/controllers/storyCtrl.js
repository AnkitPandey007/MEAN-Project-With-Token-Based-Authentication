angular.module('storyCtrl', [])

.controller('StoryController', ['Story', 'socketio', function(Story, socketio) {

	var vm  = this;
	
	Story.allStory()
		.success(function(data) {//This is a promise object
			console.log('success' + data);
			vm.stories = data;
		});
 
	vm.createStory = function(){
		Story.create(vm.storyData)
			.success(function(data) {

				// Cear up the form
				vm.storyData = '';
				vm.messsage = data.messsage;
			});
	};

	socketio.on('story', function(data) {
		vm.stories.push(data)
	})

}])

.controller('AllStoriesController', ['stories', "socketio", function(stories, socketio){
	
	var vm =  this;
	vm.stories = stories.data;
	socketio.on('story', function(data) {
		vm.stories.push(data);
	});
}])