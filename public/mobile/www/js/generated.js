App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, passengerData, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat;
    return {
        getAirports: function() {
            return $http({
                method: 'GET',
                url: '/api/airports',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getFlights: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'


                    }
                })
        },
        getOtherFlightsEco: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getOtherFlightsBusi: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: '/api/aircrafts',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/countries',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        setOutGoingFlight: function(flight) {
            chosenOutgoingFlight = flight;
        },
        setReturningFlight: function(flight) {
            chosenReturningFlight = flight;
        },
        setPassenger: function(passenger) {
            passengerData = passenger;
        },
        getCabinetOutgoingClass: function() {
            return cabinetOutgoingClass;
        },
        getCabinetReturningClass: function() {
            return cabinetReturningClass;
        },
        setBooking: function(booking) {

            if (!booking.exitIsEconomy)
                cabinetOutgoingClass = "Business"
            else
                cabinetOutgoingClass = "Economy"

            if (!booking.reEntryIsEconomy)
                cabinetReturningClass = "Business"

            else
                cabinetReturningClass = "Economy"


            bookingData = booking;
        },
        getPassenger: function() {
            return passengerData;
        },
        getBooking: function() {
            return bookingData;
        },
        getChosenOutGoingFlight: function() {
            return chosenOutgoingFlight;
        },
        getChosenReturningFlight: function() {
            return chosenReturningFlight;
        },
        getOutgoingSeat: function() {
            return outgoingSeat;
        },

        getReturnSeat: function() {
            return returnSeat;
        },
        setOutgoingSeat: function(seat) {
            outgoingSeat = seat;
        },
        setRetrunSeat: function(seat) {
            returnSeat = seat;
        },
        clearLocal: function() {
            chosenReturningFlight = {}
            chosenOutgoingFlight = {}
            passengerData = {}
            bookingData = {}
            cabinetOutgoingClass = {}
            cabinetReturningClass = {}
            outgoingSeat = {}
            returnSeat = {}
        },
        submitBooking: function() {
            return $http({
                method: 'POST',
                url: '/api/booking',
                headers: {
                    'x-access-token': accessToken
                },
                data: {
                    passenger: passengerData,
                    booking: bookingData,
                    outgoingSeatNumber: outgoingSeat,
                    returnSeatNumber: returnSeat
                }
            });
        }
    };
});

