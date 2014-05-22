
/**********************************************************************
 * Module - for controllers only (injected into main module)
 **********************************************************************/

angular.module('authApp.controllers', [])

/**********************************************************************
 * Login controller
 **********************************************************************/
.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function() {
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })

    //success - callback fn
    .success(function(user) {
      // Success: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/admin');
    })

    //error - callback fn
    .error(function() {
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
})

/**********************************************************************
 * SignUp controller
 **********************************************************************/
.controller('SignUpCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.signup = function() {
    $http.post('/signup', {
      username: $scope.user.username,
      password: $scope.user.password,
      email: $scope.user.email,
    })

    //success - callback fn
    .success(function(user){
      // Success: authentication OK
      $rootScope.message = 'Error during Sign Up';
      $location.url('/admin');
    })

    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Error during Sign Up.';
      $location.url('/login');
    });
  };
})


/**********************************************************************
 * Admin controller
 **********************************************************************/
.controller('AdminCtrl', function($scope, $http) {
  // List of users got from the server
  $scope.users = [];

  // Fill the array to display it in the page
  $http.get('/users')

  .success(function(users){
    for (var i in users)     
      $scope.users.push( users[i] );
  });
});
