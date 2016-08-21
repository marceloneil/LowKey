var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var slackchannelSchema = new mongoose.Schema({
    channelId: {
        type: String,
        unique: true
    },
    channelName: String,
    users: [String],
    messages: [{
        date: Date,
        user: String,
        body: String
    }],
    dates: [Date]
}, schemaOptions);



var SlackChannel = mongoose.model('SlackChannel', slackchannelSchema);

module.exports = SlackChannel;