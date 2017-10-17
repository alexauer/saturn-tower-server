 var express = require('express');
var router = express.Router();
var async = require('async');
var json2csv = require('json2csv');

/* Logger */
var winston = require('winston');
var portal = winston.loggers.get('portal');

/* Models */
var User = require('../../models/user.js')
var Sensor = require('../../models/sensor.js');
var Measurement = require('../../models/measurement.js');

var getChartData = function(req,res){

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


var checkAuthenticity = function(reqSensorID, req, callback){
	
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


var queryChartData = function(sensorObjectID, start, end, callback){

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


	// var Measurement = new Schema({
	// 	sensorID: String,
	// 	sensorObjectID: String,
	//     sensorName: String,
	//     timestamp: String,
	//     weatherData: {
	//     	temperatureEnvironment: Number,
	//     	temperatureCPU: Number,
	//     	pressure: Number,
	//     	humidity: Number
	//     }
	// });


