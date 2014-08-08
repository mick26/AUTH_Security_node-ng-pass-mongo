/*================================================================
Server side Routing - routes dealing with the user authentication

ROUTE Definitions
=================================================================*/

var passport = require('passport');


module.exports = {


	/*================================================================
	$http post - Sign Up 
	=================================================================*/

	register : function(req, res) {

		var username = req.body.username || '';
		var password = req.body.password || '';
		var email = req.body.email || '';
		var passwordConfirmation = req.body.passwordConfirmation || '';

		//Angular form validation also ensures required fields are filled
		//Check to ensure passwordConfirmation matches password
		if (username == '' || password == '' || password != passwordConfirmation) {
			return res.status(400).send("Bad Request:Registration error");
		}


		//check if username exists already
		UserModel.findOne({username: req.body.username}, function (err, user) {
			
			if (err) {
				console.log(err);
				res.status(401).send("Unauthorised-error finding username in DB");
			}

			//user exists already
			else if(user) {
				res.status(409).send("Conflict: username already exists");
				//res.send(409, {status:409, message: 'Conflict - username already exists', type:'user-issue'});
			}

			//user does not exist already
			else if (user == undefined) {
			
				var newUser = new UserModel( {
					username : req.body.username,
					password : req.body.password,
					admin : true,
					email : req.body.email
				})

				newUser.save(function(err) {
					if (err) {
						console.log(err);
						res.status(500).send("Internal Server Error: problem saving user to DB");
					}
					else {
						return res.status(200).send("New user saved to DB ok");
					}
				});	
			}

		})		
	},


	/*================================================================
	$http post /login
	=================================================================*/
	login : function(req, res) {
	  res.send(req.user);
	},


	/*================================================================
	$HTTP post /logout
	=================================================================*/
	logout : function(req, res) {
	  req.logOut();
	  res.status(200).send("Logged out");
	},

	/*================================================================
	$http get /loggedin
	Test if user is logged in or not
	? is the JS Conditional Operator 
	Ref.
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
	condition ? val1 : val2
	if condition is true the operator has value val1
	if user is NOT Authenticated 0 is returned to client

	NOTE!! req.isAuthenticated() and req.isUnauthenticated() are PassportJS flags
	=================================================================*/
	loggedin : function(req, res) {

		console.log("*Req.isAuthenticated()" +req.isAuthenticated()); //TEST
		console.log("*Req.isUnauthenticated()" +req.isUnauthenticated()); //TEST

	  	res.send(req.isAuthenticated() ? req.user : '0');
		console.log("get /loggedin");
	},


	/*================================================================
	$http GET /users
	auth will return 401 and stop the route if user not logged in
	=================================================================*/
	users : function(req, res) { 
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
	}

};




