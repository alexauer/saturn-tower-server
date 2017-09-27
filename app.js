var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
//var tls = require('tls');
//var fs = require('fs');

// SSL options
// var configSSL = {
//   key: fs.readFileSync('./private/server-key.pem'),
//   cert: fs.readFileSync('./private/server-cert.pem'),
//   ca: fs.readFileSync('')
// }

// PFS (Perfect Forwared Security) context
// var optionsPFS ={
//   key: fs.readFileSync('./private/server-key.pem'),
//   cert: fs.readFileSync('./private/server-cert.pem'),
//   dhparam: fs.readFileSync('./private/dhparam.pem')
// }


// var context = tls.createSecureContext(configSSL);

// deviceServer.addContext(host+port2,context);

// Portal Server
var HOST = '127.0.0.1';
var PORT = 3000;

// Sensor Server
var PORT2 = 3001;

// MongoDB
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/miblab-weather-station';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
  	console.log("Mongo connected successfully to server.");
  	db.close();
});

// Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/miblab-weather-station', {
  	useMongoClient: true,
  /* other options */
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongoose connected successfully to server.");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret:'TopSecretKey',
            saveUninitialized: true,
            resave: true}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index.js')(passport);
var device = require('./routes/device.js');

app.use('/', routes);
app.use('/sensors', device);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 	var err = new Error('Not Found');
  	err.status = 404;
  	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var httpPortalServer = http.createServer(app);
httpPortalServer.listen(PORT, function(){
    console.log("Node portal server running at port: "+PORT);
});

module.exports = app;
