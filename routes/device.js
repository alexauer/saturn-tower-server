const express = require('express');
const deviceRoute = express.Router();
const async = require('async');
const moment = require('moment');
const crypto = require('crypto-js');

//logger
const winston = require('../logs/logger.js');
const sensor = winston.loggers.get('sensor'); 

//models
const Sensor = require('../models/sensor.js');
const User = require('../models/user.js');
const Measurement = require('../models/measurement.js');

//config
const config = require('../config/main.json');

//middleware
const isAuthenticated = function (req, res, next) {
  	//is always authenticated because sensore aren't able to log in
    return next();
}


deviceRoute.post('/', isAuthenticated, function(req, res){

	// check req on length (float attack)
	checkInput(req, function(err, input){
		
		if (err){
			sensor.error('SensorID: '+err);
		}

		if (input){
			
			// //check sensor ID & message hash (fake sensor attack)
			checkAuthenticity(req, function(err, authentic){

				var messageData = {
					"sensorID": req.body.message.sensorID,
					"sensorObjectID": req.body.message.sensorObjectID,
					"sensorname": req.body.message.sensorname,
					"timestamp": req.body.message.timestamp,
					"temperatureCPU": req.body.message.weatherData.temperatureCPU,
					"temperatureEnvironment": req.body.message.weatherData.temperatureEnvironment,
					"pressure": req.body.message.weatherData.pressure,
					"humidity": req.body.message.weatherData.humidity
				}

				if (err){
					sensor.error('Sensor: ' + req.body.message.sensorname + " " + err + '\r');
					prepareResponse(err, null, function(response){
						res.send(JSON.stringify(response));
						sensor.info('Sensor: ' + req.body.message.sensorname + ' response sent to client. \r')
					});
				}
				if (authentic){

					saveToDB(req, function(err, dataDB){

						if (err){
							sensor.error('Sensor: ' + req.body.message.sensorname + ' data could not be saved into DB: ' + err + '\r');
						}else if (dataDB){
							// sensor.info('Sensor: ' + req.body.message.sensorname + ' sensordata saved in DB. \r');
						}

						prepareResponse(err, dataDB, function(response){
							res.send(JSON.stringify(response));
							// sensor.info('Sensor: ' + req.body.message.sensorname + ' response sent to client. \r')
						});
					});
				}
			});
		}
	});
});

const checkInput = function(req, callback){

	if (req.body.message){
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

const checkAuthenticity = function(req, callback){

	
	// hashSensorID(req.body.message.sensorID, key, function(hash){
	// 	console.log("hash:   " + req.body.message.sensorIDHash);
	// 	console.log("hashed: " + hash);
	// 	console.log(req.body.message.sensorIDHash.valueOf() == hash.valueOf());
	// });	

	// hashMsg(JSON.stringify(req.body.message), function(hash){
	// 	console.log("hash: " + req.body.messageHash);
	// 	console.log("hashed: "+ hash);
	// 	console.log("valid " + req.body.messageHash == hash);
	// });

	// check age of message
	if (req.body.message.timestamp > (moment().format('X') - config.maxSensorTimeStampValidityInSec)){

		var sensorID = req.body.message.sensorID;
		var sensorIDHash = req.body.message.sensorIDHash;
		var msgHash = req.body.messageHash;
		var msgString = JSON.stringify(req.body.message);

		var key = req.body.message.timestamp.toString().slice(-4) + config.hash.deviceKey;
		// check sensorID hash
		hashSensorID(sensorID, key, function(hashedSensorID){

			if(hashedSensorID === sensorIDHash){

				// check message hash
				hashMsg(msgString, config.hash.messageKey, function(hashedRawMsgBody){

					if (hashedRawMsgBody  === msgHash){
						return callback(null, true);
					}else{
						return callback(new Error('Sensor was authenticated. Message Hash wrong. \n' + "msgHash:"+msgHash+" \n"+"hashedMsg: "+ hashedRawMsgBody+"\nMsgString:"+msgString+"\nMsgRaw:"+req.body.message), null)
					}
				});

			}else{
				return callback(new Error('Sensor was not authenticated.'), null)
			}
		});
	}
}

const hashSensorID = function(input, key, callback){
	var hash = crypto.HmacSHA256(input, key);
	var hashString = hash.toString(crypto.enc.utf8);
	return callback(hashString);
}

const hashMsg = function(input, key, callback){
	var hash = crypto.HmacSHA256(input, key);
	var hashString = hash.toString(crypto.enc.utf8);
	return callback(hashString);
}

const saveToDB = function(req, callback){

	var query  = Sensor.where({ _id : req.body.message.sensorObjectID });
	query.findOne(function (err, sensor){

	 	if (err){
	 		return callback(new Error('No sensor found with sensorObjectID: ' + err), false);
	 	} 
	 	if (sensor) {

    		var data = new Measurement();
			data.sensorID = req.body.message.sensorID;
			data.sensorObjectID = req.body.message.sensorObjectID;
			data.sensorName = req.body.message.sensorname;
			data.timestamp = req.body.message.timestamp;
			data.weatherData.temperatureEnvironment = req.body.message.weatherData.temperatureEnvironment;
			data.weatherData.temperatureCPU = req.body.message.weatherData.temperatureCPU;
			data.weatherData.pressure = req.body.message.weatherData.pressure;
			data.weatherData.humidity = req.body.message.weatherData.humidity;

			data.save(function(err, data, numAffected) {

				if (err){
					callback(new Error('Sensor data could not be saved: ' + err), false);
				}else{
					callback(null, data);
				} 
			});
	 	 }
	});
}

const initSensor = function(callback){

	var sensor = Sensor();
	sensor.sensorID = '00000000d75c2580'
	sensor.sensorName = 'Phoebe'
	sensor.location = 'm306'
	sensor.lastRestart = ''

	sensor.save(function(err,data, numAffected){
		if(err){
			console.log(new Error('Sensor could not be saved: ' + err));
		}else{
			console.log('sensor saved with ob_id: ' + data.id);
			callback(data.id)
		}
	});
}

var prepareResponse = function(err, data, callback){

	var res = {
		"command": {
			"resend":false,
			"restart":false
		},
		"configure":{
			"objectID":"",
			"location":"",
			"sensorname":"",
			"ntpServer":"",
			"sendInterval":"",
			"serverIP":"",
			"serverPORT":""
		}
	}

	if(err){
		res.command.resend = true;
	}else if(data){
		res.command.resend = false;
	}

	callback(res);
}

module.exports = deviceRoute;