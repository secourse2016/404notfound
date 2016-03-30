App.controller('flightsCtrl',function($scope,$location){
  //expect that these params will be given
  //

  $scope.title = "Choose a Flight";
  $scope.buttonText = "Next";
  $scope.goNext = function(){
      $location.path('/exit-flight');
  }
});
