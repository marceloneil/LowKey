var moment = require('moment');
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var SlackUser = require('../models/SlackUser');

var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {
    logLevel: 'error',
    dataStore: new MemoryDataStore()
});
var web = new WebClient(token);

exports.start = function() {
    rtm.start();
    web.channels.list(function(err, res) {
        for (var i = 0; i < res.channels.length; i++) {
            console.log(res.channels[i].name);
            web.channels.history(
                res.channels[i].id, {
                    inclusive: 1,
                    count: 1000
                },
                function(err, res) {
                    for (var j = 0; j < res.messages.length; j++) {
                        var message = res.messages[j];
                        var user = rtm.dataStore.getUserById(message.user);
                        if (message.bot_id) {
                            continue;
                        }
                        else if (!user.id) {
                            continue;
                        }
                        else if (message.text.includes("has joined the channel")) {
                            continue;
                        }
                        var date = new Date(message.ts * 1000);
                        date.setHours(0, 0, 0, 0);
                        var msg = {
                            date: date,
                            body: message.text.replace(/<.*>/, '')
                        };

                        SlackUser.update({
                                userId: user.id
                            }, {
                                $push: {
                                    'messages': msg
                                }
                            }, {
                                safe: true,
                                upsert: true
                            },
                            function(err, data) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );

                        SlackUser.update({
                                userId: user.id
                            }, {
                                $addToSet: {
                                    'dates': date
                                }
                            }, {
                                safe: true,
                                upsert: true
                            },
                            function(err, data) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    }
                })
        }
    });
    web.users.list(function(err, res) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < res.members.length; i++) {
                var user = res.members[i];
                if (!user.is_bot && user.id != 'USLACKBOT') {
                    var slackuser = new SlackUser({
                        userId: user.id,
                        name: user.name,
                        email: user.profile.email,
                        avatar: user.profile.image_192
                    });
                    slackuser.save(function(err, res) {
                        if (err) {
                            //console.log(err);
                        }
                    });
                }
            }
        }
    });
    rtm.on(RTM_EVENTS.MESSAGE, function(message) {
        var user = rtm.dataStore.getUserById(message.user);
        var date = new Date(message.ts * 1000);
        date.setHours(0, 0, 0, 0);
        var msg = {
            date: date,
            body: message.text.replace(/<.*>/, '')
        };

        SlackUser.update({
                userId: user.id
            }, {
                $push: {
                    'messages': msg
                }
            }, {
                safe: true,
                upsert: true
            },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
            }
        );

        SlackUser.update({
                userId: user.id
            }, {
                $addToSet: {
                    'dates': date
                }
            }, {
                safe: true,
                upsert: true
            },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
            }
        );
    });
};

exports.getUsers = function(req, res, next) {
    SlackUser.find({}, function(err, users) {
        res.send(users);
    });
};