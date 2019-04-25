const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const flash = require('express-flash');
// const tls = require('tls');
// const fs = require('fs');

const config = require('./config/main.json')

// SSL options
// const configSSL = {
//   key: fs.readFileSync('./private/server-key.pem'),
//   cert: fs.readFileSync('./private/server-cert.pem'),
//   ca: fs.readFileSync('')
// }

// PFS (Perfect Forwared Security) context
// const optionsPFS ={
//   key: fs.readFileSync('./private/server-key.pem'),
//   cert: fs.readFileSync('./private/server-cert.pem'),
//   dhparam: fs.readFileSync('./private/dhparam.pem')
// }


// const context = tls.createSecureContext(configSSL);

// deviceServer.addContext(host+port2,context);

// Portal Server
const HOST = config.HOST;
const PORT = config.PORT;

// MongoDB
const MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/saturn-tower';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
  	console.log("Mongo connected successfully to server.");
  	db.close();
});

// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/saturn-tower', {
  	useMongoClient: true,
  /* other options */
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongoose connected successfully to server.");
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
const passport = require('passport');
const expressSession = require('express-session');
app.use(expressSession({secret:'TopSecretKey',
            saveUninitialized: true,
            resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require('moment');

// Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);

const routes = require('./routes/index.js')(passport);
const device = require('./routes/device.js');

app.use('/', routes);
app.use('/sensors', device);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 	const err = new Error('Not Found');
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

const httpPortalServer = http.createServer(app);
httpPortalServer.listen(PORT, function(){
    console.log("Node portal server running at port: "+PORT);
});

module.exports = app;
