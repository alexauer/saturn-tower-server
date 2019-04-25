
const express = require('express');
const router = express.Router();
const slackClient = require('./slack/slackClient.js')
const mailClient = require('./mail/mailClient.js')

//config
const config = require('../config/main.json');

//logger
const winston = require('../logs/logger.js');
const sensor = winston.loggers.get('sensor'); 


//dummy message
// var sensor = {
// 	"sensorName" : "Phoebe",
// 	"locationID" : "TIRF",
// 	"location": "m326a"
// }
// var lastMsg = {
// 	"timestamp": moment().format('X')
// }

const sendDownAlert = function(sensor, lastMsg, callback){

	if(config.slackAlert.active){

		slackClient.sendAlert(sensor, lastMsg, function(err, res){

			if(err){
				sensor.error('Slack Bot: Alert for sensor: ' + sensor.sensorName + " could not be sent via Slack app. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Slack Bot: Alert for sensor: ' + sensor.sensorName + " was sent via Slack app. \r");
			}
		});
	}

	if(config.emailAlert.active){

		mailClient.sendAlert(sensor, lastMsg, function(err, res){
			
			if(err){
				sensor.error('Email Bot: Alert for sensor: ' + sensor.sensorName + " could not be sent. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Email Bot: Alert for sensor: ' + sensor.sensorName + " was sent. \r");
			}
		});
	}
}

module.exports.sendDownAlert = sendDownAlert;