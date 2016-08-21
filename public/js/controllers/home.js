//angular.module('chart.js', []);
//var charts = angular.module('myModule', ['chart.js']);

angular.module('MyApp')
  .controller('HomeCtrl', function($scope, $location, $window, $auth, $http) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    Chart.defaults.global.colors =  ['#5cb360', '#DCDCDC', '#00ADF9', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];
    $scope.slackChannelName = "General";

    $scope.currentPersonaLink = "";
    $scope.currentPersona = "";
    
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
          
          if(channelScore >= 60){
            Chart.defaults.global.colors[0] =  '#5cb360';
          }else if(channelScore <= 40){
            Chart.defaults.global.colors[0] =  '#ca0041';
          }else{
            Chart.defaults.global.colors[0] =  '#ffd500';
          }


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
            persona: "",
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
              //var pieColours = ['#803690', '#DCDCDC'];
              //{fillColor:['#5cb360', '#d4e4d5']}
              
              
              $http({
                method: 'POST',
                data: {
                  userid: res.data.userid
                },
                url: 'https://lowkey-kshen3778.c9users.io/personas'
              }).then(function successCallback(res2) {
                if(userScore >= 60){
                  Chart.defaults.global.colors[0] =  '#5cb360';
                }else if(userScore <= 40){
                  Chart.defaults.global.colors[0] =  '#ca0041';
                }else{
                  Chart.defaults.global.colors[0] =  '#ffd500';
                }
                  $scope.usersCards.push({
                    labels: labels,
                    series: ['Emotion Score'],
                    data: data,
                    //fillColor: colours,
                    pieData: pieData,
                    pieLabels: pieLabels,
                    //pieColours: pieColours,
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
    var personaArray = {
          "architect": "https://www.16personalities.com/intj-personality",
          "logician": "https://www.16personalities.com/intp-personality",
          "commander": "https://www.16personalities.com/entj-personality",
          "debater": "https://www.16personalities.com/entp-personality",
          "advocate": "https://www.16personalities.com/infj-personality",
          "mediator": "https://www.16personalities.com/infp-personality",
          "protagonist": "https://www.16personalities.com/enfj-personality",
          "campaigner": "https://www.16personalities.com/enfp-personality",
          "logistician": "https://www.16personalities.com/istj-personality",
          "defender": "https://www.16personalities.com/isfj-personality",
          "executive": "https://www.16personalities.com/estj-personality",
          "consul": "https://www.16personalities.com/esfj-personality",
          "virtuoso": "https://www.16personalities.com/istp-personality",
          "adventurer": "https://www.16personalities.com/isfp-personality",
          "entrepreneur": "https://www.16personalities.com/estp-personality",
          "entertainer": "https://www.16personalities.com/esfp-personality"
    };
    $scope.genLineGraph = function(dayArray) {
      Chart.defaults.global.colors[0] =  '#97BBCD';
      $scope.lineLabels = dayArray.labels;
      $scope.lineSeries = dayArray.series;
      $scope.lineData = dayArray.data;
      $scope.lineOptions = dayArray.options;
      $scope.currentPersona = dayArray.persona;

      $scope.currentPersonaLink = personaArray[dayArray.persona];
      document.getElementById('id01').style.display = 'block';
    };
  });