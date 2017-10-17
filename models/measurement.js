var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Measurement = new Schema({
	sensorID: String,
	sensorObjectID: String,
	sensorName: String,
	timestamp: Number,
	weatherData: {
		temperatureEnvironment: Number,
		temperatureCPU: Number,
		pressure: Number,
		humidity: Number
	}
});

module.exports = mongoose.model('Measurement', Measurement);