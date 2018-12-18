var express = require('express');
var router = express.Router();

/* Logger */
var winston = require('winston');
var portal = winston.loggers.get('portal');

/* Models */
var User = require('../../models/user.js')
var Sensor = require('../../models/sensor.js');

var addSensor = function(req,res){

	var sensor = new Sensor();
    sensor.creationTimestamp = generateDate();
	sensor.sensorID = req.body.settings.sensorID;
    sensor.sensorName = req.body.settings.sensorName;
    sensor.location = req.body.settings.location;
    sensor.locationID =  req.body.settings.locationID;
    sensor.connectivity = req.body.settings.connectivity;
    sensor.macAdresse = req.body.settings.macAdresse; 

    var query = Sensor.where({'sensorID':req.body.settings.sensorID})

    query.findOne( function (err, sensorOld) {
         // In case of any error, return using the done method
        if (err){
            portal.error('Admin Portal: SensorID: '+ sensor.sensorID+ ': Error during saving, Error: '+err);
            var returnJSON = {"status": "failure", "objectID": sensorOld.id, "errormessage": "Sensor could not be saved. Internal Error."};
            res.send(JSON.stringify(returnJSON));
        }
        // already exists
        if (sensorOld) {
            portal.info('Admin Portal: SensorID: '+ sensor.sensorID+ ': Error during saving, sensor already existing, objectID: ' +sensorOld.id);
            var returnJSON = {"status": "failure", "objectID": sensorOld.id, "errormessage": "Sensor with sensorID: "+req.body.settings.sensorID+" alreadt exists."};
            res.send(JSON.stringify(returnJSON));
        }else{
            sensor.save(function (err, sensor){
                if (err){
                    portal.error('Admin Portal: SensorID: '+ sensor.sensorID+ ': Error during saving, Error: '+err);
                    var returnJSON = {"status": "failure", "objectID": sensor.id, "errormessage": "Sensor could not be saved into DB."};
                    res.send(JSON.stringify(returnJSON));
                }else{
                    portal.info('Admin Portal: SensorID: '+ sensor.sensorID+ ': Sensor was saved in DB, objectID: ' +sensor.id);
                    var returnJSON = {"status": 'ok', "objectID": sensor.id, "errormessage": "Sensor saved into DB."};
                    res.send(JSON.stringify(returnJSON));
                }
            });
        }
    });
}

var generateDate = function(){
    var result = moment().format('X');
    return result;
};

module.exports.addSensor = addSensor;
