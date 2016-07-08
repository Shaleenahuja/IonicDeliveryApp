// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .run(function ($rootScope, $state, $ionicLoading) {

    $rootScope.$on("$stateChangeStart",
      function(event, toState, toParams, fromState, fromParams, options){
        console.log(toState);
        if (!$rootScope['authentication-token'] && toState.name == 'orders') {
          event.preventDefault();
          $state.go('login');
        }
    });
  })

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    templateUrl: 'templates/tabs.html',
    controller:'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('login', {
    url: '/login',
    templateUrl: 'templates/tab-login.html',
    controller: 'LoginCtrl'
  })

  .state('orders', {
      url: '/orders',
      templateUrl: 'templates/tab-orders.html',
      controller: 'OrdersCtrl',
      onEnter: function($rootScope) {
        //used $timeout to load after controller gets initialized
        //so that $on event should get define before broadcasting
        $rootScope.$broadcast('get:orders');

      }
    })

    .state('orders-address', {
      url: '/orders/:details',
      templateUrl: 'templates/order-address.html',
      controller: 'OrderAddressCtrl'
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab');
  $httpProvider.interceptors.push('httpRequestInterceptor');

});
