/*================================================================
Server side Routing

ROUTE Declarations

Ref.
https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
http://scotch.io/quick-tips/js/node/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
http://stackoverflow.com/questions/14188834/express-passport-where-is-the-documentation-for-ensureauthentication-isaut
https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
=================================================================*/


/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
var authRoutes = require('./routes/auth-routes.js');  //route definitions
var passport = require('passport');

/* ========================================================== 
Define a function to be used at every secured route
Send HTTP 401 error (unauthorised) if not logged on
NOTE!! req.isAuthenticated() and req.isUnauthenticated() are PassportJS flags
============================================================ */
var auth = function(req, res, next) {
  if (!req.isAuthenticated()) 
  	res.status(401).send("Unauthorised");
  else
  	next();
};


module.exports = function(app) {

	/* ========================================================== 
	User Routes
	============================================================ */
	app.post('/register', authRoutes.register);
	app.post('/login', passport.authenticate('local'), authRoutes.login);
	app.post('/logout', authRoutes.logout);
	app.get('/loggedin', authRoutes.loggedin);

	app.get('/users', auth, authRoutes.users);	//added auth middleware to route

};