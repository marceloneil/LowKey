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
        // Channels List
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
                        if(err){
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                    });
                }
            }
        }
    });
    rtm.on(RTM_EVENTS.MESSAGE, function(message) {
        var user = rtm.dataStore.getUserById(message.user);
        var date = moment(message.ts * 1000).format('DD/MM/YYYY');
        var avatar = user.profile.image_192;
        console.log(avatar);

        console.log(message);
    });
}