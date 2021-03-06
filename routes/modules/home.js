const express = require('express');
const router = express.Router();
const async = require('async');

/* Logger */
const winston = require('winston');
const portal = winston.loggers.get('portal');

/* Models */
const User = require('../../models/user.js')
const Sensor = require('../../models/sensor.js');
const Measurement = require('../../models/measurement.js');


const show = function (req, res){
	
	var sensorObjectIDs = req.user.sensorObjectIDs;
	var response = [];

	async.eachSeries(sensorObjectIDs, function(id,next){
			
		Measurement.findOne({'sensorObjectID':id}).sort('-timestamp').exec( function(err,measurement){

			if(err){
					next();
			}else if(measurement){

				var query = Sensor.where({'_id':id});
				query.findOne(function(err,sensor){

					if(err){	

					}else if(sensor){
						var data = {
							"sensor" : {
								"locationID" : sensor.locationID,
								"sendInterval" : sensor.sendInterval,
								"data" : measurement }
							}
						
						response.push(data);

					}else{
						
					}
					next();
				});

			}else{
				next();
			}
		});
	}, function(err){
		if(err){
			res.render('home', {title: 'Saturn Tower', errorMessage:'Error during data preparation.'});
		}else if(response){
			
			res.render('home', {title: 'Saturn Tower', docs:response});
		}else{
			res.render('home', {title: 'Saturn Tower', errorMessage:'User has no sensors assigned.'});
		}
	});	
}

module.exports.show = show;

