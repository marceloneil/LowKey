angular.module('MyApp')
    .controller('SpeechCtrl', function($scope, $location, $window, $auth, $http) {

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        var labels = 50;
        $scope.chartOverTime = [];
        $scope.chartOverTime.push({
            labels: labels,
            series: ['Emotion Score'],
            data: [3, 5, 2, 1],
            //fillColor: colours,
            //pieData: pieData,
            //pieLabels: pieLabels,
            //pieColours: pieColours,
            //persona: res2.data.persona,
            //userScoreCalculated: userScore,
            options: {
                title: {
                    display: true,
                    text: "Applicant"
                }
            }
        });
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
        var tensecondWord;

        $scope.updatePersona = function() {
            $http({
                method: 'POST',
                data: {
                    text: indicoString
                },
                url: 'https://lowkey-kshen3778.c9users.io/coverletter'
            }).then(function successCallback(response) {
                console.log(response);
                $scope.currentPersona = response.data[0];
            });
        };
        //var timeToSwitch = false;
        setInterval(function() {
            console.log(recognition);
            if (recognition.lang == "") {
                recognition.stop();
                recognition.start();
            }
            //}
        }, 5000);

        recognition.stop();
        $scope.recordingState = false;
        $scope.toggleRecording = function() {
            if ($scope.recordingState == true) {
                recognition.stop();
                $scope.recordingState = false;
                //chuck stuff to indico here
                $scope.updatePersona();
            }
            else {
                recognition.start();
                $scope.recordingState = true;
            }
        };
        //the charts
        $scope.genLineGraph = function(dayArray) {
            //Chart.defaults.global.colors[0] = '#97BBCD';
            $scope.lineLabels = dayArray.labels;
            $scope.lineSeries = dayArray.series;
            $scope.lineData = dayArray.data;
            $scope.lineOptions = dayArray.options;
            //$scope.currentPersona = dayArray.persona;
            //$scope.currentPersonaLink = personaArray[dayArray.persona];
        };
        $scope.genLineGraph($scope.chartOverTime);
    })