/*================================================================
Server side Routing using Express / Mongoose / MongoDB
=================================================================*/

var passport = require('passport');

/* ========================================================== 
Define a function to be used at every secured route
Send HTTP 401 error (unauthorised) if not logged on
============================================================ */
var auth = function(req, res, next) {
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};


module.exports = function(app) 
{
	/*================================================================
	$http GET /users
	auth will return 401 and stop the route if user not logged in
	=================================================================*/
	app.get('/users', auth, function(req, res) {
	  
		// get and return all the todos after you create another
		UserModel.find(function(err, username) 
		{
			if (err)
			{
				return res.send(err);
			}
			else
			{
				return res.json(username);
			}
		});
	});

	/*================================================================
	$http get /loggedin
	Test if user is logged in or not
	=================================================================*/
	app.get('/loggedin', function(req, res) {
	  	res.send(req.isAuthenticated() ? req.user : '0');
		console.log("get /loggedin");
	});


	/*================================================================
	$http post /login
	=================================================================*/
	app.post('/login', passport.authenticate('local'), function(req, res) {
	  res.send(req.user);
	});


	/*================================================================
	$http post - Sign Up 
	=================================================================*/
	app.post('/signup', function(req, res) {

		//	console.log("req username: " + req.body.username);	//TEST
		//	console.log("req password: " +req.body.password);	//TEST
		//	console.log("req email: " +req.body.email);			//TEST

		var newUser = new UserModel( {
			username: req.body.username,
			password: req.body.password, 
			admin: true,
			email:req.body.email 
		})

		/*================================================================
		save user to DB
		=================================================================*/
		newUser.save( function(err) {
		    if (err) 
		    	throw err;

			  res.send(req.user);
		});
	});

	/*================================================================
	$HTTP post /logout
	=================================================================*/
	app.post('/logout', function(req, res) {
	  req.logOut();
	  res.send(200);
	});
	/*===============================================================*/
};