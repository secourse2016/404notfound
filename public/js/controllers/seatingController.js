App.controller('seatingCtrl',function($scope,$location){
  $scope.title = "Where would you like to sit?";
  $scope.buttonText = "Next";
  $scope.goNext = function(){
      $location.path('/payment');
  }
})