// @abdelrhman-essam
App.controller('confirmationCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-confirmation';
  $scope.title = "Confirm your flight";

  $scope.buttonTextNxt = "Confirm?";
  $scope.buttonTextBk = "Back";

  if(Type == 'desktop'){
    $scope.goNext = function() {
      // api.submitBooking().then(function(data){
      //   console.log(data);
      //   alert(data.data)
      //   api.clearLocal();
      // },function(err){

      // })
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

    $scope.passenger = api.getPassenger()[0];
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

  }

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

// @Nabila
App.controller('flightDetailsCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-flight';
  $scope.title = "Flight(s) Details";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";



  if (Type == 'desktop') {
    $scope.goNext = function() {
      $location.path('/passenger-details');
    }
    $scope.goBack = function() {
      $location.path('/flights');
    }

    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
      $location.path('/flights');
      return;
    }
  }
  var outgoingFlight = api.getChosenOutGoingFlight();
  var returnFlight = api.getChosenReturningFlight();

  var booking = api.getBooking();

  var facilities = ["Smoking areas available", "Wi-Fi availability",
    "4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
    "Screens to show your flight pattern, aircraft altitude and speed"
  ];
if (outgoingFlight){
  var departureDate = new Date(outgoingFlight.departureUTC);
  outgoingFlight.departureUTC = departureDate.toUTCString();
  var arrivalDate = new Date(outgoingFlight.arrivalUTC);
  outgoingFlight.arrivalUTC = arrivalDate.toUTCString();


  if (returnFlight) {
    departureDate = new Date(returnFlight.departureUTC);
    returnFlight.departureUTC = departureDate.toUTCString();
    arrivalDate = new Date(returnFlight.arrivalUTC);
    returnFlight.arrivalUTC = arrivalDate.toUTCString();
  }
  var aircrafts = [];
  var outAircrafthasSmoking;
  var outAircrafthasWifi;
  var reAircrafthasSmoking;
  var reAircrafthasWifi ;
  api.getAircrafts().then(function mySucces(response) {
    aircrafts = response.data;
    for (var i = 0; i < aircrafts.length; i++) {
      if (aircrafts[i].tailNumber === outgoingFlight.refAircraftTailNumber) {
        outAircrafthasSmoking = aircrafts[i].hasSmoking;
        outAircrafthasWifi = aircrafts[i].hasWifi;
        $scope.outAircraftModel = aircrafts[i].model;
      }
      if (returnFlight) {
        if (aircrafts[i].tailNumber === returnFlight.refAircraftTailNumber) {
          reAircrafthasSmoking = aircrafts[i].hasSmoking;
          reAircrafthasWifi = aircrafts[i].hasWifi;
          $scope.reAircraftModel = aircrafts[i].model;
        }
      }

    }
  }, function myError(response) {
    console.log(response.statusText);
  });

  $scope.outRefOriginAirportName;
  $scope.outRefDestinationAirportName;
  var airports = [];
  api.getAirports().then(function mySucces(response) {
    airports = response.data;
    for (var i = 0; i < airports.length; i++) {
      if (airports[i].iata === outgoingFlight.refOriginAirport) {
        $scope.outRefOriginAirportName = airports[i].name;
      }
      if (airports[i].iata === outgoingFlight.refDestinationAirport) {
        $scope.outRefDestinationAirportName = airports[i].name;
      }
      if (returnFlight) {
        $scope.reRefOriginAirportName;
        $scope.reRefDestinationAirportName;
        if (airports[i].iata === returnFlight.refOriginAirport) {
          $scope.reRefOriginAirportName = airports[i].name;
        }
        if (airports[i].iata === returnFlight.refDestinationAirport) {
          $scope.reRefDestinationAirportName = airports[i].name;
        }

      }
    }
  }, function myError(response) {
    console.log(response.statusText);
  });
  var outbusinessOrEcon = "";
  var outfare = 0;
if (!api.IsOtherHosts()){
  if (booking.exitIsEconomy) {
    outbusinessOrEcon = "Economy";
    outfare = outgoingFlight.economyFare;
  } else {
    outbusinessOrEcon = "Business";
    outfare = outgoingFlight.businessFare;
  }
  if (returnFlight) {
    var rebusinessOrEcon = "";
    var refare = 0;
    if (booking.reEntryIsEconomy) {
      rebusinessOrEcon = "Economy";
      refare = returnFlight.economyFare;
    } else {
      rebusinessOrEcon = "Business";
      refare = returnFlight.businessFare;
    }
  }
}else{
  if (booking.class) {
    outbusinessOrEcon = "Economy";
    outfare = outgoingFlight.economyFare;
  } else {
    outbusinessOrEcon = "Business";
    outfare = outgoingFlight.businessFare;
  }
  if (returnFlight) {
    var rebusinessOrEcon = "";
    var refare = 0;
    if (booking.class) {
      rebusinessOrEcon = "Economy";
      refare = returnFlight.economyFare;
    } else {
      rebusinessOrEcon = "Business";
      refare = returnFlight.businessFare;
    }
  }
}
  var outfacilitiesResult = [];
  if (outAircrafthasSmoking)
    outfacilitiesResult.push(facilities[0]);
  if (outAircrafthasWifi)
    outfacilitiesResult.push(facilities[1]);
if(!api.IsOtherHosts()){
  if (!booking.exitIsEconomy) {
    outfacilitiesResult.push(facilities[2]);
    outfacilitiesResult.push(facilities[3]);
    outfacilitiesResult.push(facilities[4]);
  }
}
  else {
    if (!booking.class) {
      outfacilitiesResult.push(facilities[2]);
      outfacilitiesResult.push(facilities[3]);
      outfacilitiesResult.push(facilities[4]);
    }
  }

  outfacilitiesResult.push(facilities[5]);
  if (returnFlight) {
    var refacilitiesResult = [];
    if (reAircrafthasSmoking)
      refacilitiesResult.push(facilities[0]);
    if (reAircrafthasWifi)
      refacilitiesResult.push(facilities[1]);
  if(!api.IsOtherHosts()){
    if (!booking.reEntryIsEconomy) {
      refacilitiesResult.push(facilities[2]);
      refacilitiesResult.push(facilities[3]);
      refacilitiesResult.push(facilities[4]);
    }
  }

    else{
      if (!booking.class) {
        refacilitiesResult.push(facilities[2]);
        refacilitiesResult.push(facilities[3]);
        refacilitiesResult.push(facilities[4]);
      }
    }

    refacilitiesResult.push(facilities[5]);

    $scope.returnFlight = returnFlight;
    $scope.rebusinessOrEcon = rebusinessOrEcon;
    $scope.refare = refare;
    $scope.refacilitiesResult = refacilitiesResult;
  }
  $scope.outgoingFlight = outgoingFlight;
  $scope.outbusinessOrEcon = outbusinessOrEcon;
  $scope.outfare = outfare;
  $scope.outfacilitiesResult = outfacilitiesResult;

}
});

