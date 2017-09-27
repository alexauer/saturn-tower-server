var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/');
	}
	// if the user is not authenticated then redirect him to the login page
}

module.exports = function(passport){
	
	/* GET login page. */
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Welcome to the Miblab Weatherstation.' });
	});

	/* Handle login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true 
	}));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/* GET registeration page. */
	router.get('/register', function(req, res, next) {
		res.render('register', { title: 'Please register.' });
	});

	/* Handle registeration POST. */
	router.post('/register', passport.authenticate('signup', {
	    successRedirect: '/home',
	    failureRedirect: '/register',
	    failureFlash : true 
	}));

	return router;
}; 
