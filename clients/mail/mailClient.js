const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const moment = require('moment')

//config
const config = require('../../config/main.json');


var smtpConfig = {
	host: config.emailAlert.SMTP.HOST,
    port: config.emailAlert.SMTP.PORT,
    secure: false,
    auth: {
        user: config.emailAlert.SMTP.USER,
        pass: config.emailAlert.SMTP.PASSWORD
    }
};

//send alert via email
const sendAlert = function(sensor, lastMsg, callback){

    var alertText = 'Sensor '+sensor.sensorName+' ('+sensor.locationID+') in room '+sensor.location+' is down since '+ moment(lastMsg.timestamp,'X').format("dd, D MMM, HH:mm");

    var message = {
        from: config.emailAlert.SENDER,
        to: config.emailAlert.RECEIVER,
        subject: 'Saturn Tower Sensor Alert',
        text: alertText
    };

    var smtpTransport = nodemailer.createTransport(smtpConfig);

    smtpTransport.sendMail(message, (err, res) => {

        if(err){
            return callback(new Error('Alert could not be sent. ' + err.message, false);
        }
        else{
            return callback(false, res);
        }   
    });
}

module.exports.sendAlert = sendAlert;