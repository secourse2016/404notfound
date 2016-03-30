App.controller('confirmationCtrl',function($scope,$location){
  $scope.title = "Confirm your flight";
  $scope.buttonText = "Confirm?";
  $scope.goNext = function(){
      $location.path('/');
  }
});
