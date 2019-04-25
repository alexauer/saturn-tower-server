var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user'},
    password: String,
    sensorObjectIDs: [Schema.Types.ObjectId],
    email:{
    	active: { type: Boolean, default: false },
    	address: String
    },
    slack:{
    	active: { type: Boolean, default: false },
    	TOKEN: String,
    	channelID: String
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);