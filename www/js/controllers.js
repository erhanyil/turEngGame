angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state,$ionicModal, $timeout,$rootScope,Session,$interval,$ionicHistory) {

  $rootScope.gameOn = false;
  $scope.leaveGame = function(data) {
    if($rootScope.gameOn && data == 'game'){
      if(confirm("Exit ? oyun devam ediyor")){
        $rootScope.gameOn = false;
        $interval.cancel($rootScope.timer);
        $state.go('app.home');
      }
    }
  };
})

.controller('HomeCtrl', function($scope, $state, $http, $rootScope,$q, Data, Session,$httpParamSerializer,$interval,$ionicHistory,$localStorage,$ionicPopup,$timeout,$window) {
        $rootScope.localData = Session.getLocal();
        $rootScope.score =  $rootScope.localData[ $rootScope.localData.length - 1].score;
        $scope.showGamePage = false;
        if($rootScope.gameDif != null || $rootScope.gameDif != undefined){
          $window.location.reload();
        }
        $scope.hardGame = function() {
            Data.read('data.json').then( function( data ) {
            $rootScope.gameDif = 'hard';
            $rootScope.currentGameData = data.quiz['hard'];
            $scope.showPopup();
            
            });
        };

        $scope.mediumGame = function() {
            Data.read('data.json').then( function( data ) {
            $rootScope.gameDif = 'medium';
            $rootScope.currentGameData = data.quiz['medium'];
            $scope.showPopup();
            });
        };

        $scope.easyGame = function() {
            Data.read('data.json').then( function( data ) {
            $rootScope.gameDif = 'easy';
            $rootScope.currentGameData = data.quiz['easy'];
            $scope.showPopup();
            });
        };

        $scope.exit = function(){
            ionic.Platform.exitApp();
        };

        
      $scope.showPopup = function() {
          $scope.data = {};
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.time">',
            title: 'Lütfen Süre Giriniz',
            subTitle: 'Sadece rakam giriniz',
            scope: $scope,
            buttons: [
              { text: 'İptal' },
              {
                text: '<b>Oyuna Başla</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.time) {
                    e.preventDefault();
                  } else {
                    $rootScope.time = $rootScope.SetTime = 0;
                    $interval.cancel($rootScope.timer);
                    $rootScope.time = $rootScope.SetTime = $scope.data.time;
                    $state.go('app.game',{reload:true});
                  }
                }
              },
            ]
          });
      };

})

