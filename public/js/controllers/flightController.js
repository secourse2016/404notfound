// @Nabila
App.controller('exitFlightCtrl',function($scope,$location){
  $scope.title = "Flight Details";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function(){
      $location.path('/passenger-details');
  }
  $scope.goBack = function(){
      $location.path('/flights');
  }
  // assume that you can reach the flight and you will bind the data of this flight to your view
  //if you have any other assumtions tell me.
  // var flight = ourCrazyAwesomeFactory.getFlightDetails();

});

// App.controller('reEntryFlightCtrl',function($scope,$location){
//   $scope.title = "Re-Entry Flight Details";
//   $scope.buttonText = "Next";
//   $scope.goNext = function(){
//       $location.path('/passenger-details');
//   }
// });
