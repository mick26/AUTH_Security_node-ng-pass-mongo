/**********************************************************************
 * Module - for controllers only (injected into main module)
 **********************************************************************/
angular.module('authApp.controllers', [])


  /**********************************************************************
   * Home controller
   **********************************************************************/
  .controller('HomeCtrl', function($scope, $rootScope, $http, $rootScope, flash) {

    $rootScope.message = 'This is the Home Page.';
  
    //Make an AJAX call to check if the user is logged in
    $http.get('/loggedin')

    //.success(function(user) {
    .success(function(data, status, headers, config) {

      //Authenticated - 
      if (data !== '0') {
        $rootScope.isLogged = 1;
        $rootScope.username = data.username;
        $scope.error = '';
        $rootScope.welcome = 'Welcome ' + JSON.stringify($rootScope.username);  
      }

      //Not Authenticated - Got 0 as $http response i.e. 
      else {

        $scope.info = function () {
            flash.info = 'info message-You need to log on';
      };
      // $scope.info = function () {
    //     flash.info = 'info message';
    // };

    // $scope.info1 = function () {
    //     flash.to('alert-1').info = 'info message';
    // };

    // $scope.warn = function () {
    //     flash.warn = 'warn message';
    // };


    //     $rootScope.error = function () {
    //     flash.error = 'error message You need to log in';
    // };

        $rootScope.message = 'You need to log in.';
        $rootScope.isLogged = 0;          
        $rootScope.username = "";
      

      }
    })
  })



/**********************************************************************
 * Register controller
 **********************************************************************/
.controller('RegisterCtrl', function($scope, $rootScope, $http, $location, flash) {
  // This object will be filled by the form
  $scope.user = {};

  //for flash messages
  $scope.all = function () {
      $scope.info();
      $scope.warn();
      $scope.success();
      $scope.error();
  };

  //Register the login() function
  //$scope.register = function() {
  $scope.register = function register(username, password, passwordConfirm) {

    $http.post('/register', $scope.user)

    //Success: Registered OK
    .success(function(data, status, headers, config) {

      //Flash Messages
      $scope.info = function () {
        flash.info = '';
      };
      $scope.warn = function () {
        flash.warn = '';
      };
      $scope.success = function () {
        flash.success = 'Well done-Registeration Successful';
      };
      $scope.error = function () {
        flash.error = '';
      };
      $scope.all();

      $location.url('/login');
    })

    //Error: Registeration failed
    .error(function(data, status, headers, config) { 
      $scope.message = 'Error during Sign Up.';


      //Flash Messages
      $scope.info = function () {
        flash.info = '';
      };
      $scope.warn = function () {
        flash.warn = '';
      };
      $scope.success = function () {
        flash.success = '';
      };
      

      if(status === 409) {
       // $scope.error = 'Duplicate username: Please select a different username';
        $scope.error = function () {
          flash.error = 'Duplicate username: Please select a different username';
        };
      }

      if(status === 400) {
        //$scope.error = 'ERROR: Password Confirmation does not match Password';
        $scope.error = function () {
          flash.error = 'Password Confirmation does not match Password';
        };
      }

      if(status === 500) {
        $scope.error = function () {
          flash.error = 'Internal Server Error:problem saving to DB';
        };
      }

      $scope.all();
//      $location.url('/login'); 
    });
  };
})



/**********************************************************************
 * Login controller
 **********************************************************************/
.controller('LoginCtrl', function($scope, $rootScope, $http, $location, flash) {
  //This object will be filled by the form
  $scope.user = {};
  //$rootScope.isLogged = 0;

  $scope.all = function () {
      $scope.info();
      $scope.warn();
      $scope.success();
      $scope.error();
  };


  // Register the login() function
  $scope.login = function() {

    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })


    //success - callback fn
    .success(function(data, status, headers, config) {

      //console.log("data = "+JSON.stringify(data)); //TEST
      $rootScope.isLogged = 1;
      $rootScope.username = $scope.user.username;
      // $rootScope.message = 'Authentication successful!';
      $rootScope.welcome = 'Welcome ' + JSON.stringify(data.username);  

      //Flash Messages
      $scope.info = function () {
        flash.info = '';
      };
      $scope.warn = function () {
        flash.warn = '';
      };
      $scope.success = function () {
        flash.success = 'Authentication Successful-Welcome to Micks Secure Area';
      };
      $scope.error = function () {
        flash.error = '';
      };
      $scope.all();

      $location.url('/admin');
    })


    //error - callback fn
    .error(function() {

      //Flash Messages
      $scope.info = function () {
        flash.info = '';
      };
      $scope.warn = function () {
        flash.warn = '';
      };
      $scope.success = function () {
        flash.success = '';
      };
      $scope.error = function () {
        flash.error = 'Authentication failed';
      };
      $scope.all();

      // Error: authentication failed
      $rootScope.isLogged = 0;
      $rootScope.welcome = 'Invalid User';
      $rootScope.username = "";
      $location.url('/login');
    });
  };
})


