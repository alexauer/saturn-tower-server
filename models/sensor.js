var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensor = new Schema({
    sensorName: String,
    location: String,
    macAdresse: String,
});

module.exports = mongoose.model('sensor', sensor);