// @abdelrhman-essam
App.controller('confirmationCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-confirmation';
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
    api.submitBooking().then(function(data){
      console.log(data);
    },function(err){

    })
    $location.path('/');
  }
  $scope.goBack = function() {
    $location.path('/payment');
  }

  if(!api.getChosenOutGoingFlight() || !api.getBooking()){
    $location.path('/flights');
    return;
  }
  if(!api.getPassenger()){
    $location.path('/passenger-details');
      return;
  }
  $scope.goSocial = function () {
    $location.path('/social');

  }
  $scope.flight = api.getChosenOutGoingFlight();

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

// 
// console.log("chosenOutgoingFlight");
//   console.log(api.getChosenOutGoingFlight());
// console.log("chosenReturningFlight")
// console.log(api.getChosenReturningFlight());
// console.log("passenger")
// console.log(api.getPassenger())
// console.log("booking")
// console.log(api.getBooking())
// console.log("goingSeat")
// console.log(api.getOutgoingSeat())
// console.log("retrunSeat")
// console.log(api.getReturnSeat())


});
