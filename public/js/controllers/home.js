  angular.module('MyApp')
      .controller('HomeCtrl', function($scope, $location, $window, $auth, $http) {
          $scope.isAuthenticated = function() {
              return $auth.isAuthenticated();
          };

          // This gets initialized once upon page load to retrieve the usernames
          /*$http({
              method: 'GET',
              url: 'https://lowkey-kshen3778.c9users.io/analyze'
          }).then(function successCallback(response) {
              console.log(response);
              $scope.users = response;
          }, function errorCallback(response) {
              console.log(response);
          });*/
          
          $http({
              method: 'POST',
              data: {
                name: "splacorn"  
              },
              url: 'https://lowkey-kshen3778.c9users.io/analyze'
          }).then(function successCallback(response) {
              console.log(response);
              $scope.users = response;
          }, function errorCallback(response) {
              console.log(response);
          });
          
          
          $scope.lineGraphData = Array();
          $scope.genLineGraph = function(dayArray) {
              for (var i = 0; i < dayArray.length; i++) {
                  $scope.lineGraphData.push(dayArray[i].score);
              }
          };
      });