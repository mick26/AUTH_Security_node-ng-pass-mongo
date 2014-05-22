## Synopsis
 

Authentication with NodeJS, ExpressJS, AngularJS and MongoDB
Secure Angular route URL's by the server.


# Angular Routes 

User creation/logon and Authentication is managed using the following $http routes: 

post /login		//login using username & password
post /signup 	//signup to register a username & password
get /users 		//returns list of all users from the MongoDB -- a secured URL
get /loggedin 	//test if logged in or not

If the user selects a secured route - the route processing will stop and a 401 (unauthorised) error will be returned.


# HTTPS

I configured Node to operate as a HTTPS server so there is a safe connection between Angular client and the Node server.
This is mostly because when a user logs on their password is transmitted in plain text to the server and is visible in the HTTP packet.
Once a user is logged on their password is not transmitted again in plain text until they log on again.

It is also advisable to connect from Node server to MongoDB over HTTPS connection.


# Packages Used

- Passport authentication middleware for NodeJS 
- Passport Local Strategy, simple username and password logon. Other strategies include using Facebook, Twitter, Google accounts to log on
- Mongoose to connect with the MongoDB
- Bcryptjs to encrypt the plain text password for storage in MongoDB


The program is based on a number of sources but mainly [Kev's Tutorial](https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs) and [daniel stubbs tutorial](http://danielstudds.com/setting-up-passport-js-secure-spa-part-1/). 
An interesting article is given by [Alberto Pose](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) regarding the use of Cookies or Tokens with Angular. 


# Requirements

* MongoDB running
* Node
* bower client package manager
* SSL server key and certificate files 


## Installation

* Clone the Repository
* npm install - install all the node packages listed in the package.json file 
* bower install - installs the front end packages listed in the bower.json file
* Turn on MongoDB
* Open ../server/config/database.js and enter Mongo database details
* Place SSL files in server/ssl directory
* node server.js - start up Node\Express server
* Browse to http://localhost:3200


Note: you can disable the HTTPS server in the server.js file and uncomment the HTTP server code.


## Technologies Used
 
Node, Express 4.2, Angular, Mongoose, MongoDB, OpenSSL, Robomongo MongoDB client, REST API, Bower, Passport, Bcryptjs,
$http service to make AJAX (Asynchronous JavaScript and XML) requests in AngularJS.


Michael Cullen
2014
