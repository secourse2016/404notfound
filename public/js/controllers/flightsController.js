// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location, $routeParams, api) {

  $scope.pageClass = 'page-flights';
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = true;
  $scope.isOutgoingFlightSelected = false;
  $scope.selectedBooking = {
     "refPassengerID": null,
     "exitDepartureUTC": null,
     "reEntryDepartureUTC": null,
     "issueDate": null,
     "isGoingEconomy": null,
     "isReturningEconomy": null,
     "isOneWay": true,
     "refExitFlightNumber": null,
     "refReEntryFlightNumber": null,
     "receiptNumber": null
   };

  $scope.goNext = function() {

    api.setOutGoingFlight($scope.selectedOutgoingFlight);
    api.setReturningFlight($scope.selectedReturningFlight);
    api.setBooking($scope.selectedBooking);
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
  var exitDate = new Date($routeParams.exitDate * 1000);
  exitDate.setHours( 0,0,0,0 );
  $scope.roundTrip = false;
  if($routeParams.returnDate){
    var returnDate = new Date($routeParams.returnDate * 1000);
    returnDate.setHours( 0,0,0,0 );
    $scope.roundTrip = true;
  }

  // var origin = "TXL";
  // var destination = "JFK";
  // var exitDate = new Date(1459555200 * 1000);

  if (!origin || !destination || !exitDate) {
    $location.path('/');
  }

  var flights = [];
  var returnDateISO;
  if(returnDate)
    returnDateISO = returnDate.toISOString();

  api.getFlights(origin,destination,exitDate.toISOString(),returnDateISO).then(function mySuccess(response) {
    console.log(exitDate);

    console.log(exitDate.toISOString());
    console.log(response);
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

      return flight.refOriginAirport === origin
              && flight.refDestinationAirport === destination
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

  $scope.selectOutgoingFlight = function(flight, isEconomy){

    $scope.isOutgoingFlightSelected = true;
    $scope.selectedOutgoingFlight = flight;

    $scope.selectedBooking.exitDepartureUTC = flight.departureUTC;
    $scope.selectedBooking.isGoingEconomy = isEconomy;
    $scope.selectedBooking.isOneWay = $scope.roundTrip;
    $scope.selectedBooking.refExitFlightNumber = flight.number;
  }

  $scope.selectReturningFlight = function(flight, isEconomy){

    $scope.isReturningFlightSelected = true;
    $scope.selectedReturningFlight = flight;

    $scope.selectedBooking.reEntryDepartureUTC = flight.departureUTC;
    $scope.selectedBooking.isReturningEconomy = isEconomy;
    $scope.selectedBooking.isOneWay = $scope.roundTrip;
    $scope.selectedBooking.refReEntryFlightNumber = flight.number;
  }


$scope.checkNextBtnState = function(){
  if($scope.roundTrip){
    return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
  }else {
    return $scope.isOutgoingFlightSelected;
  }
}




  $scope.flights = {
    "outgoingFlights": [
      {
        "_id": "5713c7c014c7153812fc25b0",
        "number": "1002",
        "departureUTC": "2016-04-12T01:00:00Z",
        "arrivalUTC": "2016-04-12T03:00:00Z",
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
        "boardingPeriod": 45,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200,
        "businessFare": 300,
        "emptyEconomySeatsCount": 5,
        "emptyBusinessSeatsCount": 16,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": [
          {
            "number": "A1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          }
        ]
      }
    ],
    "returnFlights": [
      {
        "_id": "5713c7c014c7153812fc25e7",
        "number": "1003",
        "departureUTC": "2016-04-17T04:00:00Z",
        "arrivalUTC": "2016-04-17T06:00:00Z",
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
        "boardingPeriod": 45,
        "boardingTerminal": "3",
        "arrivalTerminal": "1",
        "economyFare": 200,
        "businessFare": 300,
        "emptyEconomySeatsCount": 5,
        "emptyBusinessSeatsCount": 16,
        "economySeatSchema": null,
        "buisnessSeatSchema": null,
        "seatmap": [
          {
            "number": "A1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K1",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K2",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K3",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K4",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K5",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K6",
            "isEmpty": true,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K7",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K8",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K9",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K10",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K11",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K12",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K13",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K14",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K15",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K16",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K17",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K18",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K19",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K20",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K21",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K22",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K23",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K24",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K25",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K26",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K27",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K28",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K29",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K30",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K31",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K32",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K33",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K34",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K35",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K36",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K37",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K38",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K39",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "A40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "B40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "D40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "E40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "F40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "G40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": true,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "J40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          },
          {
            "number": "K40",
            "isEmpty": true,
            "isEconomy": true,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": false,
            "refBookingID": null,
            "refPassengerID": null
          }
        ]
      }
    ]
  }


});
