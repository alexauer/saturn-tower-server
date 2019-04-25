var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = new Schema({
	creationTimestamp: Number,
	sensorID: String,
    sensorName: String,
    location: String,
    locationID: String,
    connectivity: String,
    sendInterval: Number,
    macAdresse: String,
    lastRestart: String
});

module.exports = mongoose.model('Sensor', Sensor);