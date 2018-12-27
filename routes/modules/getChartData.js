const express = require('express');
const router = express.Router();
const async = require('async');
const json2csv = require('json2csv');

/* Logger */
const winston = require('winston');
const portal = winston.loggers.get('portal');

/* Models */
const User = require('../../models/user.js')
const Sensor = require('../../models/sensor.js');
const Measurement = require('../../models/measurement.js');

const getChartData = function(req,res){

	var sensorObjectID = req.params.sensor_ObjectID;
	var starttime = req.params.start;
	var endtime = req.params.end;

	if(starttime < endtime){

		queryChartData(sensorObjectID, starttime, endtime, function(err, sensorData){

			if (err){
				portal.error('Portal: User: '+req.user.username+': Error during data preperation for chart data request.'+err+'\r');
				res.json({"status": "failure", "errormessage":"Error during data query"});

			}else if(sensorData.toString().length>0){

				var fields = ['timestamp','weatherData.temperatureEnvironment','weatherData.pressure','weatherData.humidity'];
				var fieldNames = ['Time', 'Temperature','Pressure','Humditiy'];
				var csv = json2csv({data:sensorData, fields:fields, fieldNames:fieldNames, quotes: ''});

				res.json({"status": "ok", "errormessage":"Chart data fetched", "docs":csv});
			}else{
				portal.error('Portal: User: '+req.user.username+': Error during data preperation for chart data request. Error: '+err+'\r');
				res.json({"status": "failure", "errormessage":""});
			}
		});

	}else{
		portal.error('Portal: User: '+req.user.username+': Error during data preperation for chart data request. endtime < starttime\r');
    	res.send({errorMessage:'Error during data query.'});
	}
}


const checkAuthenticity = function(reqSensorID, req, callback){
	
	User.findOne({'_id':req.user.id}, function (err,user){
		
		if(err){
			return callback(err, null);
		}
		if(user.toString().length>0){
			var dbSensors = user.sensorIDs
			if(dbSensors.indexOf(reqSensorID)>-1){
				return callback(null, true);
			}
			else{
				return callback(null, false);
			}
		}else{
			return callback(new Error('User from Request not found. Internal error, query was empty.',null));
		}
	})
}


const queryChartData = function(sensorObjectID, start, end, callback){

	Measurement.find({'sensorObjectID':sensorObjectID}).where('timestamp').gt(start).lt(end).sort('timestamp').exec(function(err,sensorDocs){

		if (err){
			return callback(err, null);
		}
		else if (sensorDocs.length>0){

			return callback(null, sensorDocs);
		}
		else{
			return callback(new Error('Error: No data available.'), null);
		}
	});
}


module.exports.getChartData = getChartData;

