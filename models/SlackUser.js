var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var slackuserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: String,
    email: {
        type: String,
        unique: true
    },
    avatar: String,
    messages: [{
        date: Date,
        body: String
    }],
    dates: [Date]
}, schemaOptions);



var SlackUser = mongoose.model('SlackUser', slackuserSchema);

module.exports = SlackUser;