var flightNewController = function($scope, $location, $routeParams, api) {

  $scope.pageClass = 'page-flights';
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = false;
  $scope.isOutgoingFlightSelected = false;

  api.setIsOtherHosts(true);

  $scope.goNext = function() {
    api.setOutGoingFlight($scope.selectedOutgoingFlight);
    api.setReturningFlight($scope.selectedReturningFlight);
    api.setBooking($scope.selectedBooking);
    $location.path('/exit-flight');
  }

  $scope.goBack = function() {
    $location.path('/');
  }

  $scope.selectedBooking = {
    "PassengerDetails": null,
    "refExitFlightID": null,
    "refReEntryFlightID": null,
    "class": null,
    "paymentToken": null
  };

  var origin = $routeParams.origin;
  var destination = $routeParams.destination;
  var exitDate = new Date($routeParams.exitDate * 1000);

  $scope.roundTrip = false;

  if ($routeParams.returnDate) {
    var returnDate = new Date($routeParams.returnDate * 1000);
    $scope.roundTrip = true;
  }

  var flights;
  var returnDateMill;

  if (returnDate)
    returnDateMill = returnDate.getTime();

  api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
    $scope.flights = response.data;
  }, function myError(response) {
    console.log(response.statusText);
  })

}


if (Type == 'mobile') {
  flightNewController.$inject = ['$scope', '$location', 'api'];
} else {
  flightNewController.$inject = ['$scope', '$location', '$routeParams', 'api'];
}


App.controller('flightsNewCtrl', flightNewController);
