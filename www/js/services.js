var url = 'http://192.168.0.214:5000/';
angular.module('starter.services', [])

.factory('orderService', function() {
  var order = {};
  var orders = [];
  return {
    get: function () {
      return order;
    },
    set: function (data) {
      order = data;
    },
    getOrders: function () {
      console.log('dsdsdsd');
      return orders;
    },
    setOrders: function (data) {
      console.log(data, orders);
      orders = data;
    }
  };
})
  .factory('loginService', function($http) {
    // Might use a resource here that returns a JSON array
    var login_url = url+'test/v1/login/';
    return {
      login: function(data) {
        return $http.post(login_url, data);
      }
    };
  })

  .factory('userService', function($http, storeService,$rootScope, orderService, $state) {
    // Might use a resource here that returns a JSON array
    var user = {id: null};
    if (storeService.get('user')){
      user = storeService.get('user');
      $rootScope['authentication-token'] = user.authentication_token;
      $http.get(url+'test/v1/orders/').then(function (response) {
        orderService.setOrders(response.data.data);
        $state.go('orders');
      });
    }

    return {
      get: function() {
        return user;
      },
      set: function(data) {
        user = data;
        storeService.set('user', data);
        return true;
      }
    };
  })
  .factory('httpRequestInterceptor', function ($rootScope) {
    return {
      request: function (config) {

        // use this to destroying other existing headers
        // config.headers = {'authentication-token':'authentication-token'};

        // use this to prevent destroying other existing headers
        config.headers['authentication-token'] = $rootScope['authentication-token'] || undefined;

        return config;
      }
    };
  })
  .service('storeService', ['$window', function ($window) {
    this.get = function(key) {
      if ($window.localStorage [key]) {
        var cart = angular.fromJson($window.localStorage [key]);
        return JSON.parse(cart);
      }
      return false;
    };
    return {

      get: function (key) {
        if ($window.localStorage [key]) {
          console.log($window.localStorage [key]);
          var cart = angular.fromJson($window.localStorage [key]);
          console.log(cart);
          return cart;
        }
        return false;

      },
      set: function (key, val) {

        if (val === undefined) {
          $window.localStorage .removeItem(key);
        } else {
          $window.localStorage [key] = angular.toJson(val);
        }
        return $window.localStorage [key];
      },
      clearAll: function(){
        $window.localStorage.clear();
      },
      clear: function(key){
        $window.localStorage.removeItem(key);
      },
      reload: function(){
        $window.location.reload();
      }
    }
  }]);


