angular.module('starter.controllers', [])

.controller('TabCtrl', function ($scope, userService) {
  console.log("tabCtrl");
  $scope.user = userService.get();
  console.log($scope.user)
})
.controller('LoginCtrl', function($rootScope, $scope, loginService, userService, $state, orderService, $http) {
  console.log("login");
  $scope.login = function(data){
    alert(data);
      loginService.login(data).then(function(response){
      userService.set(response.data.data);
      $rootScope['authentication-token'] = response.data.data.authentication_token;
        $http.get('http://192.168.0.114:5000/test/v1/orders/').then(function (response) {
            orderService.setOrders(response.data.data);
          $state.go('orders');
          });
    });

  }
})

.controller('OrdersCtrl', function($scope,$http, $ionicPopup, $timeout, $state, orderService, userService) {

  $scope.$on('get:orders', function(){
    $scope.delivery = $scope.getOrders();
    console.log('sdsd', $scope.delivery)
  });
  $scope.delivery = orderService.getOrders();

  $scope.getOrders = function(){
    console.log('jhgvhjvbkjhvbjkbvlj');
    $scope.delivery = orderService.getOrders();
    console.log($scope.delivery);
  };
  $scope.getOrders();
  $scope.showPopup = function (order) {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.otp">',
      title: 'Delivery Status',
      subTitle: 'Enter the Otp.',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $http.put("http://192.168.0.114:5000/test/v1/order/"+order.id+'/',$scope.data)
            }
          }
        }
      ]
    });

    myPopup.then(function(res){
      order = res.data.data;
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);
  };

  $scope.showDirections = function(locality,city){
    window.open('geo:lat,lon?q='+locality+','+city, '_system');
  };
  $scope.getDetails= function (data) {
    orderService.set(data);
    $state.go('orders-address');
  }


})

.controller('OrderAddressCtrl', function($scope, $stateParams, orderService) {
  console.log(orderService.get());
  $scope.clientDetails = orderService.get();
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
