var indico = require('indico.io');
var SlackUser = require('../models/SlackUser');
var SlackChannel = require('../models/SlackChannel');
var SentimentScore = require('../models/SentimentScore');
var ChannelSentimentScore = require('../models/ChannelSentimentScore');
var fs = require('fs');
var pdfText = require('pdf-text')

//PDFParser = require("./pdf2json/PDFParser");

indico.apiKey = process.env.INDICO;

var logError = function(err) {
    console.log(err);
};

exports.uploadFile = function(req, res, next) {
    /** When using the "single"
    data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var target_path = 'uploads/coverletter.pdf';

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        var buffer = fs.readFileSync(target_path);
        pdfText(buffer, function(err, chunks) {
            console.log(chunks.toString());
            fs.unlink(target_path, function(err) {
                if (err) {
                    console.log(err);
                }
                indico.personas(chunks.toString()).then(function(data) {
                    console.log(data);

                    var calculatedPersona = calculatePersona(data);

                    res.send({
                        "persona": calculatedPersona
                    });

                }).catch(logError);
            });
        });
    });
    src.on('error', function(err) {
        res.send('error');
    });


};

exports.analyze = function(req, res, next) {
    //get slack user
    SlackUser.findOne({
        userId: req.body.userid
    }, function(err, slackuser) {

        if (err) {
            res.send("error");
        }

        var dailyMessages = [];
        if (slackuser.dates) {

            for (var i = 0; i < slackuser.dates.length; i++) {
                var completemsg = "";
                for (var j = 0; j < slackuser.messages.length; j++) {
                    var date1 = slackuser.messages[j].date + "";
                    var date2 = slackuser.dates[i] + "";
                    if (date1 == date2) {
                        completemsg += slackuser.messages[j].body + " ";
                    }
                }

                dailyMessages.push({
                    date: slackuser.dates[i],
                    msg: completemsg
                });

            }


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
                    scores.push({
                        date: dailyMessages[i].date,
                        score: calculatedScores[i]
                    });
                }
                sentimentscore.scores = scores;


                sentimentscore.save(function(err, sscore) {
                    if (err) {
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

exports.analyzeChannel = function(req, res, next) {
    //get slack user
    SlackChannel.findOne({
        channelId: req.body.channelid
    }, function(err, slackchannel) {

        var dailyMessages = [];
        if (slackchannel.dates) {

            for (var i = 0; i < slackchannel.dates.length; i++) {
                var completemsg = "";
                for (var j = 0; j < slackchannel.messages.length; j++) {
                    var date1 = slackchannel.messages[j].date + "";
                    var date2 = slackchannel.dates[i] + "";
                    if (date1 == date2) {
                        completemsg += slackchannel.messages[j].body + " ";
                    }
                }

                dailyMessages.push({
                    date: slackchannel.dates[i],
                    msg: completemsg
                });

            }

            var text = [];
            for (var i = 0; i < dailyMessages.length; i++) {
                text.push(dailyMessages[i].msg);
            }



            indico.emotion(text).then(function(data) {
                var channelsentimentscore = new ChannelSentimentScore();
                channelsentimentscore.channelname = slackchannel.channelName;
                channelsentimentscore.channelid = slackchannel.channelId;
                var scores = [];

                var calculatedScores = calculateScore(data);

                var results = [];
                for (var i = 0; i < calculatedScores.length; i++) {
                    //results.push({date: dailyMessages[i].date, score: calculatedScores[i]});
                    scores.push({
                        date: dailyMessages[i].date,
                        score: calculatedScores[i]
                    });
                }
                channelsentimentscore.scores = scores;

                channelsentimentscore.save(function(err, sscore) {
                    if (err) {
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
    //get slack user
    SlackUser.findOne({
        userId: req.body.userid
    }, function(err, slackuser) {

        var dailyMessages = [];
        if (slackuser.dates) {


            var completemsg = "";
            for (var j = 0; j < slackuser.messages.length; j++) {
                completemsg += slackuser.messages[j].body + " ";
            }
            indico.personas(completemsg).then(function(data) {
                var calculatedPersona = calculatePersona(data);
                res.send({
                    "persona": calculatedPersona
                });
            }).catch(logError);
        }
        else {
            console.log("error");
            res.send("this is an error");
        }
    });
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
        joyScore = (results[i].joy * 90) / 2;
        sadnessScore = (results[i].sadness * 25) / 2;
        fearScore = (results[i].fear * 25) / 2;
        surpriseScore = (results[i].surprise * 10) / 2;

        totalScore = totalScore - angerScore - sadnessScore - fearScore + joyScore + surpriseScore;
        scoreArray[i] = totalScore;
    }
    return scoreArray;
}

function calculatePersona(data) {
    var array = [];
    for (var a in data) {
        array.push([a, data[a]])
    }
    array.sort(function(a, b) {
        return a[1] - b[1]
    });
    array.reverse();
    /*
    Architect
    Logician
    Commander
    Debater
    Advocate
    Mediator
    Protagonist
    Campaigner
    Logistician
    Defender", "https://www.16personalities.com/isfj-personality"),
        ("Executive", "https://www.16personalities.com/estj-personality"),
        ("Consul", "https://www.16personalities.com/esfj-personality"),
        ("Virtuoso", "https://www.16personalities.com/istp-personality"),
        ("Adventurer", "https://www.16personalities.com/isfp-personality"),
        ("Entrepreneur", "https://www.16personalities.com/estp-personality"),
        ("Entertainer", "https://www.16personalities.com/esfp-personality")
    */
    var str = JSON.stringify(array[0]);
    console.log(str);
    var arr = str.split(",");
    var newstr = arr[0];
    var personastr = newstr.substring(2, newstr.length - 1);
    return personastr;
}


exports.analyzePersona = function(req, res, next) {
    console.log(req.body.text);
    indico.personas(req.body.text).then(function(data) {
        var array = [];
        for (var a in data) {
            array.push([a, data[a]])
        }
        array.sort(function(a, b) {
            return a[1] - b[1]
        });
        array.reverse();

        var str = JSON.stringify(array[0]);
        var arr = str.split(",");
        var newstr = arr[0];
        var personastr = newstr.substring(2, newstr.length - 1);
        console.log(personastr);
        res.send(personastr);
    });
};

exports.determineEmotions = function(req, res, next) {
  
    indico.emotion(req.body.speech).then(function(data) {
        res.send(data);
    });
};