.controller('GameCtrl', function($scope, $state, $http, $rootScope,$q, Data, Session,$interval,$timeout,$ionicHistory,$localStorage) {
    
    $rootScope.localData = Session.getLocal();
    $scope.username =  $rootScope.localData[ $rootScope.localData.length-1].username;
    $rootScope.score =  $rootScope.localData[ $rootScope.localData.length-1].score;
    $rootScope.lastScore = 0;

    $scope.newGamePrepear = function(){
        $scope.passDis = true;
        $scope.currScore = 0;
        $scope.questionCount = 1;
        $scope.attempt = 3;
        $scope.pass = 3;
        $rootScope.time = $rootScope.SetTime;   
        $scope.existQuest = [];
        $rootScope.gameOn = true;
    };
    $scope.newGamePrepear();

    $scope.callInterval = function(){
     $rootScope.timer = $interval(function(){
       if($rootScope.time > 0){
         $rootScope.time--;
         $scope.checkTime($rootScope.time);
        }
      },1000,0);
    };
    $scope.callInterval();

    $scope.checkTime = function(input) {
      if($rootScope.time == 0){
        $scope.showAnswer();
        setTimeout(function() {
          $scope.pass--;
          $scope.prepearGame(); 
          $rootScope.time =  $rootScope.SetTime;  
          $scope.questionCount++;
        }, 2000);
      } 
    };
    
    $scope.getRandomClass = function(){
       var item = "";
       return items[Math.floor(Math.random()*items.length)];
    };

    $scope.prepearGame = function(){
      var k = Math.floor(Math.random() * $rootScope.currentGameData.length);
      var findQuestion = true;
      while(findQuestion){
        if($scope.existQuest.length != $rootScope.currentGameData.length){
          if($scope.existQuest.indexOf(k) < 0){
            $scope.existQuest.push(k);
            findQuestion = false;
            break;
          }else{
            k = Math.floor(Math.random() * $rootScope.currentGameData.length);
          }
        }else{
          findQuestion = true;
          break;
        }
      }
      if(findQuestion || $scope.pass == 0){
        var _oldData = Session.getLocal();
        _oldData[_oldData.length -1 ].score = $rootScope.score = $rootScope.score + $scope.currScore;
        $rootScope.lastScore = $scope.currScore;
        Session.addLocal(_oldData[_oldData.length -1 ]);
        $scope.newGamePrepear();
        $interval.cancel($rootScope.timer);
        $state.go('app.rankBoard');
      }else if($scope.attempt  > 0){
        $scope.currentData = "";
        $scope.question = "";
        $scope.answer = "";
        $scope.options = [];
        $scope.existOptions = [];
        $scope.currentData = $rootScope.currentGameData[k];
        $scope.question = $scope.currentData.question;
        $scope.answer = $scope.currentData.answer;
        var d = true;

          var k = Math.floor(Math.random() * $scope.currentData.options.length);
        while(d){
          if($scope.existOptions.length != 4){
            if($scope.existOptions.indexOf(k) < 0){
              $scope.options.push({answer:$scope.currentData.options[k],color:""});
              $scope.existOptions.push(k);    
            }else{
             k = Math.floor(Math.random() * $scope.currentData.options.length);
            }
          }else{
            d = false;
          }      
        }
      }
      
    $scope.passDis = false;
    };
    $scope.prepearGame();


    $scope.checkAnswer = function(data){
      $interval.cancel($rootScope.timer);
      if($scope.answer == data){
          if($rootScope.gameDif == "hard"){
            $scope.currScore=$scope.currScore+3;
          }else if($rootScope.gameDif == "medium"){
            $scope.currScore=$scope.currScore+2;
          }else if($rootScope.gameDif == "easy"){
            $scope.currScore=$scope.currScore+1;
          }
          $scope.showAnswer();
          $timeout(function() { 
            $scope.questionCount++;
            $scope.prepearGame(); 
            $rootScope.time =  $rootScope.SetTime;  
            $scope.callInterval();
          }, 2000);
      }else{
        if($scope.attempt > 1){
          $rootScope.time =  $rootScope.SetTime; 
          $scope.showAnswer();
          $timeout(function() { 
            $scope.questionCount++;
            $scope.prepearGame(); 
            $rootScope.time =  $rootScope.SetTime;  
            $scope.callInterval();
          }, 2000);
        }else{
        var _oldData = Session.getLocal();
        _oldData[_oldData.length -1 ].score = $rootScope.score = $rootScope.score + $scope.currScore;
        $rootScope.lastScore = $scope.currScore;
        Session.addLocal(_oldData[_oldData.length -1 ]);
        $scope.newGamePrepear();
          $state.go('app.rankBoard');
        }
        $scope.attempt--;
      }
    };

    $scope.showAnswer = function(){
       for(var i =0;i<$scope.options.length;i++){
            if($scope.options[i].answer != $scope.answer){
              //$scope.options[i].color = "button-assertive";
            }else{
              $scope.options[i].color = "button-balanced";
            }
          }
    };

    $scope.passGame = function() {
      $interval.cancel($rootScope.timer);
      $scope.existQuest = $scope.existQuest.slice($scope.existQuest.length,1);
      if($scope.pass == 1){
        var _oldData = Session.getLocal();
        _oldData[_oldData.length -1 ].score = $rootScope.score = $rootScope.score + $scope.currScore;
        $rootScope.lastScore = $scope.currScore;
        Session.addLocal(_oldData[_oldData.length -1 ]);
        $scope.newGamePrepear();
        $rootScope.gameDif = null;
        $state.go("app.rankBoard",{},{reload: "app.rankBoard"});
      }else{
        $scope.questionCount++;
        $scope.pass--;
        $scope.prepearGame();
        $rootScope.time =  $rootScope.SetTime;  
        $scope.callInterval();
      }
    };
    
    $scope.leaveGame = function(data) {
    if($rootScope.gameOn && data == 'game'){
      if(confirm("Exit ? oyun devam ediyor")){
        $rootScope.gameOn = false;
        $interval.cancel($rootScope.timer);
        var _oldData = Session.getLocal();
        _oldData[_oldData.length -1 ].score = $rootScope.score = $rootScope.score + $scope.currScore;
        _oldData[_oldData.length -1 ].time = $scope.resTime;
        Session.addLocal(_oldData[_oldData.length - 1 ]);
        $scope.newGamePrepear();
        $state.go('app.rankBoard');
      }
    }
  };
})

.controller('RankBoardCtrl', function($scope, $state, $interval,$http, $rootScope,$q, Data, Session,$cordovaFile,$localStorage,$ionicHistory) {
    
  $scope.allRanks = Session.getLocal();
  
        $interval.cancel($rootScope.timer);
    $scope.username = $scope.allRanks[$scope.allRanks.length -1].username;

    $scope.goHome = function(){
        $state.go("app.home",{},{reload: "app.home"});
    };
})

.controller('SettingCtrl', function($scope, $state, $http, $rootScope,$q, Data, Session,$ionicPopup,$timeout) {
 

})

.controller('LoginCtrl', function($scope, $state, $rootScope,$stateParams,Session,$window,$ionicHistory,$localStorage) {
    
  $rootScope.loginInfo=false;
  var isNot = true; // Kullanıcı bilgisi varmıydı ? 

  $scope.login = function(data){
    if(data != undefined || data != null) {
       $rootScope.localData = Session.getLocal();
      for(var i=0;i< $rootScope.localData.length;i++){
        if($rootScope.localData[i].username == data){
            var temp =  $rootScope.localData[i];
            $rootScope.localData =  $rootScope.localData.slice.call( i, 1 );
            $rootScope.localData.push(temp);
            isNot = false;
            break;
        }
      }

      if(isNot){
        Session.addLocal({username:data,score:0,time:0});
        $rootScope.localData = Session.getLocal();
      }
        
      $rootScope.score = $rootScope.localData[ $rootScope.localData.length - 1].score;
      $rootScope.loginInfo = true;  
      $state.go('app.home');
    }else{
      alert("Takma ad giriniz");
    }
  };

});
