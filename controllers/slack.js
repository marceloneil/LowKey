var moment = require('moment');
var async = require('async');
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var SlackUser = require('../models/SlackUser');
var SlackChannel = require('../models/SlackChannel');
var firstTime = false;

var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {
    logLevel: 'error',
    dataStore: new MemoryDataStore()
});
var web = new WebClient(token);

exports.start = function() {
    rtm.start();
    web.channels.list(function(err, res) {
        async.map(
            res.channels,
            function(channel, Callback) {
                if (firstTime) {
                    var slackchannel = new SlackChannel({
                        channelId: channel.id,
                        channelName: channel.name,
                        users: channel.members
                    });
                    slackchannel.save(function(err, res) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                web.channels.history(
                    channel.id, {
                        inclusive: 1,
                        count: 1000
                    },
                    function(err, res) {
                        if (firstTime) {
                            for (var j = 0; j < res.messages.length; j++) {
                                var message = res.messages[j];
                                if (message.bot_id || !message.user || message.text.includes("has joined the channel")) {
                                    continue;
                                }
                                else {
                                    var date = new Date(message.ts * 1000);
                                    date.setHours(0, 0, 0, 0);
                                    var msg = {
                                        date: date,
                                        body: message.text.replace(/<.*>/, '').replace(/\r?\n|\r/g, '')
                                    };

                                    SlackUser.update({
                                            userId: message.user
                                        }, {
                                            $push: {
                                                'messages': msg
                                            },
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
                                    
                                    msg.user = message.user;

                                    SlackChannel.update({
                                            channelId: channel.id
                                        }, {
                                            $push: {
                                                'messages': msg
                                            },
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
                                    )
                                }
                            }
                        }
                    }
                )
            },
            function(err, res) {
                if (err) {
                    console.log(err, res);
                }
            });
    });
    web.users.list(function(err, res) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < res.members.length; i++) {
                var user = res.members[i];
                if (!user.is_bot && user.id != 'USLACKBOT' && firstTime) {
                    var slackuser = new SlackUser({
                        userId: user.id,
                        name: user.name,
                        email: user.profile.email,
                        avatar: user.profile.image_192
                    });
                    slackuser.save(function(err, res) {
                        if (err) {
                            console.log(err);
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
            body: message.text.replace(/<.*>/, '').replace(/\r?\n|\r/g, '')
        };
        console.log(message.channel);

        if (message.bot_id) {
            // Bot
        }
        else if (!user.id) {
            console.log('No user Id');
        }
        else if (message.text.includes("has joined the channel")) {
            // Notification
        }
        else {

            if (user.name == "peter") {
                web.reactions.add("key", {
                    timestamp: parseFloat(message.ts),
                    channel: message.channel
                }, function(err, res) {
                    if (err || !res.ok) {
                        console.log(res);
                        console.log(err);
                    }
                });
            }

            SlackUser.update({
                    userId: user.id
                }, {
                    $push: {
                        'messages': msg
                    },
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

            if (message.channel.charAt(0) === "C") {
                
                msg.user = message.user;
                
                SlackChannel.update({
                        channelId: message.channel
                    }, {
                        $push: {
                            'messages': msg
                        },
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
        }
    });
};

exports.getUsers = function(req, res, next) {
    SlackUser.find({}, function(err, users) {
        res.send(users);
    });
};

exports.getChannels = function(req, res, next) {
    SlackChannel.find({}, function(err, channels) {
        res.send(channels);
    });
};