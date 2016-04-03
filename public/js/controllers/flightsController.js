// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location, $routeParams, api) {

  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = true;

  $scope.goNext = function() {
    $location.path('/exit-flight');
  }

  $scope.goBack = function() {
    // check if the user has selected a flight
    // and then call api.setFlight(chosenFlight)
    //if the user hasn't selected a flight return prevent him from proceeding
    $location.path('/');
  }

  // var origin = $routeParams.origin;
  // var destination = $routeParams.destination;
  // var exitDate = new Date($routeParams.exitDate * 1000);

  var origin = "TXL";
  var destination = "JFK";
  var exitDate = new Date(1459555200 * 1000);

  if (!origin || !destination || !exitDate) {
    $location.path('/');
  }

  var flights = [];

  api.getAll().then(function mySuccess(response) {

    flights = response.data;

    // formatting data to be presentable
    for (i = 0; i < flights.length; i++) {

      var departureDate = new Date(flights[i].departureUTC);
      flights[i].departureUTC = departureDate.toUTCString();

      var arrivalDate = new Date(flights[i].arrivalUTC);
      flights[i].arrivalUTC = arrivalDate.toUTCString();

      var hours = Math.floor(flights[i].duration / 60);
      var minutes = flights[i].duration % 60;

      flights[i].duration = hours + "h " + minutes + "m";

    }

    // throwing away flights not fitting constraints
    function checkConstraints(flight) {

      var flightDate = new Date(flight.departureUTC);

      return flight.refOriginAirport === origin && flight.refDestinationAirport === destination
              && flightDate.getDay() === exitDate.getDay()
              && flightDate.getMonth() === exitDate.getMonth()
              && flightDate.getFullYear() === exitDate.getFullYear();

    }

    $scope.flights = flights.filter(checkConstraints);

  }, function myError(response) {
    console.log(response.statusText);
  });

  var airports = [];

  api.getAirports().then(function mySuccess(response) {

    airports = response.data;

    for (var i = 0; i < flights.length; i++) {

      for (var j = 0; j < airports.length; j++) {

        if (airports[j].iata === flights[i].refOriginAirport)
          flights[i].refOriginAirportName = airports[j].name;

        if (airports[j].iata === flights[i].refDestinationAirport)
          flights[i].refDestinationAirportName = airports[j].name;

      }

    }

  }, function myError(response) {
    console.log(response.statusText);
  });

  var aircrafts = [];

  api.getAircrafts().then(function mySuccess(response) {

    aircrafts = response.data;

    for (var i = 0; i < flights.length; i++) {

      for (var j = 0; j < aircrafts.length; j++) {

        if (aircrafts[j].tailNumber === flights[i].refAircraftTailNumber)
          flights[i].refAircraftModel = aircrafts[j].model;

      }

    }

  }, function myError(response) {
    console.log(response.statusText);
  });

});
