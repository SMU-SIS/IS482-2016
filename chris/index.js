var app = angular.module("fireLearning", ["firebase", "ngRoute", "ui.bootstrap"]);
var ref = new Firebase("https://scorching-inferno-5500.firebaseio.com");

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
	$routeProvider
	.when('/',{
		controller: "AuthCtrl",
		templateUrl: "/index.html",
	
	}).
	otherwise({
		redirectTo: '/'
	});
}]);

app.factory("Auth", function($firebaseAuth){
	return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, $location, $modal, $firebaseObject, $firebaseArray,Auth){
	$scope.provider = '';
	$scope.authData;

  var ref = new Firebase("https://scorching-inferno-5500.firebaseio.com/classMentors/badges");
  // download the data into a local object
  $scope.data = $firebaseObject(ref);

  
  $scope.load_events = function(){
    var ref2 = new Firebase("https://scorching-inferno-5500.firebaseio.com/classMentors/events");
    // download the data into a local object
    $scope.events = $firebaseArray(ref2);

    console.log("loading events.");
    
  }      
  
  $scope.load_events();     
        
	Auth.$onAuth(function(authData){
		$scope.authData = authData;
		if(authData) {
			$scope.cachedProfile = getCachedProfile();
			createUser();

		}
		console.log($scope.authData);
	});

	$scope.login = function(provider) {
		Auth.$authWithOAuthPopup(provider,  { scope: 'email' })
		.catch(function(error){
			console.error(error);
		})

	}

	$scope.logout = function() {
	  console.log($scope.authData);
		Auth.$unauth();
		console.log($scope.authData);
	}

	var createUser = function() {
		ref.createUser($scope.cachedProfile, function(error, userData) {
			if (error) {
	 			switch (error.code) {
					case "EMAIL_TAKEN":
						console.log("The new user account cannot be created because the email is already in use.");
						break;
					case "INVALID_EMAIL":
						console.log("The specified email is not a valid email.");
						break;
					default:
						console.log("Error creating user:", error);
				}
			} else {
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
	}

	var getCachedProfile = function() {
		if(!$scope.authData) return "";

		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile;
				break;
			case "facebook":
				return $scope.authData.facebook.cachedUserProfile;
				break;
			case "google":
				return $scope.authData.google.cachedUserProfile;
				break;
			default:
				return "";
		}
	}

	$scope.getUserImage = function() {
		if(!$scope.authData) return "";
		
		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile.avatar_url ? $scope.authData.github.cachedUserProfile.avatar_url : "";
				break;
			case "facebook":
				return $scope.authData.facebook.profileImageURL ? $scope.authData.facebook.profileImageURL : "";
				break;
			case "google":
				return $scope.authData.google.profileImageURL ? $scope.authData.google.profileImageURL : "";
				break;
			default:
				return "";
		}
	}


  $scope.cancelLogin = function () {
    console.log($scope);
    $scope.userLoginModal.dismiss('cancel');
  };
  
});