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
      api.submitBooking().then(function(data){
        console.log(data);
        alert(data.data)
        api.clearLocal();
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
  var outAircrafthasSmoking = false;
  var outAircrafthasWifi = false;
  var reAircrafthasSmoking = false;
  var reAircrafthasWifi = false;
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
  var outfacilitiesResult = [];
  if (outAircrafthasSmoking)
    outfacilitiesResult.push(facilities[0]);
  if (outAircrafthasWifi)
    outfacilitiesResult.push(facilities[1]);
  if (!booking.exitIsEconomy) {
    outfacilitiesResult.push(facilities[2]);
    outfacilitiesResult.push(facilities[3]);
    outfacilitiesResult.push(facilities[4]);
  }
  outfacilitiesResult.push(facilities[5]);
  if (returnFlight) {
    var refacilitiesResult = [];
    if (reAircrafthasSmoking)
      refacilitiesResult.push(facilities[0]);
    if (reAircrafthasWifi)
      refacilitiesResult.push(facilities[1]);
    if (!booking.reEntryIsEconomy) {
      refacilitiesResult.push(facilities[2]);
      refacilitiesResult.push(facilities[3]);
      refacilitiesResult.push(facilities[4]);
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
      "refPassengerID": null,
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

        var departureDate = new Date(flights.outgoingFlights[i].departureUTC);
        flights.outgoingFlights[i].departureUTC = departureDate.toUTCString();

        var arrivalDate = new Date(flights.outgoingFlights[i].arrivalUTC);
        flights.outgoingFlights[i].arrivalUTC = arrivalDate.toUTCString();

        var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
        var minutes = flights.outgoingFlights[i].duration % 60;

        flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

      }

      // $scope.flights = flights.filter(checkConstraints);

      if ($scope.roundTrip) {

        for (i = 0; i < flights.returnFlights.length; i++) {

          var departureDate = new Date(flights.returnFlights[i].departureUTC);
          flights.returnFlights[i].departureUTC = departureDate.toUTCString();

          var arrivalDate = new Date(flights.returnFlights[i].arrivalUTC);
          flights.returnFlights[i].arrivalUTC = arrivalDate.toUTCString();

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

    $scope.flights = [{
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
      "number": "1002",
      "departureUTC": "2016-05-10T12:00:00Z",
      "arrivalUTC": "2016-05-10T14:00:00Z",
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
      "number": "1003",
      "departureUTC": "2016-05-10T17:00:00Z",
      "arrivalUTC": "2016-05-10T19:00:00Z",
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
    }];

    $scope.origin = "CAI";
    $scope.destination = "JED";
    $scope.exitDate = "2016-05-10T01:00:00Z";

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


var flightNewController = function($scope, $location,$routeParams,api) {
    $scope.pageClass = 'page-flights';
    $scope.title = "Choose a Flight";
    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.isCollapsed = false;
    $scope.isOutgoingFlightSelected = false;


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
    $scope.roundTrip = false;
    if ($routeParams.returnDate) {
        var returnDate = new Date($routeParams.returnDate * 1000);
        $scope.roundTrip = true;
    }
    var flights;
    var returnDateMill;
    if (returnDate)
        returnDateMill = returnDate.getTime();
    console.log(exitDate.toISOString())
    api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
        console.log(response)
        $scope.flights = response.data;
    }, function myError(response) {
        console.log(response.statusText);
    })
}


if(Type == 'mobile'){
  flightNewController.$inject = ['$scope', '$location', 'api'];
}else{
  flightNewController.$inject = ['$scope', '$location','$routeParams', 'api'];
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

if(Type == 'desktop'){
  if(!api.getChosenOutGoingFlight() || !api.getBooking()){
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




  $scope.passenger = {
        type: null,
        countryCode: null,
        nationality:null,
        sex: null,
        birthDate: null,
        birthPlace: null,
        nationalID: null,
        authority: null,
        issueDate: null,
        expiryDate: null,
        points: null,
        membership: null,
       firstName :null,
        middleName: null,
        lastName:null,
        passportNumber: null,
        phoneNumber:null,
        email: null

       };
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
      nationality:$scope.nationality,
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
      firstName : $scope.firstName,
      middleName: $scope.middleName,
      lastName: $scope.lastName,
      passportNumber: $scope.passportNumber,
      phoneNumber: $scope.phoneNumber,
      email: $scope.email1


       };
    ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");



  if(complete == false){
        if(($scope.firstName ==null)||($scope.middleName ==null)||($scope.lastName ==null)||($scope.phoneNumber ==null)||($scope.passportNumber ==null))
        {
          alert("Please fill in data");

        }
        else{
          if($scope.email1!=$scope.emailver)
          alert("The repeated email doesnt match the first email");
          else {
            if(($scope.check==null))
            alert("Please check the box");
            else{
            complete = true;
          }
          }

        }


    }
      if(complete==true){
        api.setPassenger($scope.passenger);
          $location.path('/seating/outgoing');
        }

      }
  $scope.goBack = function() {
      $location.path('/exit-flight');
    }
}


});

// @mirna
App.controller('paymentCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
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
  var seatingController = function($scope, $location,$routeParams,api) {
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


};


if(Type == 'mobile'){
  seatingController.$inject = ['$scope', '$location', 'api'];
}else{
  seatingController.$inject = ['$scope', '$location','$routeParams', 'api'];
}


App.controller('seatingCtrl', seatingController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gICAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIHBhc3NlbmdlckRhdGEsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvYWlycG9ydHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMFwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiLzBcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzRWNvOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvZWNvbm9teVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215XCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzQnVzaTogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2J1c2luZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2J1c2luZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEgPSBwYXNzZW5nZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRPdXRnb2luZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0T3V0Z29pbmdDbGFzcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0UmV0dXJuaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEJvb2tpbmc6IGZ1bmN0aW9uKGJvb2tpbmcpIHtcblxuICAgICAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KVxuICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcblxuXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFBhc3NlbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzc2VuZ2VyRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9va2luZ0RhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3Nlbk91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5PdXRnb2luZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5SZXR1cm5pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0Z29pbmdTZWF0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJldHVyblNlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJldHVyblNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0cnVuU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyTG9jYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEgPSB7fVxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0ge31cbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHt9XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0ge31cbiAgICAgICAgfSxcbiAgICAgICAgc3VibWl0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvYm9va2luZycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYXNzZW5nZXI6IHBhc3NlbmdlckRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGJvb2tpbmdEYXRhLFxuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU2VhdE51bWJlcjogcmV0dXJuU2VhdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiLy8gQGFiZGVscmhtYW4tZXNzYW1cbkFwcC5jb250cm9sbGVyKCdjb25maXJtYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtY29uZmlybWF0aW9uJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDb25maXJtIHlvdXIgZmxpZ2h0XCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIkNvbmZpcm0/XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgYWxlcnQoZGF0YS5kYXRhKVxuICAgICAgICBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgfSxmdW5jdGlvbihlcnIpe1xuXG4gICAgICB9KVxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgfVxuXG4gICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUuZ29Tb2NpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3NvY2lhbCcpO1xuXG4gICAgfVxuICAgICRzY29wZS5mbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSBhcGkuZ2V0UGFzc2VuZ2VyKCk7XG4gICAgJCgnI3F1b3Rlcy10ZXh0JykudHlwZUl0KHtcbiAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgJ1wiVHJhdmVsIGFuZCBjaGFuZ2Ugb2YgcGxhY2UgaW1wYXJ0IG5ldyB2aWdvciB0byB0aGUgbWluZC5cIi1TZW5lY2EnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyB0ZW5kcyB0byBtYWduaWZ5IGFsbCBodW1hbiBlbW90aW9ucy7igJ0g4oCUIFBldGVyIEhvZWcnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyDigJMgaXQgbGVhdmVzIHlvdSBzcGVlY2hsZXNzLCB0aGVuIHR1cm5zIHlvdSBpbnRvIGEgc3Rvcnl0ZWxsZXIu4oCdIC0gSWJuIEJhdHR1dGEnLFxuICAgICAgICAnIOKAnFdlIHRyYXZlbCwgc29tZSBvZiB1cyBmb3JldmVyLCB0byBzZWVrIG90aGVyIHBsYWNlcywgb3RoZXIgbGl2ZXMsIG90aGVyIHNvdWxzLuKAnSDigJMgQW5haXMgTmluJ1xuICAgICAgXSxcbiAgICAgIHNwZWVkOiA4MCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG4gIH1cblxuLy9cbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuT3V0Z29pbmdGbGlnaHRcIik7XG4vLyAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpO1xuLy8gY29uc29sZS5sb2coXCJwYXNzZW5nZXJcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRQYXNzZW5nZXIoKSlcbi8vIGNvbnNvbGUubG9nKFwiYm9va2luZ1wiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKSlcbi8vIGNvbnNvbGUubG9nKFwiZ29pbmdTZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0T3V0Z29pbmdTZWF0KCkpXG4vLyBjb25zb2xlLmxvZyhcInJldHJ1blNlYXRcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRSZXR1cm5TZWF0KCkpXG5cblxufSk7XG4iLCIvLyBATmFiaWxhXG5BcHAuY29udHJvbGxlcignZmxpZ2h0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkZsaWdodChzKSBEZXRhaWxzXCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuXG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgdmFyIG91dGdvaW5nRmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG4gIHZhciByZXR1cm5GbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCk7XG5cbiAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuXG4gIHZhciBmYWNpbGl0aWVzID0gW1wiU21va2luZyBhcmVhcyBhdmFpbGFibGVcIiwgXCJXaS1GaSBhdmFpbGFiaWxpdHlcIixcbiAgICBcIjQgY3VsdHVyYWwgY3Vpc2luZXNcIiwgXCJJbmZsaWdodCBlbnRlcnRhaW5tZW50XCIsIFwiRXh0cmEgY296eSBzbGVlcGVyZXR0ZVwiLFxuICAgIFwiU2NyZWVucyB0byBzaG93IHlvdXIgZmxpZ2h0IHBhdHRlcm4sIGFpcmNyYWZ0IGFsdGl0dWRlIGFuZCBzcGVlZFwiXG4gIF07XG5pZiAob3V0Z29pbmdGbGlnaHQpe1xuICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuXG5cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIGFycml2YWxEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmFycml2YWxVVEMpO1xuICAgIHJldHVybkZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICB2YXIgYWlyY3JhZnRzID0gW107XG4gIHZhciBvdXRBaXJjcmFmdGhhc1Ntb2tpbmcgPSBmYWxzZTtcbiAgdmFyIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGZhbHNlO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBmYWxzZTtcbiAgdmFyIHJlQWlyY3JhZnRoYXNXaWZpID0gZmFsc2U7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5cbiAgaWYgKGJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuZWNvbm9teUZhcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgIH1cbiAgfVxuICB2YXIgb3V0ZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICBpZiAob3V0QWlyY3JhZnRoYXNTbW9raW5nKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzV2lmaSlcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbiAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gICAgfVxuICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuXG4gICAgJHNjb3BlLnJldHVybkZsaWdodCA9IHJldHVybkZsaWdodDtcbiAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLnJlZmFyZSA9IHJlZmFyZTtcbiAgICAkc2NvcGUucmVmYWNpbGl0aWVzUmVzdWx0ID0gcmVmYWNpbGl0aWVzUmVzdWx0O1xuICB9XG4gICRzY29wZS5vdXRnb2luZ0ZsaWdodCA9IG91dGdvaW5nRmxpZ2h0O1xuICAkc2NvcGUub3V0YnVzaW5lc3NPckVjb24gPSBvdXRidXNpbmVzc09yRWNvbjtcbiAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAkc2NvcGUub3V0ZmFjaWxpdGllc1Jlc3VsdCA9IG91dGZhY2lsaXRpZXNSZXN1bHQ7XG5cbn1cbn0pO1xuIiwiLy8gQGFiZGVscmFobWFuLW1hZ2VkXG52YXIgZmxpZ2h0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsIGFwaSkge1xuXG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgICBcInJlZlBhc3NlbmdlcklEXCI6IG51bGwsXG4gICAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICAgIFwicmVmRXhpdEZsaWdodElEXCI6IG51bGwsXG4gICAgICBcInJlZlJlRW50cnlGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgXCJyZWNlaXB0TnVtYmVyXCI6IG51bGxcbiAgICB9O1xuXG4gICAgaWYgKCFvcmlnaW4gfHwgIWRlc3RpbmF0aW9uIHx8ICFleGl0RGF0ZSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgZmxpZ2h0cztcbiAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG5cbiAgICBhcGkuZ2V0RmxpZ2h0cyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICBmbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgLy8gZm9ybWF0dGluZyBkYXRhIHRvIGJlIHByZXNlbnRhYmxlXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmRlcGFydHVyZVVUQyk7XG4gICAgICAgIGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcblxuICAgICAgICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5hcnJpdmFsVVRDKTtcbiAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG5cbiAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAvIDYwKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgIGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uID0gaG91cnMgKyBcImggXCIgKyBtaW51dGVzICsgXCJtXCI7XG5cbiAgICAgIH1cblxuICAgICAgLy8gJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzLmZpbHRlcihjaGVja0NvbnN0cmFpbnRzKTtcblxuICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kZXBhcnR1cmVVVEMpO1xuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG5cbiAgICAgICAgICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uYXJyaXZhbFVUQyk7XG4gICAgICAgICAgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuXG4gICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHM7XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRUYWlsTnVtYmVyKVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuZXhpdElzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgJHNjb3BlLmZsaWdodHMgPSBbe1xuICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDAzOjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJudW1iZXJcIjogXCIxMDAxXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDY6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDA4OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJudW1iZXJcIjogXCIxMDAyXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTI6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE0OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJudW1iZXJcIjogXCIxMDAzXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTc6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE5OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfV07XG5cbiAgICAkc2NvcGUub3JpZ2luID0gXCJDQUlcIjtcbiAgICAkc2NvcGUuZGVzdGluYXRpb24gPSBcIkpFRFwiO1xuICAgICRzY29wZS5leGl0RGF0ZSA9IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIjtcblxuICB9XG5cbiAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZU91dDtcbiAgfTtcblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59IGVsc2Uge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgJ2FwaSddO1xufVxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c0N0cmwnLCBmbGlnaHRDb250cm9sbGVyKTtcbiIsIlxudmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwkcm91dGVQYXJhbXMsYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodHMnO1xuICAgICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcblxuXG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuXG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgdXNlciBoYXMgc2VsZWN0ZWQgYSBmbGlnaHRcbiAgICAgICAgLy8gYW5kIHRoZW4gY2FsbCBhcGkuc2V0RmxpZ2h0KGNob3NlbkZsaWdodClcbiAgICAgICAgLy9pZiB0aGUgdXNlciBoYXNuJ3Qgc2VsZWN0ZWQgYSBmbGlnaHQgcmV0dXJuIHByZXZlbnQgaGltIGZyb20gcHJvY2VlZGluZ1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gICAgfVxuICAgIHZhciBmbGlnaHRzO1xuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcbiAgICBjb25zb2xlLmxvZyhleGl0RGF0ZS50b0lTT1N0cmluZygpKVxuICAgIGFwaS5nZXRPdGhlckZsaWdodHNFY28ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pXG59XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCckcm91dGVQYXJhbXMnLCAnYXBpJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCJBcHAuY29udHJvbGxlcignbWFpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG5cblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcblxuICAgICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICAgICAgc3RyaW5nczogW1xuICAgICAgICAgICAgICBcIlNpbXBsZSwgY29udmVuaWVudCwgaW5zdGFudCBjb25maXJtYXRpb24uXCIsIFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLCBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLCBcIlRpbWUgdG8gZ2V0IGVuY2hhbnRlZC5cIlxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgICAgICBsb29wOiB0cnVlXG4gICAgICB9KTtcbiAgICAgICRzY29wZS5mbGlnaHQgPSB7XG4gICAgICAgICAgdHlwZTogXCJvbmVcIlxuICAgICAgfVxuICAgICAgJHNjb3BlLm90aGVyQWlybGluZSA9IHtcbiAgICAgIHZhbHVlOmZhbHNlXG4gICAgICB9XG4gICAgICAkc2NvcGUuZ29Ub0ZsaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKS5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdCkuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKVxuICAgICAgICAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgIH07XG4gICAgICAkbG9jYXRpb24udXJsKCRsb2NhdGlvbi5wYXRoKCkpO1xuICAgICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAgICRzY29wZS5jaGlsZHJlbiA9IFsnMCBjaGlsZHJlbicsICcxIGNoaWxkJywgJzIgY2hpbGRyZW4nLCAnMyBjaGlsZHJlbicsICc0IGNoaWxkcmVuJ107XG4gICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gJHNjb3BlLmNoaWxkcmVuWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSB0ZXh0O1xuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLmFkdWx0cyA9IFsnMSBhZHVsdCcsICcyIGFkdWx0cycsICczIGFkdWx0cycsICc0IGFkdWx0cyddO1xuICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9ICRzY29wZS5hZHVsdHNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5pbmZhbnRzID0gWycwIGluZmFudHMnLCAnMSBpbmZhbnQnXTtcbiAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gJHNjb3BlLmluZmFudHNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlSW5mYW50ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5haXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICAgICRzY29wZS5zZWxlY3RlZERlc3QgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGZ1bmN0aW9uIGFpcnBvcnNDb250YWlucyhpYXRhKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGlhdGEgPT0gJHNjb3BlLmFpcnBvcnRzW2ldWydpYXRhJ10pXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuYnV0dG9uU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gISRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhJHNjb3BlLnNlbGVjdGVkRGVzdCB8fCAhJHNjb3BlLmV4aXREYXRlIHx8ICRzY29wZS5zZWxlY3RlZERlc3QgPT0gJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkT3JpZ2luKSB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZERlc3QpO1xuICAgICAgfVxuICAgIH1lbHNle1xuXG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFVwRGF0ZSgkc2NvcGUpIHtcbiAgICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnRvZGF5KCk7XG5cbiAgICAkc2NvcGUub3BlbjIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnBvcHVwMi5vcGVuZWQgPSB0cnVlO1xuICAgIH07XG4gICAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnBvcHVwLm9wZW5lZCA9IHRydWU7XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgICAgIHJldHVybiBtb2RlID09PSAnZGF5JyAmJiAoZGF0ZS5nZXREYXkoKSA9PT0gMCB8fCBkYXRlLmdldERheSgpID09PSA2KTtcbiAgICB9XG4gICAgJHNjb3BlLmRhdGVPcHRpb25zID0ge1xuICAgICAgICBmb3JtYXRZZWFyOiAneXknLFxuICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgyMDIwLCA1LCAyMiksXG4gICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIHN0YXJ0aW5nRGF5OiAxXG4gICAgfTtcbiAgICAkc2NvcGUucG9wdXAyID0ge1xuICAgICAgICBvcGVuZWQ6IGZhbHNlXG4gICAgfTtcbiAgICAkc2NvcGUucG9wdXAgPSB7XG4gICAgICAgIG9wZW5lZDogZmFsc2VcbiAgICB9O1xufVxuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbmlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAkc2NvcGUuY2hhbmdlVGl0bGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSB0ZXh0O1xuICB9XG5cbiAgYXBpLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuXG5cblxuICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxpdHk6bnVsbCxcbiAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICAgZmlyc3ROYW1lIDpudWxsLFxuICAgICAgICBtaWRkbGVOYW1lOiBudWxsLFxuICAgICAgICBsYXN0TmFtZTpudWxsLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogbnVsbCxcbiAgICAgICAgcGhvbmVOdW1iZXI6bnVsbCxcbiAgICAgICAgZW1haWw6IG51bGxcblxuICAgICAgIH07XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTm93IHlvdSBoYXZlICRzY29wZS5uYXRpb25hbGl0eSBhbmQgJHNjb3BlLnRpdGxlc0J0blRleHQgeW91IGNhbiB1c2UgdGhlbSBpbiB5b3VyIG9iamVjdFxuICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gIC8qaWYoIWFwaS5nZXRDaG9zZW5GbGlnaHQoKSlcbiAge1xuICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgYWxlcnQoXCJZb3UgaGF2ZSB0byBjaG9vc2UgYSBmbGlnaHRcIik7XG4gIH0qL1xuICAvL1RoZSByZXZlcnRpbmcgdG8gdGhlIGZsaWdodHMgcGFnZVxuXG4gICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgbmF0aW9uYWxpdHk6JHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgc2V4OiBudWxsLFxuICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgIHRpdGxlOiAkc2NvcGUudGl0bGVzQnRuVGV4dCxcbiAgICAgIGZpcnN0TmFtZSA6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZSxcbiAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlcixcbiAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxXG5cblxuICAgICAgIH07XG4gICAgLy8vYmVmb3JlIHlvdSBsZWF2ZSB0aGUgcGFnZSBtYWtlIHN1cmUgdGhhdCB0aGUgcGFzc2VuZ2VyIG9iamVjdCBpcyBjb21wbGV0ZSBvdGhlcndpc2Ugc2hvdyBhbGVydChcIkZpbGwgaW4gYWxsIGRhdGFcIik7XG5cblxuXG4gIGlmKGNvbXBsZXRlID09IGZhbHNlKXtcbiAgICAgICAgaWYoKCRzY29wZS5maXJzdE5hbWUgPT1udWxsKXx8KCRzY29wZS5taWRkbGVOYW1lID09bnVsbCl8fCgkc2NvcGUubGFzdE5hbWUgPT1udWxsKXx8KCRzY29wZS5waG9uZU51bWJlciA9PW51bGwpfHwoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09bnVsbCkpXG4gICAgICAgIHtcbiAgICAgICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGluIGRhdGFcIik7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGlmKCRzY29wZS5lbWFpbDEhPSRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICBhbGVydChcIlRoZSByZXBlYXRlZCBlbWFpbCBkb2VzbnQgbWF0Y2ggdGhlIGZpcnN0IGVtYWlsXCIpO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoKCRzY29wZS5jaGVjaz09bnVsbCkpXG4gICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjaGVjayB0aGUgYm94XCIpO1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgfVxuICAgICAgaWYoY29tcGxldGU9PXRydWUpe1xuICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cbn1cblxuXG59KTtcbiIsIi8vIEBtaXJuYVxuQXBwLmNvbnRyb2xsZXIoJ3BheW1lbnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIHlvdXIgcGF5bWVudCBvcHRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiUGF5IVwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpO1xuICB9XG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcnKTtcbiAgfVxuXG4gIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcblxuICAgICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpe1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgIGlmKGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgZWxzZVxuICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgIGlmKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSl7XG5cbiAgICAgICAgICBpZihhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cblxuICAgICAgICB9XG5cblxuICAgICAgJHNjb3BlLnByaWNlID0gcHJpY2U7XG4gICAgICAkc2NvcGUueWVhcnMgPSBbJzIwMTYnLCcyMDE3JywnMjAxOCcsJzIwMTknLCcyMDIwJywnMjAyMScsJzIwMjInLCcyMDIzJywnMjAyNCddO1xuICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICRzY29wZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLm1vbnRocyA9IFsnSmFudWFyeScsJ0ZlYnVyYXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5JywnQXVndXN0JywnU2VwdGVtYmVyJywnT2N0b2JlcicsJ05vdmVtYmVyJywnRGVjZW1iZXInXTtcbiAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gJHNjb3BlLm1vbnRoc1swXTtcbiAgICAgICRzY29wZS5jaGFuZ2VNb250aCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSB0ZXh0O1xuICAgICAgfSAgICBcbiAgfVxuXG59KTtcbiIsIi8vIEBhaG1lZC1lc3NtYXRcbiAgdmFyIHNlYXRpbmdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sJHJvdXRlUGFyYW1zLGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1zZWF0aW5nJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIldoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIHNpdD9cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvcmV0dXJpbmcnKTtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXBpLnNldFJldHJ1blNlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIH1cblxuXG5cbiAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VhdG1hcDtcblxuICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcblxuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH1cblxuXG5cbiAgICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICAgIHZhciBzY2hlbWEgPSBbMywgNSwgMywgMjBdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc2VhcmNoQ29sb3IgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgaWYgKCEkc2NvcGUuaXNFbXB0eSh0ZXh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0T2N1JztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdEVtcHR5JztcbiAgICAgIH1cbiAgICAgICRzY29wZS5pc0VtcHR5ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhdG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoc2VhdG1hcFtpXVsnbnVtYmVyJ10gPT0gdGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXRtYXBbaV1bJ2lzRW1wdHknXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnNlbGVjdFNlYXQgPSBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgJHNjb3BlLnNlYXQgPSBzZWF0O1xuICAgICAgfTtcbiAgICB9XG5cblxufTtcblxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywgJ2FwaSddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdzZWF0aW5nQ3RybCcsIHNlYXRpbmdDb250cm9sbGVyKTtcbiJdfQ==
