var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var user = new Schema({
    username: String,
    password: String,
    sensorsID: [Schema.Types.ObjectId]
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', user);