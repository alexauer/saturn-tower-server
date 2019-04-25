const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/client');
const moment = require('moment')

//send alert via slack
const sendAlert = function(user, sensor, lastMsg, callback){

	//slack setup
	var web = new WebClient(user.slack.TOKEN);
	var conversationID = user.slack.channelID;

	var alertText = 'Sensor '+sensor.sensorName+' ('+sensor.locationID+') in room '+sensor.location+' is down since '+ moment(lastMsg.timestamp,'X').format("dd, D MMM, HH:mm");

	web.chat.postMessage({ channel: conversationID, text: alertText })
		.then((res) => {
			if(!res.ok){
				return callback(new Error('Alert could not be sent. ' + res, false);
			}
			if(res.ok){
				return callback(false, res.ok);
			}	
		})
		.catch();
}

const sendTestAlert = function(user, callback){

	//slack setup
	var web = new WebClient(user.slack.TOKEN);
	var conversationID = user.slack.channelID;

	var alertText = 'This is a test message from the Saturn Tower sensor alert.';

	web.chat.postMessage({ channel: conversationID, text: alertText })
		.then((res) => {
			if(!res.ok){
				return callback(new Error('Test alert could not be sent. ' + res, false);
			}
			if(res.ok){
				return callback(false, res.ok);
			}	
		})
		.catch();
}

module.exports.sendAlert = sendAlert;
module.exports.sendTestAlert = sendTestAlert;