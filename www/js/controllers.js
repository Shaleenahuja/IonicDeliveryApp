var url = 'http://52.66.81.153/';
angular.module('starter.controllers', [])

.controller('TabCtrl', function ($scope, userService) {
  $scope.user = userService.get();

})
.controller('LoginCtrl', function($rootScope, $scope, loginService, userService, $state, orderService, $http) {
  console.log("login");
  $scope.login = function(data){

      loginService.login(data).then(function(response){
      userService.set(response.data.data);
      $rootScope['authentication-token'] = response.data.data.authentication_token;
        $http.get(url+'test/v1/orders/').then(function (response) {
            orderService.setOrders(response.data.data);
          $state.go('orders');
          });
    });

  }
})

.controller('OrdersCtrl', function($scope,$http, $ionicPopup, $timeout, $state, orderService, userService, $interval) {

  $scope.$on('get:orders', function(){
    $scope.delivery = $scope.getOrders();
    console.log('sdsd', $scope.delivery)
  });
  $scope.delivery = orderService.getOrders();
  $scope.paymentMode = [{id:0,value:'cash'},{id:1,value:'credit'}]
  $scope.getOrders = function(){
    console.log('jhgvhjvbkjhvbjkbvlj');
    $scope.delivery = orderService.getOrders();
    console.log($scope.delivery);
  };
  $scope.getNewOrders = function () {
    $http.get(url+'test/v1/orders/').then(function(response){
      console.log(response);
      if (response.data.data.length){
        if($scope.delivery.length){
          var previousOrderId = $scope.delivery[0].id;
        }
        $scope.delivery = response.data.data;
        console.log($scope.delivery);

        if (previousOrderId && previousOrderId != $scope.delivery[0].id){
          alert('New Order Arrived.');
        }

      }
    })
  };
  $scope.getOrders();
  $interval($scope.getNewOrders, 300000);
  $scope.markDeliver = function (order) {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="number" min="1000" max="9999" ng-model="data.otp">',
      title: 'Delivery Status',
      subTitle: 'Enter the Otp.',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Check</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
              return false;
            } else {
              console.log($scope.data);
              return $http.put(url+"test/v1/order/"+order.id+'/',$scope.data)
            }
          }
        }
      ]
    });

    myPopup.then(function(res){
      if(res){
        order.status = "delivered";
      }
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);
  };

  $scope.recieverInfo = function (order) {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" placeholder="Reiever Name" ng-model="data.customer_name">' +
      '<input type="number" placeholder="number" ng-model="data.customer_number"> ' +
      '<h4>Payment Mode</h4>' +
      '<select class="col col50" ng-model="data.payment_mode" ng-options="payment.id as payment.value for payment in paymentMode"></select>',
      title: 'Reciever Info',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data) {
              e.preventDefault();
            } else {
              console.log($scope.data);
              return $http.put(url+"test/v1/order/"+order.id+'/',$scope.data)
            }
          }
        }
      ]
    });

    myPopup.then(function(res){

    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);
  };

  $scope.showDirections = function(locality, city){
    launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function(isAvailable){
      var app;
      if(isAvailable){
        app = launchnavigator.APP.GOOGLE_MAPS;
      }else{
        console.warn("Google Maps not available - falling back to user selection");
        app = launchnavigator.APP.USER_SELECT;
      }
      launchnavigator.navigate(locality+", "+city, {
        app: app
      });
    });
    //window.open('geo:lat,lon?q='+locality+','+city, '_system');
  };
  $scope.getDetails= function (data) {
    orderService.set(data);
    $state.go('orders-address');
  }

  $scope.cancelOrder = function(order){
    console.log(order.id);
    $scope.data = {status:'cancel'};
    order.status = 'cancel';
    $http.put(url+"test/v1/order/"+order.id+'/', $scope.data).then( function (response) {
      console.log(response.data.data);
      order.status = response.data.data.status;
    })

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
