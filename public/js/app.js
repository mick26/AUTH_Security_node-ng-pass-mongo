'use strict';

/**********************************************************************
 * Module - Main module dependancies include the controllers module

 flash service is a publisher of flash messages and the flash directive is a subscriber to flash messages. 
 The flash directive leverages the Twitter Bootstrap Alert component.
 **********************************************************************/
angular.module('authApp', ['ngResource', 'ngRoute', 'angular-flash.flash-alert-directive', 'angular-flash.service', 
      'authApp.controllers'] )


  .config(function($routeProvider, $locationProvider, $httpProvider) {


    //==========================================================
    // Check if the user is logged in by answering to a promise
    // Wait till promise is resolved.
    // success ->user is logged in
    // otherwise redirect to login form
    //==========================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
      
      // Initialize a new promise
      var deferred = $q.defer();  //returns a deferred object - either be resolved or rejected

      //Make an AJAX call to check if the user is logged in
      //$http returns a promise with 2 methods success and error
      //since returned value is a promise you can use then method to register callbacks
      $http.get('/loggedin')

      //.success(function(user) {
      .success(function(data, status, headers, config) {
      
        //Authenticated - 
        if (data !== '0') {
          $timeout(deferred.resolve, 0);
          $rootScope.isLogged = 1;
          $rootScope.username = data.username;
        }

        //Got 0 as $http response i.e. Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $rootScope.isLogged = 0;          
          $rootScope.username = "";
          $timeout(function(){ 
            deferred.reject(); 
          }, 0);
          
      //    $rootScope.username = "";
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
        templateUrl: '/views/home.tpl.html',
        controller: 'HomeCtrl'
      })
	  
	   .when('/register', {
        templateUrl: 'views/register.tpl.html',
        controller: 'RegisterCtrl'
      })

      .when('/login', {
        templateUrl: 'views/login.tpl.html',
        controller: 'LoginCtrl'
      })

     .when('/logout', {
        templateUrl: 'views/home.tpl.html',
        controller: 'LogoutCtrl'
      })

     .when('/about', {
        templateUrl: 'views/about.tpl.html',
        controller: 'AboutCtrl'
      })

      .when('/admin', {
        templateUrl: 'views/admin.tpl.html',
        controller: 'AdminCtrl',
        resolve: {                  
          loggedin: checkLoggedin     //secure url
        }
      })
      
      .otherwise({
        redirectTo: '/'
      });
    //================================================

  }) // end of config()


  .config(function (flashProvider) {
      // Support bootstrap 3.0 "alert-danger" class with error flash types
      flashProvider.errorClassnames.push('alert-danger');

      /**
       * Also have...
       *
       * flashProvider.warnClassnames
       * flashProvider.infoClassnames
       * flashProvider.successClassnames
       */
  })

  .run(function($rootScope, $http) {
    $rootScope.message = 'This is Root Message';
  });

