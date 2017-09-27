var express = require('express');
var deviceRoute = express.Router();
var async = require('async');
var moment = require('moment');
var crypto = require('crypto-js');

//logger
var winston = require('../logs/logger.js');
var sensor = winston.loggers.get('sensor'); 

//models
var Sensor = require('../models/sensor.js');
var User = require('../models/user.js');
var SensorData = require('../models/sensorData.js');


//config
var config = require('../config/main.json');

var isAuthenticated = function (req, res, next) {
  	//is always authenticated because sensore aren't able to log in
    return next();
}


deviceRoute.post('/', isAuthenticated, function(req, res){

	// check req on length (float attack)
	checkInput(req, function(err, input){

		if (err){
			sensor.error('SensorID: ')
		}
		if (input){

			//check sensor ID hash (fake sensor attack)
			checkAuthenticity(req, function(err, authenticity){

				var messageData = {
					"sensorID": req.body.sensorID,
					"sensorObjectID": req.body.sensorObjectID,
					"sensorname": req.body.sensorname,
					"timestamp": req.body.timestamp,
					"temperatureCPU": req.body.weatherData.temperatureCPU,
					"temperatureEnvironment": req.body.weatherData.temperatureEnvironment,
					"pressure": req.body.weatherData.pressure,
					"humidity": req.body.weatherData.humidity
				}
				console.log(messageData);

				if (err){
					sensor.error('Sensor: ' + req.body.sensorname + ' Error: ' + err + '\r');
				}
				if (authenticity){

					saveToDB(req, function(err, status){

						if (err){
							sensor.error('Sensor: ' + req.body.sensorname + ' Error: Data could not be saved into DB: ' + err + '\r');
							callback(err, null);
						}else if (statur){
							sensor.info('Sensor: ' + req.body.sensorname + ' Info: Sensordata saved in DB. \r');
							callback(null, null);
						}
					});
				}
			});
		}
	});
});

var checkInput = function(req, callback){

	if (req.body){
		if (req.body.length > 1e6){
			// Flood attack or faulty client
			req.connection.destroy();
			return callback(new Error('Request was to long from sensor, req > 1e6 letters.'), null);
		}else{
			return callback(null, true)
		}	
	}else{
		return callback(new Error('Request body was null'), null);
	}
}

var checkAuthenticity = function(req, callback){

	// check age of message
	if (req.body.timestamp > (moment().format('X') - config.maxSensorTimeStampValidityInSec)){

		var sensorID = req.body.sensorID;
		var sensorIDHash = req.body.sensorIDHash;
		var rawMsgBody = req.body.rawBody;
		var msgHash = req.body.msgHash

		// check sensorID hash
		hashSensorID(sensorID, function(hashedSensorID){

			if(hashedSensorID === sensorIDHash){

				// check message hash
				hashMsg(rawMsgBody, function(hasehdRawMsgBody){

					if (hasehdRawMsgBody === msgHash){
						return callback(null, true);
					}else{
						return callback(new Error('Sensor was authenticated. Message Hash wrong.'), null)
					}
				});

			}else{
				return callback(new Error('Sensor was not authenticated.'), null)
			}
		});
	}
}

var hashSensorID = function(input, callback){
	var hash = crypto.HmacSHA256(input, config.deviceHashKey);
	var hashString = hash.toString(crypto.enc.utf8);
	return callback(hashString);
}

var saveToDB = function(req, callback){

	var query  = Sensor.where({ sensorID : req.body.sensorID });
	query.findOne(function (err, sensor){

	 	if (err){
	 		return callback(new Error('No sensor found with sensorID: ' + err), false);
	 	} 
	 	if (sensor) {

    		var data = new SensorData();
			data.sensorID = req.body.sensorObjectID;
			data.sensorObjectID = req.body.sensorObjectID;
			data.sensorName = req.body.sensorname;
			data.timestamp = req.body.timestamp;
			data.weatherData.temperatureEnvironment = req.body.weatherData.temperatureEnvironment;
			data.weatherData.temperatureCPU = req.body.weatherData.temperatureCPU;
			data.weatherData.pressure = req.body.weatherData.pressure;
			data.weatherData.humidity = req.body.weatherData.humidity;

			data.save(function(err, data, numAffected) {

				if (err){
					callback(new Error('Sensor data could not be saved: ' + err), false);
				}else{
					callback(null, true);
				}
			});
	 	 }
	});
}

module.exports = deviceRoute;