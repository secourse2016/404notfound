// @abdelrhman-essam
App.controller('confirmationCtrl', function($scope, $location) {
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
    $location.path('/');
  }
  $scope.goBack = function() {
    $location.path('/payment');
  }

  //You shouldn't add much here for now
  //you might expect passenger and booking data

  // this is just a test
  $scope.booking = {
    wifi: "true",
    name: "ahmed"
  }

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
