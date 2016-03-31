// @mirna
App.controller('paymentCtrl',function($scope,$location){
  $scope.title = "Choose your payment option";
  
  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function(){
      $location.path('/confirmation');
  }
  $scope.goBack = function(){
      $location.path('/seating');
  }


  //mirna nty gaya thazary l sprint deh bs khoshy ma3a Ahmed fel seatings bta3to
});
