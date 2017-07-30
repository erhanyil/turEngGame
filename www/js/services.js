angular.module('starter.services', [])

.factory('Data', function($q, $http) {
  var defer = $q.defer();
  return {
    read: function (_requestData) {
        var _data = [];
        return $http.get('data/'+_requestData).then( function( response ) {
          return _data =  response.data;
        }); 
    },
    write: function (_requestData) {
        var _data = [];
        return $http.read('data/'+_requestData).then( function( response ) {
          return _data =  response.data;
        }); 
    }
  };
})

.factory("Session",function($state,$ionicHistory,$window,$rootScope,$localStorage){

  var _localData = [];
  var _sessionData = [];
  $localStorage.data = [];
  $localStorage.data =_localData;

  return {
    setLocal: function(data) {
                $localStorage.data = data;
    },
    getLocal: function() {
                return $localStorage.data;
    },
    clearLocal: function(){
			delete localStorage.data;
      _localData = { data: [] };
      $window.location.reload();
    },
    addLocal: function(_data){
        var _oldData = $localStorage.data;
        _oldData.push(_data);
        $localStorage.data = _oldData;
    }
  };
});