// @abdelrahman-maged
var flightController = function($scope, $location, $routeParams, api) {

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

      // formatting data to be presentable
      for (i = 0; i < flights.outgoingFlights.length; i++) {

        var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
        var minutes = flights.outgoingFlights[i].duration % 60;

        flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

      }

      // $scope.flights = flights.filter(checkConstraints);

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
      // $scope.selectedBooking.isOneWay = $scope.roundTrip;
      $scope.selectedBooking.refExitFlightID = flight._id;
    }

    $scope.selectReturningFlight = function(flight, isEconomy) {
      $scope.isReturningFlightSelected = true;
      $scope.selectedReturningFlight = flight;
      $scope.selectedBooking.reEntryIsEconomy = isEconomy;
      // $scope.selectedBooking.isOneWay = $scope.roundTrip;
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

    $scope.miniLogoPath = function(operatorAirline){
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
  flightController.$inject = ['$scope', '$location', 'api'];
} else {
  flightController.$inject = ['$scope', '$location', '$routeParams', 'api'];
}

App.controller('flightsCtrl', flightController);

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

App.controller('mainCtrl', function($scope, $location, api) {
    $scope.pageClass = 'page-main';



    if(Type == 'desktop'){

      $('#main-text').typeIt({
          strings: [
              "Simple, convenient, instant confirmation.", "Destinations all around the globe.", "Experience authentic hospitality.", "Time to get enchanted."
          ],
          speed: 120,
          breakLines: false,
          loop: true
      });
      $scope.flight = {
          type: "one"
      }
      $scope.otherAirline = {
      value:false
      }
      $scope.goToFlights = function() {
          if ($scope.otherAirline.value) {
            if ($scope.flight.type == "one")
            $location.path('/flights-new').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
            else{
              $location.path('/flights-new')
                  .search('origin', $scope.selectedOrigin)
                  .search('destination', $scope.selectedDest)
                  .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
                  .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
            }
          } else {
              if ($scope.flight.type == "one")
                  $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
              else {
                  $location.path('/flights')
                      .search('origin', $scope.selectedOrigin)
                      .search('destination', $scope.selectedDest)
                      .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
                      .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
              }

          }

      };
      $location.url($location.path());
      setUpDate($scope);

      $scope.children = ['0 children', '1 child', '2 children', '3 children', '4 children'];
      $scope.childrenBtnText = $scope.children[0];
      $scope.changeChildren = function(text) {
          $scope.childrenBtnText = text;
      }



      $scope.adults = ['1 adult', '2 adults', '3 adults', '4 adults'];
      $scope.adultBtnText = $scope.adults[0];
      $scope.changeAdult = function(text) {
          $scope.adultBtnText = text;
      }

      $scope.infants = ['0 infants', '1 infant'];
      $scope.infantBtnText = $scope.infants[0];
      $scope.changeInfant = function(text) {
          $scope.infantBtnText = text;
      }

      api.getAirports().then(function mySucces(response) {
          $scope.airports = response.data;
      }, function myError(response) {
          console.log(response.statusText);
      });
      $scope.selectedOrigin = undefined;
      $scope.selectedDest = undefined;

      function airporsContains(iata) {
          for (var i = 0; i < $scope.airports.length; i++) {
              if (iata == $scope.airports[i]['iata'])
                  return true;
          }
          return false;
      }

      $scope.buttonState = function() {
          return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitDate || $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin) || !airporsContains($scope.selectedDest);
      }
    }else{

    }
});

function setUpDate($scope) {
    $scope.today = function() {
        $scope.exitDate = new Date();
        $scope.returnDate = new Date();
    };
    $scope.today();

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    $scope.open = function() {
        $scope.popup.opened = true;
    };


    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup = {
        opened: false
    };
}

// @yassmine
App.controller('passengerDetailsCtrl', function($scope, $location, api) {
    $scope.title = "Fill in your details";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    $scope.passenger = {
        type: null,
        countryCode: null,
        nationality: null,
        sex: null,
        birthDate: null,
        birthPlace: null,
        nationalID: null,
        authority: null,
        issueDate: null,
        expiryDate: null,
        points: null,
        membership: null,
        firstName: null,
        middleName: null,
        lastName: null,
        passportNumber: null,
        phoneNumber: null,
        email: null

    };

    if (Type == 'desktop') {
        if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
            $location.path('/flights');
            return;
        }

        $scope.titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
        $scope.titlesBtnText = $scope.titles[0];
        $scope.changeTitle = function(text) {
            $scope.titlesBtnText = text;
        }

        api.getCountries().then(function mySucces(response) {
            $scope.countries = response.data;
        }, function myError(response) {
            console.log(response.statusText);
        });




        // ---------------------------------------- Now you have $scope.nationality and $scope.titlesBtnText you can use them in your object
        var complete = false;
        $scope.goNext = function() {

            /*if(!api.getChosenFlight())
            {
            $location.path('/flights');
            alert("You have to choose a flight");
            }*/
            //The reverting to the flights page

            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.nationality,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.titlesBtnText,
                firstName: $scope.firstName,
                middleName: $scope.middleName,
                lastName: $scope.lastName,
                passportNumber: $scope.passportNumber,
                phoneNumber: $scope.phoneNumber,
                email: $scope.email1


            };
            ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");



            if (complete == false) {
                $scope.alertData = false;
                if (($scope.firstName == null) || ($scope.middleName == null) || ($scope.lastName == null) || ($scope.phoneNumber == null) || ($scope.passportNumber == null) || ($scope.email1 == null) || ($scope.emailver == null)) {
                    $scope.alertData = true;

                } else {
                    $scope.alertConfirm = false;
                    if ($scope.email1 != $scope.emailver)
                        $scope.alertConfirm = true;
                    else {
                        $scope.alertCheck = false;
                        if (($scope.check == null))
                            $scope.alertCheck = true;
                        else {
                            complete = true;
                        }
                    }

                }


            }
            if (complete == true) {
                api.setPassenger($scope.passenger);
                $location.path('/seating/outgoing');
                if(!api.isOtherHosts)
                  $location.path('/seating/outgoing');
                  else $location.path('/payment')
            }

        }
        $scope.goBack = function() {
            $location.path('/exit-flight');
        }
    } else {



        var complete1 = false;

        $scope.Next = function() {


            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.countriesMob,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.TitleMob,
                firstName: $scope.firstNameMob,
                middleName: $scope.middleNameMob,
                lastName: $scope.lastNameMob,
                passportNumber: $scope.passportNumberMob,
                phoneNumber: $scope.phoneNumberMob,
                email: $scope.email1Mob


            };




            if (complete1 == false) {

                if (($scope.firstNameMob == null) || ($scope.middleNameMob == null) || ($scope.lastNameMob == null) || ($scope.phoneNumberMob == null) || ($scope.passportNumberMob == null) || ($scope.email1Mob == null) || ($scope.emailverMob == null)) {
                    alert("Please fill in data:" + "\n" + "Passport Number must be 8 numbers" + "\n" +
                        "Phone Number must be 10 numbers" + "\n" + "Emails must be in a@xyz.com format");

                } else {

                    if ($scope.email1Mob != $scope.emailverMob)
                        alert("The entered emails do not match");
                    else {

                        if (($scope.checkMob == null))
                            alert("Please verify the information you entered")
                        else {
                            complete1 = true;

                        }
                    }

                }


            }

            if (complete1 == true) {
                api.setPassenger($scope.passenger);

                $location.path('/tab/seating/outgoing');
            }

        };
    }



});

