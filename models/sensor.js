var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = new Schema({
	sensorID: String,
    sensorName: String,
    location: String,
    macAdresse: String,
    lastRestart: String
});

module.exports = mongoose.model('Sensor', Sensor);