'use strict';

/**********************************************************************
 * Module - Main module dependancies include the controllers module
 **********************************************************************/
angular.module('authApp', ['ngResource', 'ngRoute', 'authApp.controllers'] )


  .config(function($routeProvider, $locationProvider, $httpProvider) {

    //==========================================================
    // Check if the user is logged in by answering to a promise
    // Wait till promise is resolved.
    // success ->user is logged in
    // otherwise redirect to login form
    //==========================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin')

      .success(function(user) {
        // Authenticated
        if (user !== '0')
          $timeout(deferred.resolve, 0);

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    
    //============================================================
    // Interceptor to detect AJAX 401 errors (unauthorised)
    // and display login form.
    //=============================================================
    $httpProvider.responseInterceptors.push(function($q, $location) {
      return function(promise) {
        return promise
        
        .then(
          // Success: just return the response
          function(response) {
            return response;
          }, 
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401)
              $location.url('/login');            //render login form
            return $q.reject(response);
          }
        );
      }
    });

    //================================================

    //================================================
    // Define all the Routes
    //================================================
    $routeProvider

      .when('/', {
        templateUrl: '/views/main.html'
      })

      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        resolve: {                  
          loggedin: checkLoggedin     //secure url
        }
      })

      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
	  
	   .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpCtrl'
      })
      
      .otherwise({
        redirectTo: '/'
      });
    //================================================

  }) // end of config()

  .run(function($rootScope, $http) {
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function() {
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

