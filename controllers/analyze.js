var indico = require('indico.io');
var SlackUser = require('../models/SlackUser');
var SentimentScore = require('../models/SentimentScore');

indico.apiKey = process.env.INDICO;

var logError = function(err) {
    console.log(err);
}

exports.analyze = function(req, res, next) {
    //get slack user
    SlackUser.findOne({
        userId: req.body.userid
    }, function(err, slackuser) {
        
        var dailyMessages = [];
        if (slackuser.dates) {

            for (var i = 0; i < slackuser.dates.length; i++) {
                var completemsg = "";
                for (var j = 0; j < slackuser.messages.length; j++) {
                    var date1 = slackuser.messages[j].date + "";
                    var date2 = slackuser.dates[i] + "";
                    if (date1 == date2) {
                        //console.log("equal");
                        completemsg += slackuser.messages[j].body + " ";
                    }
                }

                dailyMessages.push({
                    date: slackuser.dates[i],
                    msg: completemsg
                });

            }
            
            //console.log(dailyMessages);


            var text = [];
            for (var i = 0; i < dailyMessages.length; i++) {
                text.push(dailyMessages[i].msg);
            }



            indico.emotion(text).then(function(data) {
                
                var sentimentscore = new SentimentScore();
                sentimentscore.username = slackuser.name;
                sentimentscore.userid = slackuser.userId;
                var scores = [];

                var calculatedScores = calculateScore(data);

                var results = [];
                for (var i = 0; i < calculatedScores.length; i++) {
                    //results.push({date: dailyMessages[i].date, score: calculatedScores[i]});
                    scores.push({date: dailyMessages[i].date, score: calculatedScores[i]});
                }
                sentimentscore.scores = scores;


                sentimentscore.save(function(err, sscore) {
                    if(err){
                        res.send(err);
                    }
                    res.send(sscore);
                });
            }).catch(logError);

        }
        else {
            console.log("user doesnt have dates");
            res.send("this is an error");

        }

    });


};
exports.personas = function(req, res, next) {
    indico.personas("I worked primarily with acoustics and noise control, with my emphasis being in active noise and vibration control. I worked with the aircraft fuselage and all of the vibrations and noises created in there and limiting their effects on the cockpit. Of course, automobile engines are also very noisy being so close to the driver. I also worked with compressors. I worked with really small compressors to really big compressors. I worked on small refrigeration units using passive and active control techniques. You�d be surprised at how big an issue refrigerator noise is overseas, in Europe and Asia with their tight living conditions. I also worked with huge engine compressors of up to sixty horsepower. That�s really big for a university, you know. I also worked with reciprocating compressors, screw compressors, scroll compressors, and rotary compressors. ").then(function(data) {
        res.send(data);
    }).catch(logError);
};

//return an array of scores
function calculateScore(results) {
    var angerScore = 0;
    var joyScore = 0;
    var sadnessScore = 0;
    var fearScore = 0;
    var surpriseScore = 0;
    var totalScore;
    var scoreArray = new Array(results.length);
    for (var i = 0; i < results.length; i++) {
        totalScore = 50;
        angerScore = (results[i].anger * 50) / 2;
        joyScore = (results[i].joy * 75) / 2;
        sadnessScore = (results[i].sadness * 25) / 2;
        fearScore = (results[i].fear * 25) / 2;
        surpriseScore = (results[i].surprise * 25) / 2;
        
        totalScore = totalScore - angerScore - sadnessScore - fearScore + (joyScore * 3) + surpriseScore;
        scoreArray[i] = totalScore;
    }


    return scoreArray;

}