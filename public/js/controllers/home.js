angular.module('chart.js',[]);
var charts = angular.module('myModule',['chart.js']);

angular.module('MyApp', ["myModule"])
  .controller('HomeCtrl', function($scope, $location, $window, $auth, $http) {
      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.data = [300, 500, 100];
      $scope.slackChannelName = "General";

      var showGraph = function(id) {
        document.getElementById('id01').style.display = 'block';
        console.log(id);
        /*
        $http({
            method: 'POST',
            data: {
              userid: response.data[i].userId
            },
            url: 'https://lowkey-kshen3778.c9users.io/analyze'
          }).then(function successCallback(res) {
        
          });*/
        //console.log(user.score)
        /*$http({
          method: 'GET',
          url: 'https://lowkey-kshen3778.c9users.io/personas'
        }).then(function successCallback(response) {
          console.log(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });*/
      };
      $scope.usersCards = [

      ];
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
              userid: response.data[i].userId
            },
            url: 'https://lowkey-kshen3778.c9users.io/analyze'
          }).then(function successCallback(res) {
            console.log(res);
            var userScore = 0;
            for (var a = 0; a < res.data.scores.length; a++) {
              userScore += res.data.scores[a].score;
            }
            userScore = userScore / res.data.scores.length;
            userScore = Math.round(userScore * 10) / 10;
            res.userScoreCalculated = userScore;
            //console.log(userScore);
            angular.element(document.getElementById("userCardsCon")).append('<div class="col-sm-2 w3-animate-zoom userCard" style="cursor: pointer;" onclick="showGraph(\''+res.data.id+'\')"><div class="panel"><div class="panel-body" ><h2 class="w3-center " style="margin-bottom: 100px;">' + res.data.username + '</h2><p class="number" style="margin-bottom: -145px;">' + userScore + '</p><canvas id="' + res.data.username + 'doughnutChart" style="margin-bottom: 50px;" width="100" height="100"></div></div></div>');

            var canvas = document.getElementById(res.data.username + 'doughnutChart');
            var ctx = canvas.getContext("2d");

            // Doughnut Chart Data
            var doughnutData = {
              labels: [
                "Score"
              ],
              datasets: [{
                data: [userScore, 100 - userScore],
                backgroundColor: [
                  "#5cb360",
                  "#d4e4d5"
                ],
                hoverBackgroundColor: [
                  "#5cb360",
                  "#d4e4d5"
                ]
              }]
            };


            // Create the Doughnut Chart
            var scoreChart = new Chart(ctx, {
              type: "doughnut",
              data: doughnutData
            });
          }, function errorCallback(response) {
            console.log(response);
          });
        }
            $scope.usersCards.push(res.data);

          }, function errorCallback(response) {
            console.log(response);
          });
        }
      });
        /*$http({
          method: 'POST',
          data: {
            name: "splacorn"
          },
          url: 'https://lowkey-kshen3778.c9users.io/analyze'
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          console.log(response);
        });*/










        $scope.lineGraphData = [];
        $scope.genLineGraph = function(dayArray) {
          for (var i = 0; i < dayArray.length; i++) {
            $scope.lineGraphData.push(dayArray[i].score);
          }
        };
});