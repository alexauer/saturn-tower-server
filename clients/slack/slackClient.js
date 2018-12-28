const express = require('express');
const router = express.Router();
const { WebClient } = require('@slack/client');
const moment = require('moment')

//config
const config = require('../../config/main.json');

//slack setup
const web = new WebClient(config.slackAlert.TOKEN);
const conversationID = config.slackAlert.channel;

//send alert via slack
const sendAlert = function(sensor, lastMsg, callback){

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

module.exports.sendAlert = sendAlert;