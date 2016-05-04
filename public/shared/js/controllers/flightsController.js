// @abdelrahman-maged
var flightController = function($scope, $location, api, $routeParams) {

  $scope.pageClass = 'page-flights';
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";

  api.setIsOtherHosts(false);

  if (Type == 'desktop') {

    $scope.isCollapsed = true;
    $scope.isOutgoingFlightSelected = false;

    $scope.goNext = function() {

      api.setOutGoingFlight($scope.selectedOutgoingFlight);
      api.setReturningFlight($scope.selectedReturningFlight);

      $scope.selectedBooking.refExitFlightID = $scope.selectedOutgoingFlight._id;

      if ($scope.selectedReturningFlight)
        $scope.selectedBooking.refReEntryFlightID = $scope.selectedReturningFlight._id;

      api.setBooking($scope.selectedBooking);
      $location.path('/exit-flight');

    }

    $scope.goBack = function() {
      $location.path('/');
    }

    var origin = $routeParams.origin;
    var destination = $routeParams.destination;
    var exitDate = new Date($routeParams.exitDate * 1000);

    $scope.roundTrip = false;

    if ($routeParams.returnDate) {
      var returnDate = new Date($routeParams.returnDate * 1000);
      $scope.roundTrip = true;
    }

    $scope.selectedBooking = {
      "refPassengerID": [],
      "issueDate": null,
      "isOneWay": !$scope.roundTrip,
      "refExitFlightID": null,
      "refReEntryFlightID": null,
      "receiptNumber": null
    };

    if (!origin || !destination || !exitDate) {
      $location.path('/');
    }

    var flights;
    var returnDateMill;

    if (returnDate)
      returnDateMill = returnDate.getTime();

    api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {

      flights = response.data;

      for (i = 0; i < flights.outgoingFlights.length; i++) {

        var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
        var minutes = flights.outgoingFlights[i].duration % 60;

        flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

      }

      if ($scope.roundTrip) {

        for (i = 0; i < flights.returnFlights.length; i++) {

          var hours = Math.floor(flights.returnFlights[i].duration / 60);
          var minutes = flights.returnFlights[i].duration % 60;

          flights.returnFlights[i].duration = hours + "h " + minutes + "m";

        }

      }

      $scope.flights = flights;

      api.getAirports().then(function mySuccess(response) {

        airports = response.data;

        for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

          for (var j = 0; j < airports.length; j++) {

            if (airports[j].iata === $scope.flights.outgoingFlights[i].refOriginAirport)
              $scope.flights.outgoingFlights[i].refOriginAirportName = airports[j].name;

            if (airports[j].iata === $scope.flights.outgoingFlights[i].refDestinationAirport)
              $scope.flights.outgoingFlights[i].refDestinationAirportName = airports[j].name;


          }

        }

        if ($scope.roundTrip) {

          for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

            for (var j = 0; j < airports.length; j++) {

              if (airports[j].iata === $scope.flights.returnFlights[i].refOriginAirport)
                $scope.flights.returnFlights[i].refOriginAirportName = airports[j].name;

              if (airports[j].iata === $scope.flights.returnFlights[i].refDestinationAirport)
                $scope.flights.returnFlights[i].refDestinationAirportName = airports[j].name;

            }

          }

        }

      }, function myError(response) {
        console.log(response.statusText);
      });

      api.getAircrafts().then(function mySuccess(response) {

        aircrafts = response.data;

        for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

          for (var j = 0; j < aircrafts.length; j++) {

            if (aircrafts[j].tailNumber === $scope.flights.outgoingFlights[i].refAircraftTailNumber)
              $scope.flights.outgoingFlights[i].refAircraftModel = aircrafts[j].model;

          }

        }

        if ($scope.roundTrip) {

          for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

            for (var j = 0; j < aircrafts.length; j++) {

              if (aircrafts[j].tailNumber === $scope.flights.returnFlights[i].refAircraftTailNumber)
                $scope.flights.returnFlights[i].refAircraftModel = aircrafts[j].model;

            }

          }

        }

      }, function myError(response) {
        console.log(response.statusText);
      });

    }, function myError(response) {
      console.log(response.statusText);
    });

    $scope.selectOutgoingFlight = function(flight, isEconomy) {
      $scope.isOutgoingFlightSelected = true;
      $scope.selectedOutgoingFlight = flight;
      $scope.selectedBooking.exitIsEconomy = isEconomy;
      $scope.selectedBooking.refExitFlightID = flight._id;
    }

    $scope.selectReturningFlight = function(flight, isEconomy) {
      $scope.isReturningFlightSelected = true;
      $scope.selectedReturningFlight = flight;
      $scope.selectedBooking.reEntryIsEconomy = isEconomy;
      $scope.selectedBooking.refReEntryFlightID = flight._id;
    }

    $scope.checkNextBtnState = function() {
      if ($scope.roundTrip)
        return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
      else
        return $scope.isOutgoingFlightSelected;
    }

  } else {

    $scope.flights = {
      "outgoingFlights": [{
        "_id": "1",
        "number": "1000",
        "departureUTC": "2016-05-10T01:00:00Z",
        "arrivalUTC": "2016-05-10T03:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Air Berlin",
        "refOriginAirport": "CAI",
        "refOriginAirportName": null,
        "refDestinationAirport": "JED",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "2",
        "number": "1001",
        "departureUTC": "2016-05-10T06:00:00Z",
        "arrivalUTC": "2016-05-10T08:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Air Berlin",
        "refOriginAirport": "CAI",
        "refOriginAirportName": null,
        "refDestinationAirport": "JED",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "3",
        "number": "1002",
        "departureUTC": "2016-05-10T12:00:00Z",
        "arrivalUTC": "2016-05-10T14:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Swiss Air",
        "refOriginAirport": "CAI",
        "refOriginAirportName": null,
        "refDestinationAirport": "JED",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "4",
        "number": "1003",
        "departureUTC": "2016-05-10T17:00:00Z",
        "arrivalUTC": "2016-05-10T19:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Swiss Air",
        "refOriginAirport": "CAI",
        "refOriginAirportName": null,
        "refDestinationAirport": "JED",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }],
      "returnFlights": [{
        "_id": "1",
        "number": "1000",
        "departureUTC": "2016-05-12T01:00:00Z",
        "arrivalUTC": "2016-05-12T03:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Air Berlin",
        "refOriginAirport": "JED",
        "refOriginAirportName": null,
        "refDestinationAirport": "CAI",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "2",
        "number": "1001",
        "departureUTC": "2016-05-12T06:00:00Z",
        "arrivalUTC": "2016-05-12T08:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Air Berlin",
        "refOriginAirport": "JED",
        "refOriginAirportName": null,
        "refDestinationAirport": "CAI",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "3",
        "number": "1002",
        "departureUTC": "2016-05-12T12:00:00Z",
        "arrivalUTC": "2016-05-12T14:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Swiss Air",
        "refOriginAirport": "JED",
        "refOriginAirportName": null,
        "refDestinationAirport": "CAI",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }, {
        "_id": "4",
        "number": "1003",
        "departureUTC": "2016-05-12T17:00:00Z",
        "arrivalUTC": "2016-05-12T19:00:00Z",
        "duration": 120,
        "status": "On Time",
        "refAircraftTailNumber": "D-CCCC",
        "refAircraftModel": null,
        "operatorAirline": "Swiss Air",
        "refOriginAirport": "JED",
        "refOriginAirportName": null,
        "refDestinationAirport": "CAI",
        "refDestinationAirportName": null,
        "boardingGate": "40",
        "boardingPeriod": 45.0,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200.0,
        "businessFare": 300.0,
        "emptyEconomySeatsCount": null,
        "emptyBusinessSeatsCount": null,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": null
      }]
    };

    $scope.origin = "CAI";
    $scope.destination = "JED";
    $scope.exitDate = "2016-05-10T01:00:00Z";

    $scope.miniLogoPath = function(operatorAirline) {
      if (operatorAirline === "Air Berlin")
        return "img/air-berlin-mini-logo.png"
      return "img/other-airline-mini-logo.png"
    };

    $scope.selectOutgoingFlight = function(flight) {
      console.log(flight._id);
    }

    $scope.selectReturningFlight = function(flight) {
      console.log(flight._id);
    }

  }

  $scope.constructDate = function(date) {
    var dateOut = new Date(date);
    return dateOut;
  };

}

if (Type == 'mobile') {
  flightController.$inject = ['$scope', '$location', 'api', '$stateParams'];
} else {
  flightController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}

App.controller('flightsCtrl', flightController);
