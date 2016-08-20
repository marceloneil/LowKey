var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var SentimentScoreSchema = new mongoose.Schema({
    username: String,
    userid: String,
    scores: [{
        date: Date,
        score: Number
    }]
}, schemaOptions);



var SentimentScore = mongoose.model('SentimentScore', SentimentScoreSchema);

module.exports = SentimentScore;