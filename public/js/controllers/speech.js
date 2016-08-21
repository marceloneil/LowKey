angular.module('MyApp')
    .controller('SpeechCtrl', function($scope, $location, $window, $auth, $http) {

        $scope.lineLabels = ["0:00"];
        $scope.lineSeries = ['Contentment', 'Stress'];
        $scope.lineData = [
            [0.2],
            [0.2]
        ];
        $scope.lineOptions = {
            title: {
                display: true,
                text: "Applicant",
            },
            legend: {
                display: true
            }
        };

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.stop();
        var indicoString = "";
        var lastWord = "";
        var previousString = "";
        recognition.onresult = function(event) {
            //console.log(event.results[0][0].transcript);
            //console.log(event.results[0][0].confidence);
            //console.log(event.results);
            //if (speechCount == 0) {
            //finds best word
            var rlength = event.results.length;
            var highest = event.results[0][0].confidence;
            var word = event.results[0][0].transcript;
            for (var i = 1; i < rlength; i++) {
                if (event.results[i][0].confidence > highest) {
                    word = event.results[i][0].transcript;
                }
            }
            /*if (word.substring(0, 3) == previousString.substring(0, 3)) {
                previousString = word;
                console.log("changed");
            }else{
                console.log(previousString);
                console.log(word.substring(0, 3));
            }*/
            lastWord = word;
            console.log(word);
            indicoString += word;
        };

        var updatePersona = function() {
            $http({
                method: 'POST',
                data: {
                    text: indicoString
                },
                url: 'https://lowkey-kshen3778.c9users.io/coverletter'
            }).then(function successCallback(response) {
                console.log(response);
                $scope.currentPersona = response.data[0][0];
            });
        };

$scope.restart = function(){
    recognition.start();
};

        /*setInterval(function() {
            if (recognition.lang == "" && $scope.recordingState) {
                recognition.stop();
                recognition.start();
            }
        }, 5000);*/


        var sec = 0;

        function pad(val) {
            return val > 9 ? val : "0" + val;
        }
        var timer;
        $scope.recordingState = false;
        $scope.toggleRecording = function() {
            if ($scope.recordingState == true) {
                clearInterval(timer);
                recognition.stop();
                $scope.recordingState = false;
                //chuck stuff to indico here
                updatePersona();
            }
            else {
                timer = setInterval(function() {
                    var timeString = pad(parseInt(sec / 60, 10)) + ":" + pad(++sec % 60);
                    if (sec % 5 == 0) {
                        $scope.lineLabels.push(timeString);
                        //updatePersona();
                        $http({
                            method: 'POST',
                            data: {
                                speech: indicoString,
                            },
                            url: 'https://lowkey-kshen3778.c9users.io/speechemotions'
                        }).then(function successCallback(res) {
                            console.log(res);
                            recognition.stop();
                            recognition.start();
                            $scope.lineData[0].push(res.data.joy);
                            $scope.lineData[1].push(res.data.fear);
                            console.log($scope.lineData[0][$scope.lineData.length -2]);
                            if($scope.lineData[0].length > 2 && $scope.lineData[0][$scope.lineData.length -3]== $scope.lineData[0][$scope.lineData.length -2]){
                                recognition.start();
                                console.log("fixed");
                            }
                        });
                    }
                }, 1000);
                recognition.start();
                $scope.recordingState = true;
            }
        };
    })