
const express = require('express');
const router = express.Router();
const slackClient = require('./slack/slackClient.js')
const mailClient = require('./mail/mailClient.js')

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

const sendDownAlert = function(user, sensor, lastMsg, callback){

	if(user.slack.active){

		slackClient.sendAlert(sensor, lastMsg, function(err, res){

			if(err){
				sensor.error('Slack Bot: Alert for sensor: ' + sensor.sensorName + " from user: " + user.username + " could not be sent via Slack app. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Slack Bot: Alert for sensor: ' + sensor.sensorName + " from user: " + user.username +  " was sent via Slack app. \r");
			}
		});
	}

	if(user.email.active){

		mailClient.sendAlert(sensor, lastMsg, function(err, res){
			
			if(err){
				sensor.error('Email Bot: Alert for sensor: ' + sensor.sensorName + " from user: " + user.username + " could not be sent. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Email Bot: Alert for sensor: ' + sensor.sensorName + " from user: " + user.username +  " was sent. \r");
			}
		});
	}
}

const sendTestAlert = function(user, callback){

	if(user.slack.active){

		slackClient.sendTestAlert(user, function(err, res){

			if(err){
				sensor.error('Slack Bot: Test alert for user:' + user.username + " could not be sent via Slack app. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Slack Bot: Test alert for user: ' + user.username +  " was sent via Slack app. \r");
			}
		});
	}

	if(user.email.active){

		mailClient.sendTestAlert(sensor, function(err, res){
			
			if(err){
				sensor.error('Email Bot: Test alert for user: ' + user.username + " could not be sent. Response from server: " + res + " \r");
			}
			if(res){
				sensor.info('Email Bot: Test alert for user: ' + user.username +  " was sent. \r");
			}
		});
	}
}

module.exports.sendDownAlert = sendDownAlert;