/**********************************************************************
 * Logout controller
 **********************************************************************/
.controller('LogoutCtrl', function ($scope, $http, $location, $rootScope, flash) {
  
  //$scope.error = '';

  //For Flash Messages
  $scope.all = function () {
      $scope.info();
      $scope.warn();
      $scope.success();
      $scope.error();
  };


  $http.post('/logout') 
  //success
  .success(function (data, status, headers, config) 
  {
   // $rootScope.message = 'Logged Out Successfully';
    $rootScope.isLogged = 0; 
    $rootScope.username = "";   
 
    //Flash Messages
    $scope.info = function () {
      flash.info = '';
    };
    $scope.warn = function () {
      flash.warn = '';
    };
    $scope.success = function () {
      flash.success = 'Logged Out Successfully';
    };
    $scope.error = function () {
      flash.error = '';
    };
    $scope.all();

    $location.url('/');
  })

  //error
  .error(function (data, status, headers, config) 
  {
    //console.log("/logout ERROR");
    //Flash Messages
    $scope.info = function () {
      flash.info = '';
    };
    $scope.warn = function () {
      flash.warn = '';
    };
    $scope.success = function () {
      flash.success = '';
    };
    $scope.error = function () {
      flash.error = 'Error Logging Out';
    };

    $scope.all();


    alert(data);
  });
})




/**********************************************************************
 * Admin controller
 **********************************************************************/
.controller('AdminCtrl', function($scope, $http, $rootScope, flash) {

  // List of users got from the server
  $scope.users = [];

  //For Flash Messages
  $scope.all = function () {
      $scope.info();
      $scope.warn();
      $scope.success();
      $scope.error();
  };

  //Make an AJAX call to check if the user is logged in
  $http.get('/loggedin')

  //.success(function(user) {
  .success(function(data, status, headers, config) {

    //Authenticated - 
    if (data !== '0') {
      $rootScope.isLogged = 1;
      $rootScope.username = data.username;
      $scope.error = '';
      $rootScope.welcome = 'Welcome ' + JSON.stringify($rootScope.username);  
     

      // Fill the array to display it in the page
      $http.get('/users')

      .success(function(data, status, headers, config) {
        for (var i in data)     
          $scope.users.push( data[i] );

        $rootScope.welcome = 'Welcome ' + JSON.stringify($rootScope.username); 
      })
    }

    //Not Authenticated - Got 0 as $http response i.e. 
    else {
    //  $rootScope.message = 'You need to log in.';

      //Flash Messages
      $scope.info = function () {
        flash.info = '';
      };
      $scope.warn = function () {
        flash.warn = 'You need to log in';
      };
      $scope.success = function () {
        flash.success = '';
      };
      $scope.error = function () {
        flash.error = 'Error Logging Out';
      };

      $scope.all();

      $rootScope.isLogged = 0;          
      $rootScope.username = "";
    }
  })
  

})


  /**********************************************************************
   * About controller
   **********************************************************************/
  .controller('AboutCtrl', function($scope, $rootScope, $http) {
   
    $scope.message = 'Look! I am an about page.';


    //Make an AJAX call to check if the user is logged in
    $http.get('/loggedin')

    //.success(function(user) {
    .success(function(data, status, headers, config) {

      //Authenticated - 
      if (data !== '0') {
        $rootScope.isLogged = 1;
        $rootScope.username = data.username;
        $rootScope.welcome = 'Welcome ' + JSON.stringify($rootScope.username);  

      }

      //Not Authenticated - Got 0 as $http response i.e. 
      else {
        $rootScope.message = 'You need to log in.';
        $rootScope.isLogged = 0;          
        $rootScope.username = "";
      }
    })

});
