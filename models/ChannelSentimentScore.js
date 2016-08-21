var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var ChannelSentimentScoreSchema = new mongoose.Schema({
    channelname: String,
    channelid: String,
    scores: [{
        date: Date,
        score: Number
    }]
}, schemaOptions);



var ChannelSentimentScore = mongoose.model('ChannelSentimentScore', ChannelSentimentScoreSchema);

module.exports = ChannelSentimentScore;