App.controller('paymentCtrl',function($scope,$location){
  $scope.title = "Choose your payment option";
  $scope.buttonText = "Pay!!";
  $scope.goNext = function(){
      $location.path('/confirmation');
  }
});
