// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location) {

  $scope.title = "Choose a Flight";
  $scope.buttonText = "Next";
  $scope.isCollapsed = true;

  $scope.goNext = function() {
      $location.path('/exit-flight');
    }

  // Abdo expect that you have the origin, destination and flight time
  // var flightsArray = ourSuperCrazyFactory.get(org,des,time);
  //create fake array and bind it to your view
  
});
