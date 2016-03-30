App.controller('exitFlightCtrl',function($scope,$location){
  $scope.title = "Exit Flight Details";
  $scope.buttonText = "Next";
  $scope.goNext = function(){
      $location.path('/reentry-flight');
  }
});

App.controller('reEntryFlightCtrl',function($scope,$location){
  $scope.title = "Re-Entry Flight Details";
  $scope.buttonText = "Next";
  $scope.goNext = function(){
      $location.path('/passenger-details');
  }
});
