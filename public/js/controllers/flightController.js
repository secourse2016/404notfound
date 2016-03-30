// @Nabila
App.controller('exitFlightCtrl',function($scope,$location){
  $scope.title = "Exit Flight Details";
  $scope.buttonText = "Next";
  $scope.goNext = function(){
      $location.path('/passenger-details');
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