// @mirna
App.controller('paymentCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";
    $scope.goNext = function() {
    api.submitBooking(api.IsOtherHosts()).then(function(data){
      console.log(data);
       alert(data.data)
      api.clearLocal();
    },function(err){

    })
    if (!api.IsOtherHosts())
    $location.path('/confirmation');
  }
  $scope.goBack = function() {
    $location.path('/seating');
  }

  if(Type == 'desktop'){

      if(!api.getChosenOutGoingFlight() || !api.getBooking()){
        $location.path('/flights');
        return;
      }
      if(!api.getPassenger()){
        $location.path('/passenger-details');
          return;
      }
      var price = 0;
      if(api.getCabinetOutgoingClass() == 'Economy')
        price = api.getChosenOutGoingFlight().economyFare
      else
        price = api.getChosenOutGoingFlight().businessFare

        if(api.getChosenReturningFlight()){

          if(api.getCabinetReturningClass() == 'Economy')
            price = price + api.getChosenReturningFlight().economyFare
          else
            price = price + api.getChosenReturningFlight().businessFare


        }


      $scope.price = price;
      $scope.years = ['2016','2017','2018','2019','2020','2021','2022','2023','2024'];
      $scope.yearsBtnText = $scope.years[0];
      $scope.changeYear = function(text) {
        $scope.yearsBtnText = text;
      }

      $scope.months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
      $scope.monthsBtnText = $scope.months[0];
      $scope.changeMonth = function(text) {
        $scope.monthsBtnText = text;
      }    
  }

});

// @ahmed-essmat
  var seatingController = function($scope, $location,api,$routeParams) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    if(Type == 'desktop'){
      $scope.goNext = function() {
          if (api.getChosenReturningFlight())
              if ($routeParams.outgoing == "outgoing") {
                  $location.path('/seating/returing');
                  api.setOutgoingSeat($scope.seat);
              } else {
                  api.setRetrunSeat($scope.seat);
                  $location.path('/payment');
              }
          else {
              api.setOutgoingSeat($scope.seat);
              $location.path('/payment');
          }

      }
      $scope.goBack = function() {
          $location.path('/passenger-details');
      }



      if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
          $location.path('/flights');
          return;
      }
      if (!api.getPassenger()) {
          $location.path('/passenger-details');
          return;
      }
      var seatmap;

      if ($routeParams.outgoing == "outgoing") {

          $scope.isEconomyText = api.getCabinetOutgoingClass();
          seatmap = api.getChosenOutGoingFlight().seatmap;
      } else {
          $scope.isEconomyText = api.getCabinetReturningClass();
          seatmap = api.getChosenReturningFlight().seatmap;
      }



      var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
      var schema = [3, 5, 3, 20];

      $scope.array1 = [];

      $scope.array2 = [];

      $scope.array3 = [];

      $scope.bob = [];

      for (var i = 0; i < schema[0]; i++) {
          $scope.array1.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[1]; i++) {
          $scope.array2.push(alphabits[0]);
          alphabits.splice(0, 1);
      }
      for (var i = 0; i < schema[2]; i++) {
          $scope.array3.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[3]; i++) {
          $scope.bob.push(i);

      }



      $scope.searchColor = function(text) {
          if (!$scope.isEmpty(text))
              return 'seatOcu';
          else
              return 'seatEmpty';
      }
      $scope.isEmpty = function(text) {
          for (var i = 0; i < seatmap.length; i++) {
              if (seatmap[i]['number'] == text) {
                  return seatmap[i]['isEmpty']
              }
          }
          return true;
      }
      $scope.selectSeat = function(seat) {
          $scope.seat = seat;
      };
    }



    var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
    var schema = [2, 4, 2, 9];

    $scope.array1 = [];

    $scope.array2 = [];

    $scope.array3 = [];

    $scope.bob = [];

    for (var i = 0; i < schema[0]; i++) {
        $scope.array1.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[1]; i++) {
        $scope.array2.push(alphabits[0]);
        alphabits.splice(0, 1);
    }
    for (var i = 0; i < schema[2]; i++) {
        $scope.array3.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[3]; i++) {
        $scope.bob.push(i);

    }


};


if(Type == 'mobile'){
  seatingController.$inject = ['$scope', '$location', 'api'];
}else{
  seatingController.$inject = ['$scope', '$location', 'api','$routeParams'];
}


