var indico = require('indico.io');
var SlackUser = require('../models/SlackUser');
var SentimentScore = require('../models/SentimentScore');

indico.apiKey = process.env.INDICO;

var logError = function(err) {
    console.log(err);
}

exports.analyze = function(req, res, next) {

    //get slack user
    SlackUser.find({
        name: req.body.name
    }, function(err, slackuser) {
        //go through slack user's messages
        var results = [];
        var messages = slackuser.messages;

        //go through the day's messages
        for (var j = 0; j < messages; j++) {
            indico.emotion(messages[j].messages).then(function(data) {
                results.push(data);
            }).catch(logError);
        }

        var calculatedScores = calculateScore(results);

        var dailyResults = [];
        for(var k=0; k<calculatedScores.length; k++){
            dailyResults.push({
                date: slackuser.messages[k].date,
                score: calculatedScores[k]
            })
        }

        var sentimentscore = new SentimentScore();
        sentimentscore.username = req.body.name;
        sentimentscore.userid = slackuser.userId;
        sentimentscore.scores = dailyResults;
        
        sentimentscore.save(function(err, sscore){
            res.send(sscore); 
        });
        

    });


};

//return an array of scores
function calculateScore(results) {
    var angerScore = 0;
    var joyScore = 0;
    var sadnessScore = 0;
    var totalScore = 50;
    for (var i = 0; i < results.length; i++) {
        angerScore += (results[i].anger * 0.7);
        joyScore += results[i].joy;
        sadnessScore += (results[i].sadness * 0.3);
        totalScore = totalScore - angerScore - sadnessScore + joyScore;
    }
}