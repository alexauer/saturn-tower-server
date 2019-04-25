var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = new Schema({
	creationTimestamp: Number,
	sensorID: String,
    sensorName: String,
    location: String,
    locationID: String,
    sendInterval: Number,
    lastRestart: String
});

module.exports = mongoose.model('Sensor', Sensor);