  angular.module('MyApp')
    .controller('HomeCtrl', function($scope, $location, $window, $auth, $http) {
      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };


      $scope.slackChannelName = "General";

      $scope.showGraph = function(user) {
        document.getElementById('id01').style.display = 'block';
        console.log(user);
        //console.log(user.score)
        $http({
          method: 'GET',
          url: 'https://lowkey-kshen3778.c9users.io/personas'
        }).then(function successCallback(response) {
          console.log(response.data);
        }, function errorCallback(response) {
          console.log(response);
        });
      }



      // This gets initialized once upon page load to retrieve the usernames
      $http({
        method: 'GET',
        url: 'https://lowkey-kshen3778.c9users.io/slackusers'
      }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
          var userScore = 100;
          angular.element(document.getElementById("userCardsCon")).append('<div class="col-sm-2" style="cursor: pointer;" ng-click="showGraph("' + response.data[i].userid + '")"><div class="panel"><div class="panel-body"><h2 class="w3-center " style="margin-bottom: 100px">' + response.data[i].name + '</h2><p class="number" style="margin-bottom: -145px">' + userScore + '</p><canvas id="' + response.data[i].name + 'doughnutChart" style="margin-bottom: 50px" width="100" height="100"><button class="w3-btn-block">View Details</button></div></div></div>');

          var canvas = document.getElementById(response.data[i].name + 'doughnutChart');
          var ctx = canvas.getContext("2d");

          // Doughnut Chart Data
          var doughnutData = {
            labels: [
              "Score"
            ],
            datasets: [{
              data: [86, 100 - 86],
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
        }
        $scope.users = response;
      }, function errorCallback(response) {
        console.log(response);
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



      var canvas = document.getElementById('userMentalHealth');
      var ctx = canvas.getContext("2d");
      var dat = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [65, 59, 80, 81, 56, 55, 40]
        }, {
          label: "My Second dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [28, 48, 40, 19, 86, 27, 90]
        }]
      };


      var myNewChart = new Chart(ctx, {
        type: "line",
        data: dat,
      });








      $scope.lineGraphData = Array();
      $scope.genLineGraph = function(dayArray) {
        for (var i = 0; i < dayArray.length; i++) {
          $scope.lineGraphData.push(dayArray[i].score);
        }
      };
    });