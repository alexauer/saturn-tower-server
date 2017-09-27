var express = require('express');
var router = express.Router();
var async = require('async');

/* Logger */
var winston = require('winston');
var portal = winston.loggers.get('portal');

/* Models */
var User = require('../../models/user.js')
var Sensor = require('../../models/sensor.js');
var Measurement = require('../../models/measurement.js');

var show = function (req, res){
	
	var sensorIDs = req.user.sensorIDs;
	resData=[];

	// //find for each sensor the last sensorDocument in db sensordata and append it to the response document
	// async.eachSeries(sensorIDs, function (id,next){	
	// 	SensorData.findOne({'sensorObjectID':id}).sort('-settings.timestamp').exec(function (err, sensorData){
			
	//         if (sensorData!==null){
	//         	//if sensor was found, get the sensorIDs
	//         	resData.push(sensorData);
	//         	next();
	//         }else{
	//         	next();
	//         }
	// 	});
	// }, 	function (err){
			
	// 		if(err){
	// 			portal.error('Web Portal: User: '+req.user.username+': Error during data preperation for home request, error: '+err+' \r');
	// 			res.render('home', { title: 'Miblab Weatherstation', errorMessage: 'Error during query.'});
	// 		}
	// 		if (resData.length>0){
	// 			portal.info('Web Portal: User: '+req.user.username+': Home request was successfully carried out.\r');
	// 			res.render('home', { title: 'Miblab Weatherstation', docs: resData});
	// 		}
	// 		else{
	// 			portal.error('Web Portal: User: '+req.user.username+': Error during data preperation for home request, query was empty.');
	// 			res.render('home', { title: 'Miblab Weatherstation', errorMessage: 'No sensors are assigned to user.'});
	// 		}
	// 	}	
	// );
}

module.exports.show = show;

