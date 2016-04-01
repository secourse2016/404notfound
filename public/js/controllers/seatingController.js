// @ahmed-essmat
App.controller('seatingCtrl',function($scope,$location){
  $scope.title = "Where would you like to sit?";

  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function(){
      $location.path('/payment');
  }
  $scope.goBack = function(){
      $location.path('/passenger-details');
  }
  //ahmed you will get the whole flight object refer back to the schema to make sure you understand
  //everything
  // use this schema for now
  var schmea = "3:2:3*30";

})
