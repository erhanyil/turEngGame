angular.module('starter', ['ionic','ui.router','starter.controllers','starter.services','ngCordova','ngStorage'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
      $rootScope.url = "";
        if(ionic.Platform.isAndroid()){
           $rootScope.url = "/android_asset/www/";
        }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
          controller: 'SettingCtrl'
      }
    }
  })

  .state('app.rankBoard', {
    url: '/rankBoard',
    views: {
      'menuContent': {
        templateUrl: 'templates/rankBoard.html',
          controller: 'RankBoardCtrl'
      }
    }
  })

  .state('app.game', {
      cache: false,
      url: '/game',
      views: {
        'menuContent': {
          templateUrl: 'templates/game.html',
          controller: 'GameCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/login');
  //$ionicConfigProvider.views.maxCache(0);
});
