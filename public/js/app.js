angular.module('MyApp', ['ngRoute', 'satellizer', 'chart.js', 'flow'])
  .config(function($routeProvider, $locationProvider, $authProvider, ChartJsProvider, flowFactoryProvider) {
    $locationProvider.html5Mode(true);

     //Chart.defaults.global.colors =  ['#F7464A', '#803690', '#00ADF9', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      })
      .when('/hires', {
        templateUrl: 'partials/hires.html',
        controller: 'HiresCtrl'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfAuthenticated: skipIfAuthenticated
        }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfAuthenticated: skipIfAuthenticated
        }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: {
          skipIfAuthenticated: skipIfAuthenticated
        }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: {
          skipIfAuthenticated: skipIfAuthenticated
        }
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    // flowFactoryProvider.defaults = {
    //   target: '/upload',
    //   permanentErrors: [404, 500, 501]
    // };
    // // You can also set default events:
    // flowFactoryProvider.on('catchAll', function(event) {
    //   console.log(event);
    // });
    // // Can be used with different implementations of Flow.js
    // // flowFactoryProvider.factory = fustyFlowFactory;
    

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
