//angular.module('chart.js', []);
//var charts = angular.module('myModule', ['chart.js']);

angular.module('MyApp')
  .controller('HomeCtrl', function($scope, $location, $window, $auth, $http) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];
    $scope.slackChannelName = "General";

    $scope.channelCards = [];
    // This gets initialized once upon page load to retrieve the usernames
    $http({
      method: 'GET',
      url: 'https://lowkey-kshen3778.c9users.io/slackchannels'
    }).then(function successCallback(response) {
      for (var i = 0; i < response.data.length; i++) {
        $http({
          method: 'POST',
          data: {
            channelid: response.data[i].channelId
          },
          url: 'https://lowkey-kshen3778.c9users.io/analyzechannel'
        }).then(function successCallback(res) {
          var channelScore = 0;
          var data = [];
          var labels = [];
          var array = res.data.scores;
          array.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });
          for (var a = 0; a < res.data.scores.length; a++) {
            channelScore += res.data.scores[a].score;
            data.push(array[a].score);
            labels.push(new Date(array[a].date).toDateString());
          }
          channelScore = channelScore / res.data.scores.length;
          channelScore = Math.round(channelScore * 10) / 10;


          var pieData = [channelScore, 100 - channelScore];
          var pieLabels = ['Emotion Score', ''];

          $scope.channelCards.push({
            labels: labels,
            series: ['Emotion Score'],
            data: data,
            //colours: ['#5cb360', '#d4e4d5'],
            channelname: res.data.channelname,
            channelScoreCalculated: channelScore,
            pieData: pieData,
            pieLabels: pieLabels,
            options: {
              title: {
                display: true,
                text: res.data.channelname
              }
            }
          });
        });
      }
    });



    $scope.showGraph = function(id) {
      document.getElementById('id01').style.display = 'block';
    };
    $scope.usersCards = [];
    // This gets initialized once upon page load to retrieve the usernames
    $http({
      method: 'GET',
      url: 'https://lowkey-kshen3778.c9users.io/slackusers'
    }).then(function successCallback(response) {
        var personaArray = [
          ("Architect", "https://www.16personalities.com/intj-personality"),
          ("Logician", "https://www.16personalities.com/intp-personality"),
          ("Commander", "https://www.16personalities.com/entj-personality"),
          ("Debater", "https://www.16personalities.com/entp-personality"),
          ("Advocate", "https://www.16personalities.com/infj-personality"),
          ("Mediator", "https://www.16personalities.com/infp-personality"),
          ("Protagonist", "https://www.16personalities.com/enfj-personality"),
          ("Campaigner", "https://www.16personalities.com/enfp-personality"),
          ("Logistician", "https://www.16personalities.com/istj-personality"),
          ("Defender", "https://www.16personalities.com/isfj-personality"),
          ("Executive", "https://www.16personalities.com/estj-personality"),
          ("Consul", "https://www.16personalities.com/esfj-personality"),
          ("Virtuoso", "https://www.16personalities.com/istp-personality"),
          ("Adventurer", "https://www.16personalities.com/isfp-personality"),
          ("Entrepreneur", "https://www.16personalities.com/estp-personality"),
          ("Entertainer", "https://www.16personalities.com/esfp-personality")
        ];
        $scope.responseData = response.data;
        for (var i = 0; i < response.data.length; i++) {

          $http({
            method: 'POST',
            data: {
              userid: response.data[i].userId,
            },
            url: 'https://lowkey-kshen3778.c9users.io/analyze'
          }).then(function successCallback(res) {
              var userScore = 0;
              var data = [];
              var labels = [];
              var colours = ['#FFFFFF', '#FFFFFF'];
              var array = res.data.scores;
              array.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
              });
              for (var a = 0; a < array.length; a++) {
                userScore += array[a].score;
                data.push(array[a].score);
                labels.push(new Date(array[a].date).toDateString());
              }
              userScore = userScore / res.data.scores.length;
              userScore = Math.round(userScore * 10) / 10;
              var pieData = [userScore, 100 - userScore];
              var pieLabels = ['Emotion Score', ''];

              $http({
                method: 'POST',
                data: {
                  userid: res.data.userid
                },
                url: 'https://lowkey-kshen3778.c9users.io/personas'
              }).then(function successCallback(res2) {
                  $scope.usersCards.push({
                    labels: labels,
                    series: ['Emotion Score'],
                    data: data,
                    //colours: colours,
                    pieData: pieData,
                    pieLabels: pieLabels,
                    username: res.data.username,
                    persona: res2.data.persona,
                    userScoreCalculated: userScore,
                    options: {
                      title: {
                        display: true,
                        text: res.data.username
                      }
                    }
                  });
                },
                function errorCallback(response) {
                  console.log(response);
                });


            },
            function errorCallback(response) {
              console.log(response);
            });
        }
      },
      function errorCallback(response) {
        console.log(response);
      });


    $scope.lineGraphData = [];
    $scope.genLineGraph = function(dayArray) {
      $scope.lineLabels = dayArray.labels;
      $scope.lineSeries = dayArray.series;
      $scope.lineData = dayArray.data;
      $scope.lineOptions = dayArray.options;
      document.getElementById('id01').style.display = 'block';
    };
  });