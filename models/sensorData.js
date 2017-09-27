var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorData = new Schema({
	sensorID: String,
	sensorObjectID: String,
    sensorName: String,
    timestamp: String,
    weatherData: {
    	temperatureEnvironment: Number,
    	temperatureCPU: Number,
    	pressure: Number,
    	humidity: Number
    }
});

module.exports = mongoose.model('SensorData', SensorData);