angular.module('MyApp')
  .controller('HiresCtrl', function($scope, $timeout, $location, $window, $auth, $http) {

    $scope.loading = false;

    $scope.uploadFile = function() {
      $scope.loading = true;

      var file = $scope.myFile;
      console.log(file);
      var uploadUrl = "/uploadfile";
      var fd = new FormData();
      fd.append('file', file);

      $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
            enctype: 'multipart/form-data'
          }
        })
        .success(function(res) {
          console.log(res);
          $scope.loading = false;
          $scope.persona = res.persona;
          $scope.personaLink = personaArray[res.persona];
          $scope.personaAvatar = personaArray[res.persona]
            .replace('https://www.16personalities.com/', 'https://www.16personalities.com/images/types/')
            .replace('-personality', '.png');
          console.log($scope.personaAvatar);
          //$scope.bestPersonaLink = 0;
          //$scope.secondPersonaLink = 0;
          //$scope.thirdPersonaLink = 0;
          //document.getElementById("bestPersona").html();
          //document.getElementById("secondPersona").html();
          //document.getElementById("thirdPersona").html();
        })
        .error(function(err) {
          console.log(err);
          $scope.loading = false;
          $scope.error = "Please upload as a text file (.txt)."
        });
    };

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
  });