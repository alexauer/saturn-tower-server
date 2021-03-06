const express = require('express');
const router = express.Router();

/* Logger */
const winston = require('winston');
const portal = winston.loggers.get('portal');

/* Models */
const User = require('../../models/user.js')
const Sensor = require('../../models/sensor.js');

const addAccount = function(req,res){

	var user = new User();
    user.username = req.body.settings.username;
    user.password = createHash(req.bodt.settings.password);
    user.emailAddress = req.body.settings.emailAddress;

    var query = User.where({'username':req.body.settings.username})

    query.findOne( function (err, userOld) {
         // In case of any error, return using the done method
        if (err){
            portal.error('Admin Portal: User: '+ user.username + ': Error during saving, Error: '+err);
            var returnJSON = {"status": "failure", "objectID": sensorOld.id, "errormessage": "User could not be saved. Internal Error."};
            res.send(JSON.stringify(returnJSON));
        }
        // already exists
        if (sensorOld) {
            portal.info('Admin Portal: User: '+ user.username + ': Error during saving, sensor already existing, objectID: ' +userOld.id);
            var returnJSON = {"status": "failure", "objectID": sensorOld.id, "errormessage": "User: "+req.body.settings.username+" alreadt exists."};
            res.send(JSON.stringify(returnJSON));
        }else{
            sensor.save(function (err, sensor){
                if (err){
                    portal.error('Admin Portal: User: '+ user.username + ': Error during saving, Error: '+err);
                    var returnJSON = {"status": "failure", "objectID": sensor.id, "errormessage": "Sensor could not be saved into DB."};
                    res.send(JSON.stringify(returnJSON));
                }else{
                    portal.info('Admin Portal: User: '+ user.username + ': Sensor was saved in DB, objectID: ' +user.id);
                    var returnJSON = {"status": 'ok', "objectID": sensor.id, "errormessage": "Sensor saved into DB."};
                    res.send(JSON.stringify(returnJSON));
                }
            });
        }
    });
}

// Generates hash using bCrypt
const createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports.addAccount = addAccount;