App.controller('seatingCtrl', seatingController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5mYWN0b3J5KCdhcGknLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICAgIHZhciBjaG9zZW5PdXRnb2luZ0ZsaWdodCwgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0LCBwYXNzZW5nZXJEYXRhLCBib29raW5nRGF0YSwgY2FiaW5ldE91dGdvaW5nQ2xhc3MsIGNhYmluZXRSZXR1cm5pbmdDbGFzcywgb3V0Z29pbmdTZWF0LCByZXR1cm5TZWF0O1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldEFpcnBvcnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcnBvcnRzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RmxpZ2h0czogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiLzBcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi8wXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXlcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvZWNvbm9teVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0J1c2k6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9idXNpbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEFpcmNyYWZ0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9haXJjcmFmdHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvY291bnRyaWVzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFBhc3NlbmdlcjogZnVuY3Rpb24ocGFzc2VuZ2VyKSB7XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhID0gcGFzc2VuZ2VyO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG5cbiAgICAgICAgICAgIGlmICghYm9va2luZy5leGl0SXNFY29ub215KVxuICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cblxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSBib29raW5nO1xuICAgICAgICB9LFxuICAgICAgICBnZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3NlbmdlckRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2tpbmdEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5PdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuT3V0Z29pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3NlblJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuUmV0dXJuaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dGdvaW5nU2VhdDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZXR1cm5TZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5TZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHJ1blNlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIHJldHVyblNlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBjbGVhckxvY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhID0ge31cbiAgICAgICAgICAgIGJvb2tpbmdEYXRhID0ge31cbiAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0ge31cbiAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSB7fVxuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2Jvb2tpbmcnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nOiBib29raW5nRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdTZWF0TnVtYmVyOiBvdXRnb2luZ1NlYXQsXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsIi8vIEBhYmRlbHJobWFuLWVzc2FtXG5BcHAuY29udHJvbGxlcignY29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSkge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWNvbmZpcm1hdGlvbic7XG4gICRzY29wZS50aXRsZSA9IFwiQ29uZmlybSB5b3VyIGZsaWdodFwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJDb25maXJtP1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGFwaS5zdWJtaXRCb29raW5nKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAvLyAgIGFsZXJ0KGRhdGEuZGF0YSlcbiAgICAgIC8vICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcblxuICAgICAgLy8gfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cbiAgICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG5cbi8vXG4vLyBjb25zb2xlLmxvZyhcImNob3Nlbk91dGdvaW5nRmxpZ2h0XCIpO1xuLy8gICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4vLyBjb25zb2xlLmxvZyhcImNob3NlblJldHVybmluZ0ZsaWdodFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwicGFzc2VuZ2VyXCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UGFzc2VuZ2VyKCkpXG4vLyBjb25zb2xlLmxvZyhcImJvb2tpbmdcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRCb29raW5nKCkpXG4vLyBjb25zb2xlLmxvZyhcImdvaW5nU2VhdFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldE91dGdvaW5nU2VhdCgpKVxuLy8gY29uc29sZS5sb2coXCJyZXRydW5TZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UmV0dXJuU2VhdCgpKVxuXG5cbn0pO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNXaWZpO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5pZiAoIWFwaS5Jc090aGVySG9zdHMoKSl7XG4gIGlmIChib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5lY29ub215RmFyZTtcbiAgfSBlbHNlIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuYnVzaW5lc3NGYXJlO1xuICB9XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gICAgdmFyIHJlZmFyZSA9IDA7XG4gICAgaWYgKGJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmVjb25vbXlGYXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgICB9XG4gIH1cbn1lbHNle1xuICBpZiAoYm9va2luZy5jbGFzcykge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5jbGFzcykge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmVjb25vbXlGYXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgICB9XG4gIH1cbn1cbiAgdmFyIG91dGZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzU21va2luZylcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuaWYoIWFwaS5Jc090aGVySG9zdHMoKSl7XG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbn1cbiAgZWxzZSB7XG4gICAgaWYgKCFib29raW5nLmNsYXNzKSB7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gICAgfVxuICB9XG5cbiAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuICBpZighYXBpLklzT3RoZXJIb3N0cygpKXtcbiAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgfVxuXG4gICAgZWxzZXtcbiAgICAgIGlmICghYm9va2luZy5jbGFzcykge1xuICAgICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuXG4gICAgJHNjb3BlLnJldHVybkZsaWdodCA9IHJldHVybkZsaWdodDtcbiAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLnJlZmFyZSA9IHJlZmFyZTtcbiAgICAkc2NvcGUucmVmYWNpbGl0aWVzUmVzdWx0ID0gcmVmYWNpbGl0aWVzUmVzdWx0O1xuICB9XG4gICRzY29wZS5vdXRnb2luZ0ZsaWdodCA9IG91dGdvaW5nRmxpZ2h0O1xuICAkc2NvcGUub3V0YnVzaW5lc3NPckVjb24gPSBvdXRidXNpbmVzc09yRWNvbjtcbiAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAkc2NvcGUub3V0ZmFjaWxpdGllc1Jlc3VsdCA9IG91dGZhY2lsaXRpZXNSZXN1bHQ7XG5cbn1cbn0pO1xuIiwiLy8gQGFiZGVscmFobWFuLW1hZ2VkXG52YXIgZmxpZ2h0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsIGFwaSkge1xuXG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICBhcGkuc2V0SXNPdGhlckhvc3RzKGZhbHNlKTtcbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcblxuICAgICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICAgIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgICAgdmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSAqIDEwMDApO1xuICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgIFwicmVmUGFzc2VuZ2VySURcIjogW10sXG4gICAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICAgIFwicmVmRXhpdEZsaWdodElEXCI6IG51bGwsXG4gICAgICBcInJlZlJlRW50cnlGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgXCJyZWNlaXB0TnVtYmVyXCI6IG51bGxcbiAgICB9O1xuXG4gICAgaWYgKCFvcmlnaW4gfHwgIWRlc3RpbmF0aW9uIHx8ICFleGl0RGF0ZSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgZmxpZ2h0cztcbiAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG5cbiAgICBhcGkuZ2V0RmxpZ2h0cyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICBmbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgLy8gZm9ybWF0dGluZyBkYXRhIHRvIGJlIHByZXNlbnRhYmxlXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgfVxuXG4gICAgICAvLyAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHMuZmlsdGVyKGNoZWNrQ29uc3RyYWludHMpO1xuXG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuXG4gICAgICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJwb3J0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tqXS50YWlsTnVtYmVyID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXRJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgICAvLyAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmlzT25lV2F5ID0gJHNjb3BlLnJvdW5kVHJpcDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gZmxpZ2h0Ll9pZDtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICB9XG5cbiAgfSBlbHNlIHtcblxuICAgICRzY29wZS5mbGlnaHRzID0ge1xuICAgIFwib3V0Z29pbmdGbGlnaHRzXCI6IFt7XG4gICAgICBcIl9pZFwiOiBcIjFcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMFwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDAxOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwMzowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiMlwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAxXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDY6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDA4OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIzXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQxMjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMTQ6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiNFwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAzXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTc6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE5OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9XSxcbiAgICBcInJldHVybkZsaWdodHNcIjogW3tcbiAgICAgIFwiX2lkXCI6IFwiMVwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMDE6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDAzOjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIyXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDFcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQwNjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMDg6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjNcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMlwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDEyOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQxNDowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCI0XCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQxNzowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMTk6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH1dXG4gIH07XG5cbiAgICAkc2NvcGUub3JpZ2luID0gXCJDQUlcIjtcbiAgICAkc2NvcGUuZGVzdGluYXRpb24gPSBcIkpFRFwiO1xuICAgICRzY29wZS5leGl0RGF0ZSA9IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIjtcblxuICAgICRzY29wZS5taW5pTG9nb1BhdGggPSBmdW5jdGlvbihvcGVyYXRvckFpcmxpbmUpe1xuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZSA9PT0gXCJBaXIgQmVybGluXCIpXG4gICAgICAgIHJldHVybiBcImltZy9haXItYmVybGluLW1pbmktbG9nby5wbmdcIlxuICAgICAgcmV0dXJuIFwiaW1nL290aGVyLWFpcmxpbmUtbWluaS1sb2dvLnBuZ1wiXG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgY29uc29sZS5sb2coZmxpZ2h0Ll9pZCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgY29uc29sZS5sb2coZmxpZ2h0Ll9pZCk7XG4gICAgfVxuXG4gIH1cblxuICAkc2NvcGUuY29uc3RydWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF0ZU91dCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHJldHVybiBkYXRlT3V0O1xuICB9O1xuXG59XG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn0gZWxzZSB7XG4gIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckcm91dGVQYXJhbXMnLCAnYXBpJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzQ3RybCcsIGZsaWdodENvbnRyb2xsZXIpO1xuIiwidmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBhcGkpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICBhcGkuc2V0SXNPdGhlckhvc3RzKHRydWUpO1xuXG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gIH1cblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgXCJQYXNzZW5nZXJEZXRhaWxzXCI6IG51bGwsXG4gICAgXCJyZWZFeGl0RmxpZ2h0SURcIjogbnVsbCxcbiAgICBcInJlZlJlRW50cnlGbGlnaHRJRFwiOiBudWxsLFxuICAgIFwiY2xhc3NcIjogbnVsbCxcbiAgICBcInBheW1lbnRUb2tlblwiOiBudWxsXG4gIH07XG5cbiAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBmbGlnaHRzO1xuICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgaWYgKHJldHVybkRhdGUpXG4gICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pXG5cbn1cblxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59IGVsc2Uge1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgJ2FwaSddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzTmV3Q3RybCcsIGZsaWdodE5ld0NvbnRyb2xsZXIpO1xuIiwiQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1tYWluJztcblxuXG5cbiAgICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG5cbiAgICAgICQoJyNtYWluLXRleHQnKS50eXBlSXQoe1xuICAgICAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgICAgICAgXCJTaW1wbGUsIGNvbnZlbmllbnQsIGluc3RhbnQgY29uZmlybWF0aW9uLlwiLCBcIkRlc3RpbmF0aW9ucyBhbGwgYXJvdW5kIHRoZSBnbG9iZS5cIiwgXCJFeHBlcmllbmNlIGF1dGhlbnRpYyBob3NwaXRhbGl0eS5cIiwgXCJUaW1lIHRvIGdldCBlbmNoYW50ZWQuXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIHNwZWVkOiAxMjAsXG4gICAgICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICAgICAgbG9vcDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICAkc2NvcGUuZmxpZ2h0ID0ge1xuICAgICAgICAgIHR5cGU6IFwib25lXCJcbiAgICAgIH1cbiAgICAgICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgICB2YWx1ZTpmYWxzZVxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5vdGhlckFpcmxpbmUudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJykuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KS5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICB9O1xuICAgICAgJGxvY2F0aW9uLnVybCgkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgIHNldFVwRGF0ZSgkc2NvcGUpO1xuXG4gICAgICAkc2NvcGUuY2hpbGRyZW4gPSBbJzAgY2hpbGRyZW4nLCAnMSBjaGlsZCcsICcyIGNoaWxkcmVuJywgJzMgY2hpbGRyZW4nLCAnNCBjaGlsZHJlbiddO1xuICAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9ICRzY29wZS5jaGlsZHJlblswXTtcbiAgICAgICRzY29wZS5jaGFuZ2VDaGlsZHJlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5hZHVsdHMgPSBbJzEgYWR1bHQnLCAnMiBhZHVsdHMnLCAnMyBhZHVsdHMnLCAnNCBhZHVsdHMnXTtcbiAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUFkdWx0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSB0ZXh0O1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCBpbmZhbnRzJywgJzEgaW5mYW50J107XG4gICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9ICRzY29wZS5pbmZhbnRzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUluZmFudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gPSB1bmRlZmluZWQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWREZXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgICBmdW5jdGlvbiBhaXJwb3JzQ29udGFpbnMoaWF0YSkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChpYXRhID09ICRzY29wZS5haXJwb3J0c1tpXVsnaWF0YSddKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmJ1dHRvblN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICEkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgISRzY29wZS5zZWxlY3RlZERlc3QgfHwgISRzY29wZS5leGl0RGF0ZSB8fCAkc2NvcGUuc2VsZWN0ZWREZXN0ID09ICRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZE9yaWdpbikgfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWREZXN0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcblxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBzZXRVcERhdGUoJHNjb3BlKSB7XG4gICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgICB9O1xuICAgICRzY29wZS50b2RheSgpO1xuXG4gICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgICB9O1xuICAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5wb3B1cC5vcGVuZWQgPSB0cnVlO1xuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIGRpc2FibGVkKGRhdGEpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBkYXRhLmRhdGUsXG4gICAgICAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICAgfVxuICAgICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoMjAyMCwgNSwgMjIpLFxuICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICBzdGFydGluZ0RheTogMVxuICAgIH07XG4gICAgJHNjb3BlLnBvcHVwMiA9IHtcbiAgICAgICAgb3BlbmVkOiBmYWxzZVxuICAgIH07XG4gICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICAgICBvcGVuZWQ6IGZhbHNlXG4gICAgfTtcbn1cbiIsIi8vIEB5YXNzbWluZVxuQXBwLmNvbnRyb2xsZXIoJ3Bhc3NlbmdlckRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAgICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY291bnRyeUNvZGU6IG51bGwsXG4gICAgICAgIG5hdGlvbmFsaXR5OiBudWxsLFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgZmlyc3ROYW1lOiBudWxsLFxuICAgICAgICBtaWRkbGVOYW1lOiBudWxsLFxuICAgICAgICBsYXN0TmFtZTogbnVsbCxcbiAgICAgICAgcGFzc3BvcnROdW1iZXI6IG51bGwsXG4gICAgICAgIHBob25lTnVtYmVyOiBudWxsLFxuICAgICAgICBlbWFpbDogbnVsbFxuXG4gICAgfTtcblxuICAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aXRsZXMgPSBbJ01yJywgJ01ycycsICdNcycsICdEciddO1xuICAgICAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9ICRzY29wZS50aXRsZXNbMF07XG4gICAgICAgICRzY29wZS5jaGFuZ2VUaXRsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG5cblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTm93IHlvdSBoYXZlICRzY29wZS5uYXRpb25hbGl0eSBhbmQgJHNjb3BlLnRpdGxlc0J0blRleHQgeW91IGNhbiB1c2UgdGhlbSBpbiB5b3VyIG9iamVjdFxuICAgICAgICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvKmlmKCFhcGkuZ2V0Q2hvc2VuRmxpZ2h0KCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91IGhhdmUgdG8gY2hvb3NlIGEgZmxpZ2h0XCIpO1xuICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAvL1RoZSByZXZlcnRpbmcgdG8gdGhlIGZsaWdodHMgcGFnZVxuXG4gICAgICAgICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGU6IG51bGwsIC8vYWNjb3JkaW5nIHRvIGNvdW50cnlcbiAgICAgICAgICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICAgICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICAgICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgICAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHNjb3BlLnRpdGxlc0J0blRleHQsXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlcixcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxXG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vL2JlZm9yZSB5b3UgbGVhdmUgdGhlIHBhZ2UgbWFrZSBzdXJlIHRoYXQgdGhlIHBhc3NlbmdlciBvYmplY3QgaXMgY29tcGxldGUgb3RoZXJ3aXNlIHNob3cgYWxlcnQoXCJGaWxsIGluIGFsbCBkYXRhXCIpO1xuXG5cblxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0RGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnREYXRhID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDEgIT0gJHNjb3BlLmVtYWlsdmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb21wbGV0ZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgICAgICAgICBpZighYXBpLmlzT3RoZXJIb3N0cylcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgICAgICAgZWxzZSAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcblxuXG5cbiAgICAgICAgdmFyIGNvbXBsZXRlMSA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAgICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgICAgICAgICAgbmF0aW9uYWxpdHk6ICRzY29wZS5jb3VudHJpZXNNb2IsXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUuVGl0bGVNb2IsXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICAgICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lTW9iLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWVNb2IsXG4gICAgICAgICAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyTW9iLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxTW9iXG5cblxuICAgICAgICAgICAgfTtcblxuXG5cblxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlMSA9PSBmYWxzZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGZpbGwgaW4gZGF0YTpcIiArIFwiXFxuXCIgKyBcIlBhc3Nwb3J0IE51bWJlciBtdXN0IGJlIDggbnVtYmVyc1wiICsgXCJcXG5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlBob25lIE51bWJlciBtdXN0IGJlIDEwIG51bWJlcnNcIiArIFwiXFxuXCIgKyBcIkVtYWlscyBtdXN0IGJlIGluIGFAeHl6LmNvbSBmb3JtYXRcIik7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxTW9iICE9ICRzY29wZS5lbWFpbHZlck1vYilcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGVudGVyZWQgZW1haWxzIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoJHNjb3BlLmNoZWNrTW9iID09IG51bGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24geW91IGVudGVyZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlMSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcblxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdGFiL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgIH1cblxuXG5cbn0pO1xuIiwiLy8gQG1pcm5hXG5BcHAuY29udHJvbGxlcigncGF5bWVudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGkpIHtcbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1wYXltZW50JztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgeW91ciBwYXltZW50IG9wdGlvblwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJQYXkhXCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgYXBpLnN1Ym1pdEJvb2tpbmcoYXBpLklzT3RoZXJIb3N0cygpKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgYWxlcnQoZGF0YS5kYXRhKVxuICAgICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICB9LGZ1bmN0aW9uKGVycil7XG5cbiAgICB9KVxuICAgIGlmICghYXBpLklzT3RoZXJIb3N0cygpKVxuICAgICRsb2NhdGlvbi5wYXRoKCcvY29uZmlybWF0aW9uJyk7XG4gIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZycpO1xuICB9XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuXG4gICAgICBpZighYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpe1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgcHJpY2UgPSAwO1xuICAgICAgaWYoYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICBlbHNlXG4gICAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgaWYoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKXtcblxuICAgICAgICAgIGlmKGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuXG4gICAgICAgIH1cblxuXG4gICAgICAkc2NvcGUucHJpY2UgPSBwcmljZTtcbiAgICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsJzIwMTcnLCcyMDE4JywnMjAxOScsJzIwMjAnLCcyMDIxJywnMjAyMicsJzIwMjMnLCcyMDI0J107XG4gICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gJHNjb3BlLnllYXJzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICRzY29wZS55ZWFyc0J0blRleHQgPSB0ZXh0O1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubW9udGhzID0gWydKYW51YXJ5JywnRmVidXJhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknLCdBdWd1c3QnLCdTZXB0ZW1iZXInLCdPY3RvYmVyJywnTm92ZW1iZXInLCdEZWNlbWJlciddO1xuICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZU1vbnRoID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICB9ICAgIFxuICB9XG5cbn0pO1xuIiwiLy8gQGFobWVkLWVzc21hdFxuICB2YXIgc2VhdGluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGksJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXNlYXRpbmcnO1xuICAgICRzY29wZS50aXRsZSA9IFwiV2hlcmUgd291bGQgeW91IGxpa2UgdG8gc2l0P1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9yZXR1cmluZycpO1xuICAgICAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0UmV0cnVuU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgfVxuXG5cblxuICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYXBpLmdldFBhc3NlbmdlcigpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzZWF0bWFwO1xuXG4gICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuXG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfVxuXG5cblxuICAgICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgICAgdmFyIHNjaGVtYSA9IFszLCA1LCAzLCAyMF07XG5cbiAgICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5zZWFyY2hDb2xvciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBpZiAoISRzY29wZS5pc0VtcHR5KHRleHQpKVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRPY3UnO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0RW1wdHknO1xuICAgICAgfVxuICAgICAgJHNjb3BlLmlzRW1wdHkgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWF0bWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChzZWF0bWFwW2ldWydudW1iZXInXSA9PSB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc2VhdG1hcFtpXVsnaXNFbXB0eSddXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICAkc2NvcGUuc2VsZWN0U2VhdCA9IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAkc2NvcGUuc2VhdCA9IHNlYXQ7XG4gICAgICB9O1xuICAgIH1cblxuXG5cbiAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgdmFyIHNjaGVtYSA9IFsyLCA0LCAyLCA5XTtcblxuICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgIH1cblxuXG59O1xuXG5cbmlmKFR5cGUgPT0gJ21vYmlsZScpe1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufWVsc2V7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ3NlYXRpbmdDdHJsJywgc2VhdGluZ0NvbnRyb2xsZXIpO1xuIl19
