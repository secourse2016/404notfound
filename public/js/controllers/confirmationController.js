// @abdelrhman-essam
App.controller('confirmationCtrl',function($scope,$location){
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function(){
      $location.path('/');
  }
  $scope.goBack = function(){
      $location.path('/payment');
  }

  //You shouldn't add much here for now
});
