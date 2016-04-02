// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location,$routeParams,api) {
    $scope.pageClass = 'page-flights';
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

  var origin = $routeParams.origin;
  var destination = $routeParams.destination;
  var exitDate = $routeParams.exitDate;

  if(!origin || !destination || !exitDate) {
    $location.path('/');
  }

  // array received from factory
  var flights = [{
    "number": "1000",
    "departureUTC": "2016-04-01T07:00:00Z",
    "arrivalUTC": "2016-04-01T09:00:00Z",
    "duration": 120,
    "status": "On Time",
    "refAircraftTailNumber": "D-AAAA",
    "refAircraftModel": null,
    "operatorAirline": "Air Berlin",
    "refOriginAirport": "CAI",
    "refOriginAirportName": null,
    "refDestinationAirport": "TXL",
    "refDestinationAirportName": null,
    "boardingGate": "40",
    "boardingPeriod": 45.0,
    "boardingTerminal": "3",
    "arrivalTerminal": "1",
    "economyFare": 200.0,
    "businessFare": 300.0,
    "emptyEconomySeatsCount": 14,
    "emptyBusinessSeatsCount": 20,
    "economySeatSchema": null,
    "buisnessSeatSchema": null,
    "seatmap": null
  }, {
    "number": "1001",
    "departureUTC": "2016-04-01T15:00:00Z",
    "arrivalUTC": "2016-04-01T17:00:00Z",
    "duration": 120,
    "status": "On Time",
    "refAircraftTailNumber": "D-AAAA",
    "refAircraftModel": null,
    "operatorAirline": "Air Berlin",
    "refOriginAirport": "CAI",
    "refOriginAirportName": null,
    "refDestinationAirport": "TXL",
    "refDestinationAirportName": null,
    "boardingGate": "40",
    "boardingPeriod": 45.0,
    "boardingTerminal": "3",
    "arrivalTerminal": "1",
    "economyFare": 200.0,
    "businessFare": 300.0,
    "emptyEconomySeatsCount": 50,
    "emptyBusinessSeatsCount": 24,
    "economySeatSchema": null,
    "buisnessSeatSchema": null,
    "seatmap": null
  }];

  var airports = [];

  api.getAirports().then(function mySuccess(response) {

    airports = response.data;

    for (var i = 0; i < flights.length; i++) {

      for (var j = 0; j < airports.length; j++) {

        if(airports[j].iata === flights[i].refOriginAirport)
          flights[i].refOriginAirportName = airports[j].name;

        if(airports[j].iata === flights[i].refDestinationAirport)
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

        if(aircrafts[j].tailNumber === flights[i].refAircraftTailNumber)
          flights[i].refAircraftModel = aircrafts[j].model;

      }

    }

  }, function myError(response) {
    console.log(response.statusText);
  });

  // formatting data to be presentable
  for (i = 0; i < flights.length; i++) {

    var departureDate = new Date(flights[i].departureUTC);
    flights[i].departureUTC = departureDate.toUTCString();

    var arrivalDate = new Date(flights[i].arrivalUTC);
    flights[i].arrivalUTC = arrivalDate.toUTCString();

    var hours = flights[i].duration / 60;
    var minutes = flights[i].duration % 60;

    flights[i].duration = hours + "h " + minutes + "m"

  }

  $scope.flights = flights;

});
