/*=========================================================
Michael Cullen

Authentication: Node, Express, Angular, MongoDb

2014
Working - (Tá se ag obair)

Ref.
https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
http://danielstudds.com/setting-up-passport-js-secure-spa-part-1/
http://stackoverflow.com/questions/20228572/passport-local-with-node-jwt-simple
http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/
https://github.com/roblevintennis/passport-api-tokens
https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
https://github.com/studds/secure-spa-part-1
============================================================*/

/* ========================================================== 
External Modules/Packages Required
============================================================ */
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var bodyParser = require('body-parser');
var logger= require('morgan');
var colours = require('colors');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var fs = require('fs-extra');

/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
//note omitted var prefix for db so it shall be available in other files
db = require('./server/models/userModel.js');		//mongoose schema/model
var pass = require('./server/passport/pass.js');
var routes = require('./server/routes.js');       	//Exchange routes & mongoose interaction with DB


/* ========================================================== 
OpenSSL credentials - read private key and cert files
Reading them Synchronous - Node will be blocking until files are read
ok in this instance. 
============================================================ */
var privateKey = fs.readFileSync('./server/ssl/localhost/server.key'); 
var certificate = fs.readFileSync('./server/ssl/localhost/server.crt'); 
var credentials = { key : privateKey, cert: certificate };



/* ========================================================== 
Create a new application with Express
============================================================ */
var app = express();


/* ========================================================== 
Set the Port
============================================================ */
app.set('port', process.env.PORT || 3200);


/* ========================================================== 
Use Middleware
============================================================ */
app.use(logger('dev'));
app.use(cookieParser()); 

// parse application/json
app.use(bodyParser.json())

app.use(methodOverride());


/* ========================================================== 
Use express.session before passport
To ensure passport session will work
============================================================ */
app.use(session({ 
	secret: 'securedsession', 
  	saveUninitialized: true,
    resave: true
}));

/* ========================================================== 
Use Passport
============================================================ */
app.use(passport.initialize()); // Add passport initialization

/* ========================================================== 
Use passport.session() middleware 
For persistent login sessions (recommended).
============================================================ */
app.use(passport.session());    // Add passport initialization


/* ========================================================== 
Set the path to static files. 
Where index.html shall be found.
============================================================ */
app.use(express.static(__dirname + "/public"));
//app.use(express.static(path.join(__dirname, 'public')));


/* ========================================================== 
ROUTES - using Express
============================================================ */
routes(app);


/* ========================================================== 
Secure HTTPS Server
============================================================ */

var secureServer = https.createServer( credentials, app);
secureServer.listen(app.get('port'), function() {
    console.log('Secure Express server listening on port %d ' .red, secureServer.address().port);
});


/* Unsecure http server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' .green + app.get('port'));
});
*/


