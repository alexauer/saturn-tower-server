const { WebClient } = require('@slack/client');
const moment = require('moment')

//config
const config = require('../../config/main.json');

//logger
const winston = require('../../logs/logger.js');
const sensor = winston.loggers.get('sensor'); 

//slack setup
const web = new WebClient(config.SLACKTOKEN);
const conversationID = config.slackChannel;

//dummy message
// var sensor = {
// 	"sensorName" : "Phoebe",
// 	"locationID" : "TIRF",
// 	"location": "m326a"
// }
// var lastMsg = {
// 	"timestamp": moment().format('X')
// }

//send down-time alert  
function sendDownAlert = function(sensor, lastMsg){

	var alertText = 'Sensor '+sensor.sensorName+' ('+sensor.locationID+') in room '+sensor.location+' is down since '+ moment(lastMsg.timestamp,'X').format("dd, D MMM, HH:mm");

	web.chat.postMessage({ channel: conversationID, text: alertText })
		.then((res) => {
			if(res.ok){
				sensor.info('Slack Bot: Alert for sensor: ' + sensor.sensorName + " was sent via Slack app. \r");
			}
			if(!res.ok){
				sensor.error('Slack Bot: Alert for sensor: ' + sensor.sensorName + " could not be sent via Slack app. Response from server: " + res + " \r");
			}
		})
		.catch();
}

module.exports.sendDownAlert = sendDownAlert;