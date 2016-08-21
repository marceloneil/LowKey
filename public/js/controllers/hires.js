angular.module('MyApp')
  .controller('HiresCtrl', function($scope, $timeout, $location, $window, $auth, $http) {

    $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {
      console.log('please');
      event.preventDefault(); //prevent file from uploading
      console.log('please');
      console.log(flowFile);
    });
    
    $scope.method = function( $file, $event, $flow ){
      console.log('please');
      $event.preventDefault();
      console.log('please');
      console.log($file);
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