angular.module('MyApp')
  .controller('HiresCtrl', function($scope, $timeout, $location, $window, $auth, $http) {

    $scope.loading = false;
    
    $scope.reset = function(){
      $scope.loading = false;
      $scope.error = ''
      $scope.persona = ''
    }

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
          $scope.persona = res.persona + ' (' + personaArray[res.persona].link
          .replace('https://www.16personalities.com/', '')
          .replace('-personality', '').toUpperCase() + ')';;
          $scope.personaLink = personaArray[res.persona].link;
          $scope.personaAvatar = personaArray[res.persona].link
            .replace('https://www.16personalities.com/', 'https://www.16personalities.com/images/types/')
            .replace('-personality', '.png');
          $scope.personaText = personaArray[res.persona].text;
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
      "architect": {
        "link": "https://www.16personalities.com/intj-personality",
        "text": "It’s lonely at the top, and being one of the rarest and most strategically capable personality types, INTJs know this all too well. INTJs form just two percent of the population, and women of this personality type are especially rare, forming just 0.8% of the population – it is often a challenge for them to find like-minded individuals who are able to keep up with their relentless intellectualism and chess-like maneuvering. People with the INTJ personality type are imaginative yet decisive, ambitious yet private, amazingly curious, but they do not squander their energy."
      },
      "logician": {
        "link": "https://www.16personalities.com/intp-personality",
        "text": "The INTP personality type is fairly rare, making up only three percent of the population, which is definitely a good thing for them, as there's nothing they'd be more unhappy about than being \"common\". INTPs pride themselves on their inventiveness and creativity, their unique perspective and vigorous intellect. Usually known as the philosopher, the architect, or the dreamy professor, INTPs have been responsible for many scientific discoveries throughout history."
      },
      "commander": {
        "link": "https://www.16personalities.com/entj-personality",
        "text": "ENTJs are natural-born leaders. People with this personality type embody the gifts of charisma and confidence, and project authority in a way that draws crowds together behind a common goal. But unlike their Feeling (F) counterpart, ENTJs are characterized by an often ruthless level of rationality, using their drive, determination and sharp minds to achieve whatever end they've set for themselves. Perhaps it is best that they make up only three percent of the population, lest they overwhelm the more timid and sensitive personality types that make up much of the rest of the world – but we have ENTJs to thank for many of the businesses and institutions we take for granted every day."
      },
      "debater": {
        "link": "https://www.16personalities.com/entp-personality",
        "text": "The ENTP personality type is the ultimate devil's advocate, thriving on the process of shredding arguments and beliefs and letting the ribbons drift in the wind for all to see. Unlike their more determined Judging (J) counterparts, ENTPs don't do this because they are trying to achieve some deeper purpose or strategic goal, but for the simple reason that it's fun. No one loves the process of mental sparring more than ENTPs, as it gives them a chance to exercise their effortlessly quick wit, broad accumulated knowledge base, and capacity for connecting disparate ideas to prove their points."
      },
      "advocate": {
        "link": "https://www.16personalities.com/infj-personality",
        "text": "The INFJ personality type is very rare, making up less than one percent of the population, but they nonetheless leave their mark on the world. As Diplomats (NF), they have an inborn sense of idealism and morality, but what sets them apart is the accompanying Judging (J) trait – INFJs are not idle dreamers, but people capable of taking concrete steps to realize their goals and make a lasting positive impact."
      },
      "mediator": {
        "link": "https://www.16personalities.com/infp-personality",
        "text": "INFP personalities are true idealists, always looking for the hint of good in even the worst of people and events, searching for ways to make things better. While they may be perceived as calm, reserved, or even shy, INFPs have an inner flame and passion that can truly shine. Comprising just 4% of the population, the risk of feeling misunderstood is unfortunately high for the INFP personality type – but when they find like-minded people to spend their time with, the harmony they feel will be a fountain of joy and inspiration."
      },
      "protagonist": {
        "link": "https://www.16personalities.com/enfj-personality",
        "text": "ENFJs are natural-born leaders, full of passion and charisma. Forming around two percent of the population, they are oftentimes our politicians, our coaches and our teachers, reaching out and inspiring others to achieve and to do good in the world. With a natural confidence that begets influence, ENFJs take a great deal of pride and joy in guiding others to work together to improve themselves and their community."
      },
      "campaigner": {
        "link": "https://www.16personalities.com/enfp-personality",
        "text": "The ENFP personality is a true free spirit. They are often the life of the party, but unlike Explorers, they are less interested in the sheer excitement and pleasure of the moment than they are in enjoying the social and emotional connections they make with others. Charming, independent, energetic and compassionate, the 7% of the population that they comprise can certainly be felt in any crowd."
      },
      "logistician": {
        "link": "https://www.16personalities.com/istj-personality",
        "text": "The ISTJ personality type is thought to be the most abundant, making up around 13% of the population. Their defining characteristics of integrity, practical logic and tireless dedication to duty make ISTJs a vital core to many families, as well as organizations that uphold traditions, rules and standards, such as law offices, regulatory bodies and military. People with the ISTJ personality type enjoy taking responsibility for their actions, and take pride in the work they do – when working towards a goal, ISTJs hold back none of their time and energy completing each relevant task with accuracy and patience."
      },
      "defender": {
        "link": "https://www.16personalities.com/isfj-personality",
        "text": "The ISFJ personality type is quite unique, as many of their qualities defy the definition of their individual traits. Though possessing the Feeling (F) trait, ISFJs have excellent analytical abilities; though Introverted (I), they have well-developed people skills and robust social relationships; and though they are a Judging (J) type, ISFJs are often receptive to change and new ideas. As with so many things, people with the ISFJ personality type are more than the sum of their parts, and it is the way they use these strengths that defines who they are."
      },
      "executive": {
        "link": "ESTJs are representatives of tradition and order, utilizing their understanding of what is right, wrong and socially acceptable to bring families and communities together. Embracing the values of honesty, dedication and dignity, people with the ESTJ personality type are valued for their clear advice and guidance, and they happily lead the way on difficult paths. Taking pride in bringing people together, ESTJs often take on roles as community organizers, working hard to bring everyone together in celebration of cherished local events, or in defense of the traditional values that hold families and communities together.",
        "text": "Excellent administrators, unsurpassed at managing things – or people."
      },
      "consul": {
        "link": "https://www.16personalities.com/esfj-personality",
        "text": "People who share the ESFJ personality type are, for lack of a better word, popular – which makes sense, given that it is also a very common personality type, making up twelve percent of the population. In high school, ESFJs are the cheerleaders and the quarterbacks, setting the tone, taking the spotlight and leading their teams forward to victory and fame. Later in life, ESFJs continue to enjoy supporting their friends and loved ones, organizing social gatherings and doing their best to make sure everyone is happy."
      },
      "virtuoso": {
        "link": "https://www.16personalities.com/istp-personality",
        "text": "ISTPs love to explore with their hands and their eyes, touching and examining the world around them with cool rationalism and spirited curiosity. People with this personality type are natural Makers, moving from project to project, building the useful and the superfluous for the fun of it, and learning from their environment as they go. Often mechanics and engineers, ISTPs find no greater joy than in getting their hands dirty pulling things apart and putting them back together, just a little bit better than they were before."
      },
      "adventurer": {
        "link": "https://www.16personalities.com/isfp-personality",
        "text": "ISFP personality types are true artists, but not necessarily in the typical sense where they're out painting happy little trees. Often enough though, they are perfectly capable of this. Rather, it's that they use aesthetics, design and even their choices and actions to push the limits of social convention. ISFPs enjoy upsetting traditional expectations with experiments in beauty and behavior – chances are, they've expressed more than once the phrase \"Don't box me in!\""
      },
      "entrepreneur": {
        "link": "https://www.16personalities.com/estp-personality",
        "text": "ESTP personality types always have an impact on their immediate surroundings – the best way to spot them at a party is to look for the whirling eddy of people flitting about them as they move from group to group. Laughing and entertaining with a blunt and earthy humor, ESTP personalities love to be the center of attention. If an audience member is asked to come on stage, ESTPs volunteer – or volunteer a shy friend."
      },
      "entertainer": {
        "link": "https://www.16personalities.com/esfp-personality",
        "text": "If anyone is to be found spontaneously breaking into song and dance, it is the ESFP personality type. ESFPs get caught up in the excitement of the moment, and want everyone else to feel that way, too. No other personality type is as generous with their time and energy as ESFPs when it comes to encouraging others, and no other personality type does it with such irresistible style."
      }
    };
  });