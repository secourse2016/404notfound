// @abdelrahman-maged
App.controller('flightsCtrl',function($scope,$location){
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = true;
  $scope.goNext = function(){
      $location.path('/exit-flight');
  }
  $scope.goBack = function(){
      $location.path('/');
  }
  //if you have any other assumtions tell me.

  // Abdo expect that you have the origin, destination and flight time
  // var flightsArray = ourSuperCrazyFactory.get(org,des,time);
  //create fake array and bind it to your view
});
