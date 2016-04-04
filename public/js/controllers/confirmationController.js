// @abdelrhman-essam
App.controller('confirmationCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-confirmation';
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
    $location.path('/');
  }
  $scope.goBack = function() {
    $location.path('/payment');
  }

  if(!api.getChosenFlight() || !api.getBooking()){
    $location.path('/flights');
    return;
  }
  if(!api.getPassenger()){
    $location.path('/passenger-details');
      return;
  }

  $scope.flight = api.getChosenFlight();

  $scope.passenger = api.getPassenger();
  $('#quotes-text').typeIt({
    strings: [
      '"Travel and change of place impart new vigor to the mind."-Seneca',
       '“Traveling tends to magnify all human emotions.” — Peter Hoeg',
       '“Traveling – it leaves you speechless, then turns you into a storyteller.” - Ibn Battuta',
      ' “We travel, some of us forever, to seek other places, other lives, other souls.” – Anais Nin'
    ],
    speed: 80,
    breakLines: false,
    loop: true
  });
});
