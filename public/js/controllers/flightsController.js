// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location) {

  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = true;

  $scope.goNext = function() {
    $location.path('/exit-flight');
  }
  
  $scope.goBack = function() {
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
    "refAircraftModel": "Airbus A330", // nonexistent in flight schema, needed however in view
    "operatorAirline": "Air Berlin",
    "refOriginAirport": "CAI",
    "refOriginAirportName": "Cairo International Airport", // nonexistent in flight schema, needed however in view
    "refDestinationAirport": "TXL",
    "refDestinationAirportName": "Berlin-Tegel Airport", // nonexistent in flight schema, needed however in view
    "boardingGate": "40",
    "boardingPeriod": 45.0,
    "boardingTerminal": "3",
    "arrivalTerminal": "1",
    "economyFare": 200.0,
    "businessFare": 300.0,
    "emptyEconomySeatsCount": 14, // retrieved in backend from aircrafts collection
    "emptyBusinessSeatsCount": 20, // retrieved in backend from aircrafts collection
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
    "refAircraftModel": "Airbus A330", // nonexistent in flight schema, needed however in view
    "operatorAirline": "Air Berlin",
    "refOriginAirport": "CAI",
    "refOriginAirportName": "Cairo International Airport", // nonexistent in flight schema, needed however in view
    "refDestinationAirport": "TXL",
    "refDestinationAirportName": "Berlin-Tegel Airport", // nonexistent in flight schema, needed however in view
    "boardingGate": "40",
    "boardingPeriod": 45.0,
    "boardingTerminal": "3",
    "arrivalTerminal": "1",
    "economyFare": 200.0,
    "businessFare": 300.0,
    "emptyEconomySeatsCount": 50, // retrieved in backend from aircrafts collection
    "emptyBusinessSeatsCount": 24, // retrieved in backend from aircrafts collection
    "economySeatSchema": null,
    "buisnessSeatSchema": null,
    "seatmap": null
  }];

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
