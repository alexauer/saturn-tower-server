const express = require('express');
const router = express.Router();

const isAuthenticated = function (req, res, next) {
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
	router.get('/', function(req, res) {
		res.render('index', {title: 'Welcome to Saturn Tower.'});
	});

	/* Handle login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true 
	}));

	/* Handle Logout */
	router.get('/logout', isAuthenticated, function(req, res) {
		req.session.destroy();
		req.logout();
		res.redirect('/');
	});

	/* GET home page */
	router.get('/home', isAuthenticated, function(req,res){
		const homeReq = require('./modules/home.js');
		homeReq.show(req, res);
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

	/* GET chart data */
	router.get('/get/chartData/:sensor_ObjectID/:start-:end', isAuthenticated, function(req,res){
		const getChartData = require('./modules/getChartData.js');
		getChartData.getChartData(req,res);
	});

	return router;
}; 
