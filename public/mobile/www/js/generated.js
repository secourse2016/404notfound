App.config(function($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});

App.factory('api', function($http) {
  var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
  var chosenOutgoingFlight, chosenReturningFlight, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat, refNum;
  var isOtherHosts; // set to false in flightsctrl ,set to true flightsNewCtrl
  var stripeToken;
  var passengerData = [];
  return {
    getAirports: function() {
      return $http({
        method: 'GET',
        url: 'http://localhost:8080/api/airports',
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
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0/1",
          headers: {
            'x-access-token': accessToken,
            'other-hosts': 'false'

          }
        })
      else
        return $http({
          method: 'GET',
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0/1",
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
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy/1",
          headers: {
            'x-access-token': accessToken,
            'website': 'AirBerlin',
            'other-hosts': 'true'
          }
        })
      else
        return $http({
          method: 'GET',
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy/1",
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
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business/1",
          headers: {
            'x-access-token': accessToken,
            'website': 'AirBerlin',
            'other-hosts': 'true'
          }
        })
      else
        return $http({
          method: 'GET',
          url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business/1",
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
      passengerData.push(passenger);
      if (isOtherHosts)
        bookingData.PassengerDetails = passengerData
    },
    getCabinetOutgoingClass: function() {
      return cabinetOutgoingClass;
    },
    getCabinetReturningClass: function() {
      return cabinetReturningClass;
    },
    setBooking: function(booking) {
      if (!isOtherHosts) {

        if (!booking.exitIsEconomy)
          cabinetOutgoingClass = "Business"
        else
          cabinetOutgoingClass = "Economy"

        if (!booking.reEntryIsEconomy)
          cabinetReturningClass = "Business"

        else
          cabinetReturningClass = "Economy"
      } else {
        if (!booking.class)
          cabinetOutgoingClass = "Business"
        else
          cabinetOutgoingClass = "Economy"

        if (!booking.class)
          cabinetReturningClass = "Business"

        else
          cabinetReturningClass = "Economy"
      }



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
    setIsOtherHosts: function(otherHosts) {
      isOtherHosts = otherHosts;
    },
    IsOtherHosts: function() {
      return isOtherHosts;
    },
    clearLocal: function() {
      chosenReturningFlight = {}
      chosenOutgoingFlight = {}
      passengerData = []
      bookingData = {}
      cabinetOutgoingClass = {}
      cabinetReturningClass = {}
      outgoingSeat = {}
      returnSeat = {}
      isisOtherHosts = false

    },
    submitBooking: function(otherHosts) {
      var price = 0;
      if (this.getCabinetOutgoingClass() == 'Economy')
        price = this.getChosenOutGoingFlight().economyFare
      else
        price = this.getChosenOutGoingFlight().businessFare

      if (this.getChosenReturningFlight())
        if (this.getCabinetReturningClass() == 'Economy')
          price = price + this.getChosenReturningFlight().economyFare
        else
          price = price + this.getChosenReturningFlight().businessFare

      if (!otherHosts) {
        return $http({
          method: 'POST',
          url: '/booking',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': accessToken,
            'other-hosts': otherHosts
          },
          data: $.param({
            passenger: passengerData,
            booking: bookingData,
            price: price,
            outgoingSeatNumber: outgoingSeat,
            returnSeatNumber: returnSeat,
            token: stripeToken
          })
        });
      } else {
        return $http({
          method: 'POST',
          url: '/booking', // has to be changed !!
          headers: {
            'x-access-token': accessToken,
            'other-hosts': otherHosts
          },
          data: bookingData
        });
      }

    },
    getStripeToken: function() {
      return stripeToken;
    },
    setStripeToken: function(token) {
      stripeToken = token;
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
      // api.submitBooking('false').then(function(data){
      //   console.log(data);
      //   alert(data.data)
      //   api.clearLocal();
      // },function(err){
      //
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
  api.setIsOtherHosts(false);
  if (Type == 'desktop') {

    $scope.isCollapsed = true;
    $scope.isOutgoingFlightSelected = false;

    $scope.goNext = function() {
      api.setOutGoingFlight($scope.selectedOutgoingFlight);
      api.setReturningFlight($scope.selectedReturningFlight);
      $scope.selectedBooking.refExitFlightID = $scope.selectedOutgoingFlight._id
      if($scope.selectedReturningFlight)
      $scope.selectedBooking.refReEntryFlightID = $scope.selectedReturningFlight._id
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

var flightNewController = function($scope, $location, api,$routeParams) {
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
    $location.path('/passenger-details');
  }

  $scope.goBack = function() {
    $location.path('/');
  }

  $scope.selectedBooking = {
    "passengerDetails": [{
      "firstName": null,
      "lastName": null,
      "passportNum": null,
      "passportExpiryDate": null,
      "dateOfBirth": null,
      "nationality": null,
      "email": null,
    }],
    "class": null,
    "outgoingFlightId": null,
    "returnFlightId": null,
    "paymentToken": null
  }

  var origin = $routeParams.origin;
  var destination = $routeParams.destination;
  var exitDate = new Date($routeParams.exitDate * 1000);

  // TODO: var isEconomy = $routeParams.class === "economy"? true : false;
  var isEconomy = true;

  $scope.roundTrip = false;

  if ($routeParams.returnDate) {
    var returnDate = new Date($routeParams.returnDate * 1000);
    $scope.roundTrip = true;
  }

  var returnDateMill;

  if (returnDate)
    returnDateMill = returnDate.getTime();

  if (isEconomy) {
    api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
      console.log(response.data)
    }, function myError(response) {
      console.log(response.statusText);
    });
  } else {
    api.getOtherFlightsBusi(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
    }, function myError(response) {
      console.log(response.statusText);
    });
  }

  $scope.selectOutgoingFlight = function(flight) {
    $scope.isOutgoingFlightSelected = true;
    $scope.selectedOutgoingFlight = flight;
    $scope.selectedBooking.class = isEconomy === true ? "economy" : "business";
    $scope.selectedBooking.outgoingFlightId = flight._id;
  }

  $scope.selectReturningFlight = function(flight) {
    $scope.isReturningFlightSelected = true;
    $scope.selectedReturningFlight = flight;
    $scope.selectedBooking.returnFlightId = flight._id;
  }

  $scope.checkNextBtnState = function() {
    if ($scope.roundTrip)
      return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
    else
      return $scope.isOutgoingFlightSelected;
  }

}


if (Type == 'mobile') {
  flightNewController.$inject = ['$scope', '$location', 'api'];
} else {
  flightNewController.$inject = ['$scope', '$location', 'api','$routeParams',];
}


App.controller('flightsNewCtrl', flightNewController);

App.controller('mainCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-main';

  $scope.go = function() {
    console.log($scope.selectedOrigin);
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
    return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitDate|| $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin) || !airporsContains($scope.selectedDest);
  }

  $scope.flight = {
    type: "one"
  }
  $scope.otherAirline = {
    value: false
  }



  $scope.goToFlights = function() {
    var exitDate, returnDate;
    console.log($scope.selectedOrigin)
      // if(Type == 'desktop'){
    exitDate = ($scope.exitDate.getTime() / 1000).toFixed(0);
    returnDate = ($scope.returnDate.getTime() / 1000).toFixed(0);
    // }else{
    //   exitDate = ((new Date($scope.exitDate).getTime())/1000).toFixed(0);
    //   returnDate = ((new Date($scope.returnDate).getTime())/1000).toFixed(0);
    // }
    if ($scope.otherAirline.value) {
      if ($scope.flight.type == "one")
        $location.path('/flights-new')
        .search('origin', $scope.selectedOrigin)
        .search('destination', $scope.selectedDest)
        .search('exitDate', exitDate);
      else {
        $location.path('/flights-new')
          .search('origin', $scope.selectedOrigin)
          .search('destination', $scope.selectedDest)
          .search('exitDate', exitDate)
          .search('returnDate', returnDate);
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




  if (Type == 'desktop') {

    $('#main-text').typeIt({
      strings: [
        "Simple, convenient, instant confirmation.", "Destinations all around the globe.", "Experience authentic hospitality.", "Time to get enchanted."
      ],
      speed: 120,
      breakLines: false,
      loop: true
    });



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


    var complete = false;
    $scope.goNext = function() {



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
        if (!api.isOtherHosts)
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
App.controller('paymentCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Submit";
  $scope.buttonTextBk = "Back";

  $scope.form = {
    number: null,
    cvc: null,
    exp_month: null,
    exp_year: null
  };
  $scope.goNext = function() {
    var r = confirm("Are you sure you want pay?");
    if (r == true) {
    $scope.form.exp_year = $scope.yearsBtnText
    $scope.form.exp_month = parseInt($scope.months.indexOf($scope.monthsBtnText)) + 1
    Stripe.card.createToken($scope.form, function(status, response) {
      api.setStripeToken(response.id)
      api.submitBooking(api.IsOtherHosts()).then(function(data) {
        console.log(data)
        $location.path('/confirmation');
        // api.clearLocal();
      }, function(err) {

      })
    });
    }

    // if (!api.IsOtherHosts())
  }
  $scope.goBack = function() {
    $location.path('/seating');
  }

  if (Type == 'desktop') {

    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
      $location.path('/flights');
      return;
    }
    if (!api.getPassenger()) {
      $location.path('/passenger-details');
      return;
    }
    var price = 0;
    if (api.getCabinetOutgoingClass() == 'Economy')
      price = api.getChosenOutGoingFlight().economyFare
    else
      price = api.getChosenOutGoingFlight().businessFare

    if (api.getChosenReturningFlight()) {

      if (api.getCabinetReturningClass() == 'Economy')
        price = price + api.getChosenReturningFlight().economyFare
      else
        price = price + api.getChosenReturningFlight().businessFare


    }


    $scope.price = price;
    $scope.years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    $scope.yearsBtnText = $scope.years[0];
    $scope.changeYear = function(text) {
      $scope.yearsBtnText = text;
    }

    $scope.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.monthsBtnText = $scope.months[0];
    $scope.changeMonth = function(text) {
      $scope.monthsBtnText = text;
      $scope.monthsBtnNo = $scope.months.indexOf(text);
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

/*! stripe-js 30-03-2016 */
(function(){var a,b,c,d,e,f,g,h,i,j={}.hasOwnProperty,k=function(a,b){function c(){this.constructor=a}for(var d in b)j.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};if(g="https://js.stripe.com",c="https://js.stripe.com",d=!!/stripe\.com$/.test("undefined"!=typeof window&&null!==window?window.location.host:void 0),b="console"in window&&"warn"in window.console,!d&&"querySelectorAll"in document&&b&&(f=document.querySelectorAll('script[src^="'+g+'"]'),f.length||console.warn("It looks like Stripe.js is not being loaded from https://js.stripe.com. Stripe does not support serving Stripe.js from your own domain.")),this.Stripe)return!b||this.Stripe.isDoubleLoaded||this.Stripe.earlyError||console.warn("It looks like Stripe.js was loaded more than one time. Please only load it once per page."),void(this.Stripe.isDoubleLoaded=!0);this.Stripe=function(){function a(){}return a.version=2,a.endpoint="https://api.stripe.com/v1",a.setPublishableKey=function(b){return a.key=b,a.utils.validateProtocol(a.key)},a._language="en-US",a.setLanguage=function(b){return a._language=b},a._allowedCustomHeaders=["X-Stripe-Livemode","Authorization"],a._customHeaders={},a._setCustomHeader=function(a,b){var c,d,e,f,g;for(d=!1,g=this._allowedCustomHeaders,e=0,f=g.length;f>e;e++)if(c=g[e],c===a){this._customHeaders[a]=b,d=!0;break}return d},a.trackPerf=!1,a._isChannel="#__stripe_transport__"===("undefined"!=typeof window&&null!==window?window.location.hash:void 0),a._isSafeStripeDomain=d,a._iframeOnAmount=1,a._isSafeDomain=function(){return"#__forcedss3__"===window.location.hash?!1:a._isSafeStripeDomain||window.StripeTemporaryNoDSS3?!0:a._iframeOnAmount<Math.random()}(),a._finalTransport="undefined"!=typeof window&&null!==window&&"XMLHttpRequest"in window&&"withCredentials"in new XMLHttpRequest?"cors":"jsonp",a._transport=a._isChannel||a._isSafeDomain?a._finalTransport:"iframe",a._fallBackToOldStripeJsTechniques=function(){return this._transport="jsonp",this._finalTransport="jsonp",this._isSafeDomain="true"},a._iframeRequestQueue=[],a._iframePendingRequests={},a._iframeChannelStatus="pending",a._iframeChannelComplete=function(b){var c,d,e,f;for(this._iframeChannelStatus=b?"success":"failure","failure"===this._iframeChannelStatus&&this._fallBackToOldStripeJsTechniques(),d=this._iframeRequestQueue,delete this._iframeRequestQueue,this._iframeRequestQueue=[],e=0,f=d.length;f>e;e++)c=d[e],this.request(c,!0);this._iframeChannelComplete=function(){return a.reportError("CompleteDuplicationError")}},a.request=function(a,b){return this.trackPerf&&a.tokenType?this._instrumentedRequest(a,b):this._rawRequest(a,b)},a._rawRequest=function(b,c){var d,e,f;if(e="POST"===b.method&&(null!=(f=b.data)?f.card:void 0),c||(b.data.payment_user_agent?this._isChannel||(b.data.payment_user_agent=""+b.data.payment_user_agent+" ("+a.stripejs_ua+")"):b.data.payment_user_agent=a.stripejs_ua),"iframe"===this._transport){if(e)return"pending"===this._iframeChannelStatus?this._iframeRequestQueue.push(b):"failure"===this._iframeChannelStatus?this.ajaxJSONP(b):this.iframe(b);if("cors"===this._finalTransport)try{return this.xhr(b)}catch(g){return d=g,this._transport="jsonp",this.request(b,!0)}return this.ajaxJSONP(b)}if("cors"===this._transport)try{return this.xhr(b)}catch(g){return d=g,a.reportError("XhrThrewError"),this._transport="jsonp",this.request(b,!0)}return this.ajaxJSONP(b)},a.reportError=function(b,c){var d;return"console"in window&&"warn"in window.console,1,d=Math.round((new Date).getTime()/1e3),(new Image).src="https://q.stripe.com?event=stripejs-error&type="+encodeURIComponent(b)+(c?"&timing="+c:"")+"&key="+a.key+"&timestamp="+d+"&payment_user_agent="+encodeURIComponent(a.stripejs_ua)},a._instrumentedRequest=function(b,c){var d,e;return d=(new Date).getTime(),e=function(c){return function(e,f){var g,h,i,j,k;return j=null!=(k=b.tokenType)?k:"unknown",g=(new Date).getTime(),h=c._getResourceTiming(null!=e?e.responseURL:void 0),i={event:"rum.stripejs",tokenType:j,url:b.url,status:f,start:d,end:g,resourceTiming:h},a.logRUM(i)}}(this),b.success=function(a){return function(b,c,d){return e(d,c),a.apply(this,arguments)}}(b.success),b.complete=function(a){return function(b,c,d){return"success"!==b&&e(c,b),a.apply(this,arguments)}}(b.complete),this._rawRequest(b,c)},a._getResourceTiming=function(a){var b;switch(b="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.getEntriesByName?performance.getEntriesByName(a):void 0,!1){case 1!==(null!=b?b.length:void 0):return this._sanitizeResourceTiming(b[0]);case 0!==(null!=b?b.length:void 0):return{errorMsg:"No resource timing entries found"};case null==(null!=b?b.length:void 0):return{errorMsg:"More than one resource timing entry"};default:return null}},a._resourceTimingWhitelist=["connectEnd","connectStart","domainLookupEnd","domainLookupStart","duration","fetchStart","redirectEnd","redirectStart","requestStart","responseEnd","responseStart","secureConnectionStart","startTime"],a._sanitizeResourceTiming=function(a){var b,c,d,e,f;for(c={},f=this._resourceTimingWhitelist,d=0,e=f.length;e>d;d++)b=f[d],a[b]&&(c[b]=a[b]);return c},a.logRUM=function(b){return(new Image).src="https://q.stripe.com/?"+a.utils.serialize(b)},a.complete=function(b,c){return function(d,e,f){return"success"!==d?(a.reportError("Complete500-"+d),"function"==typeof b?b(500,{error:{code:d,type:d,message:c}}):void 0):void 0}},a._iframeBaseUrl=c,a._stripejsBaseUrl=g,a._relayResponse=function(b,c,d){return a._socket.postMessage(a.JSON.stringify({code:c,resp:d,requestId:b}))},a._callCount=0,a._callCache={},a._receiveChannelRelay=function(b,c){var d,e,f,g;if(f=a._iframeBaseUrl.replace(/^https?:\/\//,"").replace(/\/.*$/,""),g=c.replace(/^https?:\/\//,"").replace(/\/.*$/,""),g===f&&"string"==typeof b){try{e=a.JSON.parse(b)}catch(h){throw d=h,a.reportError("InvalidJSON-ChannelRelay"),new Error("Stripe.js received invalid JSON")}if("function"==typeof a._callCache[e.requestId])return a._callCache[e.requestId](e.resp,e.code),delete a._callCache[e.requestId]}},a._channelListener=function(b,c){var d,e,f,g;if("string"==typeof b){try{g=a.JSON.parse(b)}catch(h){throw e=h,a.reportError("InvalidJSON-ChannelListener"),new Error("Stripe.js received invalid JSON")}if(d=g.data.card,delete g.data.card,f=g.headers["Accept-Language"],d)return a.setPublishableKey(g.data.key),f&&a.setLanguage(f),null!=g.endpoint&&(a.endpoint=g.endpoint),null!=g.trackPerf&&(a.trackPerf=g.trackPerf),a.card.createToken(d,g.data,function(b,c){return a._relayResponse(g.requestId,b,c)});throw a.reportError("InvalidChannelUse-NonCard"),new Error("Stripe.js iframe transport used for non-card request")}},a}(),this.Stripe.token=function(){function a(){}return a.validate=function(a,b){if(!a)throw b+" required";if("object"!=typeof a)throw b+" invalid"},a.formatData=function(a,b){var c,d,e;Stripe.utils.isElement(a)&&(a=Stripe.utils.paramsFromForm(a,b));for(c in a)d=a[c],null==d&&delete a[c];return Stripe.utils.underscoreKeys(a),"string"==typeof a.exp&&(e=Stripe.utils.parseExpString(a.exp),a.exp_month=e[0],a.exp_year=e[1],delete a.exp),a},a.create=function(a,b){var c,d;return a.key||(a.key=Stripe.key||Stripe.publishableKey),Stripe.utils.validateKey(a.key),d=function(){switch(!1){case null==a.card:return"card";case null==a.bank_account:return"bank_account";case null==a.pii:return"pii";default:return"unknown"}}(),c={url:""+Stripe.endpoint+"/tokens",data:a,method:"POST",headers:{},success:function(a,c){return"function"==typeof b?b(c,a):void 0},complete:Stripe.complete(b,"A network error has occurred, and you have not been charged. Please try again."),timeout:4e4,tokenType:d},Stripe._language&&(c.headers["Accept-Language"]=Stripe._language),Stripe.request(c)},a.get=function(a,b){if(!a)throw new Error("token required");return Stripe.utils.validateKey(Stripe.key),Stripe.request({url:""+Stripe.endpoint+"/tokens/"+a,data:{key:Stripe.key},success:function(a,c){return"function"==typeof b?b(c,a):void 0},complete:Stripe.complete(b,"A network error has occurred loading data from Stripe. Please try again."),timeout:4e4})},a}(),this.Stripe.card=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return k(b,a),b.tokenName="card",b.whitelistedAttrs=["number","cvc","exp","exp_month","exp_year","name","address_line1","address_line2","address_city","address_state","address_zip","address_country","currency"],b.createToken=function(a,c,d){var e;return null==c&&(c={}),Stripe.token.validate(a,"card"),"function"==typeof c?(d=c,c={}):"object"!=typeof c&&(e=parseInt(c,10),c={},e>0&&(c.amount=e)),c[b.tokenName]=Stripe.token.formatData(a,b.whitelistedAttrs),Stripe.token.create(c,d)},b.getToken=function(a,b){return Stripe.token.get(a,b)},b.validateCardNumber=function(a){return a=(a+"").replace(/\s+|-/g,""),a.length>=10&&a.length<=16&&b.luhnCheck(a)},b.validateCVC=function(a){return a=Stripe.utils.trim(a),/^\d+$/.test(a)&&a.length>=3&&a.length<=4},b.validateExpiry=function(a,b){var c,d,e,f;if(null!=b)e=Stripe.utils.trim(a),b=Stripe.utils.trim(b);else{try{f=Stripe.utils.parseExpString(a),e=f[0],b=f[1]}catch(g){return!1}e+="",b+=""}return/^\d+$/.test(e)&&/^\d+$/.test(b)&&e>=1&&12>=e?(2===b.length&&(b=70>b?"20"+b:"19"+b),4!==b.length?!1:(d=new Date(b,e),c=new Date,d.setMonth(d.getMonth()-1),d.setMonth(d.getMonth()+1,1),d>c)):!1},b.luhnCheck=function(a){var b,c,d,e,f,g;for(d=!0,e=0,c=(a+"").split("").reverse(),f=0,g=c.length;g>f;f++)b=c[f],b=parseInt(b,10),(d=!d)&&(b*=2),b>9&&(b-=9),e+=b;return e%10===0},b.cardType=function(a){return b.cardTypes[a.slice(0,2)]||"Unknown"},b.cardBrand=function(a){return b.cardType(a)},b.cardTypes=function(){var a,b,c,d;for(b={},a=c=40;49>=c;a=++c)b[a]="Visa";for(a=d=50;59>=d;a=++d)b[a]="MasterCard";return b[34]=b[37]="American Express",b[60]=b[62]=b[64]=b[65]="Discover",b[35]="JCB",b[30]=b[36]=b[38]=b[39]="Diners Club",b}(),b}(this.Stripe.token),this.Stripe.bankAccount=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return k(b,a),b.tokenName="bank_account",b.whitelistedAttrs=["country","currency","routing_number","account_number","name","account_holder_type","account_holder_name"],b.createToken=function(a,c,d){return null==c&&(c={}),Stripe.token.validate(a,"bank account"),"function"==typeof c&&(d=c,c={}),c[b.tokenName]=Stripe.token.formatData(a,b.whitelistedAttrs),Stripe.token.create(c,d)},b.getToken=function(a,b){return Stripe.token.get(a,b)},b.validateRoutingNumber=function(a,c){switch(a=Stripe.utils.trim(a),c){case"US":return/^\d+$/.test(a)&&9===a.length&&b.routingChecksum(a);case"CA":return/\d{5}\-\d{3}/.test(a)&&9===a.length;default:return!0}},b.validateAccountNumber=function(a,b){switch(a=Stripe.utils.trim(a),b){case"US":return/^\d+$/.test(a)&&a.length>=1&&a.length<=17;default:return!0}},b.routingChecksum=function(a){var b,c,d,e,f,g;for(d=0,b=(a+"").split(""),g=[0,3,6],e=0,f=g.length;f>e;e++)c=g[e],d+=3*parseInt(b[c]),d+=7*parseInt(b[c+1]),d+=parseInt(b[c+2]);return 0!==d&&d%10===0},b}(this.Stripe.token),this.Stripe.piiData=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return k(b,a),b.tokenName="pii",b.whitelistedAttrs=["personal_id_number"],b.createToken=function(a,c,d){return null==c&&(c={}),Stripe.token.validate(a,"pii data"),"function"==typeof c&&(d=c,c={}),c[b.tokenName]=Stripe.token.formatData(a,b.whitelistedAttrs),Stripe.token.create(c,d)},b.getToken=function(a,b){return Stripe.token.get(a,b)},b}(this.Stripe.token),this.Stripe._poller=function(){function a(){}return a._activePolls={},a._clearPoll=function(b){return delete a._activePolls[b]},a._defaultPollInterval=1500,a._maxPollInterval=24e3,a._initPoll=function(b){if(null!=a._activePolls[b])throw new Error("You are already polling "+b+". Please cancel that poll before polling it again.");return a._activePolls[b]={}},a._poll=function(b,c,d,e,f){c(b,function(g,h){var i;if(null!=a._activePolls[b])return g>=400&&500>g?(a._clearPoll(b),"function"==typeof f?f(g,h):void 0):200===g&&e(b,h)?(a._clearPoll(b),"function"==typeof f?f(g,h):void 0):(200===g&&d(b,h)&&"function"==typeof f&&f(g,h),500===g&&2*a._activePolls[b].interval<=a._maxPollInterval?a._activePolls[b].interval*=2:g>=200&&500>g&&(a._activePolls[b].interval=a._defaultPollInterval),i=setTimeout(function(){return a._poll(b,c,d,e,f)},a._activePolls[b].interval),a._activePolls[b].timeoutId=i)})},a._cancelPoll=function(b){var c;if(c=a._activePolls[b],null==c)throw new Error("You are not polling "+b+".");null!=c.timeoutId&&clearTimeout(c.timeoutId),a._clearPoll(b)},a}(),this.Stripe.bitcoinReceiver=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return k(b,a),b._whitelistedAttrs=["amount","currency","email","description"],b.createReceiver=function(a,b){var c;return Stripe.token.validate(a,"bitcoin_receiver data"),c=Stripe.token.formatData(a,this._whitelistedAttrs),c.key=Stripe.key||Stripe.publishableKey,Stripe.utils.validateKey(c.key),Stripe.request({url:""+Stripe.endpoint+"/bitcoin/receivers",data:c,method:"POST",success:function(a,c){return"function"==typeof b?b(c,a):void 0},complete:Stripe.complete(b,"A network error has occurred while creating a Bitcoin address. Please try again."),timeout:4e4})},b.getReceiver=function(a,b){var c;if(!a)throw new Error("receiver id required");return c=Stripe.key||Stripe.publishableKey,Stripe.utils.validateKey(c),Stripe.request({url:""+Stripe.endpoint+"/bitcoin/receivers/"+a,data:{key:c},success:function(a,c){return"function"==typeof b?b(c,a):void 0},complete:Stripe.complete(b,"A network error has occurred loading data from Stripe. Please try again."),timeout:4e4})},b.pollReceiver=function(a,b){return this._initPoll(a),this._poll(a,function(a){return function(b,c){return a.getReceiver(b,c)}}(this),function(a,b){return!1},function(a,b){return b.filled},b)},b.cancelReceiverPoll=function(a){return b._cancelPoll(a)},b}(this.Stripe._poller),this.Stripe.source=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return k(b,a),b.get=function(a,b,c){var d,e;if(!a)throw new Error("sourceId required");if(!b)throw new Error("clientSecret required");return d=Stripe.key||Stripe.publishableKey,Stripe.utils.validateKey(d),e={},e.key=d,e.client_secret=b,Stripe.request({url:""+Stripe.endpoint+"/sources/"+a,data:e,success:function(a,b){return"function"==typeof c?c(b,a):void 0},complete:Stripe.complete(c,"A network error has occurred loading data from Stripe. Please try again."),timeout:4e4})},b.poll=function(a,b,c){return this._initPoll(a),this._poll(a,function(a){return function(c,d){return a.get(c,b,d)}}(this),function(a){return function(b,c){return a._activePolls[b].source_status!==c.status?(a._activePolls[b].source_status=c.status,!0):!1}}(this),function(a,b){return!1},c)},b.cancelPoll=function(a){return this._cancelPoll(a)},b}(this.Stripe._poller),a=["createToken","getToken","cardType","validateExpiry","validateCVC","validateCardNumber"];for(h=0,i=a.length;i>h;h++)e=a[h],this.Stripe[e]=this.Stripe.card[e];this.Stripe.stripejs_ua="stripe.js/127787e","undefined"!=typeof module&&null!==module&&(module.exports=this.Stripe),"function"==typeof define&&define("stripe",[],function(a){return function(){return a.Stripe}}(this))}).call(this),function(){this.Stripe.isDoubleLoaded||function(a){function b(a,e){function f(a){if(f[a]!==q)return f[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=f("json-stringify")&&f("json-parse");else{var c,d='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var i=e.stringify,k="function"==typeof i&&t;if(k){(c=function(){return 1}).toJSON=c;try{k="0"===i(0)&&"0"===i(new g)&&'""'==i(new h)&&i(s)===q&&i(q)===q&&i()===q&&"1"===i(c)&&"[1]"==i([c])&&"[null]"==i([q])&&"null"==i(null)&&"[null,null,null]"==i([q,s,null])&&i({a:[c,!0,!1,null,"\x00\b\n\f\r	"]})==d&&"1"===i(null,c)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new j(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new j(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new j(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new j(-1))}catch(l){k=!1}}b=k}if("json-parse"==a){var m=e.parse;if("function"==typeof m)try{if(0===m("0")&&!m(!1)){c=m(d);var n=5==c.a.length&&1===c.a[0];if(n){try{n=!m('"	"')}catch(l){}if(n)try{n=1!==m("01")}catch(l){}if(n)try{n=1!==m("1.")}catch(l){}}}}catch(l){n=!1}b=n}}return f[a]=!!b}a||(a=d.Object()),e||(e=d.Object());var g=a.Number||d.Number,h=a.String||d.String,i=a.Object||d.Object,j=a.Date||d.Date,k=a.SyntaxError||d.SyntaxError,l=a.TypeError||d.TypeError,m=a.Math||d.Math,n=a.JSON||d.JSON;"object"==typeof n&&n&&(e.stringify=n.stringify,e.parse=n.parse);var o,p,q,r=i.prototype,s=r.toString,t=new j(-0xc782b5b800cec);try{t=-109252==t.getUTCFullYear()&&0===t.getUTCMonth()&&1===t.getUTCDate()&&10==t.getUTCHours()&&37==t.getUTCMinutes()&&6==t.getUTCSeconds()&&708==t.getUTCMilliseconds()}catch(u){}if(!f("json")){var v="[object Function]",w="[object Date]",x="[object Number]",y="[object String]",z="[object Array]",A="[object Boolean]",B=f("bug-string-char-index");if(!t)var C=m.floor,D=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,b){return D[b]+365*(a-1970)+C((a-1969+(b=+(b>1)))/4)-C((a-1901+b)/100)+C((a-1601+b)/400)};if((o=r.hasOwnProperty)||(o=function(a){var b,c={};return(c.__proto__=null,c.__proto__={toString:1},c).toString!=s?o=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(b=c.constructor,o=function(a){var c=(this.constructor||b).prototype;return a in this&&!(a in c&&this[a]===c[a])}),c=null,o.call(this,a)}),p=function(a,b){var d,e,f,g=0;(d=function(){this.valueOf=0}).prototype.valueOf=0,e=new d;for(f in e)o.call(e,f)&&g++;return d=e=null,g?p=2==g?function(a,b){var c,d={},e=s.call(a)==v;for(c in a)e&&"prototype"==c||o.call(d,c)||!(d[c]=1)||!o.call(a,c)||b(c)}:function(a,b){var c,d,e=s.call(a)==v;for(c in a)e&&"prototype"==c||!o.call(a,c)||(d="constructor"===c)||b(c);(d||o.call(a,c="constructor"))&&b(c)}:(e=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],p=function(a,b){var d,f,g=s.call(a)==v,h=!g&&"function"!=typeof a.constructor&&c[typeof a.hasOwnProperty]&&a.hasOwnProperty||o;for(d in a)g&&"prototype"==d||!h.call(a,d)||b(d);for(f=e.length;d=e[--f];h.call(a,d)&&b(d));}),p(a,b)},!f("json-stringify")){var F={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},G="000000",H=function(a,b){return(G+(b||0)).slice(-a)},I="\\u00",J=function(a){for(var b='"',c=0,d=a.length,e=!B||d>10,f=e&&(B?a.split(""):a);d>c;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=F[g];break;default:if(32>g){b+=I+H(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},K=function(a,b,c,d,e,f,g){var h,i,j,k,m,n,r,t,u,v,B,D,F,G,I,L;try{h=b[a]}catch(M){}if("object"==typeof h&&h)if(i=s.call(h),i!=w||o.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=x&&i!=y&&i!=z||o.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&1/0>h){if(E){for(m=C(h/864e5),j=C(m/365.2425)+1970-1;E(j+1,0)<=m;j++);for(k=C((m-E(j,0))/30.42);E(j,k+1)<=m;k++);m=1+m-E(j,k),n=(h%864e5+864e5)%864e5,r=C(n/36e5)%24,t=C(n/6e4)%60,u=C(n/1e3)%60,v=n%1e3}else j=h.getUTCFullYear(),k=h.getUTCMonth(),m=h.getUTCDate(),r=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),v=h.getUTCMilliseconds();h=(0>=j||j>=1e4?(0>j?"-":"+")+H(6,0>j?-j:j):H(4,j))+"-"+H(2,k+1)+"-"+H(2,m)+"T"+H(2,r)+":"+H(2,t)+":"+H(2,u)+"."+H(3,v)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=s.call(h),i==A)return""+h;if(i==x)return h>-1/0&&1/0>h?""+h:"null";if(i==y)return J(""+h);if("object"==typeof h){for(G=g.length;G--;)if(g[G]===h)throw l();if(g.push(h),B=[],I=f,f+=e,i==z){for(F=0,G=h.length;G>F;F++)D=K(F,h,c,d,e,f,g),B.push(D===q?"null":D);L=B.length?e?"[\n"+f+B.join(",\n"+f)+"\n"+I+"]":"["+B.join(",")+"]":"[]"}else p(d||h,function(a){var b=K(a,h,c,d,e,f,g);b!==q&&B.push(J(a)+":"+(e?" ":"")+b)}),L=B.length?e?"{\n"+f+B.join(",\n"+f)+"\n"+I+"}":"{"+B.join(",")+"}":"{}";return g.pop(),L}};e.stringify=function(a,b,d){var e,f,g,h;if(c[typeof b]&&b)if((h=s.call(b))==v)f=b;else if(h==z){g={};for(var i,j=0,k=b.length;k>j;i=b[j++],h=s.call(i),(h==y||h==x)&&(g[i]=1));}if(d)if((h=s.call(d))==x){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==y&&(e=d.length<=10?d:d.slice(0,10));return K("",(i={},i[""]=a,i),f,g,e,"",[])}}if(!f("json-parse")){var L,M,N=h.fromCharCode,O={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"},P=function(){throw L=M=null,k()},Q=function(){for(var a,b,c,d,e,f=M,g=f.length;g>L;)switch(e=f.charCodeAt(L)){case 9:case 10:case 13:case 32:L++;break;case 123:case 125:case 91:case 93:case 58:case 44:return a=B?f.charAt(L):f[L],L++,a;case 34:for(a="@",L++;g>L;)if(e=f.charCodeAt(L),32>e)P();else if(92==e)switch(e=f.charCodeAt(++L)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:a+=O[e],L++;break;case 117:for(b=++L,c=L+4;c>L;L++)e=f.charCodeAt(L),e>=48&&57>=e||e>=97&&102>=e||e>=65&&70>=e||P();a+=N("0x"+f.slice(b,L));break;default:P()}else{if(34==e)break;for(e=f.charCodeAt(L),b=L;e>=32&&92!=e&&34!=e;)e=f.charCodeAt(++L);a+=f.slice(b,L)}if(34==f.charCodeAt(L))return L++,a;P();default:if(b=L,45==e&&(d=!0,e=f.charCodeAt(++L)),e>=48&&57>=e){for(48==e&&(e=f.charCodeAt(L+1),e>=48&&57>=e)&&P(),d=!1;g>L&&(e=f.charCodeAt(L),e>=48&&57>=e);L++);if(46==f.charCodeAt(L)){for(c=++L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}if(e=f.charCodeAt(L),101==e||69==e){for(e=f.charCodeAt(++L),43!=e&&45!=e||L++,c=L;g>c&&(e=f.charCodeAt(c),e>=48&&57>=e);c++);c==L&&P(),L=c}return+f.slice(b,L)}if(d&&P(),"true"==f.slice(L,L+4))return L+=4,!0;if("false"==f.slice(L,L+5))return L+=5,!1;if("null"==f.slice(L,L+4))return L+=4,null;P()}return"$"},R=function(a){var b,c;if("$"==a&&P(),"string"==typeof a){if("@"==(B?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=Q(),"]"!=a;c||(c=!0))c&&(","==a?(a=Q(),"]"==a&&P()):P()),","==a&&P(),b.push(R(a));return b}if("{"==a){for(b={};a=Q(),"}"!=a;c||(c=!0))c&&(","==a?(a=Q(),"}"==a&&P()):P()),","!=a&&"string"==typeof a&&"@"==(B?a.charAt(0):a[0])&&":"==Q()||P(),b[a.slice(1)]=R(Q());return b}P()}return a},S=function(a,b,c){var d=T(a,b,c);d===q?delete a[b]:a[b]=d},T=function(a,b,c){var d,e=a[b];if("object"==typeof e&&e)if(s.call(e)==z)for(d=e.length;d--;)S(e,d,c);else p(e,function(a){S(e,a,c)});return c.call(a,b,e)};e.parse=function(a,b){var c,d;return L=0,M=""+a,c=R(Q()),"$"!=Q()&&P(),L=M=null,b&&s.call(b)==v?T((d={},d[""]=c,d),"",b):c}}}return e.runInContext=b,e}var c={"function":!0,object:!0},d=this,e=b(a,d);d.JSON={parse:e.parse,stringify:e.stringify}}.call(Stripe,this)}.call(this),function(){this.Stripe.isDoubleLoaded||!function(a,b,c,d,e,f){function g(a,b){var c=typeof a[b];return"function"==c||!("object"!=c||!a[b])||"unknown"==c}function h(){var a="Shockwave Flash",b="application/x-shockwave-flash";if(!p(navigator.plugins)&&"object"==typeof navigator.plugins[a]){var c=navigator.plugins[a].description;c&&!p(navigator.mimeTypes)&&navigator.mimeTypes[b]&&navigator.mimeTypes[b].enabledPlugin&&(x=c.match(/\d+/g))}if(!x){var d;try{d=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),x=Array.prototype.slice.call(d.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/),1),d=null}catch(e){}}if(!x)return!1;var f=parseInt(x[0],10),g=parseInt(x[1],10);return y=f>9&&g>0,!0}function i(){if(!L){L=!0;for(var a=0;a<M.length;a++)M[a]();M.length=0}}function j(a,b){return L?void a.call(b):void M.push(function(){a.call(b)})}function k(a){return a.match(D)[3]}function l(a){return a.match(D)[4]||""}function m(a){var b,c,d=a.toLowerCase().match(D),e="",f="";try{b=d[2],c=d[3],e=d[4]||"",("http:"==b&&":80"==e||"https:"==b&&":443"==e)&&(e=""),f=b+"//"+c+e}catch(g){f=a}return f}function n(a){if(a=a.replace(F,"$1/"),!a.match(/^(http||https):\/\//)){var b="/"===a.substring(0,1)?"":c.pathname;"/"!==b.substring(b.length-1)&&(b=b.substring(0,b.lastIndexOf("/")+1)),a=c.protocol+"//"+c.host+b+a}for(;E.test(a);)a=a.replace(E,"");return a}function o(a,b){var c="",d=a.indexOf("#");-1!==d&&(c=a.substring(d),a=a.substring(0,d));var e,g=[];for(var h in b)b.hasOwnProperty(h)&&(e="stripe_"+h,g.push(e+"="+f(b[h])));return a+(J?"#":-1==a.indexOf("?")?"?":"&")+g.join("&")+c}function p(a){return"undefined"==typeof a}function q(a,b,c){var d;for(var e in b)b.hasOwnProperty(e)&&(e in a?(d=b[e],"object"==typeof d?q(a[e],d,c):c||(a[e]=b[e])):a[e]=b[e]);return a}function r(){var a=b.body.appendChild(b.createElement("form")),c=a.appendChild(b.createElement("input"));c.name=I+"TEST"+C,w=c!==a.elements[c.name],b.body.removeChild(a)}function s(c){p(w)&&r();var e;w?e=b.createElement('<iframe name="'+c.props.name+'"/>'):(e=b.createElement("IFRAME"),e.name=c.props.name),e.id=e.name=c.props.name,delete c.props.name,"string"==typeof c.container&&(c.container=b.getElementById(c.container)),c.container||(q(e.style,{position:"absolute",top:"-2000px",left:"0px"}),c.container=b.body);var f=c.props.src;c.props.src="about:blank",q(e,c.props),e.border=e.frameBorder=0,e.allowTransparency=!0;var g=!1;return c.onFrameAck&&"postMessage"in a&&a.addEventListener?a.addEventListener("message",function(a){var b=Stripe._iframeBaseUrl.replace(/^https?:\/\//,"").replace(/\/.*$/,""),d=a.origin.replace(/^https?:\/\//,"").replace(/\/.*$/,"");b===d&&"stripe:ack"===a.data&&c.onFrameAck(!0)},!1):g=!0,c.container.appendChild(e),c.onLoad&&z(e,"load",function(){c.onLoad.apply(c,arguments),g&&c.onFrameAck(!1)}),c.onError&&z(e,"error",function(){c.onError.apply(c,arguments)}),e.src=f,c.onAsyncInject&&d(function(){c.onAsyncInject.call(c,e)},5e3),c.props.src=f,e}function t(c){var d,e=c.protocol;if(c.isHost=c.isHost||p(O.xdm_p),J=c.hash||!1,c.props||(c.props={}),c.isHost){if(c.remote=n(c.remote),c.channel=c.channel||"default"+C++,c.secret=Math.random().toString(16).substring(2),p(e))if(g(a,"postMessage")||g(b,"postMessage"))e="1";else{if(!(c.swf&&g(a,"ActiveXObject")&&h()))throw new Error("No suitable transport protocol for Stripe.js");e="6"}}else c.channel=O.xdm_c.replace(/["'<>\\]/g,""),c.secret=O.xdm_s,c.remote=O.xdm_e.replace(/["'<>\\]/g,""),e=O.xdm_p;switch(c.protocol=e,e){case"1":d=[new H.stack.PostMessageTransport(c)];break;case"6":x||h(),d=[new H.stack.FlashTransport(c)]}return d?(d.push(new H.stack.QueueBehavior({lazy:c.lazy,remove:!0})),d):void c.onInternalError.call(c,"BadXDMProtocol")}function u(a){for(var b,c={incoming:function(a,b){this.up.incoming(a,b)},outgoing:function(a,b){this.down.outgoing(a,b)},callback:function(a){this.up.callback(a)},init:function(){this.down.init()},destroy:function(){this.down.destroy()}},d=0,e=a.length;e>d;d++)b=a[d],q(b,c,!0),0!==d&&(b.down=a[d-1]),d!==e-1&&(b.up=a[d+1]);return b}function v(a){a.up.down=a.down,a.down.up=a.up,a.up=a.down=null}var w,x,y,z,A,B=this,C=Math.floor(1e6*Math.random()),D=(Function.prototype,/^((http:|https:|file:|chrome\-extension:|chrome:)\/\/([^:\/\s]+)(:\d+)*)/),E=/[\-\w]+\/\.\.\//,F=/([^:])\/\//g,G="Stripe",H={},I="stripeXDM_",J=!1;if(g(a,"addEventListener"))z=function(a,b,c){a.addEventListener(b,c,!1)},A=function(a,b,c){a.removeEventListener(b,c,!1)};else{if(!g(a,"attachEvent"))throw new Error("Browser not supported");z=function(a,b,c){a.attachEvent("on"+b,c)},A=function(a,b,c){a.detachEvent("on"+b,c)}}var K,L=!1,M=[];if("readyState"in b?(K=b.readyState,L="complete"==K||~navigator.userAgent.indexOf("AppleWebKit/")&&("loaded"==K||"interactive"==K)):L=!!b.body,!L){if(g(a,"addEventListener"))z(b,"DOMContentLoaded",i);else if(z(b,"readystatechange",function(){"complete"==b.readyState&&i()}),b.documentElement.doScroll&&a===top){var N=function(){if(!L){try{b.documentElement.doScroll("left")}catch(a){return void d(N,1)}i()}};N()}z(a,"load",i)}var O=function(a){a=a.substring(1).split("&");for(var b,c={},d=a.length;d--;)b=a[d].split("="),c[b[0].replace(/^stripe_/,"")]=e(b[1]);return c}(/stripe_xdm_e=/.test(c.search)?c.search:c.hash),P=function(){return Stripe.JSON};q(H,{version:"2.4.19.3",query:O,stack:{},apply:q,getJSONObject:P,whenReady:j}),H.DomHelper={on:z,un:A},function(){var a={};H.Fn={set:function(b,c){a[b]=c},get:function(b,c){if(a.hasOwnProperty(b)){var d=a[b];return c&&delete a[b],d}}}}(),H.Socket=function(a){var b=u(t(a).concat([{incoming:function(b,c){a.onMessage(b,c)},callback:function(b){a.onReady&&a.onReady(b)}}])),c=m(a.remote);this.origin=m(a.remote),this.destroy=function(){b.destroy()},this.postMessage=function(a){b.outgoing(a,c)},b.init()},H.stack.FlashTransport=function(a){function e(a,b){d(function(){h.up.incoming(a,p)},0)}function g(c){var d=a.swf+"?host="+a.isHost,e="easyXDM_swf_"+Math.floor(1e4*Math.random());H.Fn.set("flash_loaded"+c.replace(/[\-.]/g,"_"),function(){H.stack.FlashTransport[c].swf=r=t.firstChild;for(var a=H.stack.FlashTransport[c].queue,b=0;b<a.length;b++)a[b]();a.length=0}),a.swfContainer?t="string"==typeof a.swfContainer?b.getElementById(a.swfContainer):a.swfContainer:(t=b.createElement("div"),q(t.style,y&&a.swfNoThrottle?{height:"20px",width:"20px",position:"fixed",right:0,top:0}:{height:"1px",width:"1px",position:"absolute",overflow:"hidden",right:0,top:0}),b.body.appendChild(t));var g="callback=flash_loaded"+f(c.replace(/[\-.]/g,"_"))+"&proto="+B.location.protocol+"&domain="+f(k(B.location.href))+"&port="+f(l(B.location.href))+"&ns="+f(G);t.innerHTML="<object height='20' width='20' type='application/x-shockwave-flash' id='"+e+"' data='"+d+"'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='"+d+"'></param><param name='flashvars' value='"+g+"'></param><embed type='application/x-shockwave-flash' FlashVars='"+g+"' allowScriptAccess='always' wmode='transparent' src='"+d+"' height='1' width='1'></embed></object>"}var h,i,p,r,t;return h={outgoing:function(b,c,d){r.postMessage(a.channel,b.toString()),d&&d()},destroy:function(){try{r.destroyChannel(a.channel)}catch(b){}r=null,i&&(i.parentNode.removeChild(i),i=null)},onDOMReady:function(){p=a.remote,H.Fn.set("flash_"+a.channel+"_init",function(){d(function(){h.up.callback(!0)})}),H.Fn.set("flash_"+a.channel+"_onMessage",e),a.swf=n(a.swf);var b=k(a.swf),f=function(){H.stack.FlashTransport[b].init=!0,r=H.stack.FlashTransport[b].swf,r.createChannel(a.channel,a.secret,m(a.remote),a.isHost),a.isHost&&(y&&a.swfNoThrottle&&q(a.props,{position:"fixed",right:0,top:0,height:"20px",width:"20px"}),q(a.props,{src:o(a.remote,{xdm_e:m(c.href),xdm_c:a.channel,xdm_p:6,xdm_s:a.secret}),name:I+a.channel+"_provider"}),i=s(a))};H.stack.FlashTransport[b]&&H.stack.FlashTransport[b].init?f():H.stack.FlashTransport[b]?H.stack.FlashTransport[b].queue.push(f):(H.stack.FlashTransport[b]={queue:[f]},g(b))},init:function(){j(h.onDOMReady,h)}}},H.stack.PostMessageTransport=function(b){function e(a){if(a.origin)return m(a.origin);if(a.uri)return m(a.uri);if(a.domain)return c.protocol+"//"+a.domain;throw new Error("Unable to retrieve the origin of the event")}function f(a){var c=e(a);c==k&&"string"==typeof a.data&&a.data.substring(0,b.channel.length+1)==b.channel+" "&&g.up.incoming(a.data.substring(b.channel.length+1),c)}var g,h,i,k;return g={outgoing:function(a,c,d){try{i.postMessage(b.channel+" "+a,c||k),d&&d()}catch(e){b.onInternalError&&b.onInternalError.call(b,"CallerWindowError")}},destroy:function(){A(a,"message",f),h&&(i=null,h.parentNode.removeChild(h),h=null)},onDOMReady:function(){if(k=m(b.remote),b.isHost){var e=function(c){c.data==b.channel+"-ready"&&(i="postMessage"in h.contentWindow?h.contentWindow:h.contentWindow.document,A(a,"message",e),z(a,"message",f),d(function(){g.up.callback(!0)},0))};z(a,"message",e),q(b.props,{src:o(b.remote,{xdm_e:m(c.href),xdm_c:b.channel,xdm_p:1}),name:I+b.channel+"_provider"}),h=s(b)}else z(a,"message",f),i="postMessage"in a.parent?a.parent:a.parent.document,i.postMessage(b.channel+"-ready",k),d(function(){g.up.callback(!0)},0)},init:function(){j(g.onDOMReady,g)}}},H.stack.QueueBehavior=function(a){function b(){if(a.remove&&0===h.length)return void v(c);if(!i&&0!==h.length&&!g){
i=!0;var e=h.shift();c.down.outgoing(e.data,e.origin,function(a){i=!1,e.callback&&d(function(){e.callback(a)},0),b()})}}var c,g,h=[],i=!0,j="",k=0,l=!1,m=!1;return c={init:function(){p(a)&&(a={}),a.maxLength&&(k=a.maxLength,m=!0),a.lazy?l=!0:c.down.init()},callback:function(a){i=!1;var d=c.up;b(),d.callback(a)},incoming:function(b,d){if(m){var f=b.indexOf("_"),g=parseInt(b.substring(0,f),10);j+=b.substring(f+1),0===g&&(a.encode&&(j=e(j)),c.up.incoming(j,d),j="")}else c.up.incoming(b,d)},outgoing:function(d,e,g){a.encode&&(d=f(d));var i,j=[];if(m){for(;0!==d.length;)i=d.substring(0,k),d=d.substring(i.length),j.push(i);for(;i=j.shift();)h.push({data:j.length+"_"+i,origin:e,callback:0===j.length?g:null})}else h.push({data:d,origin:e,callback:g});l?c.down.init():b()},destroy:function(){g=!0,c.down.destroy()}}},Stripe.easyXDM=H}(window,document,location,window.setTimeout,decodeURIComponent,encodeURIComponent)}.call(this),function(){var a=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};this.Stripe.isDoubleLoaded||(this.Stripe.utils=function(){function b(){}var c;return c=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,b.trim=function(a){return null===a?"":(a+"").replace(c,"")},b.serialize=function(a,b,c){var d,e,f;null==b&&(b=[]);try{for(e in a)f=a[e],c&&(e=""+c+"["+e+"]"),"object"==typeof f?this.serialize(f,b,e):b.push(""+e+"="+encodeURIComponent(f));return b.join("&").replace(/%20/g,"+")}catch(g){throw d=g,new Error("Unable to serialize: "+a)}},b.underscore=function(a){return(a+"").replace(/([A-Z])/g,function(a){return"_"+a.toLowerCase()}).replace(/-/g,"_")},b.underscoreKeys=function(a){var b,c,d;d=[];for(b in a)c=a[b],delete a[b],d.push(a[this.underscore(b)]=c);return d},b.isElement=function(a){return"object"!=typeof a?!1:a.jquery?!0:1===a.nodeType},b.paramsFromForm=function(b,c){var d,e,f,g,h,i,j,k,l,m;for(null==c&&(c=[]),b.jquery&&(b=b[0]),f=b.getElementsByTagName("input"),h=b.getElementsByTagName("select"),i={},j=0,l=f.length;l>j;j++)e=f[j],d=this.underscore(e.getAttribute("data-stripe")),a.call(c,d)<0||(i[d]=e.value);for(k=0,m=h.length;m>k;k++)g=h[k],d=this.underscore(g.getAttribute("data-stripe")),a.call(c,d)<0||null!=g.selectedIndex&&(i[d]=g.options[g.selectedIndex].value);return i},b.validateProtocol=function(a){var b;if(a&&"string"==typeof a)return/_live_/g.test(a)&&"https:"!==window.location.protocol&&null!=(null!=(b=window.console)?b.warn:void 0)?window.console.warn("You are using Stripe.js in live mode over an insecure connection. This is considered unsafe. Please conduct live requests only on sites served over https. For more info, see https://stripe.com/help/ssl"):void 0},b.validateKey=function(a){if(!a||"string"!=typeof a)throw new Error("You did not set a valid publishable key. Call Stripe.setPublishableKey() with your publishable key. For more info, see https://stripe.com/docs/stripe.js");if(/\s/g.test(a))throw new Error("Your key is invalid, as it contains whitespace. For more info, see https://stripe.com/docs/stripe.js");if(/^sk_/.test(a))throw new Error("You are using a secret key with Stripe.js, instead of the publishable one. For more info, see https://stripe.com/docs/stripe.js")},b.parseExpString=function(a){var b,c,d,e,f,g,h,i,j;for(g=function(b){throw new Error("You passed an invalid expiration date `"+a+"`. "+(b||"")+"Please pass a string containing a numeric month and year such as `01-17` or `2015 / 05` For more info, see https://stripe.com/docs/stripe.js")},"string"!=typeof a&&g(),f=a.split(/[\.\-\/\s]+/g),2!==f.length&&g(),b=i=0,j=f.length;j>i;b=++i)e=f[b],d=parseInt(e),isNaN(d)&&g(""+f+" is not a number. "),1>d&&g(""+d+" is less than one. "),f[b]=d;return f[0]>12?(h=f[0],c=f[1]):(c=f[0],h=f[1]),c>12&&g("Month must be a number 1-12, not "+c),100>h&&(h+=2e3),[c,h]},b}())}.call(this),function(){var a,b=[].slice;a=(new Date).getTime(),this.Stripe.isDoubleLoaded||(this.Stripe.ajaxJSONP=function(c){var d,e,f,g,h,i,j;return null==c&&(c={}),f="sjsonp"+ ++a,i=document.createElement("script"),e=null,d=function(a){var b;return null==a&&(a="abort"),clearTimeout(e),null!=(b=i.parentNode)&&b.removeChild(i),f in window&&(window[f]=function(){}),"function"==typeof c.complete?c.complete(a,j,c):void 0},j={abort:d},i.onerror=function(){return j.abort(),"function"==typeof c.error?c.error(j,c):void 0},window[f]=function(){var a,d;a=1<=arguments.length?b.call(arguments,0):[],clearTimeout(e),i.parentNode.removeChild(i);try{delete window[f]}catch(g){d=g,window[f]=void 0}return"function"==typeof c.success&&c.success.apply(c,b.call(a).concat([j])),"function"==typeof c.complete?c.complete("success",j,c):void 0},h=(c.headers||{})["Accept-Language"],c.data||(c.data={}),c.data.callback=f,c.method&&(c.data._method=c.method),h&&(c.data._accept_language=h),i.src=c.url+"?"+Stripe.utils.serialize(c.data),g=document.getElementsByTagName("head")[0],g.appendChild(i),c.timeout>0&&(e=setTimeout(function(){return j.abort("timeout")},c.timeout)),j})}.call(this),function(){var a,b,c,d,e,f,g,h,i,j={}.hasOwnProperty;this.Stripe.isDoubleLoaded||(b={contentType:"application/x-www-form-urlencoded",accept:{json:"application/json"}},g=/^(20\d|1223)$/,f="invalid_json_response",d=function(a,b,c){return function(){return a._aborted?c(a.request,"abort"):a.request&&4===a.request.readyState?(a.request.onreadystatechange=function(){},0===a.request.status?c(a.request,"empty_response"):g.test(a.request.status)?b(a.request,a.request.status):b(a.request,a.request.status)):void 0}},h=function(a,c){var d,e,f,g,h;f=c.headers||{},f.Accept||(f.Accept=b.accept.json),f["Content-Type"]||(f["Content-Type"]=b.contentType),g=c._globalCustomHeaders;for(d in g)j.call(g,d)&&"setRequestHeader"in a&&a.setRequestHeader(d,c._globalCustomHeaders[d]);h=[];for(e in f)j.call(f,e)&&("setRequestHeader"in a?h.push(a.setRequestHeader(e,f[e])):h.push(void 0));return h},i=function(a,b){return/\?/.test(a)?a+"&"+b:a+"?"+b},c=function(a,b){var c,e,f,g,j,k,l,m,n;k=this.o,j=(k.method||"GET").toUpperCase(),l=k.url,g=null!=(m=k.data)?m.key:void 0,c=Stripe.utils.serialize(k.data),f=void 0,"GET"===j&&c&&(l=i(l,c),c=null),n=new XMLHttpRequest,n.open(j,l,!0),h(n,k),n.onreadystatechange=d(this,a,b);try{n.send(c)}catch(o){e=o,Stripe.reportError("XHR-"+e.toString()),b(n,"xhr_send_failure")}return n},a=function(a){return this.o=a,e.apply(this,arguments)},e=function(a){var b,d,e;return this.url=a.url,this.timeout=null,this._successHandler=function(){},this._errorHandlers=[],this._completeHandlers=[],a.timeout&&(this.timeout=setTimeout(function(a){return function(){return a.abort()}}(this),a.timeout)),a.success&&(this._successHandler=function(){return a.success.apply(a,arguments)}),a.error&&this._errorHandlers.push(function(){return a.error.apply(a,arguments)}),a.complete&&this._completeHandlers.push(function(){return a.complete.apply(a,arguments)}),b=function(b){return function(c,d){var e;for(a.timeout&&clearTimeout(b.timeout),b.timeout=null,e=[];b._completeHandlers.length>0;)e.push(b._completeHandlers.shift()(d,c,a));return e}}(this),e=function(a){return function(c,e){var g,h,i;if(i=c.responseText,!i||!i.length)return d(c,"empty_response");try{return h=Stripe.JSON.parse(i),a._successHandler(h,e,c),b(h,"success")}catch(j){return g=j,d(c,f)}}}(this),d=function(a){return function(b,c){var d,e,g;if(g=b.responseText,e=void 0,g&&g.length&&c!==f)try{e=Stripe.JSON.parse(g)}catch(h){d=h,c=c+"_AND_"+f}for(;a._errorHandlers.length>0;)a._errorHandlers.shift()(e||b,c);return Stripe.reportError(c),Stripe._fallBackToOldStripeJsTechniques(),Stripe.request(a.o,!0)}}(this),this.request=c.call(this,e,d)},a.prototype={abort:function(){var a;return this._aborted=!0,null!=(a=this.request)?a.abort():void 0}},this.Stripe.xhr=function(b){return b._globalCustomHeaders=this._customHeaders,new a(b)})}.call(this),function(){var a,b,c,d={}.hasOwnProperty;this.Stripe.isDoubleLoaded||(a=function(a){return this.options=a,a.requestId=Stripe._callCount,a.endpoint=Stripe.endpoint,a.trackPerf=Stripe.trackPerf,this.iframeTimeout=setTimeout(function(){return Stripe._fallBackToOldStripeJsTechniques(),Stripe._iframePendingRequests[a.requestId]&&(Stripe.request(Stripe._iframePendingRequests[a.requestId],!0),delete Stripe._iframePendingRequests[a.requestId]),Stripe._callCache[a.requestId]=function(){return Stripe.reportError("TimeoutEventualReturnError")}},1e4),Stripe._iframePendingRequests[a.requestId]=a,Stripe._callCache[a.requestId]=function(b){return function(){return clearTimeout(b.iframeTimeout),delete Stripe._iframePendingRequests[a.requestId],a.success.apply(a,arguments),"function"==typeof a.complete?a.complete("success",null,a):void 0}}(this),Stripe._callCount+=1,Stripe._socket.postMessage(Stripe.JSON.stringify(a))},this.Stripe.iframe=function(b){return new a(b)},b=Stripe.easyXDM,this.Stripe._isChannel?Stripe._socket=new b.Socket({swf:""+Stripe._iframeBaseUrl+"/v2/stripexdm.swf",onMessage:Stripe._channelListener}):Stripe._isSafeDomain||(c=function(a){var b,d,e;"console"in window&&"warn"in window.console,1,Stripe._iframeChannelComplete.call(Stripe,!1),Stripe._callCache={},Stripe.reportError("FB-"+a),d=document.createElement("script"),e=Math.round((new Date).getTime()/1e3),d.src=""+Stripe._iframeBaseUrl+"/v2/cspblocked.js?domain="+encodeURIComponent(document.location.href)+"&timestamp="+e+"&info="+encodeURIComponent(a)+"&payment_user_agent="+encodeURIComponent(Stripe.stripejs_ua),b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(d,b),c=function(){}},Stripe._socket=new b.Socket({swf:""+Stripe._iframeBaseUrl+"/v2/stripexdm.swf",remote:""+Stripe._iframeBaseUrl+"/v2/channel"+(Stripe.accountDetails?"-provisioning":"")+".html#__stripe_transport__",onMessage:Stripe._receiveChannelRelay,ackTimeoutDuration:1e4,onLoad:function(){return this._socketLoadTime=+new Date,this.onError=function(){},this.onAsyncInject=function(){},clearTimeout(this.injectTimeout),this._socketAckTime?this.loadTimeout?(clearTimeout(this.loadTimeout),Stripe._iframeChannelComplete.call(Stripe,!0)):Stripe.reportError("LoadDelayError",this._socketLoadTime-this._socketAckTime):this.ackTimeout=setTimeout(function(a){return function(){return a.onFrameAck=function(){},clearTimeout(a.loadTimeout),c("AckTimeoutError")}}(this),this.ackTimeoutDuration)},onError:function(){return this.onLoad=function(){},this.onAsyncInject=function(){},this.onFrameAck=function(){},clearTimeout(this.ackTimeout),clearTimeout(this.injectTimeout),clearTimeout(this.loadTimeout),c("IframeOnError")},onInternalError:function(a){var b,c,e;this.onError=function(){},this.onLoad=function(){},this.onFrameAck=function(){},this.onAsyncInject=function(){},clearTimeout(this.ackTimeout),clearTimeout(this.loadTimeout),clearTimeout(this.injectTimeout),Stripe.reportError("FB-XDM-"+a),Stripe._fallBackToOldStripeJsTechniques(),e=Stripe._iframePendingRequests;for(b in e)d.call(e,b)&&(c=e[b],Stripe._callCache[c.requestId]=function(){},delete Stripe._iframePendingRequests[c.requestId],Stripe.request(c,!0))},onAsyncInject:function(a){return this.injectTimeout=setTimeout(function(a){return function(){return a.onError=function(){},a.onLoad=function(){},a.onFrameAck=function(){},clearTimeout(a.ackTimeout),clearTimeout(a.loadTimeout),c("InjectTimeoutError")}}(this),this.ackTimeoutDuration)},onFrameAck:function(a){return this._socketAckTime=+new Date,clearTimeout(this.ackTimeout),clearTimeout(this.injectTimeout),this.onAsyncInject=function(){},this.onError=function(){},this.ackTimeout?Stripe._iframeChannelComplete.call(Stripe,!0):this._socketLoadTime?(this.onLoad=function(){},Stripe.reportError("AckDelayError",this._socketAckTime-this._socketLoadTime)):this.loadTimeout=setTimeout(function(a){return function(){return c("LoadTimeoutError"),a.onLoad=function(){}}}(this),this.ackTimeoutDuration)}})))}.call(this),function(){var a=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};this.Stripe.isDoubleLoaded||(this.Stripe.validator={"boolean":function(a,b){return"true"!==b&&"false"!==b?"Enter a boolean string (true or false)":void 0},integer:function(a,b){return/^\d+$/.test(b)?void 0:"Enter an integer"},positive:function(a,b){return!this.integer(a,b)&&parseInt(b,10)>0?void 0:"Enter a positive value"},range:function(b,c){var d;return d=parseInt(c,10),a.call(b,d)<0?"Needs to be between "+b[0]+" and "+b[b.length-1]:void 0},required:function(a,b){return!a||null!=b&&""!==b?void 0:"Required"},year:function(a,b){return/^\d{4}$/.test(b)?void 0:"Enter a 4-digit year"},birthYear:function(a,b){var c;return c=this.year(a,b),c?c:parseInt(b,10)>2e3?"You must be over 18":parseInt(b,10)<1900?"Enter your birth year":void 0},month:function(a,b){return this.integer(a,b)?"Please enter a month":this.range([1,2,3,4,5,6,7,8,9,10,11,12],b)?"Needs to be between 1 and 12":void 0},choices:function(b,c){return a.call(b,c)<0?"Not an acceptable value for this field":void 0},email:function(a,b){return/^[^@<\s>]+@[^@<\s>]+$/.test(b)?void 0:"That doesn't look like an email address"},url:function(a,b){return/^https?:\/\/.+\..+/.test(b)?void 0:"Not a valid url"},usTaxID:function(a,b){return/^\d{2}-?\d{1}-?\d{2}-?\d{4}$/.test(b)?void 0:"Not a valid tax ID"},ein:function(a,b){return/^\d{2}-?\d{7}$/.test(b)?void 0:"Not a valid EIN"},ssnLast4:function(a,b){return/^\d{4}$/.test(b)?void 0:"Not a valid last 4 digits for an SSN"},ownerPersonalID:function(a,b){var c;return c=function(){switch(a){case"CA":return/^\d{3}-?\d{3}-?\d{3}$/.test(b);case"US":return!0}}(),c?void 0:"Not a valid ID"},bizTaxID:function(a,b){var c,d,e,f,g,h,i,j;if(h={CA:["Tax ID",[/^\d{9}$/]],US:["EIN",[/^\d{2}-?\d{7}$/]]},g=h[a],null!=g){for(c=g[0],f=g[1],d=!1,i=0,j=f.length;j>i;i++)if(e=f[i],e.test(b)){d=!0;break}if(!d)return"Not a valid "+c}},zip:function(a,b){var c;return c=function(){switch(a.toUpperCase()){case"CA":return/^[\d\w]{6}$/.test(null!=b?b.replace(/\s+/g,""):void 0);case"US":return/^\d{5}$/.test(b)||/^\d{9}$/.test(b)}}(),c?void 0:"Not a valid zip"},bankAccountNumber:function(a,b){return/^\d{1,17}$/.test(b)?void 0:"Invalid bank account number"},usRoutingNumber:function(a){var b,c,d,e,f,g,h;if(!/^\d{9}$/.test(a))return"Routing number must have 9 digits";for(f=0,b=g=0,h=a.length-1;h>=g;b=g+=3)c=3*parseInt(a.charAt(b),10),d=7*parseInt(a.charAt(b+1),10),e=parseInt(a.charAt(b+2),10),f+=c+d+e;return 0===f||f%10!==0?"Invalid routing number":void 0},caRoutingNumber:function(a){return/^\d{5}\-\d{3}$/.test(a)?void 0:"Invalid transit number"},routingNumber:function(a,b){switch(a.toUpperCase()){case"CA":return this.caRoutingNumber(b);case"US":return this.usRoutingNumber(b)}},phoneNumber:function(a,b){var c;return c=b.replace(/[^0-9]/g,""),10!==c.length?"Invalid phone number":void 0},bizDBA:function(a,b){return/^.{1,23}$/.test(b)?void 0:"Statement descriptors can only have up to 23 characters"},nameLength:function(a,b){return 1===b.length?"Names need to be longer than one character":void 0}})}.call(this);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIiwic3RhdGljL3N0cmlwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uID0ge307XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0ID0ge307XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wdXQgPSB7fTtcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnBhdGNoID0ge307XG59KTtcblxuQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICB2YXIgY2hvc2VuT3V0Z29pbmdGbGlnaHQsIGNob3NlblJldHVybmluZ0ZsaWdodCwgYm9va2luZ0RhdGEsIGNhYmluZXRPdXRnb2luZ0NsYXNzLCBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MsIG91dGdvaW5nU2VhdCwgcmV0dXJuU2VhdCwgcmVmTnVtO1xuICB2YXIgaXNPdGhlckhvc3RzOyAvLyBzZXQgdG8gZmFsc2UgaW4gZmxpZ2h0c2N0cmwgLHNldCB0byB0cnVlIGZsaWdodHNOZXdDdHJsXG4gIHZhciBzdHJpcGVUb2tlbjtcbiAgdmFyIHBhc3NlbmdlckRhdGEgPSBbXTtcbiAgcmV0dXJuIHtcbiAgICBnZXRBaXJwb3J0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL2FpcnBvcnRzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIGdldEZsaWdodHM6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiLzAvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi8wLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgZ2V0T3RoZXJGbGlnaHRzRWNvOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGdldE90aGVyRmxpZ2h0c0J1c2k6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRBaXJjcmFmdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiAnL2FwaS9haXJjcmFmdHMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0Q291bnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJy9hcGkvY291bnRyaWVzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIHNldE91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgIH0sXG4gICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICB9LFxuICAgIHNldFBhc3NlbmdlcjogZnVuY3Rpb24ocGFzc2VuZ2VyKSB7XG4gICAgICBwYXNzZW5nZXJEYXRhLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgIGlmIChpc090aGVySG9zdHMpXG4gICAgICAgIGJvb2tpbmdEYXRhLlBhc3NlbmdlckRldGFpbHMgPSBwYXNzZW5nZXJEYXRhXG4gICAgfSxcbiAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgfSxcbiAgICBnZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNhYmluZXRSZXR1cm5pbmdDbGFzcztcbiAgICB9LFxuICAgIHNldEJvb2tpbmc6IGZ1bmN0aW9uKGJvb2tpbmcpIHtcbiAgICAgIGlmICghaXNPdGhlckhvc3RzKSB7XG5cbiAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgIH1cblxuXG5cbiAgICAgIGJvb2tpbmdEYXRhID0gYm9va2luZztcbiAgICB9LFxuXG4gICAgZ2V0UGFzc2VuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXNzZW5nZXJEYXRhO1xuICAgIH0sXG4gICAgZ2V0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYm9va2luZ0RhdGE7XG4gICAgfSxcbiAgICBnZXRDaG9zZW5PdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hvc2VuT3V0Z29pbmdGbGlnaHQ7XG4gICAgfSxcbiAgICBnZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNob3NlblJldHVybmluZ0ZsaWdodDtcbiAgICB9LFxuICAgIGdldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb3V0Z29pbmdTZWF0O1xuICAgIH0sXG5cbiAgICBnZXRSZXR1cm5TZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXR1cm5TZWF0O1xuICAgIH0sXG4gICAgc2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICBvdXRnb2luZ1NlYXQgPSBzZWF0O1xuICAgIH0sXG4gICAgc2V0UmV0cnVuU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgcmV0dXJuU2VhdCA9IHNlYXQ7XG4gICAgfSxcbiAgICBzZXRJc090aGVySG9zdHM6IGZ1bmN0aW9uKG90aGVySG9zdHMpIHtcbiAgICAgIGlzT3RoZXJIb3N0cyA9IG90aGVySG9zdHM7XG4gICAgfSxcbiAgICBJc090aGVySG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGlzT3RoZXJIb3N0cztcbiAgICB9LFxuICAgIGNsZWFyTG9jYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0ge31cbiAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0ge31cbiAgICAgIHBhc3NlbmdlckRhdGEgPSBbXVxuICAgICAgYm9va2luZ0RhdGEgPSB7fVxuICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSB7fVxuICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0ge31cbiAgICAgIG91dGdvaW5nU2VhdCA9IHt9XG4gICAgICByZXR1cm5TZWF0ID0ge31cbiAgICAgIGlzaXNPdGhlckhvc3RzID0gZmFsc2VcblxuICAgIH0sXG4gICAgc3VibWl0Qm9va2luZzogZnVuY3Rpb24ob3RoZXJIb3N0cykge1xuICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgIGlmICh0aGlzLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgZWxzZVxuICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgaWYgKHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgIGlmICh0aGlzLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgIGlmICghb3RoZXJIb3N0cykge1xuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHVybDogJy9ib29raW5nJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6IG90aGVySG9zdHNcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgYm9va2luZzogYm9va2luZ0RhdGEsXG4gICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXQsXG4gICAgICAgICAgICB0b2tlbjogc3RyaXBlVG9rZW5cbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgdXJsOiAnL2Jvb2tpbmcnLCAvLyBoYXMgdG8gYmUgY2hhbmdlZCAhIVxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogb3RoZXJIb3N0c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTogYm9va2luZ0RhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9LFxuICAgIGdldFN0cmlwZVRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzdHJpcGVUb2tlbjtcbiAgICB9LFxuICAgIHNldFN0cmlwZVRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgc3RyaXBlVG9rZW4gPSB0b2tlbjtcbiAgICB9XG4gIH07XG59KTtcbiIsIi8vIEBhYmRlbHJobWFuLWVzc2FtXG5BcHAuY29udHJvbGxlcignY29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSkge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWNvbmZpcm1hdGlvbic7XG4gICRzY29wZS50aXRsZSA9IFwiQ29uZmlybSB5b3VyIGZsaWdodFwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJDb25maXJtP1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGFwaS5zdWJtaXRCb29raW5nKCdmYWxzZScpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgLy8gICBhbGVydChkYXRhLmRhdGEpXG4gICAgICAvLyAgIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAvLyB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAvL1xuICAgICAgLy8gfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cbiAgICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG5cbi8vXG4vLyBjb25zb2xlLmxvZyhcImNob3Nlbk91dGdvaW5nRmxpZ2h0XCIpO1xuLy8gICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4vLyBjb25zb2xlLmxvZyhcImNob3NlblJldHVybmluZ0ZsaWdodFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwicGFzc2VuZ2VyXCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UGFzc2VuZ2VyKCkpXG4vLyBjb25zb2xlLmxvZyhcImJvb2tpbmdcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRCb29raW5nKCkpXG4vLyBjb25zb2xlLmxvZyhcImdvaW5nU2VhdFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldE91dGdvaW5nU2VhdCgpKVxuLy8gY29uc29sZS5sb2coXCJyZXRydW5TZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UmV0dXJuU2VhdCgpKVxuXG5cbn0pO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNXaWZpO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5cbiAgaWYgKGJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuZWNvbm9teUZhcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gIGlmIChvdXRBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICBpZiAob3V0QWlyY3JhZnRoYXNXaWZpKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICB9XG4gb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcblxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcblxuICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgJHNjb3BlLnJlYnVzaW5lc3NPckVjb24gPSByZWJ1c2luZXNzT3JFY29uO1xuICAgICRzY29wZS5yZWZhcmUgPSByZWZhcmU7XG4gICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgfVxuICAkc2NvcGUub3V0Z29pbmdGbGlnaHQgPSBvdXRnb2luZ0ZsaWdodDtcbiAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICRzY29wZS5vdXRmYXJlID0gb3V0ZmFyZTtcbiAgJHNjb3BlLm91dGZhY2lsaXRpZXNSZXN1bHQgPSBvdXRmYWNpbGl0aWVzUmVzdWx0O1xuXG59XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBhcGkpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgYXBpLnNldElzT3RoZXJIb3N0cyhmYWxzZSk7XG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodC5faWRcbiAgICAgIGlmKCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodClcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0Ll9pZFxuICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgICBcInJlZlBhc3NlbmdlcklEXCI6IFtdLFxuICAgICAgXCJpc3N1ZURhdGVcIjogbnVsbCxcbiAgICAgIFwiaXNPbmVXYXlcIjogISRzY29wZS5yb3VuZFRyaXAsXG4gICAgICBcInJlZkV4aXRGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgIFwicmVjZWlwdE51bWJlclwiOiBudWxsXG4gICAgfTtcblxuICAgIGlmICghb3JpZ2luIHx8ICFkZXN0aW5hdGlvbiB8fCAhZXhpdERhdGUpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgdmFyIGZsaWdodHM7XG4gICAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gICAgaWYgKHJldHVybkRhdGUpXG4gICAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICAgYXBpLmdldEZsaWdodHMob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAvLyBmb3JtYXR0aW5nIGRhdGEgdG8gYmUgcHJlc2VudGFibGVcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICB9XG5cbiAgICAgIC8vICRzY29wZS5mbGlnaHRzID0gZmxpZ2h0cy5maWx0ZXIoY2hlY2tDb25zdHJhaW50cyk7XG5cbiAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHM7XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRUYWlsTnVtYmVyKVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuZXhpdElzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgJHNjb3BlLmZsaWdodHMgPSB7XG4gICAgXCJvdXRnb2luZ0ZsaWdodHNcIjogW3tcbiAgICAgIFwiX2lkXCI6IFwiMVwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDAzOjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIyXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDFcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQwNjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMDg6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjNcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMlwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDEyOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxNDowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCI0XCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQxNzowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMTk6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH1dLFxuICAgIFwicmV0dXJuRmxpZ2h0c1wiOiBbe1xuICAgICAgXCJfaWRcIjogXCIxXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDBcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQwMTowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMDM6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjJcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDA2OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQwODowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAyXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMTI6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE0OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjRcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwM1wiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDE3OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQxOTowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfV1cbiAgfTtcblxuICAgICRzY29wZS5vcmlnaW4gPSBcIkNBSVwiO1xuICAgICRzY29wZS5kZXN0aW5hdGlvbiA9IFwiSkVEXCI7XG4gICAgJHNjb3BlLmV4aXREYXRlID0gXCIyMDE2LTA1LTEwVDAxOjAwOjAwWlwiO1xuXG4gICAgJHNjb3BlLm1pbmlMb2dvUGF0aCA9IGZ1bmN0aW9uKG9wZXJhdG9yQWlybGluZSl7XG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lID09PSBcIkFpciBCZXJsaW5cIilcbiAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1iZXJsaW4tbWluaS1sb2dvLnBuZ1wiXG4gICAgICByZXR1cm4gXCJpbWcvb3RoZXItYWlybGluZS1taW5pLWxvZ28ucG5nXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjb25zb2xlLmxvZyhmbGlnaHQuX2lkKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjb25zb2xlLmxvZyhmbGlnaHQuX2lkKTtcbiAgICB9XG5cbiAgfVxuXG4gICRzY29wZS5jb25zdHJ1Y3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXRlT3V0ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgcmV0dXJuIGRhdGVPdXQ7XG4gIH07XG5cbn1cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufSBlbHNlIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRyb3V0ZVBhcmFtcycsICdhcGknXTtcbn1cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNDdHJsJywgZmxpZ2h0Q29udHJvbGxlcik7XG4iLCJ2YXIgZmxpZ2h0TmV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksJHJvdXRlUGFyYW1zKSB7XG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gIGFwaS5zZXRJc090aGVySG9zdHModHJ1ZSk7XG5cbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgfVxuXG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICBcInBhc3NlbmdlckRldGFpbHNcIjogW3tcbiAgICAgIFwiZmlyc3ROYW1lXCI6IG51bGwsXG4gICAgICBcImxhc3ROYW1lXCI6IG51bGwsXG4gICAgICBcInBhc3Nwb3J0TnVtXCI6IG51bGwsXG4gICAgICBcInBhc3Nwb3J0RXhwaXJ5RGF0ZVwiOiBudWxsLFxuICAgICAgXCJkYXRlT2ZCaXJ0aFwiOiBudWxsLFxuICAgICAgXCJuYXRpb25hbGl0eVwiOiBudWxsLFxuICAgICAgXCJlbWFpbFwiOiBudWxsLFxuICAgIH1dLFxuICAgIFwiY2xhc3NcIjogbnVsbCxcbiAgICBcIm91dGdvaW5nRmxpZ2h0SWRcIjogbnVsbCxcbiAgICBcInJldHVybkZsaWdodElkXCI6IG51bGwsXG4gICAgXCJwYXltZW50VG9rZW5cIjogbnVsbFxuICB9XG5cbiAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgLy8gVE9ETzogdmFyIGlzRWNvbm9teSA9ICRyb3V0ZVBhcmFtcy5jbGFzcyA9PT0gXCJlY29ub215XCI/IHRydWUgOiBmYWxzZTtcbiAgdmFyIGlzRWNvbm9teSA9IHRydWU7XG5cbiAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICBpZiAocmV0dXJuRGF0ZSlcbiAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gIGlmIChpc0Vjb25vbXkpIHtcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGFwaS5nZXRPdGhlckZsaWdodHNCdXNpKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmNsYXNzID0gaXNFY29ub215ID09PSB0cnVlID8gXCJlY29ub215XCIgOiBcImJ1c2luZXNzXCI7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gZmxpZ2h0Ll9pZDtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuRmxpZ2h0SWQgPSBmbGlnaHQuX2lkO1xuICB9XG5cbiAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICByZXR1cm4gJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgJiYgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgfVxuXG59XG5cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgZmxpZ2h0TmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufSBlbHNlIHtcbiAgZmxpZ2h0TmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRyb3V0ZVBhcmFtcycsXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c05ld0N0cmwnLCBmbGlnaHROZXdDb250cm9sbGVyKTtcbiIsIkFwcC5jb250cm9sbGVyKCdtYWluQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG4gICRzY29wZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5zZWxlY3RlZE9yaWdpbik7XG4gIH1cblxuICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLmFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuXG4gICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgJHNjb3BlLnNlbGVjdGVkRGVzdCA9IHVuZGVmaW5lZDtcblxuICBmdW5jdGlvbiBhaXJwb3JzQ29udGFpbnMoaWF0YSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaWF0YSA9PSAkc2NvcGUuYWlycG9ydHNbaV1bJ2lhdGEnXSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gICRzY29wZS5idXR0b25TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICEkc2NvcGUuc2VsZWN0ZWREZXN0IHx8ICEkc2NvcGUuZXhpdERhdGV8fCAkc2NvcGUuc2VsZWN0ZWREZXN0ID09ICRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZE9yaWdpbikgfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWREZXN0KTtcbiAgfVxuXG4gICRzY29wZS5mbGlnaHQgPSB7XG4gICAgdHlwZTogXCJvbmVcIlxuICB9XG4gICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgdmFsdWU6IGZhbHNlXG4gIH1cblxuXG5cbiAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGV4aXREYXRlLCByZXR1cm5EYXRlO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgIC8vIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICBleGl0RGF0ZSA9ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcbiAgICByZXR1cm5EYXRlID0gKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG4gICAgLy8gfWVsc2V7XG4gICAgLy8gICBleGl0RGF0ZSA9ICgobmV3IERhdGUoJHNjb3BlLmV4aXREYXRlKS5nZXRUaW1lKCkpLzEwMDApLnRvRml4ZWQoMCk7XG4gICAgLy8gICByZXR1cm5EYXRlID0gKChuZXcgRGF0ZSgkc2NvcGUucmV0dXJuRGF0ZSkuZ2V0VGltZSgpKS8xMDAwKS50b0ZpeGVkKDApO1xuICAgIC8vIH1cbiAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpO1xuICAgICAgZWxzZSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSlcbiAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgcmV0dXJuRGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJykuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KS5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgIGVsc2Uge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9O1xuXG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgIFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIiwgXCJEZXN0aW5hdGlvbnMgYWxsIGFyb3VuZCB0aGUgZ2xvYmUuXCIsIFwiRXhwZXJpZW5jZSBhdXRoZW50aWMgaG9zcGl0YWxpdHkuXCIsIFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICBdLFxuICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG5cblxuICAgICRsb2NhdGlvbi51cmwoJGxvY2F0aW9uLnBhdGgoKSk7XG4gICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAkc2NvcGUuY2hpbGRyZW4gPSBbJzAgY2hpbGRyZW4nLCAnMSBjaGlsZCcsICcyIGNoaWxkcmVuJywgJzMgY2hpbGRyZW4nLCAnNCBjaGlsZHJlbiddO1xuICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSAkc2NvcGUuY2hpbGRyZW5bMF07XG4gICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9IHRleHQ7XG4gICAgfVxuXG5cblxuICAgICRzY29wZS5hZHVsdHMgPSBbJzEgYWR1bHQnLCAnMiBhZHVsdHMnLCAnMyBhZHVsdHMnLCAnNCBhZHVsdHMnXTtcbiAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gJHNjb3BlLmFkdWx0c1swXTtcbiAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCBpbmZhbnRzJywgJzEgaW5mYW50J107XG4gICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSAkc2NvcGUuaW5mYW50c1swXTtcbiAgICAkc2NvcGUuY2hhbmdlSW5mYW50ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSB0ZXh0O1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHNldFVwRGF0ZSgkc2NvcGUpIHtcbiAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAkc2NvcGUucmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCk7XG4gIH07XG4gICRzY29wZS50b2RheSgpO1xuXG4gICRzY29wZS5vcGVuMiA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgfTtcbiAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUucG9wdXAub3BlbmVkID0gdHJ1ZTtcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIGRpc2FibGVkKGRhdGEpIHtcbiAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgcmV0dXJuIG1vZGUgPT09ICdkYXknICYmIChkYXRlLmdldERheSgpID09PSAwIHx8IGRhdGUuZ2V0RGF5KCkgPT09IDYpO1xuICB9XG4gICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICBmb3JtYXRZZWFyOiAneXknLFxuICAgIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDUsIDIyKSxcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgIHN0YXJ0aW5nRGF5OiAxXG4gIH07XG4gICRzY29wZS5wb3B1cDIgPSB7XG4gICAgb3BlbmVkOiBmYWxzZVxuICB9O1xuICAkc2NvcGUucG9wdXAgPSB7XG4gICAgb3BlbmVkOiBmYWxzZVxuICB9O1xufVxuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJHNjb3BlLnRpdGxlcyA9IFsnTXInLCAnTXJzJywgJ01zJywgJ0RyJ107XG4gICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAgICRzY29wZS5jaGFuZ2VUaXRsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICBhcGkuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvdW50cmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cblxuXG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgdHlwZTogbnVsbCxcbiAgICAgIGNvdW50cnlDb2RlOiBudWxsLFxuICAgICAgbmF0aW9uYWxpdHk6IG51bGwsXG4gICAgICBzZXg6IG51bGwsXG4gICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICBwb2ludHM6IG51bGwsXG4gICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgZmlyc3ROYW1lOiBudWxsLFxuICAgICAgbWlkZGxlTmFtZTogbnVsbCxcbiAgICAgIGxhc3ROYW1lOiBudWxsLFxuICAgICAgcGFzc3BvcnROdW1iZXI6IG51bGwsXG4gICAgICBwaG9uZU51bWJlcjogbnVsbCxcbiAgICAgIGVtYWlsOiBudWxsXG5cbiAgICB9O1xuXG5cbiAgICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuXG4gICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS50aXRsZXNCdG5UZXh0LFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lLFxuICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxuICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMVxuXG5cbiAgICAgIH07XG4gICAgICAvLy9iZWZvcmUgeW91IGxlYXZlIHRoZSBwYWdlIG1ha2Ugc3VyZSB0aGF0IHRoZSBwYXNzZW5nZXIgb2JqZWN0IGlzIGNvbXBsZXRlIG90aGVyd2lzZSBzaG93IGFsZXJ0KFwiRmlsbCBpbiBhbGwgZGF0YVwiKTtcblxuXG5cbiAgICAgIGlmIChjb21wbGV0ZSA9PSBmYWxzZSkge1xuICAgICAgICAkc2NvcGUuYWxlcnREYXRhID0gZmFsc2U7XG4gICAgICAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSkge1xuICAgICAgICAgICRzY29wZS5hbGVydERhdGEgPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgaWYgKGNvbXBsZXRlID09IHRydWUpIHtcbiAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgaWYgKCFhcGkuaXNPdGhlckhvc3RzKVxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICBlbHNlICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICB9XG5cbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcblxuXG5cbiAgICB2YXIgY29tcGxldGUxID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUuY291bnRyaWVzTW9iLFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS5UaXRsZU1vYixcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZU1vYixcbiAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZU1vYixcbiAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlck1vYixcbiAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFNb2JcblxuXG4gICAgICB9O1xuXG5cblxuXG4gICAgICBpZiAoY29tcGxldGUxID09IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhOlwiICsgXCJcXG5cIiArIFwiUGFzc3BvcnQgTnVtYmVyIG11c3QgYmUgOCBudW1iZXJzXCIgKyBcIlxcblwiICtcbiAgICAgICAgICAgIFwiUGhvbmUgTnVtYmVyIG11c3QgYmUgMTAgbnVtYmVyc1wiICsgXCJcXG5cIiArIFwiRW1haWxzIG11c3QgYmUgaW4gYUB4eXouY29tIGZvcm1hdFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgIT0gJHNjb3BlLmVtYWlsdmVyTW9iKVxuICAgICAgICAgICAgYWxlcnQoXCJUaGUgZW50ZXJlZCBlbWFpbHMgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSlcbiAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UgZW50ZXJlZFwiKVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbXBsZXRlMSA9PSB0cnVlKSB7XG4gICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgfVxuXG4gICAgfTtcbiAgfVxuXG5cblxufSk7XG4iLCIvLyBAbWlybmFcbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXBheW1lbnQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSB5b3VyIHBheW1lbnQgb3B0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgJHNjb3BlLmZvcm0gPSB7XG4gICAgbnVtYmVyOiBudWxsLFxuICAgIGN2YzogbnVsbCxcbiAgICBleHBfbW9udGg6IG51bGwsXG4gICAgZXhwX3llYXI6IG51bGxcbiAgfTtcbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByID0gY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCBwYXk/XCIpO1xuICAgIGlmIChyID09IHRydWUpIHtcbiAgICAkc2NvcGUuZm9ybS5leHBfeWVhciA9ICRzY29wZS55ZWFyc0J0blRleHRcbiAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcbiAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgYXBpLnNldFN0cmlwZVRva2VuKHJlc3BvbnNlLmlkKVxuICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcoYXBpLklzT3RoZXJIb3N0cygpKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKTtcbiAgICAgICAgLy8gYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuXG4gICAgICB9KVxuICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGlmICghYXBpLklzT3RoZXJIb3N0cygpKVxuICB9XG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcnKTtcbiAgfVxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYXBpLmdldFBhc3NlbmdlcigpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwcmljZSA9IDA7XG4gICAgaWYgKGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICBlbHNlXG4gICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSkge1xuXG4gICAgICBpZiAoYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgZWxzZVxuICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG5cbiAgICB9XG5cblxuICAgICRzY29wZS5wcmljZSA9IHByaWNlO1xuICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsICcyMDE3JywgJzIwMTgnLCAnMjAxOScsICcyMDIwJywgJzIwMjEnLCAnMjAyMicsICcyMDIzJywgJzIwMjQnXTtcbiAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gJHNjb3BlLnllYXJzWzBdO1xuICAgICRzY29wZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLm1vbnRocyA9IFsnSmFudWFyeScsICdGZWJ1cmFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gJHNjb3BlLm1vbnRoc1swXTtcbiAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAkc2NvcGUubW9udGhzQnRuTm8gPSAkc2NvcGUubW9udGhzLmluZGV4T2YodGV4dCk7XG4gICAgfVxuICB9XG5cbn0pO1xuIiwiLy8gQGFobWVkLWVzc21hdFxuICB2YXIgc2VhdGluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGksJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXNlYXRpbmcnO1xuICAgICRzY29wZS50aXRsZSA9IFwiV2hlcmUgd291bGQgeW91IGxpa2UgdG8gc2l0P1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9yZXR1cmluZycpO1xuICAgICAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0UmV0cnVuU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgfVxuXG5cblxuICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYXBpLmdldFBhc3NlbmdlcigpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzZWF0bWFwO1xuXG4gICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuXG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfVxuXG5cblxuICAgICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgICAgdmFyIHNjaGVtYSA9IFszLCA1LCAzLCAyMF07XG5cbiAgICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5zZWFyY2hDb2xvciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBpZiAoISRzY29wZS5pc0VtcHR5KHRleHQpKVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRPY3UnO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0RW1wdHknO1xuICAgICAgfVxuICAgICAgJHNjb3BlLmlzRW1wdHkgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWF0bWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChzZWF0bWFwW2ldWydudW1iZXInXSA9PSB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc2VhdG1hcFtpXVsnaXNFbXB0eSddXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICAkc2NvcGUuc2VsZWN0U2VhdCA9IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAkc2NvcGUuc2VhdCA9IHNlYXQ7XG4gICAgICB9O1xuICAgIH1cblxuXG5cbiAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgdmFyIHNjaGVtYSA9IFsyLCA0LCAyLCA5XTtcblxuICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgIH1cblxuXG59O1xuXG5cbmlmKFR5cGUgPT0gJ21vYmlsZScpe1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufWVsc2V7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ3NlYXRpbmdDdHJsJywgc2VhdGluZ0NvbnRyb2xsZXIpO1xuIiwiLyohIHN0cmlwZS1qcyAzMC0wMy0yMDE2ICovXG4oZnVuY3Rpb24oKXt2YXIgYSxiLGMsZCxlLGYsZyxoLGksaj17fS5oYXNPd25Qcm9wZXJ0eSxrPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYygpe3RoaXMuY29uc3RydWN0b3I9YX1mb3IodmFyIGQgaW4gYilqLmNhbGwoYixkKSYmKGFbZF09YltkXSk7cmV0dXJuIGMucHJvdG90eXBlPWIucHJvdG90eXBlLGEucHJvdG90eXBlPW5ldyBjLGEuX19zdXBlcl9fPWIucHJvdG90eXBlLGF9O2lmKGc9XCJodHRwczovL2pzLnN0cmlwZS5jb21cIixjPVwiaHR0cHM6Ly9qcy5zdHJpcGUuY29tXCIsZD0hIS9zdHJpcGVcXC5jb20kLy50ZXN0KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJm51bGwhPT13aW5kb3c/d2luZG93LmxvY2F0aW9uLmhvc3Q6dm9pZCAwKSxiPVwiY29uc29sZVwiaW4gd2luZG93JiZcIndhcm5cImluIHdpbmRvdy5jb25zb2xlLCFkJiZcInF1ZXJ5U2VsZWN0b3JBbGxcImluIGRvY3VtZW50JiZiJiYoZj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbc3JjXj1cIicrZysnXCJdJyksZi5sZW5ndGh8fGNvbnNvbGUud2FybihcIkl0IGxvb2tzIGxpa2UgU3RyaXBlLmpzIGlzIG5vdCBiZWluZyBsb2FkZWQgZnJvbSBodHRwczovL2pzLnN0cmlwZS5jb20uIFN0cmlwZSBkb2VzIG5vdCBzdXBwb3J0IHNlcnZpbmcgU3RyaXBlLmpzIGZyb20geW91ciBvd24gZG9tYWluLlwiKSksdGhpcy5TdHJpcGUpcmV0dXJuIWJ8fHRoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkfHx0aGlzLlN0cmlwZS5lYXJseUVycm9yfHxjb25zb2xlLndhcm4oXCJJdCBsb29rcyBsaWtlIFN0cmlwZS5qcyB3YXMgbG9hZGVkIG1vcmUgdGhhbiBvbmUgdGltZS4gUGxlYXNlIG9ubHkgbG9hZCBpdCBvbmNlIHBlciBwYWdlLlwiKSx2b2lkKHRoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkPSEwKTt0aGlzLlN0cmlwZT1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXt9cmV0dXJuIGEudmVyc2lvbj0yLGEuZW5kcG9pbnQ9XCJodHRwczovL2FwaS5zdHJpcGUuY29tL3YxXCIsYS5zZXRQdWJsaXNoYWJsZUtleT1mdW5jdGlvbihiKXtyZXR1cm4gYS5rZXk9YixhLnV0aWxzLnZhbGlkYXRlUHJvdG9jb2woYS5rZXkpfSxhLl9sYW5ndWFnZT1cImVuLVVTXCIsYS5zZXRMYW5ndWFnZT1mdW5jdGlvbihiKXtyZXR1cm4gYS5fbGFuZ3VhZ2U9Yn0sYS5fYWxsb3dlZEN1c3RvbUhlYWRlcnM9W1wiWC1TdHJpcGUtTGl2ZW1vZGVcIixcIkF1dGhvcml6YXRpb25cIl0sYS5fY3VzdG9tSGVhZGVycz17fSxhLl9zZXRDdXN0b21IZWFkZXI9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnO2ZvcihkPSExLGc9dGhpcy5fYWxsb3dlZEN1c3RvbUhlYWRlcnMsZT0wLGY9Zy5sZW5ndGg7Zj5lO2UrKylpZihjPWdbZV0sYz09PWEpe3RoaXMuX2N1c3RvbUhlYWRlcnNbYV09YixkPSEwO2JyZWFrfXJldHVybiBkfSxhLnRyYWNrUGVyZj0hMSxhLl9pc0NoYW5uZWw9XCIjX19zdHJpcGVfdHJhbnNwb3J0X19cIj09PShcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZudWxsIT09d2luZG93P3dpbmRvdy5sb2NhdGlvbi5oYXNoOnZvaWQgMCksYS5faXNTYWZlU3RyaXBlRG9tYWluPWQsYS5faWZyYW1lT25BbW91bnQ9MSxhLl9pc1NhZmVEb21haW49ZnVuY3Rpb24oKXtyZXR1cm5cIiNfX2ZvcmNlZHNzM19fXCI9PT13aW5kb3cubG9jYXRpb24uaGFzaD8hMTphLl9pc1NhZmVTdHJpcGVEb21haW58fHdpbmRvdy5TdHJpcGVUZW1wb3JhcnlOb0RTUzM/ITA6YS5faWZyYW1lT25BbW91bnQ8TWF0aC5yYW5kb20oKX0oKSxhLl9maW5hbFRyYW5zcG9ydD1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZudWxsIT09d2luZG93JiZcIlhNTEh0dHBSZXF1ZXN0XCJpbiB3aW5kb3cmJlwid2l0aENyZWRlbnRpYWxzXCJpbiBuZXcgWE1MSHR0cFJlcXVlc3Q/XCJjb3JzXCI6XCJqc29ucFwiLGEuX3RyYW5zcG9ydD1hLl9pc0NoYW5uZWx8fGEuX2lzU2FmZURvbWFpbj9hLl9maW5hbFRyYW5zcG9ydDpcImlmcmFtZVwiLGEuX2ZhbGxCYWNrVG9PbGRTdHJpcGVKc1RlY2huaXF1ZXM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdHJhbnNwb3J0PVwianNvbnBcIix0aGlzLl9maW5hbFRyYW5zcG9ydD1cImpzb25wXCIsdGhpcy5faXNTYWZlRG9tYWluPVwidHJ1ZVwifSxhLl9pZnJhbWVSZXF1ZXN0UXVldWU9W10sYS5faWZyYW1lUGVuZGluZ1JlcXVlc3RzPXt9LGEuX2lmcmFtZUNoYW5uZWxTdGF0dXM9XCJwZW5kaW5nXCIsYS5faWZyYW1lQ2hhbm5lbENvbXBsZXRlPWZ1bmN0aW9uKGIpe3ZhciBjLGQsZSxmO2Zvcih0aGlzLl9pZnJhbWVDaGFubmVsU3RhdHVzPWI/XCJzdWNjZXNzXCI6XCJmYWlsdXJlXCIsXCJmYWlsdXJlXCI9PT10aGlzLl9pZnJhbWVDaGFubmVsU3RhdHVzJiZ0aGlzLl9mYWxsQmFja1RvT2xkU3RyaXBlSnNUZWNobmlxdWVzKCksZD10aGlzLl9pZnJhbWVSZXF1ZXN0UXVldWUsZGVsZXRlIHRoaXMuX2lmcmFtZVJlcXVlc3RRdWV1ZSx0aGlzLl9pZnJhbWVSZXF1ZXN0UXVldWU9W10sZT0wLGY9ZC5sZW5ndGg7Zj5lO2UrKyljPWRbZV0sdGhpcy5yZXF1ZXN0KGMsITApO3RoaXMuX2lmcmFtZUNoYW5uZWxDb21wbGV0ZT1mdW5jdGlvbigpe3JldHVybiBhLnJlcG9ydEVycm9yKFwiQ29tcGxldGVEdXBsaWNhdGlvbkVycm9yXCIpfX0sYS5yZXF1ZXN0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMudHJhY2tQZXJmJiZhLnRva2VuVHlwZT90aGlzLl9pbnN0cnVtZW50ZWRSZXF1ZXN0KGEsYik6dGhpcy5fcmF3UmVxdWVzdChhLGIpfSxhLl9yYXdSZXF1ZXN0PWZ1bmN0aW9uKGIsYyl7dmFyIGQsZSxmO2lmKGU9XCJQT1NUXCI9PT1iLm1ldGhvZCYmKG51bGwhPShmPWIuZGF0YSk/Zi5jYXJkOnZvaWQgMCksY3x8KGIuZGF0YS5wYXltZW50X3VzZXJfYWdlbnQ/dGhpcy5faXNDaGFubmVsfHwoYi5kYXRhLnBheW1lbnRfdXNlcl9hZ2VudD1cIlwiK2IuZGF0YS5wYXltZW50X3VzZXJfYWdlbnQrXCIgKFwiK2Euc3RyaXBlanNfdWErXCIpXCIpOmIuZGF0YS5wYXltZW50X3VzZXJfYWdlbnQ9YS5zdHJpcGVqc191YSksXCJpZnJhbWVcIj09PXRoaXMuX3RyYW5zcG9ydCl7aWYoZSlyZXR1cm5cInBlbmRpbmdcIj09PXRoaXMuX2lmcmFtZUNoYW5uZWxTdGF0dXM/dGhpcy5faWZyYW1lUmVxdWVzdFF1ZXVlLnB1c2goYik6XCJmYWlsdXJlXCI9PT10aGlzLl9pZnJhbWVDaGFubmVsU3RhdHVzP3RoaXMuYWpheEpTT05QKGIpOnRoaXMuaWZyYW1lKGIpO2lmKFwiY29yc1wiPT09dGhpcy5fZmluYWxUcmFuc3BvcnQpdHJ5e3JldHVybiB0aGlzLnhocihiKX1jYXRjaChnKXtyZXR1cm4gZD1nLHRoaXMuX3RyYW5zcG9ydD1cImpzb25wXCIsdGhpcy5yZXF1ZXN0KGIsITApfXJldHVybiB0aGlzLmFqYXhKU09OUChiKX1pZihcImNvcnNcIj09PXRoaXMuX3RyYW5zcG9ydCl0cnl7cmV0dXJuIHRoaXMueGhyKGIpfWNhdGNoKGcpe3JldHVybiBkPWcsYS5yZXBvcnRFcnJvcihcIlhoclRocmV3RXJyb3JcIiksdGhpcy5fdHJhbnNwb3J0PVwianNvbnBcIix0aGlzLnJlcXVlc3QoYiwhMCl9cmV0dXJuIHRoaXMuYWpheEpTT05QKGIpfSxhLnJlcG9ydEVycm9yPWZ1bmN0aW9uKGIsYyl7dmFyIGQ7cmV0dXJuXCJjb25zb2xlXCJpbiB3aW5kb3cmJlwid2FyblwiaW4gd2luZG93LmNvbnNvbGUsMSxkPU1hdGgucm91bmQoKG5ldyBEYXRlKS5nZXRUaW1lKCkvMWUzKSwobmV3IEltYWdlKS5zcmM9XCJodHRwczovL3Euc3RyaXBlLmNvbT9ldmVudD1zdHJpcGVqcy1lcnJvciZ0eXBlPVwiK2VuY29kZVVSSUNvbXBvbmVudChiKSsoYz9cIiZ0aW1pbmc9XCIrYzpcIlwiKStcIiZrZXk9XCIrYS5rZXkrXCImdGltZXN0YW1wPVwiK2QrXCImcGF5bWVudF91c2VyX2FnZW50PVwiK2VuY29kZVVSSUNvbXBvbmVudChhLnN0cmlwZWpzX3VhKX0sYS5faW5zdHJ1bWVudGVkUmVxdWVzdD1mdW5jdGlvbihiLGMpe3ZhciBkLGU7cmV0dXJuIGQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksZT1mdW5jdGlvbihjKXtyZXR1cm4gZnVuY3Rpb24oZSxmKXt2YXIgZyxoLGksaixrO3JldHVybiBqPW51bGwhPShrPWIudG9rZW5UeXBlKT9rOlwidW5rbm93blwiLGc9KG5ldyBEYXRlKS5nZXRUaW1lKCksaD1jLl9nZXRSZXNvdXJjZVRpbWluZyhudWxsIT1lP2UucmVzcG9uc2VVUkw6dm9pZCAwKSxpPXtldmVudDpcInJ1bS5zdHJpcGVqc1wiLHRva2VuVHlwZTpqLHVybDpiLnVybCxzdGF0dXM6ZixzdGFydDpkLGVuZDpnLHJlc291cmNlVGltaW5nOmh9LGEubG9nUlVNKGkpfX0odGhpcyksYi5zdWNjZXNzPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiLGMsZCl7cmV0dXJuIGUoZCxjKSxhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KGIuc3VjY2VzcyksYi5jb21wbGV0ZT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYixjLGQpe3JldHVyblwic3VjY2Vzc1wiIT09YiYmZShjLGIpLGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0oYi5jb21wbGV0ZSksdGhpcy5fcmF3UmVxdWVzdChiLGMpfSxhLl9nZXRSZXNvdXJjZVRpbWluZz1mdW5jdGlvbihhKXt2YXIgYjtzd2l0Y2goYj1cInVuZGVmaW5lZFwiIT10eXBlb2YgcGVyZm9ybWFuY2UmJm51bGwhPT1wZXJmb3JtYW5jZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZT9wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlOYW1lKGEpOnZvaWQgMCwhMSl7Y2FzZSAxIT09KG51bGwhPWI/Yi5sZW5ndGg6dm9pZCAwKTpyZXR1cm4gdGhpcy5fc2FuaXRpemVSZXNvdXJjZVRpbWluZyhiWzBdKTtjYXNlIDAhPT0obnVsbCE9Yj9iLmxlbmd0aDp2b2lkIDApOnJldHVybntlcnJvck1zZzpcIk5vIHJlc291cmNlIHRpbWluZyBlbnRyaWVzIGZvdW5kXCJ9O2Nhc2UgbnVsbD09KG51bGwhPWI/Yi5sZW5ndGg6dm9pZCAwKTpyZXR1cm57ZXJyb3JNc2c6XCJNb3JlIHRoYW4gb25lIHJlc291cmNlIHRpbWluZyBlbnRyeVwifTtkZWZhdWx0OnJldHVybiBudWxsfX0sYS5fcmVzb3VyY2VUaW1pbmdXaGl0ZWxpc3Q9W1wiY29ubmVjdEVuZFwiLFwiY29ubmVjdFN0YXJ0XCIsXCJkb21haW5Mb29rdXBFbmRcIixcImRvbWFpbkxvb2t1cFN0YXJ0XCIsXCJkdXJhdGlvblwiLFwiZmV0Y2hTdGFydFwiLFwicmVkaXJlY3RFbmRcIixcInJlZGlyZWN0U3RhcnRcIixcInJlcXVlc3RTdGFydFwiLFwicmVzcG9uc2VFbmRcIixcInJlc3BvbnNlU3RhcnRcIixcInNlY3VyZUNvbm5lY3Rpb25TdGFydFwiLFwic3RhcnRUaW1lXCJdLGEuX3Nhbml0aXplUmVzb3VyY2VUaW1pbmc9ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZjtmb3IoYz17fSxmPXRoaXMuX3Jlc291cmNlVGltaW5nV2hpdGVsaXN0LGQ9MCxlPWYubGVuZ3RoO2U+ZDtkKyspYj1mW2RdLGFbYl0mJihjW2JdPWFbYl0pO3JldHVybiBjfSxhLmxvZ1JVTT1mdW5jdGlvbihiKXtyZXR1cm4obmV3IEltYWdlKS5zcmM9XCJodHRwczovL3Euc3RyaXBlLmNvbS8/XCIrYS51dGlscy5zZXJpYWxpemUoYil9LGEuY29tcGxldGU9ZnVuY3Rpb24oYixjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGYpe3JldHVyblwic3VjY2Vzc1wiIT09ZD8oYS5yZXBvcnRFcnJvcihcIkNvbXBsZXRlNTAwLVwiK2QpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGI/Yig1MDAse2Vycm9yOntjb2RlOmQsdHlwZTpkLG1lc3NhZ2U6Y319KTp2b2lkIDApOnZvaWQgMH19LGEuX2lmcmFtZUJhc2VVcmw9YyxhLl9zdHJpcGVqc0Jhc2VVcmw9ZyxhLl9yZWxheVJlc3BvbnNlPWZ1bmN0aW9uKGIsYyxkKXtyZXR1cm4gYS5fc29ja2V0LnBvc3RNZXNzYWdlKGEuSlNPTi5zdHJpbmdpZnkoe2NvZGU6YyxyZXNwOmQscmVxdWVzdElkOmJ9KSl9LGEuX2NhbGxDb3VudD0wLGEuX2NhbGxDYWNoZT17fSxhLl9yZWNlaXZlQ2hhbm5lbFJlbGF5PWZ1bmN0aW9uKGIsYyl7dmFyIGQsZSxmLGc7aWYoZj1hLl9pZnJhbWVCYXNlVXJsLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLyxcIlwiKS5yZXBsYWNlKC9cXC8uKiQvLFwiXCIpLGc9Yy5yZXBsYWNlKC9eaHR0cHM/OlxcL1xcLy8sXCJcIikucmVwbGFjZSgvXFwvLiokLyxcIlwiKSxnPT09ZiYmXCJzdHJpbmdcIj09dHlwZW9mIGIpe3RyeXtlPWEuSlNPTi5wYXJzZShiKX1jYXRjaChoKXt0aHJvdyBkPWgsYS5yZXBvcnRFcnJvcihcIkludmFsaWRKU09OLUNoYW5uZWxSZWxheVwiKSxuZXcgRXJyb3IoXCJTdHJpcGUuanMgcmVjZWl2ZWQgaW52YWxpZCBKU09OXCIpfWlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGEuX2NhbGxDYWNoZVtlLnJlcXVlc3RJZF0pcmV0dXJuIGEuX2NhbGxDYWNoZVtlLnJlcXVlc3RJZF0oZS5yZXNwLGUuY29kZSksZGVsZXRlIGEuX2NhbGxDYWNoZVtlLnJlcXVlc3RJZF19fSxhLl9jaGFubmVsTGlzdGVuZXI9ZnVuY3Rpb24oYixjKXt2YXIgZCxlLGYsZztpZihcInN0cmluZ1wiPT10eXBlb2YgYil7dHJ5e2c9YS5KU09OLnBhcnNlKGIpfWNhdGNoKGgpe3Rocm93IGU9aCxhLnJlcG9ydEVycm9yKFwiSW52YWxpZEpTT04tQ2hhbm5lbExpc3RlbmVyXCIpLG5ldyBFcnJvcihcIlN0cmlwZS5qcyByZWNlaXZlZCBpbnZhbGlkIEpTT05cIil9aWYoZD1nLmRhdGEuY2FyZCxkZWxldGUgZy5kYXRhLmNhcmQsZj1nLmhlYWRlcnNbXCJBY2NlcHQtTGFuZ3VhZ2VcIl0sZClyZXR1cm4gYS5zZXRQdWJsaXNoYWJsZUtleShnLmRhdGEua2V5KSxmJiZhLnNldExhbmd1YWdlKGYpLG51bGwhPWcuZW5kcG9pbnQmJihhLmVuZHBvaW50PWcuZW5kcG9pbnQpLG51bGwhPWcudHJhY2tQZXJmJiYoYS50cmFja1BlcmY9Zy50cmFja1BlcmYpLGEuY2FyZC5jcmVhdGVUb2tlbihkLGcuZGF0YSxmdW5jdGlvbihiLGMpe3JldHVybiBhLl9yZWxheVJlc3BvbnNlKGcucmVxdWVzdElkLGIsYyl9KTt0aHJvdyBhLnJlcG9ydEVycm9yKFwiSW52YWxpZENoYW5uZWxVc2UtTm9uQ2FyZFwiKSxuZXcgRXJyb3IoXCJTdHJpcGUuanMgaWZyYW1lIHRyYW5zcG9ydCB1c2VkIGZvciBub24tY2FyZCByZXF1ZXN0XCIpfX0sYX0oKSx0aGlzLlN0cmlwZS50b2tlbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXt9cmV0dXJuIGEudmFsaWRhdGU9ZnVuY3Rpb24oYSxiKXtpZighYSl0aHJvdyBiK1wiIHJlcXVpcmVkXCI7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGEpdGhyb3cgYitcIiBpbnZhbGlkXCJ9LGEuZm9ybWF0RGF0YT1mdW5jdGlvbihhLGIpe3ZhciBjLGQsZTtTdHJpcGUudXRpbHMuaXNFbGVtZW50KGEpJiYoYT1TdHJpcGUudXRpbHMucGFyYW1zRnJvbUZvcm0oYSxiKSk7Zm9yKGMgaW4gYSlkPWFbY10sbnVsbD09ZCYmZGVsZXRlIGFbY107cmV0dXJuIFN0cmlwZS51dGlscy51bmRlcnNjb3JlS2V5cyhhKSxcInN0cmluZ1wiPT10eXBlb2YgYS5leHAmJihlPVN0cmlwZS51dGlscy5wYXJzZUV4cFN0cmluZyhhLmV4cCksYS5leHBfbW9udGg9ZVswXSxhLmV4cF95ZWFyPWVbMV0sZGVsZXRlIGEuZXhwKSxhfSxhLmNyZWF0ZT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7cmV0dXJuIGEua2V5fHwoYS5rZXk9U3RyaXBlLmtleXx8U3RyaXBlLnB1Ymxpc2hhYmxlS2V5KSxTdHJpcGUudXRpbHMudmFsaWRhdGVLZXkoYS5rZXkpLGQ9ZnVuY3Rpb24oKXtzd2l0Y2goITEpe2Nhc2UgbnVsbD09YS5jYXJkOnJldHVyblwiY2FyZFwiO2Nhc2UgbnVsbD09YS5iYW5rX2FjY291bnQ6cmV0dXJuXCJiYW5rX2FjY291bnRcIjtjYXNlIG51bGw9PWEucGlpOnJldHVyblwicGlpXCI7ZGVmYXVsdDpyZXR1cm5cInVua25vd25cIn19KCksYz17dXJsOlwiXCIrU3RyaXBlLmVuZHBvaW50K1wiL3Rva2Vuc1wiLGRhdGE6YSxtZXRob2Q6XCJQT1NUXCIsaGVhZGVyczp7fSxzdWNjZXNzOmZ1bmN0aW9uKGEsYyl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYj9iKGMsYSk6dm9pZCAwfSxjb21wbGV0ZTpTdHJpcGUuY29tcGxldGUoYixcIkEgbmV0d29yayBlcnJvciBoYXMgb2NjdXJyZWQsIGFuZCB5b3UgaGF2ZSBub3QgYmVlbiBjaGFyZ2VkLiBQbGVhc2UgdHJ5IGFnYWluLlwiKSx0aW1lb3V0OjRlNCx0b2tlblR5cGU6ZH0sU3RyaXBlLl9sYW5ndWFnZSYmKGMuaGVhZGVyc1tcIkFjY2VwdC1MYW5ndWFnZVwiXT1TdHJpcGUuX2xhbmd1YWdlKSxTdHJpcGUucmVxdWVzdChjKX0sYS5nZXQ9ZnVuY3Rpb24oYSxiKXtpZighYSl0aHJvdyBuZXcgRXJyb3IoXCJ0b2tlbiByZXF1aXJlZFwiKTtyZXR1cm4gU3RyaXBlLnV0aWxzLnZhbGlkYXRlS2V5KFN0cmlwZS5rZXkpLFN0cmlwZS5yZXF1ZXN0KHt1cmw6XCJcIitTdHJpcGUuZW5kcG9pbnQrXCIvdG9rZW5zL1wiK2EsZGF0YTp7a2V5OlN0cmlwZS5rZXl9LHN1Y2Nlc3M6ZnVuY3Rpb24oYSxjKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBiP2IoYyxhKTp2b2lkIDB9LGNvbXBsZXRlOlN0cmlwZS5jb21wbGV0ZShiLFwiQSBuZXR3b3JrIGVycm9yIGhhcyBvY2N1cnJlZCBsb2FkaW5nIGRhdGEgZnJvbSBTdHJpcGUuIFBsZWFzZSB0cnkgYWdhaW4uXCIpLHRpbWVvdXQ6NGU0fSl9LGF9KCksdGhpcy5TdHJpcGUuY2FyZD1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7cmV0dXJuIGIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gayhiLGEpLGIudG9rZW5OYW1lPVwiY2FyZFwiLGIud2hpdGVsaXN0ZWRBdHRycz1bXCJudW1iZXJcIixcImN2Y1wiLFwiZXhwXCIsXCJleHBfbW9udGhcIixcImV4cF95ZWFyXCIsXCJuYW1lXCIsXCJhZGRyZXNzX2xpbmUxXCIsXCJhZGRyZXNzX2xpbmUyXCIsXCJhZGRyZXNzX2NpdHlcIixcImFkZHJlc3Nfc3RhdGVcIixcImFkZHJlc3NfemlwXCIsXCJhZGRyZXNzX2NvdW50cnlcIixcImN1cnJlbmN5XCJdLGIuY3JlYXRlVG9rZW49ZnVuY3Rpb24oYSxjLGQpe3ZhciBlO3JldHVybiBudWxsPT1jJiYoYz17fSksU3RyaXBlLnRva2VuLnZhbGlkYXRlKGEsXCJjYXJkXCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGM/KGQ9YyxjPXt9KTpcIm9iamVjdFwiIT10eXBlb2YgYyYmKGU9cGFyc2VJbnQoYywxMCksYz17fSxlPjAmJihjLmFtb3VudD1lKSksY1tiLnRva2VuTmFtZV09U3RyaXBlLnRva2VuLmZvcm1hdERhdGEoYSxiLndoaXRlbGlzdGVkQXR0cnMpLFN0cmlwZS50b2tlbi5jcmVhdGUoYyxkKX0sYi5nZXRUb2tlbj1mdW5jdGlvbihhLGIpe3JldHVybiBTdHJpcGUudG9rZW4uZ2V0KGEsYil9LGIudmFsaWRhdGVDYXJkTnVtYmVyPWZ1bmN0aW9uKGEpe3JldHVybiBhPShhK1wiXCIpLnJlcGxhY2UoL1xccyt8LS9nLFwiXCIpLGEubGVuZ3RoPj0xMCYmYS5sZW5ndGg8PTE2JiZiLmx1aG5DaGVjayhhKX0sYi52YWxpZGF0ZUNWQz1mdW5jdGlvbihhKXtyZXR1cm4gYT1TdHJpcGUudXRpbHMudHJpbShhKSwvXlxcZCskLy50ZXN0KGEpJiZhLmxlbmd0aD49MyYmYS5sZW5ndGg8PTR9LGIudmFsaWRhdGVFeHBpcnk9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZjtpZihudWxsIT1iKWU9U3RyaXBlLnV0aWxzLnRyaW0oYSksYj1TdHJpcGUudXRpbHMudHJpbShiKTtlbHNle3RyeXtmPVN0cmlwZS51dGlscy5wYXJzZUV4cFN0cmluZyhhKSxlPWZbMF0sYj1mWzFdfWNhdGNoKGcpe3JldHVybiExfWUrPVwiXCIsYis9XCJcIn1yZXR1cm4vXlxcZCskLy50ZXN0KGUpJiYvXlxcZCskLy50ZXN0KGIpJiZlPj0xJiYxMj49ZT8oMj09PWIubGVuZ3RoJiYoYj03MD5iP1wiMjBcIitiOlwiMTlcIitiKSw0IT09Yi5sZW5ndGg/ITE6KGQ9bmV3IERhdGUoYixlKSxjPW5ldyBEYXRlLGQuc2V0TW9udGgoZC5nZXRNb250aCgpLTEpLGQuc2V0TW9udGgoZC5nZXRNb250aCgpKzEsMSksZD5jKSk6ITF9LGIubHVobkNoZWNrPWZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZztmb3IoZD0hMCxlPTAsYz0oYStcIlwiKS5zcGxpdChcIlwiKS5yZXZlcnNlKCksZj0wLGc9Yy5sZW5ndGg7Zz5mO2YrKyliPWNbZl0sYj1wYXJzZUludChiLDEwKSwoZD0hZCkmJihiKj0yKSxiPjkmJihiLT05KSxlKz1iO3JldHVybiBlJTEwPT09MH0sYi5jYXJkVHlwZT1mdW5jdGlvbihhKXtyZXR1cm4gYi5jYXJkVHlwZXNbYS5zbGljZSgwLDIpXXx8XCJVbmtub3duXCJ9LGIuY2FyZEJyYW5kPWZ1bmN0aW9uKGEpe3JldHVybiBiLmNhcmRUeXBlKGEpfSxiLmNhcmRUeXBlcz1mdW5jdGlvbigpe3ZhciBhLGIsYyxkO2ZvcihiPXt9LGE9Yz00MDs0OT49YzthPSsrYyliW2FdPVwiVmlzYVwiO2ZvcihhPWQ9NTA7NTk+PWQ7YT0rK2QpYlthXT1cIk1hc3RlckNhcmRcIjtyZXR1cm4gYlszNF09YlszN109XCJBbWVyaWNhbiBFeHByZXNzXCIsYls2MF09Yls2Ml09Yls2NF09Yls2NV09XCJEaXNjb3ZlclwiLGJbMzVdPVwiSkNCXCIsYlszMF09YlszNl09YlszOF09YlszOV09XCJEaW5lcnMgQ2x1YlwiLGJ9KCksYn0odGhpcy5TdHJpcGUudG9rZW4pLHRoaXMuU3RyaXBlLmJhbmtBY2NvdW50PWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoKXtyZXR1cm4gYi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBrKGIsYSksYi50b2tlbk5hbWU9XCJiYW5rX2FjY291bnRcIixiLndoaXRlbGlzdGVkQXR0cnM9W1wiY291bnRyeVwiLFwiY3VycmVuY3lcIixcInJvdXRpbmdfbnVtYmVyXCIsXCJhY2NvdW50X251bWJlclwiLFwibmFtZVwiLFwiYWNjb3VudF9ob2xkZXJfdHlwZVwiLFwiYWNjb3VudF9ob2xkZXJfbmFtZVwiXSxiLmNyZWF0ZVRva2VuPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gbnVsbD09YyYmKGM9e30pLFN0cmlwZS50b2tlbi52YWxpZGF0ZShhLFwiYmFuayBhY2NvdW50XCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGMmJihkPWMsYz17fSksY1tiLnRva2VuTmFtZV09U3RyaXBlLnRva2VuLmZvcm1hdERhdGEoYSxiLndoaXRlbGlzdGVkQXR0cnMpLFN0cmlwZS50b2tlbi5jcmVhdGUoYyxkKX0sYi5nZXRUb2tlbj1mdW5jdGlvbihhLGIpe3JldHVybiBTdHJpcGUudG9rZW4uZ2V0KGEsYil9LGIudmFsaWRhdGVSb3V0aW5nTnVtYmVyPWZ1bmN0aW9uKGEsYyl7c3dpdGNoKGE9U3RyaXBlLnV0aWxzLnRyaW0oYSksYyl7Y2FzZVwiVVNcIjpyZXR1cm4vXlxcZCskLy50ZXN0KGEpJiY5PT09YS5sZW5ndGgmJmIucm91dGluZ0NoZWNrc3VtKGEpO2Nhc2VcIkNBXCI6cmV0dXJuL1xcZHs1fVxcLVxcZHszfS8udGVzdChhKSYmOT09PWEubGVuZ3RoO2RlZmF1bHQ6cmV0dXJuITB9fSxiLnZhbGlkYXRlQWNjb3VudE51bWJlcj1mdW5jdGlvbihhLGIpe3N3aXRjaChhPVN0cmlwZS51dGlscy50cmltKGEpLGIpe2Nhc2VcIlVTXCI6cmV0dXJuL15cXGQrJC8udGVzdChhKSYmYS5sZW5ndGg+PTEmJmEubGVuZ3RoPD0xNztkZWZhdWx0OnJldHVybiEwfX0sYi5yb3V0aW5nQ2hlY2tzdW09ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZixnO2ZvcihkPTAsYj0oYStcIlwiKS5zcGxpdChcIlwiKSxnPVswLDMsNl0sZT0wLGY9Zy5sZW5ndGg7Zj5lO2UrKyljPWdbZV0sZCs9MypwYXJzZUludChiW2NdKSxkKz03KnBhcnNlSW50KGJbYysxXSksZCs9cGFyc2VJbnQoYltjKzJdKTtyZXR1cm4gMCE9PWQmJmQlMTA9PT0wfSxifSh0aGlzLlN0cmlwZS50b2tlbiksdGhpcy5TdHJpcGUucGlpRGF0YT1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7cmV0dXJuIGIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gayhiLGEpLGIudG9rZW5OYW1lPVwicGlpXCIsYi53aGl0ZWxpc3RlZEF0dHJzPVtcInBlcnNvbmFsX2lkX251bWJlclwiXSxiLmNyZWF0ZVRva2VuPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gbnVsbD09YyYmKGM9e30pLFN0cmlwZS50b2tlbi52YWxpZGF0ZShhLFwicGlpIGRhdGFcIiksXCJmdW5jdGlvblwiPT10eXBlb2YgYyYmKGQ9YyxjPXt9KSxjW2IudG9rZW5OYW1lXT1TdHJpcGUudG9rZW4uZm9ybWF0RGF0YShhLGIud2hpdGVsaXN0ZWRBdHRycyksU3RyaXBlLnRva2VuLmNyZWF0ZShjLGQpfSxiLmdldFRva2VuPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFN0cmlwZS50b2tlbi5nZXQoYSxiKX0sYn0odGhpcy5TdHJpcGUudG9rZW4pLHRoaXMuU3RyaXBlLl9wb2xsZXI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKCl7fXJldHVybiBhLl9hY3RpdmVQb2xscz17fSxhLl9jbGVhclBvbGw9ZnVuY3Rpb24oYil7cmV0dXJuIGRlbGV0ZSBhLl9hY3RpdmVQb2xsc1tiXX0sYS5fZGVmYXVsdFBvbGxJbnRlcnZhbD0xNTAwLGEuX21heFBvbGxJbnRlcnZhbD0yNGUzLGEuX2luaXRQb2xsPWZ1bmN0aW9uKGIpe2lmKG51bGwhPWEuX2FjdGl2ZVBvbGxzW2JdKXRocm93IG5ldyBFcnJvcihcIllvdSBhcmUgYWxyZWFkeSBwb2xsaW5nIFwiK2IrXCIuIFBsZWFzZSBjYW5jZWwgdGhhdCBwb2xsIGJlZm9yZSBwb2xsaW5nIGl0IGFnYWluLlwiKTtyZXR1cm4gYS5fYWN0aXZlUG9sbHNbYl09e319LGEuX3BvbGw9ZnVuY3Rpb24oYixjLGQsZSxmKXtjKGIsZnVuY3Rpb24oZyxoKXt2YXIgaTtpZihudWxsIT1hLl9hY3RpdmVQb2xsc1tiXSlyZXR1cm4gZz49NDAwJiY1MDA+Zz8oYS5fY2xlYXJQb2xsKGIpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGY/ZihnLGgpOnZvaWQgMCk6MjAwPT09ZyYmZShiLGgpPyhhLl9jbGVhclBvbGwoYiksXCJmdW5jdGlvblwiPT10eXBlb2YgZj9mKGcsaCk6dm9pZCAwKTooMjAwPT09ZyYmZChiLGgpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiZmKGcsaCksNTAwPT09ZyYmMiphLl9hY3RpdmVQb2xsc1tiXS5pbnRlcnZhbDw9YS5fbWF4UG9sbEludGVydmFsP2EuX2FjdGl2ZVBvbGxzW2JdLmludGVydmFsKj0yOmc+PTIwMCYmNTAwPmcmJihhLl9hY3RpdmVQb2xsc1tiXS5pbnRlcnZhbD1hLl9kZWZhdWx0UG9sbEludGVydmFsKSxpPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gYS5fcG9sbChiLGMsZCxlLGYpfSxhLl9hY3RpdmVQb2xsc1tiXS5pbnRlcnZhbCksYS5fYWN0aXZlUG9sbHNbYl0udGltZW91dElkPWkpfSl9LGEuX2NhbmNlbFBvbGw9ZnVuY3Rpb24oYil7dmFyIGM7aWYoYz1hLl9hY3RpdmVQb2xsc1tiXSxudWxsPT1jKXRocm93IG5ldyBFcnJvcihcIllvdSBhcmUgbm90IHBvbGxpbmcgXCIrYitcIi5cIik7bnVsbCE9Yy50aW1lb3V0SWQmJmNsZWFyVGltZW91dChjLnRpbWVvdXRJZCksYS5fY2xlYXJQb2xsKGIpfSxhfSgpLHRoaXMuU3RyaXBlLmJpdGNvaW5SZWNlaXZlcj1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7cmV0dXJuIGIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gayhiLGEpLGIuX3doaXRlbGlzdGVkQXR0cnM9W1wiYW1vdW50XCIsXCJjdXJyZW5jeVwiLFwiZW1haWxcIixcImRlc2NyaXB0aW9uXCJdLGIuY3JlYXRlUmVjZWl2ZXI9ZnVuY3Rpb24oYSxiKXt2YXIgYztyZXR1cm4gU3RyaXBlLnRva2VuLnZhbGlkYXRlKGEsXCJiaXRjb2luX3JlY2VpdmVyIGRhdGFcIiksYz1TdHJpcGUudG9rZW4uZm9ybWF0RGF0YShhLHRoaXMuX3doaXRlbGlzdGVkQXR0cnMpLGMua2V5PVN0cmlwZS5rZXl8fFN0cmlwZS5wdWJsaXNoYWJsZUtleSxTdHJpcGUudXRpbHMudmFsaWRhdGVLZXkoYy5rZXkpLFN0cmlwZS5yZXF1ZXN0KHt1cmw6XCJcIitTdHJpcGUuZW5kcG9pbnQrXCIvYml0Y29pbi9yZWNlaXZlcnNcIixkYXRhOmMsbWV0aG9kOlwiUE9TVFwiLHN1Y2Nlc3M6ZnVuY3Rpb24oYSxjKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBiP2IoYyxhKTp2b2lkIDB9LGNvbXBsZXRlOlN0cmlwZS5jb21wbGV0ZShiLFwiQSBuZXR3b3JrIGVycm9yIGhhcyBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBhIEJpdGNvaW4gYWRkcmVzcy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIiksdGltZW91dDo0ZTR9KX0sYi5nZXRSZWNlaXZlcj1mdW5jdGlvbihhLGIpe3ZhciBjO2lmKCFhKXRocm93IG5ldyBFcnJvcihcInJlY2VpdmVyIGlkIHJlcXVpcmVkXCIpO3JldHVybiBjPVN0cmlwZS5rZXl8fFN0cmlwZS5wdWJsaXNoYWJsZUtleSxTdHJpcGUudXRpbHMudmFsaWRhdGVLZXkoYyksU3RyaXBlLnJlcXVlc3Qoe3VybDpcIlwiK1N0cmlwZS5lbmRwb2ludCtcIi9iaXRjb2luL3JlY2VpdmVycy9cIithLGRhdGE6e2tleTpjfSxzdWNjZXNzOmZ1bmN0aW9uKGEsYyl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYj9iKGMsYSk6dm9pZCAwfSxjb21wbGV0ZTpTdHJpcGUuY29tcGxldGUoYixcIkEgbmV0d29yayBlcnJvciBoYXMgb2NjdXJyZWQgbG9hZGluZyBkYXRhIGZyb20gU3RyaXBlLiBQbGVhc2UgdHJ5IGFnYWluLlwiKSx0aW1lb3V0OjRlNH0pfSxiLnBvbGxSZWNlaXZlcj1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLl9pbml0UG9sbChhKSx0aGlzLl9wb2xsKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuZ2V0UmVjZWl2ZXIoYixjKX19KHRoaXMpLGZ1bmN0aW9uKGEsYil7cmV0dXJuITF9LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGIuZmlsbGVkfSxiKX0sYi5jYW5jZWxSZWNlaXZlclBvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIGIuX2NhbmNlbFBvbGwoYSl9LGJ9KHRoaXMuU3RyaXBlLl9wb2xsZXIpLHRoaXMuU3RyaXBlLnNvdXJjZT1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7cmV0dXJuIGIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gayhiLGEpLGIuZ2V0PWZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2lmKCFhKXRocm93IG5ldyBFcnJvcihcInNvdXJjZUlkIHJlcXVpcmVkXCIpO2lmKCFiKXRocm93IG5ldyBFcnJvcihcImNsaWVudFNlY3JldCByZXF1aXJlZFwiKTtyZXR1cm4gZD1TdHJpcGUua2V5fHxTdHJpcGUucHVibGlzaGFibGVLZXksU3RyaXBlLnV0aWxzLnZhbGlkYXRlS2V5KGQpLGU9e30sZS5rZXk9ZCxlLmNsaWVudF9zZWNyZXQ9YixTdHJpcGUucmVxdWVzdCh7dXJsOlwiXCIrU3RyaXBlLmVuZHBvaW50K1wiL3NvdXJjZXMvXCIrYSxkYXRhOmUsc3VjY2VzczpmdW5jdGlvbihhLGIpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGM/YyhiLGEpOnZvaWQgMH0sY29tcGxldGU6U3RyaXBlLmNvbXBsZXRlKGMsXCJBIG5ldHdvcmsgZXJyb3IgaGFzIG9jY3VycmVkIGxvYWRpbmcgZGF0YSBmcm9tIFN0cmlwZS4gUGxlYXNlIHRyeSBhZ2Fpbi5cIiksdGltZW91dDo0ZTR9KX0sYi5wb2xsPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5faW5pdFBvbGwoYSksdGhpcy5fcG9sbChhLGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjLGQpe3JldHVybiBhLmdldChjLGIsZCl9fSh0aGlzKSxmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5fYWN0aXZlUG9sbHNbYl0uc291cmNlX3N0YXR1cyE9PWMuc3RhdHVzPyhhLl9hY3RpdmVQb2xsc1tiXS5zb3VyY2Vfc3RhdHVzPWMuc3RhdHVzLCEwKTohMX19KHRoaXMpLGZ1bmN0aW9uKGEsYil7cmV0dXJuITF9LGMpfSxiLmNhbmNlbFBvbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX2NhbmNlbFBvbGwoYSl9LGJ9KHRoaXMuU3RyaXBlLl9wb2xsZXIpLGE9W1wiY3JlYXRlVG9rZW5cIixcImdldFRva2VuXCIsXCJjYXJkVHlwZVwiLFwidmFsaWRhdGVFeHBpcnlcIixcInZhbGlkYXRlQ1ZDXCIsXCJ2YWxpZGF0ZUNhcmROdW1iZXJcIl07Zm9yKGg9MCxpPWEubGVuZ3RoO2k+aDtoKyspZT1hW2hdLHRoaXMuU3RyaXBlW2VdPXRoaXMuU3RyaXBlLmNhcmRbZV07dGhpcy5TdHJpcGUuc3RyaXBlanNfdWE9XCJzdHJpcGUuanMvMTI3Nzg3ZVwiLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm51bGwhPT1tb2R1bGUmJihtb2R1bGUuZXhwb3J0cz10aGlzLlN0cmlwZSksXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUoXCJzdHJpcGVcIixbXSxmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5TdHJpcGV9fSh0aGlzKSl9KS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7dGhpcy5TdHJpcGUuaXNEb3VibGVMb2FkZWR8fGZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYSxlKXtmdW5jdGlvbiBmKGEpe2lmKGZbYV0hPT1xKXJldHVybiBmW2FdO3ZhciBiO2lmKFwiYnVnLXN0cmluZy1jaGFyLWluZGV4XCI9PWEpYj1cImFcIiE9XCJhXCJbMF07ZWxzZSBpZihcImpzb25cIj09YSliPWYoXCJqc29uLXN0cmluZ2lmeVwiKSYmZihcImpzb24tcGFyc2VcIik7ZWxzZXt2YXIgYyxkPSd7XCJhXCI6WzEsdHJ1ZSxmYWxzZSxudWxsLFwiXFxcXHUwMDAwXFxcXGJcXFxcblxcXFxmXFxcXHJcXFxcdFwiXX0nO2lmKFwianNvbi1zdHJpbmdpZnlcIj09YSl7dmFyIGk9ZS5zdHJpbmdpZnksaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiZ0O2lmKGspeyhjPWZ1bmN0aW9uKCl7cmV0dXJuIDF9KS50b0pTT049Yzt0cnl7az1cIjBcIj09PWkoMCkmJlwiMFwiPT09aShuZXcgZykmJidcIlwiJz09aShuZXcgaCkmJmkocyk9PT1xJiZpKHEpPT09cSYmaSgpPT09cSYmXCIxXCI9PT1pKGMpJiZcIlsxXVwiPT1pKFtjXSkmJlwiW251bGxdXCI9PWkoW3FdKSYmXCJudWxsXCI9PWkobnVsbCkmJlwiW251bGwsbnVsbCxudWxsXVwiPT1pKFtxLHMsbnVsbF0pJiZpKHthOltjLCEwLCExLG51bGwsXCJcXHgwMFxcYlxcblxcZlxcclx0XCJdfSk9PWQmJlwiMVwiPT09aShudWxsLGMpJiZcIltcXG4gMSxcXG4gMlxcbl1cIj09aShbMSwyXSxudWxsLDEpJiYnXCItMjcxODIxLTA0LTIwVDAwOjAwOjAwLjAwMFpcIic9PWkobmV3IGooLTg2NGUxMykpJiYnXCIrMjc1NzYwLTA5LTEzVDAwOjAwOjAwLjAwMFpcIic9PWkobmV3IGooODY0ZTEzKSkmJidcIi0wMDAwMDEtMDEtMDFUMDA6MDA6MDAuMDAwWlwiJz09aShuZXcgaigtNjIxOTg3NTUyZTUpKSYmJ1wiMTk2OS0xMi0zMVQyMzo1OTo1OS45OTlaXCInPT1pKG5ldyBqKC0xKSl9Y2F0Y2gobCl7az0hMX19Yj1rfWlmKFwianNvbi1wYXJzZVwiPT1hKXt2YXIgbT1lLnBhcnNlO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG0pdHJ5e2lmKDA9PT1tKFwiMFwiKSYmIW0oITEpKXtjPW0oZCk7dmFyIG49NT09Yy5hLmxlbmd0aCYmMT09PWMuYVswXTtpZihuKXt0cnl7bj0hbSgnXCJcdFwiJyl9Y2F0Y2gobCl7fWlmKG4pdHJ5e249MSE9PW0oXCIwMVwiKX1jYXRjaChsKXt9aWYobil0cnl7bj0xIT09bShcIjEuXCIpfWNhdGNoKGwpe319fX1jYXRjaChsKXtuPSExfWI9bn19cmV0dXJuIGZbYV09ISFifWF8fChhPWQuT2JqZWN0KCkpLGV8fChlPWQuT2JqZWN0KCkpO3ZhciBnPWEuTnVtYmVyfHxkLk51bWJlcixoPWEuU3RyaW5nfHxkLlN0cmluZyxpPWEuT2JqZWN0fHxkLk9iamVjdCxqPWEuRGF0ZXx8ZC5EYXRlLGs9YS5TeW50YXhFcnJvcnx8ZC5TeW50YXhFcnJvcixsPWEuVHlwZUVycm9yfHxkLlR5cGVFcnJvcixtPWEuTWF0aHx8ZC5NYXRoLG49YS5KU09OfHxkLkpTT047XCJvYmplY3RcIj09dHlwZW9mIG4mJm4mJihlLnN0cmluZ2lmeT1uLnN0cmluZ2lmeSxlLnBhcnNlPW4ucGFyc2UpO3ZhciBvLHAscSxyPWkucHJvdG90eXBlLHM9ci50b1N0cmluZyx0PW5ldyBqKC0weGM3ODJiNWI4MDBjZWMpO3RyeXt0PS0xMDkyNTI9PXQuZ2V0VVRDRnVsbFllYXIoKSYmMD09PXQuZ2V0VVRDTW9udGgoKSYmMT09PXQuZ2V0VVRDRGF0ZSgpJiYxMD09dC5nZXRVVENIb3VycygpJiYzNz09dC5nZXRVVENNaW51dGVzKCkmJjY9PXQuZ2V0VVRDU2Vjb25kcygpJiY3MDg9PXQuZ2V0VVRDTWlsbGlzZWNvbmRzKCl9Y2F0Y2godSl7fWlmKCFmKFwianNvblwiKSl7dmFyIHY9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLHc9XCJbb2JqZWN0IERhdGVdXCIseD1cIltvYmplY3QgTnVtYmVyXVwiLHk9XCJbb2JqZWN0IFN0cmluZ11cIix6PVwiW29iamVjdCBBcnJheV1cIixBPVwiW29iamVjdCBCb29sZWFuXVwiLEI9ZihcImJ1Zy1zdHJpbmctY2hhci1pbmRleFwiKTtpZighdCl2YXIgQz1tLmZsb29yLEQ9WzAsMzEsNTksOTAsMTIwLDE1MSwxODEsMjEyLDI0MywyNzMsMzA0LDMzNF0sRT1mdW5jdGlvbihhLGIpe3JldHVybiBEW2JdKzM2NSooYS0xOTcwKStDKChhLTE5NjkrKGI9KyhiPjEpKSkvNCktQygoYS0xOTAxK2IpLzEwMCkrQygoYS0xNjAxK2IpLzQwMCl9O2lmKChvPXIuaGFzT3duUHJvcGVydHkpfHwobz1mdW5jdGlvbihhKXt2YXIgYixjPXt9O3JldHVybihjLl9fcHJvdG9fXz1udWxsLGMuX19wcm90b19fPXt0b1N0cmluZzoxfSxjKS50b1N0cmluZyE9cz9vPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuX19wcm90b19fLGM9YSBpbih0aGlzLl9fcHJvdG9fXz1udWxsLHRoaXMpO3JldHVybiB0aGlzLl9fcHJvdG9fXz1iLGN9OihiPWMuY29uc3RydWN0b3Isbz1mdW5jdGlvbihhKXt2YXIgYz0odGhpcy5jb25zdHJ1Y3Rvcnx8YikucHJvdG90eXBlO3JldHVybiBhIGluIHRoaXMmJiEoYSBpbiBjJiZ0aGlzW2FdPT09Y1thXSl9KSxjPW51bGwsby5jYWxsKHRoaXMsYSl9KSxwPWZ1bmN0aW9uKGEsYil7dmFyIGQsZSxmLGc9MDsoZD1mdW5jdGlvbigpe3RoaXMudmFsdWVPZj0wfSkucHJvdG90eXBlLnZhbHVlT2Y9MCxlPW5ldyBkO2ZvcihmIGluIGUpby5jYWxsKGUsZikmJmcrKztyZXR1cm4gZD1lPW51bGwsZz9wPTI9PWc/ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPXt9LGU9cy5jYWxsKGEpPT12O2ZvcihjIGluIGEpZSYmXCJwcm90b3R5cGVcIj09Y3x8by5jYWxsKGQsYyl8fCEoZFtjXT0xKXx8IW8uY2FsbChhLGMpfHxiKGMpfTpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZT1zLmNhbGwoYSk9PXY7Zm9yKGMgaW4gYSllJiZcInByb3RvdHlwZVwiPT1jfHwhby5jYWxsKGEsYyl8fChkPVwiY29uc3RydWN0b3JcIj09PWMpfHxiKGMpOyhkfHxvLmNhbGwoYSxjPVwiY29uc3RydWN0b3JcIikpJiZiKGMpfTooZT1bXCJ2YWx1ZU9mXCIsXCJ0b1N0cmluZ1wiLFwidG9Mb2NhbGVTdHJpbmdcIixcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXCJpc1Byb3RvdHlwZU9mXCIsXCJoYXNPd25Qcm9wZXJ0eVwiLFwiY29uc3RydWN0b3JcIl0scD1mdW5jdGlvbihhLGIpe3ZhciBkLGYsZz1zLmNhbGwoYSk9PXYsaD0hZyYmXCJmdW5jdGlvblwiIT10eXBlb2YgYS5jb25zdHJ1Y3RvciYmY1t0eXBlb2YgYS5oYXNPd25Qcm9wZXJ0eV0mJmEuaGFzT3duUHJvcGVydHl8fG87Zm9yKGQgaW4gYSlnJiZcInByb3RvdHlwZVwiPT1kfHwhaC5jYWxsKGEsZCl8fGIoZCk7Zm9yKGY9ZS5sZW5ndGg7ZD1lWy0tZl07aC5jYWxsKGEsZCkmJmIoZCkpO30pLHAoYSxiKX0sIWYoXCJqc29uLXN0cmluZ2lmeVwiKSl7dmFyIEY9ezkyOlwiXFxcXFxcXFxcIiwzNDonXFxcXFwiJyw4OlwiXFxcXGJcIiwxMjpcIlxcXFxmXCIsMTA6XCJcXFxcblwiLDEzOlwiXFxcXHJcIiw5OlwiXFxcXHRcIn0sRz1cIjAwMDAwMFwiLEg9ZnVuY3Rpb24oYSxiKXtyZXR1cm4oRysoYnx8MCkpLnNsaWNlKC1hKX0sST1cIlxcXFx1MDBcIixKPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj0nXCInLGM9MCxkPWEubGVuZ3RoLGU9IUJ8fGQ+MTAsZj1lJiYoQj9hLnNwbGl0KFwiXCIpOmEpO2Q+YztjKyspe3ZhciBnPWEuY2hhckNvZGVBdChjKTtzd2l0Y2goZyl7Y2FzZSA4OmNhc2UgOTpjYXNlIDEwOmNhc2UgMTI6Y2FzZSAxMzpjYXNlIDM0OmNhc2UgOTI6Yis9RltnXTticmVhaztkZWZhdWx0OmlmKDMyPmcpe2IrPUkrSCgyLGcudG9TdHJpbmcoMTYpKTticmVha31iKz1lP2ZbY106YS5jaGFyQXQoYyl9fXJldHVybiBiKydcIid9LEs9ZnVuY3Rpb24oYSxiLGMsZCxlLGYsZyl7dmFyIGgsaSxqLGssbSxuLHIsdCx1LHYsQixELEYsRyxJLEw7dHJ5e2g9YlthXX1jYXRjaChNKXt9aWYoXCJvYmplY3RcIj09dHlwZW9mIGgmJmgpaWYoaT1zLmNhbGwoaCksaSE9d3x8by5jYWxsKGgsXCJ0b0pTT05cIikpXCJmdW5jdGlvblwiPT10eXBlb2YgaC50b0pTT04mJihpIT14JiZpIT15JiZpIT16fHxvLmNhbGwoaCxcInRvSlNPTlwiKSkmJihoPWgudG9KU09OKGEpKTtlbHNlIGlmKGg+LTEvMCYmMS8wPmgpe2lmKEUpe2ZvcihtPUMoaC84NjRlNSksaj1DKG0vMzY1LjI0MjUpKzE5NzAtMTtFKGorMSwwKTw9bTtqKyspO2ZvcihrPUMoKG0tRShqLDApKS8zMC40Mik7RShqLGsrMSk8PW07aysrKTttPTErbS1FKGosayksbj0oaCU4NjRlNSs4NjRlNSklODY0ZTUscj1DKG4vMzZlNSklMjQsdD1DKG4vNmU0KSU2MCx1PUMobi8xZTMpJTYwLHY9biUxZTN9ZWxzZSBqPWguZ2V0VVRDRnVsbFllYXIoKSxrPWguZ2V0VVRDTW9udGgoKSxtPWguZ2V0VVRDRGF0ZSgpLHI9aC5nZXRVVENIb3VycygpLHQ9aC5nZXRVVENNaW51dGVzKCksdT1oLmdldFVUQ1NlY29uZHMoKSx2PWguZ2V0VVRDTWlsbGlzZWNvbmRzKCk7aD0oMD49anx8aj49MWU0PygwPmo/XCItXCI6XCIrXCIpK0goNiwwPmo/LWo6aik6SCg0LGopKStcIi1cIitIKDIsaysxKStcIi1cIitIKDIsbSkrXCJUXCIrSCgyLHIpK1wiOlwiK0goMix0KStcIjpcIitIKDIsdSkrXCIuXCIrSCgzLHYpK1wiWlwifWVsc2UgaD1udWxsO2lmKGMmJihoPWMuY2FsbChiLGEsaCkpLG51bGw9PT1oKXJldHVyblwibnVsbFwiO2lmKGk9cy5jYWxsKGgpLGk9PUEpcmV0dXJuXCJcIitoO2lmKGk9PXgpcmV0dXJuIGg+LTEvMCYmMS8wPmg/XCJcIitoOlwibnVsbFwiO2lmKGk9PXkpcmV0dXJuIEooXCJcIitoKTtpZihcIm9iamVjdFwiPT10eXBlb2YgaCl7Zm9yKEc9Zy5sZW5ndGg7Ry0tOylpZihnW0ddPT09aCl0aHJvdyBsKCk7aWYoZy5wdXNoKGgpLEI9W10sST1mLGYrPWUsaT09eil7Zm9yKEY9MCxHPWgubGVuZ3RoO0c+RjtGKyspRD1LKEYsaCxjLGQsZSxmLGcpLEIucHVzaChEPT09cT9cIm51bGxcIjpEKTtMPUIubGVuZ3RoP2U/XCJbXFxuXCIrZitCLmpvaW4oXCIsXFxuXCIrZikrXCJcXG5cIitJK1wiXVwiOlwiW1wiK0Iuam9pbihcIixcIikrXCJdXCI6XCJbXVwifWVsc2UgcChkfHxoLGZ1bmN0aW9uKGEpe3ZhciBiPUsoYSxoLGMsZCxlLGYsZyk7YiE9PXEmJkIucHVzaChKKGEpK1wiOlwiKyhlP1wiIFwiOlwiXCIpK2IpfSksTD1CLmxlbmd0aD9lP1wie1xcblwiK2YrQi5qb2luKFwiLFxcblwiK2YpK1wiXFxuXCIrSStcIn1cIjpcIntcIitCLmpvaW4oXCIsXCIpK1wifVwiOlwie31cIjtyZXR1cm4gZy5wb3AoKSxMfX07ZS5zdHJpbmdpZnk9ZnVuY3Rpb24oYSxiLGQpe3ZhciBlLGYsZyxoO2lmKGNbdHlwZW9mIGJdJiZiKWlmKChoPXMuY2FsbChiKSk9PXYpZj1iO2Vsc2UgaWYoaD09eil7Zz17fTtmb3IodmFyIGksaj0wLGs9Yi5sZW5ndGg7az5qO2k9YltqKytdLGg9cy5jYWxsKGkpLChoPT15fHxoPT14KSYmKGdbaV09MSkpO31pZihkKWlmKChoPXMuY2FsbChkKSk9PXgpe2lmKChkLT1kJTEpPjApZm9yKGU9XCJcIixkPjEwJiYoZD0xMCk7ZS5sZW5ndGg8ZDtlKz1cIiBcIik7fWVsc2UgaD09eSYmKGU9ZC5sZW5ndGg8PTEwP2Q6ZC5zbGljZSgwLDEwKSk7cmV0dXJuIEsoXCJcIiwoaT17fSxpW1wiXCJdPWEsaSksZixnLGUsXCJcIixbXSl9fWlmKCFmKFwianNvbi1wYXJzZVwiKSl7dmFyIEwsTSxOPWguZnJvbUNoYXJDb2RlLE89ezkyOlwiXFxcXFwiLDM0OidcIicsNDc6XCIvXCIsOTg6XCJcXGJcIiwxMTY6XCJcdFwiLDExMDpcIlxcblwiLDEwMjpcIlxcZlwiLDExNDpcIlxcclwifSxQPWZ1bmN0aW9uKCl7dGhyb3cgTD1NPW51bGwsaygpfSxRPWZ1bmN0aW9uKCl7Zm9yKHZhciBhLGIsYyxkLGUsZj1NLGc9Zi5sZW5ndGg7Zz5MOylzd2l0Y2goZT1mLmNoYXJDb2RlQXQoTCkpe2Nhc2UgOTpjYXNlIDEwOmNhc2UgMTM6Y2FzZSAzMjpMKys7YnJlYWs7Y2FzZSAxMjM6Y2FzZSAxMjU6Y2FzZSA5MTpjYXNlIDkzOmNhc2UgNTg6Y2FzZSA0NDpyZXR1cm4gYT1CP2YuY2hhckF0KEwpOmZbTF0sTCsrLGE7Y2FzZSAzNDpmb3IoYT1cIkBcIixMKys7Zz5MOylpZihlPWYuY2hhckNvZGVBdChMKSwzMj5lKVAoKTtlbHNlIGlmKDkyPT1lKXN3aXRjaChlPWYuY2hhckNvZGVBdCgrK0wpKXtjYXNlIDkyOmNhc2UgMzQ6Y2FzZSA0NzpjYXNlIDk4OmNhc2UgMTE2OmNhc2UgMTEwOmNhc2UgMTAyOmNhc2UgMTE0OmErPU9bZV0sTCsrO2JyZWFrO2Nhc2UgMTE3OmZvcihiPSsrTCxjPUwrNDtjPkw7TCsrKWU9Zi5jaGFyQ29kZUF0KEwpLGU+PTQ4JiY1Nz49ZXx8ZT49OTcmJjEwMj49ZXx8ZT49NjUmJjcwPj1lfHxQKCk7YSs9TihcIjB4XCIrZi5zbGljZShiLEwpKTticmVhaztkZWZhdWx0OlAoKX1lbHNle2lmKDM0PT1lKWJyZWFrO2ZvcihlPWYuY2hhckNvZGVBdChMKSxiPUw7ZT49MzImJjkyIT1lJiYzNCE9ZTspZT1mLmNoYXJDb2RlQXQoKytMKTthKz1mLnNsaWNlKGIsTCl9aWYoMzQ9PWYuY2hhckNvZGVBdChMKSlyZXR1cm4gTCsrLGE7UCgpO2RlZmF1bHQ6aWYoYj1MLDQ1PT1lJiYoZD0hMCxlPWYuY2hhckNvZGVBdCgrK0wpKSxlPj00OCYmNTc+PWUpe2Zvcig0OD09ZSYmKGU9Zi5jaGFyQ29kZUF0KEwrMSksZT49NDgmJjU3Pj1lKSYmUCgpLGQ9ITE7Zz5MJiYoZT1mLmNoYXJDb2RlQXQoTCksZT49NDgmJjU3Pj1lKTtMKyspO2lmKDQ2PT1mLmNoYXJDb2RlQXQoTCkpe2ZvcihjPSsrTDtnPmMmJihlPWYuY2hhckNvZGVBdChjKSxlPj00OCYmNTc+PWUpO2MrKyk7Yz09TCYmUCgpLEw9Y31pZihlPWYuY2hhckNvZGVBdChMKSwxMDE9PWV8fDY5PT1lKXtmb3IoZT1mLmNoYXJDb2RlQXQoKytMKSw0MyE9ZSYmNDUhPWV8fEwrKyxjPUw7Zz5jJiYoZT1mLmNoYXJDb2RlQXQoYyksZT49NDgmJjU3Pj1lKTtjKyspO2M9PUwmJlAoKSxMPWN9cmV0dXJuK2Yuc2xpY2UoYixMKX1pZihkJiZQKCksXCJ0cnVlXCI9PWYuc2xpY2UoTCxMKzQpKXJldHVybiBMKz00LCEwO2lmKFwiZmFsc2VcIj09Zi5zbGljZShMLEwrNSkpcmV0dXJuIEwrPTUsITE7aWYoXCJudWxsXCI9PWYuc2xpY2UoTCxMKzQpKXJldHVybiBMKz00LG51bGw7UCgpfXJldHVyblwiJFwifSxSPWZ1bmN0aW9uKGEpe3ZhciBiLGM7aWYoXCIkXCI9PWEmJlAoKSxcInN0cmluZ1wiPT10eXBlb2YgYSl7aWYoXCJAXCI9PShCP2EuY2hhckF0KDApOmFbMF0pKXJldHVybiBhLnNsaWNlKDEpO2lmKFwiW1wiPT1hKXtmb3IoYj1bXTthPVEoKSxcIl1cIiE9YTtjfHwoYz0hMCkpYyYmKFwiLFwiPT1hPyhhPVEoKSxcIl1cIj09YSYmUCgpKTpQKCkpLFwiLFwiPT1hJiZQKCksYi5wdXNoKFIoYSkpO3JldHVybiBifWlmKFwie1wiPT1hKXtmb3IoYj17fTthPVEoKSxcIn1cIiE9YTtjfHwoYz0hMCkpYyYmKFwiLFwiPT1hPyhhPVEoKSxcIn1cIj09YSYmUCgpKTpQKCkpLFwiLFwiIT1hJiZcInN0cmluZ1wiPT10eXBlb2YgYSYmXCJAXCI9PShCP2EuY2hhckF0KDApOmFbMF0pJiZcIjpcIj09USgpfHxQKCksYlthLnNsaWNlKDEpXT1SKFEoKSk7cmV0dXJuIGJ9UCgpfXJldHVybiBhfSxTPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1UKGEsYixjKTtkPT09cT9kZWxldGUgYVtiXTphW2JdPWR9LFQ9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU9YVtiXTtpZihcIm9iamVjdFwiPT10eXBlb2YgZSYmZSlpZihzLmNhbGwoZSk9PXopZm9yKGQ9ZS5sZW5ndGg7ZC0tOylTKGUsZCxjKTtlbHNlIHAoZSxmdW5jdGlvbihhKXtTKGUsYSxjKX0pO3JldHVybiBjLmNhbGwoYSxiLGUpfTtlLnBhcnNlPWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtyZXR1cm4gTD0wLE09XCJcIithLGM9UihRKCkpLFwiJFwiIT1RKCkmJlAoKSxMPU09bnVsbCxiJiZzLmNhbGwoYik9PXY/VCgoZD17fSxkW1wiXCJdPWMsZCksXCJcIixiKTpjfX19cmV0dXJuIGUucnVuSW5Db250ZXh0PWIsZX12YXIgYz17XCJmdW5jdGlvblwiOiEwLG9iamVjdDohMH0sZD10aGlzLGU9YihhLGQpO2QuSlNPTj17cGFyc2U6ZS5wYXJzZSxzdHJpbmdpZnk6ZS5zdHJpbmdpZnl9fS5jYWxsKFN0cmlwZSx0aGlzKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3RoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkfHwhZnVuY3Rpb24oYSxiLGMsZCxlLGYpe2Z1bmN0aW9uIGcoYSxiKXt2YXIgYz10eXBlb2YgYVtiXTtyZXR1cm5cImZ1bmN0aW9uXCI9PWN8fCEoXCJvYmplY3RcIiE9Y3x8IWFbYl0pfHxcInVua25vd25cIj09Y31mdW5jdGlvbiBoKCl7dmFyIGE9XCJTaG9ja3dhdmUgRmxhc2hcIixiPVwiYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2hcIjtpZighcChuYXZpZ2F0b3IucGx1Z2lucykmJlwib2JqZWN0XCI9PXR5cGVvZiBuYXZpZ2F0b3IucGx1Z2luc1thXSl7dmFyIGM9bmF2aWdhdG9yLnBsdWdpbnNbYV0uZGVzY3JpcHRpb247YyYmIXAobmF2aWdhdG9yLm1pbWVUeXBlcykmJm5hdmlnYXRvci5taW1lVHlwZXNbYl0mJm5hdmlnYXRvci5taW1lVHlwZXNbYl0uZW5hYmxlZFBsdWdpbiYmKHg9Yy5tYXRjaCgvXFxkKy9nKSl9aWYoIXgpe3ZhciBkO3RyeXtkPW5ldyBBY3RpdmVYT2JqZWN0KFwiU2hvY2t3YXZlRmxhc2guU2hvY2t3YXZlRmxhc2hcIikseD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkLkdldFZhcmlhYmxlKFwiJHZlcnNpb25cIikubWF0Y2goLyhcXGQrKSwoXFxkKyksKFxcZCspLChcXGQrKS8pLDEpLGQ9bnVsbH1jYXRjaChlKXt9fWlmKCF4KXJldHVybiExO3ZhciBmPXBhcnNlSW50KHhbMF0sMTApLGc9cGFyc2VJbnQoeFsxXSwxMCk7cmV0dXJuIHk9Zj45JiZnPjAsITB9ZnVuY3Rpb24gaSgpe2lmKCFMKXtMPSEwO2Zvcih2YXIgYT0wO2E8TS5sZW5ndGg7YSsrKU1bYV0oKTtNLmxlbmd0aD0wfX1mdW5jdGlvbiBqKGEsYil7cmV0dXJuIEw/dm9pZCBhLmNhbGwoYik6dm9pZCBNLnB1c2goZnVuY3Rpb24oKXthLmNhbGwoYil9KX1mdW5jdGlvbiBrKGEpe3JldHVybiBhLm1hdGNoKEQpWzNdfWZ1bmN0aW9uIGwoYSl7cmV0dXJuIGEubWF0Y2goRClbNF18fFwiXCJ9ZnVuY3Rpb24gbShhKXt2YXIgYixjLGQ9YS50b0xvd2VyQ2FzZSgpLm1hdGNoKEQpLGU9XCJcIixmPVwiXCI7dHJ5e2I9ZFsyXSxjPWRbM10sZT1kWzRdfHxcIlwiLChcImh0dHA6XCI9PWImJlwiOjgwXCI9PWV8fFwiaHR0cHM6XCI9PWImJlwiOjQ0M1wiPT1lKSYmKGU9XCJcIiksZj1iK1wiLy9cIitjK2V9Y2F0Y2goZyl7Zj1hfXJldHVybiBmfWZ1bmN0aW9uIG4oYSl7aWYoYT1hLnJlcGxhY2UoRixcIiQxL1wiKSwhYS5tYXRjaCgvXihodHRwfHxodHRwcyk6XFwvXFwvLykpe3ZhciBiPVwiL1wiPT09YS5zdWJzdHJpbmcoMCwxKT9cIlwiOmMucGF0aG5hbWU7XCIvXCIhPT1iLnN1YnN0cmluZyhiLmxlbmd0aC0xKSYmKGI9Yi5zdWJzdHJpbmcoMCxiLmxhc3RJbmRleE9mKFwiL1wiKSsxKSksYT1jLnByb3RvY29sK1wiLy9cIitjLmhvc3QrYithfWZvcig7RS50ZXN0KGEpOylhPWEucmVwbGFjZShFLFwiXCIpO3JldHVybiBhfWZ1bmN0aW9uIG8oYSxiKXt2YXIgYz1cIlwiLGQ9YS5pbmRleE9mKFwiI1wiKTstMSE9PWQmJihjPWEuc3Vic3RyaW5nKGQpLGE9YS5zdWJzdHJpbmcoMCxkKSk7dmFyIGUsZz1bXTtmb3IodmFyIGggaW4gYiliLmhhc093blByb3BlcnR5KGgpJiYoZT1cInN0cmlwZV9cIitoLGcucHVzaChlK1wiPVwiK2YoYltoXSkpKTtyZXR1cm4gYSsoSj9cIiNcIjotMT09YS5pbmRleE9mKFwiP1wiKT9cIj9cIjpcIiZcIikrZy5qb2luKFwiJlwiKStjfWZ1bmN0aW9uIHAoYSl7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGF9ZnVuY3Rpb24gcShhLGIsYyl7dmFyIGQ7Zm9yKHZhciBlIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShlKSYmKGUgaW4gYT8oZD1iW2VdLFwib2JqZWN0XCI9PXR5cGVvZiBkP3EoYVtlXSxkLGMpOmN8fChhW2VdPWJbZV0pKTphW2VdPWJbZV0pO3JldHVybiBhfWZ1bmN0aW9uIHIoKXt2YXIgYT1iLmJvZHkuYXBwZW5kQ2hpbGQoYi5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKSksYz1hLmFwcGVuZENoaWxkKGIuY3JlYXRlRWxlbWVudChcImlucHV0XCIpKTtjLm5hbWU9SStcIlRFU1RcIitDLHc9YyE9PWEuZWxlbWVudHNbYy5uYW1lXSxiLmJvZHkucmVtb3ZlQ2hpbGQoYSl9ZnVuY3Rpb24gcyhjKXtwKHcpJiZyKCk7dmFyIGU7dz9lPWIuY3JlYXRlRWxlbWVudCgnPGlmcmFtZSBuYW1lPVwiJytjLnByb3BzLm5hbWUrJ1wiLz4nKTooZT1iLmNyZWF0ZUVsZW1lbnQoXCJJRlJBTUVcIiksZS5uYW1lPWMucHJvcHMubmFtZSksZS5pZD1lLm5hbWU9Yy5wcm9wcy5uYW1lLGRlbGV0ZSBjLnByb3BzLm5hbWUsXCJzdHJpbmdcIj09dHlwZW9mIGMuY29udGFpbmVyJiYoYy5jb250YWluZXI9Yi5nZXRFbGVtZW50QnlJZChjLmNvbnRhaW5lcikpLGMuY29udGFpbmVyfHwocShlLnN0eWxlLHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOlwiLTIwMDBweFwiLGxlZnQ6XCIwcHhcIn0pLGMuY29udGFpbmVyPWIuYm9keSk7dmFyIGY9Yy5wcm9wcy5zcmM7Yy5wcm9wcy5zcmM9XCJhYm91dDpibGFua1wiLHEoZSxjLnByb3BzKSxlLmJvcmRlcj1lLmZyYW1lQm9yZGVyPTAsZS5hbGxvd1RyYW5zcGFyZW5jeT0hMDt2YXIgZz0hMTtyZXR1cm4gYy5vbkZyYW1lQWNrJiZcInBvc3RNZXNzYWdlXCJpbiBhJiZhLmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGZ1bmN0aW9uKGEpe3ZhciBiPVN0cmlwZS5faWZyYW1lQmFzZVVybC5yZXBsYWNlKC9eaHR0cHM/OlxcL1xcLy8sXCJcIikucmVwbGFjZSgvXFwvLiokLyxcIlwiKSxkPWEub3JpZ2luLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLyxcIlwiKS5yZXBsYWNlKC9cXC8uKiQvLFwiXCIpO2I9PT1kJiZcInN0cmlwZTphY2tcIj09PWEuZGF0YSYmYy5vbkZyYW1lQWNrKCEwKX0sITEpOmc9ITAsYy5jb250YWluZXIuYXBwZW5kQ2hpbGQoZSksYy5vbkxvYWQmJnooZSxcImxvYWRcIixmdW5jdGlvbigpe2Mub25Mb2FkLmFwcGx5KGMsYXJndW1lbnRzKSxnJiZjLm9uRnJhbWVBY2soITEpfSksYy5vbkVycm9yJiZ6KGUsXCJlcnJvclwiLGZ1bmN0aW9uKCl7Yy5vbkVycm9yLmFwcGx5KGMsYXJndW1lbnRzKX0pLGUuc3JjPWYsYy5vbkFzeW5jSW5qZWN0JiZkKGZ1bmN0aW9uKCl7Yy5vbkFzeW5jSW5qZWN0LmNhbGwoYyxlKX0sNWUzKSxjLnByb3BzLnNyYz1mLGV9ZnVuY3Rpb24gdChjKXt2YXIgZCxlPWMucHJvdG9jb2w7aWYoYy5pc0hvc3Q9Yy5pc0hvc3R8fHAoTy54ZG1fcCksSj1jLmhhc2h8fCExLGMucHJvcHN8fChjLnByb3BzPXt9KSxjLmlzSG9zdCl7aWYoYy5yZW1vdGU9bihjLnJlbW90ZSksYy5jaGFubmVsPWMuY2hhbm5lbHx8XCJkZWZhdWx0XCIrQysrLGMuc2VjcmV0PU1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygyKSxwKGUpKWlmKGcoYSxcInBvc3RNZXNzYWdlXCIpfHxnKGIsXCJwb3N0TWVzc2FnZVwiKSllPVwiMVwiO2Vsc2V7aWYoIShjLnN3ZiYmZyhhLFwiQWN0aXZlWE9iamVjdFwiKSYmaCgpKSl0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWl0YWJsZSB0cmFuc3BvcnQgcHJvdG9jb2wgZm9yIFN0cmlwZS5qc1wiKTtlPVwiNlwifX1lbHNlIGMuY2hhbm5lbD1PLnhkbV9jLnJlcGxhY2UoL1tcIic8PlxcXFxdL2csXCJcIiksYy5zZWNyZXQ9Ty54ZG1fcyxjLnJlbW90ZT1PLnhkbV9lLnJlcGxhY2UoL1tcIic8PlxcXFxdL2csXCJcIiksZT1PLnhkbV9wO3N3aXRjaChjLnByb3RvY29sPWUsZSl7Y2FzZVwiMVwiOmQ9W25ldyBILnN0YWNrLlBvc3RNZXNzYWdlVHJhbnNwb3J0KGMpXTticmVhaztjYXNlXCI2XCI6eHx8aCgpLGQ9W25ldyBILnN0YWNrLkZsYXNoVHJhbnNwb3J0KGMpXX1yZXR1cm4gZD8oZC5wdXNoKG5ldyBILnN0YWNrLlF1ZXVlQmVoYXZpb3Ioe2xhenk6Yy5sYXp5LHJlbW92ZTohMH0pKSxkKTp2b2lkIGMub25JbnRlcm5hbEVycm9yLmNhbGwoYyxcIkJhZFhETVByb3RvY29sXCIpfWZ1bmN0aW9uIHUoYSl7Zm9yKHZhciBiLGM9e2luY29taW5nOmZ1bmN0aW9uKGEsYil7dGhpcy51cC5pbmNvbWluZyhhLGIpfSxvdXRnb2luZzpmdW5jdGlvbihhLGIpe3RoaXMuZG93bi5vdXRnb2luZyhhLGIpfSxjYWxsYmFjazpmdW5jdGlvbihhKXt0aGlzLnVwLmNhbGxiYWNrKGEpfSxpbml0OmZ1bmN0aW9uKCl7dGhpcy5kb3duLmluaXQoKX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZG93bi5kZXN0cm95KCl9fSxkPTAsZT1hLmxlbmd0aDtlPmQ7ZCsrKWI9YVtkXSxxKGIsYywhMCksMCE9PWQmJihiLmRvd249YVtkLTFdKSxkIT09ZS0xJiYoYi51cD1hW2QrMV0pO3JldHVybiBifWZ1bmN0aW9uIHYoYSl7YS51cC5kb3duPWEuZG93bixhLmRvd24udXA9YS51cCxhLnVwPWEuZG93bj1udWxsfXZhciB3LHgseSx6LEEsQj10aGlzLEM9TWF0aC5mbG9vcigxZTYqTWF0aC5yYW5kb20oKSksRD0oRnVuY3Rpb24ucHJvdG90eXBlLC9eKChodHRwOnxodHRwczp8ZmlsZTp8Y2hyb21lXFwtZXh0ZW5zaW9uOnxjaHJvbWU6KVxcL1xcLyhbXjpcXC9cXHNdKykoOlxcZCspKikvKSxFPS9bXFwtXFx3XStcXC9cXC5cXC5cXC8vLEY9LyhbXjpdKVxcL1xcLy9nLEc9XCJTdHJpcGVcIixIPXt9LEk9XCJzdHJpcGVYRE1fXCIsSj0hMTtpZihnKGEsXCJhZGRFdmVudExpc3RlbmVyXCIpKXo9ZnVuY3Rpb24oYSxiLGMpe2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfSxBPWZ1bmN0aW9uKGEsYixjKXthLnJlbW92ZUV2ZW50TGlzdGVuZXIoYixjLCExKX07ZWxzZXtpZighZyhhLFwiYXR0YWNoRXZlbnRcIikpdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGVkXCIpO3o9ZnVuY3Rpb24oYSxiLGMpe2EuYXR0YWNoRXZlbnQoXCJvblwiK2IsYyl9LEE9ZnVuY3Rpb24oYSxiLGMpe2EuZGV0YWNoRXZlbnQoXCJvblwiK2IsYyl9fXZhciBLLEw9ITEsTT1bXTtpZihcInJlYWR5U3RhdGVcImluIGI/KEs9Yi5yZWFkeVN0YXRlLEw9XCJjb21wbGV0ZVwiPT1LfHx+bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQXBwbGVXZWJLaXQvXCIpJiYoXCJsb2FkZWRcIj09S3x8XCJpbnRlcmFjdGl2ZVwiPT1LKSk6TD0hIWIuYm9keSwhTCl7aWYoZyhhLFwiYWRkRXZlbnRMaXN0ZW5lclwiKSl6KGIsXCJET01Db250ZW50TG9hZGVkXCIsaSk7ZWxzZSBpZih6KGIsXCJyZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24oKXtcImNvbXBsZXRlXCI9PWIucmVhZHlTdGF0ZSYmaSgpfSksYi5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwmJmE9PT10b3Ape3ZhciBOPWZ1bmN0aW9uKCl7aWYoIUwpe3RyeXtiLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbChcImxlZnRcIil9Y2F0Y2goYSl7cmV0dXJuIHZvaWQgZChOLDEpfWkoKX19O04oKX16KGEsXCJsb2FkXCIsaSl9dmFyIE89ZnVuY3Rpb24oYSl7YT1hLnN1YnN0cmluZygxKS5zcGxpdChcIiZcIik7Zm9yKHZhciBiLGM9e30sZD1hLmxlbmd0aDtkLS07KWI9YVtkXS5zcGxpdChcIj1cIiksY1tiWzBdLnJlcGxhY2UoL15zdHJpcGVfLyxcIlwiKV09ZShiWzFdKTtyZXR1cm4gY30oL3N0cmlwZV94ZG1fZT0vLnRlc3QoYy5zZWFyY2gpP2Muc2VhcmNoOmMuaGFzaCksUD1mdW5jdGlvbigpe3JldHVybiBTdHJpcGUuSlNPTn07cShILHt2ZXJzaW9uOlwiMi40LjE5LjNcIixxdWVyeTpPLHN0YWNrOnt9LGFwcGx5OnEsZ2V0SlNPTk9iamVjdDpQLHdoZW5SZWFkeTpqfSksSC5Eb21IZWxwZXI9e29uOnosdW46QX0sZnVuY3Rpb24oKXt2YXIgYT17fTtILkZuPXtzZXQ6ZnVuY3Rpb24oYixjKXthW2JdPWN9LGdldDpmdW5jdGlvbihiLGMpe2lmKGEuaGFzT3duUHJvcGVydHkoYikpe3ZhciBkPWFbYl07cmV0dXJuIGMmJmRlbGV0ZSBhW2JdLGR9fX19KCksSC5Tb2NrZXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dSh0KGEpLmNvbmNhdChbe2luY29taW5nOmZ1bmN0aW9uKGIsYyl7YS5vbk1lc3NhZ2UoYixjKX0sY2FsbGJhY2s6ZnVuY3Rpb24oYil7YS5vblJlYWR5JiZhLm9uUmVhZHkoYil9fV0pKSxjPW0oYS5yZW1vdGUpO3RoaXMub3JpZ2luPW0oYS5yZW1vdGUpLHRoaXMuZGVzdHJveT1mdW5jdGlvbigpe2IuZGVzdHJveSgpfSx0aGlzLnBvc3RNZXNzYWdlPWZ1bmN0aW9uKGEpe2Iub3V0Z29pbmcoYSxjKX0sYi5pbml0KCl9LEguc3RhY2suRmxhc2hUcmFuc3BvcnQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gZShhLGIpe2QoZnVuY3Rpb24oKXtoLnVwLmluY29taW5nKGEscCl9LDApfWZ1bmN0aW9uIGcoYyl7dmFyIGQ9YS5zd2YrXCI/aG9zdD1cIithLmlzSG9zdCxlPVwiZWFzeVhETV9zd2ZfXCIrTWF0aC5mbG9vcigxZTQqTWF0aC5yYW5kb20oKSk7SC5Gbi5zZXQoXCJmbGFzaF9sb2FkZWRcIitjLnJlcGxhY2UoL1tcXC0uXS9nLFwiX1wiKSxmdW5jdGlvbigpe0guc3RhY2suRmxhc2hUcmFuc3BvcnRbY10uc3dmPXI9dC5maXJzdENoaWxkO2Zvcih2YXIgYT1ILnN0YWNrLkZsYXNoVHJhbnNwb3J0W2NdLnF1ZXVlLGI9MDtiPGEubGVuZ3RoO2IrKylhW2JdKCk7YS5sZW5ndGg9MH0pLGEuc3dmQ29udGFpbmVyP3Q9XCJzdHJpbmdcIj09dHlwZW9mIGEuc3dmQ29udGFpbmVyP2IuZ2V0RWxlbWVudEJ5SWQoYS5zd2ZDb250YWluZXIpOmEuc3dmQ29udGFpbmVyOih0PWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxxKHQuc3R5bGUseSYmYS5zd2ZOb1Rocm90dGxlP3toZWlnaHQ6XCIyMHB4XCIsd2lkdGg6XCIyMHB4XCIscG9zaXRpb246XCJmaXhlZFwiLHJpZ2h0OjAsdG9wOjB9OntoZWlnaHQ6XCIxcHhcIix3aWR0aDpcIjFweFwiLHBvc2l0aW9uOlwiYWJzb2x1dGVcIixvdmVyZmxvdzpcImhpZGRlblwiLHJpZ2h0OjAsdG9wOjB9KSxiLmJvZHkuYXBwZW5kQ2hpbGQodCkpO3ZhciBnPVwiY2FsbGJhY2s9Zmxhc2hfbG9hZGVkXCIrZihjLnJlcGxhY2UoL1tcXC0uXS9nLFwiX1wiKSkrXCImcHJvdG89XCIrQi5sb2NhdGlvbi5wcm90b2NvbCtcIiZkb21haW49XCIrZihrKEIubG9jYXRpb24uaHJlZikpK1wiJnBvcnQ9XCIrZihsKEIubG9jYXRpb24uaHJlZikpK1wiJm5zPVwiK2YoRyk7dC5pbm5lckhUTUw9XCI8b2JqZWN0IGhlaWdodD0nMjAnIHdpZHRoPScyMCcgdHlwZT0nYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnIGlkPSdcIitlK1wiJyBkYXRhPSdcIitkK1wiJz48cGFyYW0gbmFtZT0nYWxsb3dTY3JpcHRBY2Nlc3MnIHZhbHVlPSdhbHdheXMnPjwvcGFyYW0+PHBhcmFtIG5hbWU9J3dtb2RlJyB2YWx1ZT0ndHJhbnNwYXJlbnQnPjxwYXJhbSBuYW1lPSdtb3ZpZScgdmFsdWU9J1wiK2QrXCInPjwvcGFyYW0+PHBhcmFtIG5hbWU9J2ZsYXNodmFycycgdmFsdWU9J1wiK2crXCInPjwvcGFyYW0+PGVtYmVkIHR5cGU9J2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJyBGbGFzaFZhcnM9J1wiK2crXCInIGFsbG93U2NyaXB0QWNjZXNzPSdhbHdheXMnIHdtb2RlPSd0cmFuc3BhcmVudCcgc3JjPSdcIitkK1wiJyBoZWlnaHQ9JzEnIHdpZHRoPScxJz48L2VtYmVkPjwvb2JqZWN0PlwifXZhciBoLGkscCxyLHQ7cmV0dXJuIGg9e291dGdvaW5nOmZ1bmN0aW9uKGIsYyxkKXtyLnBvc3RNZXNzYWdlKGEuY2hhbm5lbCxiLnRvU3RyaW5nKCkpLGQmJmQoKX0sZGVzdHJveTpmdW5jdGlvbigpe3RyeXtyLmRlc3Ryb3lDaGFubmVsKGEuY2hhbm5lbCl9Y2F0Y2goYil7fXI9bnVsbCxpJiYoaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGkpLGk9bnVsbCl9LG9uRE9NUmVhZHk6ZnVuY3Rpb24oKXtwPWEucmVtb3RlLEguRm4uc2V0KFwiZmxhc2hfXCIrYS5jaGFubmVsK1wiX2luaXRcIixmdW5jdGlvbigpe2QoZnVuY3Rpb24oKXtoLnVwLmNhbGxiYWNrKCEwKX0pfSksSC5Gbi5zZXQoXCJmbGFzaF9cIithLmNoYW5uZWwrXCJfb25NZXNzYWdlXCIsZSksYS5zd2Y9bihhLnN3Zik7dmFyIGI9ayhhLnN3ZiksZj1mdW5jdGlvbigpe0guc3RhY2suRmxhc2hUcmFuc3BvcnRbYl0uaW5pdD0hMCxyPUguc3RhY2suRmxhc2hUcmFuc3BvcnRbYl0uc3dmLHIuY3JlYXRlQ2hhbm5lbChhLmNoYW5uZWwsYS5zZWNyZXQsbShhLnJlbW90ZSksYS5pc0hvc3QpLGEuaXNIb3N0JiYoeSYmYS5zd2ZOb1Rocm90dGxlJiZxKGEucHJvcHMse3Bvc2l0aW9uOlwiZml4ZWRcIixyaWdodDowLHRvcDowLGhlaWdodDpcIjIwcHhcIix3aWR0aDpcIjIwcHhcIn0pLHEoYS5wcm9wcyx7c3JjOm8oYS5yZW1vdGUse3hkbV9lOm0oYy5ocmVmKSx4ZG1fYzphLmNoYW5uZWwseGRtX3A6Nix4ZG1fczphLnNlY3JldH0pLG5hbWU6SSthLmNoYW5uZWwrXCJfcHJvdmlkZXJcIn0pLGk9cyhhKSl9O0guc3RhY2suRmxhc2hUcmFuc3BvcnRbYl0mJkguc3RhY2suRmxhc2hUcmFuc3BvcnRbYl0uaW5pdD9mKCk6SC5zdGFjay5GbGFzaFRyYW5zcG9ydFtiXT9ILnN0YWNrLkZsYXNoVHJhbnNwb3J0W2JdLnF1ZXVlLnB1c2goZik6KEguc3RhY2suRmxhc2hUcmFuc3BvcnRbYl09e3F1ZXVlOltmXX0sZyhiKSl9LGluaXQ6ZnVuY3Rpb24oKXtqKGgub25ET01SZWFkeSxoKX19fSxILnN0YWNrLlBvc3RNZXNzYWdlVHJhbnNwb3J0PWZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGUoYSl7aWYoYS5vcmlnaW4pcmV0dXJuIG0oYS5vcmlnaW4pO2lmKGEudXJpKXJldHVybiBtKGEudXJpKTtpZihhLmRvbWFpbilyZXR1cm4gYy5wcm90b2NvbCtcIi8vXCIrYS5kb21haW47dGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHRoZSBvcmlnaW4gb2YgdGhlIGV2ZW50XCIpfWZ1bmN0aW9uIGYoYSl7dmFyIGM9ZShhKTtjPT1rJiZcInN0cmluZ1wiPT10eXBlb2YgYS5kYXRhJiZhLmRhdGEuc3Vic3RyaW5nKDAsYi5jaGFubmVsLmxlbmd0aCsxKT09Yi5jaGFubmVsK1wiIFwiJiZnLnVwLmluY29taW5nKGEuZGF0YS5zdWJzdHJpbmcoYi5jaGFubmVsLmxlbmd0aCsxKSxjKX12YXIgZyxoLGksaztyZXR1cm4gZz17b3V0Z29pbmc6ZnVuY3Rpb24oYSxjLGQpe3RyeXtpLnBvc3RNZXNzYWdlKGIuY2hhbm5lbCtcIiBcIithLGN8fGspLGQmJmQoKX1jYXRjaChlKXtiLm9uSW50ZXJuYWxFcnJvciYmYi5vbkludGVybmFsRXJyb3IuY2FsbChiLFwiQ2FsbGVyV2luZG93RXJyb3JcIil9fSxkZXN0cm95OmZ1bmN0aW9uKCl7QShhLFwibWVzc2FnZVwiLGYpLGgmJihpPW51bGwsaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGgpLGg9bnVsbCl9LG9uRE9NUmVhZHk6ZnVuY3Rpb24oKXtpZihrPW0oYi5yZW1vdGUpLGIuaXNIb3N0KXt2YXIgZT1mdW5jdGlvbihjKXtjLmRhdGE9PWIuY2hhbm5lbCtcIi1yZWFkeVwiJiYoaT1cInBvc3RNZXNzYWdlXCJpbiBoLmNvbnRlbnRXaW5kb3c/aC5jb250ZW50V2luZG93OmguY29udGVudFdpbmRvdy5kb2N1bWVudCxBKGEsXCJtZXNzYWdlXCIsZSkseihhLFwibWVzc2FnZVwiLGYpLGQoZnVuY3Rpb24oKXtnLnVwLmNhbGxiYWNrKCEwKX0sMCkpfTt6KGEsXCJtZXNzYWdlXCIsZSkscShiLnByb3BzLHtzcmM6byhiLnJlbW90ZSx7eGRtX2U6bShjLmhyZWYpLHhkbV9jOmIuY2hhbm5lbCx4ZG1fcDoxfSksbmFtZTpJK2IuY2hhbm5lbCtcIl9wcm92aWRlclwifSksaD1zKGIpfWVsc2UgeihhLFwibWVzc2FnZVwiLGYpLGk9XCJwb3N0TWVzc2FnZVwiaW4gYS5wYXJlbnQ/YS5wYXJlbnQ6YS5wYXJlbnQuZG9jdW1lbnQsaS5wb3N0TWVzc2FnZShiLmNoYW5uZWwrXCItcmVhZHlcIixrKSxkKGZ1bmN0aW9uKCl7Zy51cC5jYWxsYmFjayghMCl9LDApfSxpbml0OmZ1bmN0aW9uKCl7aihnLm9uRE9NUmVhZHksZyl9fX0sSC5zdGFjay5RdWV1ZUJlaGF2aW9yPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoKXtpZihhLnJlbW92ZSYmMD09PWgubGVuZ3RoKXJldHVybiB2b2lkIHYoYyk7aWYoIWkmJjAhPT1oLmxlbmd0aCYmIWcpe1xuaT0hMDt2YXIgZT1oLnNoaWZ0KCk7Yy5kb3duLm91dGdvaW5nKGUuZGF0YSxlLm9yaWdpbixmdW5jdGlvbihhKXtpPSExLGUuY2FsbGJhY2smJmQoZnVuY3Rpb24oKXtlLmNhbGxiYWNrKGEpfSwwKSxiKCl9KX19dmFyIGMsZyxoPVtdLGk9ITAsaj1cIlwiLGs9MCxsPSExLG09ITE7cmV0dXJuIGM9e2luaXQ6ZnVuY3Rpb24oKXtwKGEpJiYoYT17fSksYS5tYXhMZW5ndGgmJihrPWEubWF4TGVuZ3RoLG09ITApLGEubGF6eT9sPSEwOmMuZG93bi5pbml0KCl9LGNhbGxiYWNrOmZ1bmN0aW9uKGEpe2k9ITE7dmFyIGQ9Yy51cDtiKCksZC5jYWxsYmFjayhhKX0saW5jb21pbmc6ZnVuY3Rpb24oYixkKXtpZihtKXt2YXIgZj1iLmluZGV4T2YoXCJfXCIpLGc9cGFyc2VJbnQoYi5zdWJzdHJpbmcoMCxmKSwxMCk7ais9Yi5zdWJzdHJpbmcoZisxKSwwPT09ZyYmKGEuZW5jb2RlJiYoaj1lKGopKSxjLnVwLmluY29taW5nKGosZCksaj1cIlwiKX1lbHNlIGMudXAuaW5jb21pbmcoYixkKX0sb3V0Z29pbmc6ZnVuY3Rpb24oZCxlLGcpe2EuZW5jb2RlJiYoZD1mKGQpKTt2YXIgaSxqPVtdO2lmKG0pe2Zvcig7MCE9PWQubGVuZ3RoOylpPWQuc3Vic3RyaW5nKDAsayksZD1kLnN1YnN0cmluZyhpLmxlbmd0aCksai5wdXNoKGkpO2Zvcig7aT1qLnNoaWZ0KCk7KWgucHVzaCh7ZGF0YTpqLmxlbmd0aCtcIl9cIitpLG9yaWdpbjplLGNhbGxiYWNrOjA9PT1qLmxlbmd0aD9nOm51bGx9KX1lbHNlIGgucHVzaCh7ZGF0YTpkLG9yaWdpbjplLGNhbGxiYWNrOmd9KTtsP2MuZG93bi5pbml0KCk6YigpfSxkZXN0cm95OmZ1bmN0aW9uKCl7Zz0hMCxjLmRvd24uZGVzdHJveSgpfX19LFN0cmlwZS5lYXN5WERNPUh9KHdpbmRvdyxkb2N1bWVudCxsb2NhdGlvbix3aW5kb3cuc2V0VGltZW91dCxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJQ29tcG9uZW50KX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciBhPVtdLmluZGV4T2Z8fGZ1bmN0aW9uKGEpe2Zvcih2YXIgYj0wLGM9dGhpcy5sZW5ndGg7Yz5iO2IrKylpZihiIGluIHRoaXMmJnRoaXNbYl09PT1hKXJldHVybiBiO3JldHVybi0xfTt0aGlzLlN0cmlwZS5pc0RvdWJsZUxvYWRlZHx8KHRoaXMuU3RyaXBlLnV0aWxzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYigpe312YXIgYztyZXR1cm4gYz0vXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csYi50cmltPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT09YT9cIlwiOihhK1wiXCIpLnJlcGxhY2UoYyxcIlwiKX0sYi5zZXJpYWxpemU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZjtudWxsPT1iJiYoYj1bXSk7dHJ5e2ZvcihlIGluIGEpZj1hW2VdLGMmJihlPVwiXCIrYytcIltcIitlK1wiXVwiKSxcIm9iamVjdFwiPT10eXBlb2YgZj90aGlzLnNlcmlhbGl6ZShmLGIsZSk6Yi5wdXNoKFwiXCIrZStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZikpO3JldHVybiBiLmpvaW4oXCImXCIpLnJlcGxhY2UoLyUyMC9nLFwiK1wiKX1jYXRjaChnKXt0aHJvdyBkPWcsbmV3IEVycm9yKFwiVW5hYmxlIHRvIHNlcmlhbGl6ZTogXCIrYSl9fSxiLnVuZGVyc2NvcmU9ZnVuY3Rpb24oYSl7cmV0dXJuKGErXCJcIikucmVwbGFjZSgvKFtBLVpdKS9nLGZ1bmN0aW9uKGEpe3JldHVyblwiX1wiK2EudG9Mb3dlckNhc2UoKX0pLnJlcGxhY2UoLy0vZyxcIl9cIil9LGIudW5kZXJzY29yZUtleXM9ZnVuY3Rpb24oYSl7dmFyIGIsYyxkO2Q9W107Zm9yKGIgaW4gYSljPWFbYl0sZGVsZXRlIGFbYl0sZC5wdXNoKGFbdGhpcy51bmRlcnNjb3JlKGIpXT1jKTtyZXR1cm4gZH0sYi5pc0VsZW1lbnQ9ZnVuY3Rpb24oYSl7cmV0dXJuXCJvYmplY3RcIiE9dHlwZW9mIGE/ITE6YS5qcXVlcnk/ITA6MT09PWEubm9kZVR5cGV9LGIucGFyYW1zRnJvbUZvcm09ZnVuY3Rpb24oYixjKXt2YXIgZCxlLGYsZyxoLGksaixrLGwsbTtmb3IobnVsbD09YyYmKGM9W10pLGIuanF1ZXJ5JiYoYj1iWzBdKSxmPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSxoPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZWxlY3RcIiksaT17fSxqPTAsbD1mLmxlbmd0aDtsPmo7aisrKWU9ZltqXSxkPXRoaXMudW5kZXJzY29yZShlLmdldEF0dHJpYnV0ZShcImRhdGEtc3RyaXBlXCIpKSxhLmNhbGwoYyxkKTwwfHwoaVtkXT1lLnZhbHVlKTtmb3Ioaz0wLG09aC5sZW5ndGg7bT5rO2srKylnPWhba10sZD10aGlzLnVuZGVyc2NvcmUoZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0cmlwZVwiKSksYS5jYWxsKGMsZCk8MHx8bnVsbCE9Zy5zZWxlY3RlZEluZGV4JiYoaVtkXT1nLm9wdGlvbnNbZy5zZWxlY3RlZEluZGV4XS52YWx1ZSk7cmV0dXJuIGl9LGIudmFsaWRhdGVQcm90b2NvbD1mdW5jdGlvbihhKXt2YXIgYjtpZihhJiZcInN0cmluZ1wiPT10eXBlb2YgYSlyZXR1cm4vX2xpdmVfL2cudGVzdChhKSYmXCJodHRwczpcIiE9PXdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCYmbnVsbCE9KG51bGwhPShiPXdpbmRvdy5jb25zb2xlKT9iLndhcm46dm9pZCAwKT93aW5kb3cuY29uc29sZS53YXJuKFwiWW91IGFyZSB1c2luZyBTdHJpcGUuanMgaW4gbGl2ZSBtb2RlIG92ZXIgYW4gaW5zZWN1cmUgY29ubmVjdGlvbi4gVGhpcyBpcyBjb25zaWRlcmVkIHVuc2FmZS4gUGxlYXNlIGNvbmR1Y3QgbGl2ZSByZXF1ZXN0cyBvbmx5IG9uIHNpdGVzIHNlcnZlZCBvdmVyIGh0dHBzLiBGb3IgbW9yZSBpbmZvLCBzZWUgaHR0cHM6Ly9zdHJpcGUuY29tL2hlbHAvc3NsXCIpOnZvaWQgMH0sYi52YWxpZGF0ZUtleT1mdW5jdGlvbihhKXtpZighYXx8XCJzdHJpbmdcIiE9dHlwZW9mIGEpdGhyb3cgbmV3IEVycm9yKFwiWW91IGRpZCBub3Qgc2V0IGEgdmFsaWQgcHVibGlzaGFibGUga2V5LiBDYWxsIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleSgpIHdpdGggeW91ciBwdWJsaXNoYWJsZSBrZXkuIEZvciBtb3JlIGluZm8sIHNlZSBodHRwczovL3N0cmlwZS5jb20vZG9jcy9zdHJpcGUuanNcIik7aWYoL1xccy9nLnRlc3QoYSkpdGhyb3cgbmV3IEVycm9yKFwiWW91ciBrZXkgaXMgaW52YWxpZCwgYXMgaXQgY29udGFpbnMgd2hpdGVzcGFjZS4gRm9yIG1vcmUgaW5mbywgc2VlIGh0dHBzOi8vc3RyaXBlLmNvbS9kb2NzL3N0cmlwZS5qc1wiKTtpZigvXnNrXy8udGVzdChhKSl0aHJvdyBuZXcgRXJyb3IoXCJZb3UgYXJlIHVzaW5nIGEgc2VjcmV0IGtleSB3aXRoIFN0cmlwZS5qcywgaW5zdGVhZCBvZiB0aGUgcHVibGlzaGFibGUgb25lLiBGb3IgbW9yZSBpbmZvLCBzZWUgaHR0cHM6Ly9zdHJpcGUuY29tL2RvY3Mvc3RyaXBlLmpzXCIpfSxiLnBhcnNlRXhwU3RyaW5nPWZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoLGksajtmb3IoZz1mdW5jdGlvbihiKXt0aHJvdyBuZXcgRXJyb3IoXCJZb3UgcGFzc2VkIGFuIGludmFsaWQgZXhwaXJhdGlvbiBkYXRlIGBcIithK1wiYC4gXCIrKGJ8fFwiXCIpK1wiUGxlYXNlIHBhc3MgYSBzdHJpbmcgY29udGFpbmluZyBhIG51bWVyaWMgbW9udGggYW5kIHllYXIgc3VjaCBhcyBgMDEtMTdgIG9yIGAyMDE1IC8gMDVgIEZvciBtb3JlIGluZm8sIHNlZSBodHRwczovL3N0cmlwZS5jb20vZG9jcy9zdHJpcGUuanNcIil9LFwic3RyaW5nXCIhPXR5cGVvZiBhJiZnKCksZj1hLnNwbGl0KC9bXFwuXFwtXFwvXFxzXSsvZyksMiE9PWYubGVuZ3RoJiZnKCksYj1pPTAsaj1mLmxlbmd0aDtqPmk7Yj0rK2kpZT1mW2JdLGQ9cGFyc2VJbnQoZSksaXNOYU4oZCkmJmcoXCJcIitmK1wiIGlzIG5vdCBhIG51bWJlci4gXCIpLDE+ZCYmZyhcIlwiK2QrXCIgaXMgbGVzcyB0aGFuIG9uZS4gXCIpLGZbYl09ZDtyZXR1cm4gZlswXT4xMj8oaD1mWzBdLGM9ZlsxXSk6KGM9ZlswXSxoPWZbMV0pLGM+MTImJmcoXCJNb250aCBtdXN0IGJlIGEgbnVtYmVyIDEtMTIsIG5vdCBcIitjKSwxMDA+aCYmKGgrPTJlMyksW2MsaF19LGJ9KCkpfS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7dmFyIGEsYj1bXS5zbGljZTthPShuZXcgRGF0ZSkuZ2V0VGltZSgpLHRoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkfHwodGhpcy5TdHJpcGUuYWpheEpTT05QPWZ1bmN0aW9uKGMpe3ZhciBkLGUsZixnLGgsaSxqO3JldHVybiBudWxsPT1jJiYoYz17fSksZj1cInNqc29ucFwiKyArK2EsaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLGU9bnVsbCxkPWZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiBudWxsPT1hJiYoYT1cImFib3J0XCIpLGNsZWFyVGltZW91dChlKSxudWxsIT0oYj1pLnBhcmVudE5vZGUpJiZiLnJlbW92ZUNoaWxkKGkpLGYgaW4gd2luZG93JiYod2luZG93W2ZdPWZ1bmN0aW9uKCl7fSksXCJmdW5jdGlvblwiPT10eXBlb2YgYy5jb21wbGV0ZT9jLmNvbXBsZXRlKGEsaixjKTp2b2lkIDB9LGo9e2Fib3J0OmR9LGkub25lcnJvcj1mdW5jdGlvbigpe3JldHVybiBqLmFib3J0KCksXCJmdW5jdGlvblwiPT10eXBlb2YgYy5lcnJvcj9jLmVycm9yKGosYyk6dm9pZCAwfSx3aW5kb3dbZl09ZnVuY3Rpb24oKXt2YXIgYSxkO2E9MTw9YXJndW1lbnRzLmxlbmd0aD9iLmNhbGwoYXJndW1lbnRzLDApOltdLGNsZWFyVGltZW91dChlKSxpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaSk7dHJ5e2RlbGV0ZSB3aW5kb3dbZl19Y2F0Y2goZyl7ZD1nLHdpbmRvd1tmXT12b2lkIDB9cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYy5zdWNjZXNzJiZjLnN1Y2Nlc3MuYXBwbHkoYyxiLmNhbGwoYSkuY29uY2F0KFtqXSkpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGMuY29tcGxldGU/Yy5jb21wbGV0ZShcInN1Y2Nlc3NcIixqLGMpOnZvaWQgMH0saD0oYy5oZWFkZXJzfHx7fSlbXCJBY2NlcHQtTGFuZ3VhZ2VcIl0sYy5kYXRhfHwoYy5kYXRhPXt9KSxjLmRhdGEuY2FsbGJhY2s9ZixjLm1ldGhvZCYmKGMuZGF0YS5fbWV0aG9kPWMubWV0aG9kKSxoJiYoYy5kYXRhLl9hY2NlcHRfbGFuZ3VhZ2U9aCksaS5zcmM9Yy51cmwrXCI/XCIrU3RyaXBlLnV0aWxzLnNlcmlhbGl6ZShjLmRhdGEpLGc9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLGcuYXBwZW5kQ2hpbGQoaSksYy50aW1lb3V0PjAmJihlPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gai5hYm9ydChcInRpbWVvdXRcIil9LGMudGltZW91dCkpLGp9KX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZixnLGgsaSxqPXt9Lmhhc093blByb3BlcnR5O3RoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkfHwoYj17Y29udGVudFR5cGU6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixhY2NlcHQ6e2pzb246XCJhcHBsaWNhdGlvbi9qc29uXCJ9fSxnPS9eKDIwXFxkfDEyMjMpJC8sZj1cImludmFsaWRfanNvbl9yZXNwb25zZVwiLGQ9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhLl9hYm9ydGVkP2MoYS5yZXF1ZXN0LFwiYWJvcnRcIik6YS5yZXF1ZXN0JiY0PT09YS5yZXF1ZXN0LnJlYWR5U3RhdGU/KGEucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXt9LDA9PT1hLnJlcXVlc3Quc3RhdHVzP2MoYS5yZXF1ZXN0LFwiZW1wdHlfcmVzcG9uc2VcIik6Zy50ZXN0KGEucmVxdWVzdC5zdGF0dXMpP2IoYS5yZXF1ZXN0LGEucmVxdWVzdC5zdGF0dXMpOmIoYS5yZXF1ZXN0LGEucmVxdWVzdC5zdGF0dXMpKTp2b2lkIDB9fSxoPWZ1bmN0aW9uKGEsYyl7dmFyIGQsZSxmLGcsaDtmPWMuaGVhZGVyc3x8e30sZi5BY2NlcHR8fChmLkFjY2VwdD1iLmFjY2VwdC5qc29uKSxmW1wiQ29udGVudC1UeXBlXCJdfHwoZltcIkNvbnRlbnQtVHlwZVwiXT1iLmNvbnRlbnRUeXBlKSxnPWMuX2dsb2JhbEN1c3RvbUhlYWRlcnM7Zm9yKGQgaW4gZylqLmNhbGwoZyxkKSYmXCJzZXRSZXF1ZXN0SGVhZGVyXCJpbiBhJiZhLnNldFJlcXVlc3RIZWFkZXIoZCxjLl9nbG9iYWxDdXN0b21IZWFkZXJzW2RdKTtoPVtdO2ZvcihlIGluIGYpai5jYWxsKGYsZSkmJihcInNldFJlcXVlc3RIZWFkZXJcImluIGE/aC5wdXNoKGEuc2V0UmVxdWVzdEhlYWRlcihlLGZbZV0pKTpoLnB1c2godm9pZCAwKSk7cmV0dXJuIGh9LGk9ZnVuY3Rpb24oYSxiKXtyZXR1cm4vXFw/Ly50ZXN0KGEpP2ErXCImXCIrYjphK1wiP1wiK2J9LGM9ZnVuY3Rpb24oYSxiKXt2YXIgYyxlLGYsZyxqLGssbCxtLG47az10aGlzLm8saj0oay5tZXRob2R8fFwiR0VUXCIpLnRvVXBwZXJDYXNlKCksbD1rLnVybCxnPW51bGwhPShtPWsuZGF0YSk/bS5rZXk6dm9pZCAwLGM9U3RyaXBlLnV0aWxzLnNlcmlhbGl6ZShrLmRhdGEpLGY9dm9pZCAwLFwiR0VUXCI9PT1qJiZjJiYobD1pKGwsYyksYz1udWxsKSxuPW5ldyBYTUxIdHRwUmVxdWVzdCxuLm9wZW4oaixsLCEwKSxoKG4sayksbi5vbnJlYWR5c3RhdGVjaGFuZ2U9ZCh0aGlzLGEsYik7dHJ5e24uc2VuZChjKX1jYXRjaChvKXtlPW8sU3RyaXBlLnJlcG9ydEVycm9yKFwiWEhSLVwiK2UudG9TdHJpbmcoKSksYihuLFwieGhyX3NlbmRfZmFpbHVyZVwiKX1yZXR1cm4gbn0sYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vPWEsZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGU9ZnVuY3Rpb24oYSl7dmFyIGIsZCxlO3JldHVybiB0aGlzLnVybD1hLnVybCx0aGlzLnRpbWVvdXQ9bnVsbCx0aGlzLl9zdWNjZXNzSGFuZGxlcj1mdW5jdGlvbigpe30sdGhpcy5fZXJyb3JIYW5kbGVycz1bXSx0aGlzLl9jb21wbGV0ZUhhbmRsZXJzPVtdLGEudGltZW91dCYmKHRoaXMudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhLmFib3J0KCl9fSh0aGlzKSxhLnRpbWVvdXQpKSxhLnN1Y2Nlc3MmJih0aGlzLl9zdWNjZXNzSGFuZGxlcj1mdW5jdGlvbigpe3JldHVybiBhLnN1Y2Nlc3MuYXBwbHkoYSxhcmd1bWVudHMpfSksYS5lcnJvciYmdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZ1bmN0aW9uKCl7cmV0dXJuIGEuZXJyb3IuYXBwbHkoYSxhcmd1bWVudHMpfSksYS5jb21wbGV0ZSYmdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uKCl7cmV0dXJuIGEuY29tcGxldGUuYXBwbHkoYSxhcmd1bWVudHMpfSksYj1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oYyxkKXt2YXIgZTtmb3IoYS50aW1lb3V0JiZjbGVhclRpbWVvdXQoYi50aW1lb3V0KSxiLnRpbWVvdXQ9bnVsbCxlPVtdO2IuX2NvbXBsZXRlSGFuZGxlcnMubGVuZ3RoPjA7KWUucHVzaChiLl9jb21wbGV0ZUhhbmRsZXJzLnNoaWZ0KCkoZCxjLGEpKTtyZXR1cm4gZX19KHRoaXMpLGU9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGMsZSl7dmFyIGcsaCxpO2lmKGk9Yy5yZXNwb25zZVRleHQsIWl8fCFpLmxlbmd0aClyZXR1cm4gZChjLFwiZW1wdHlfcmVzcG9uc2VcIik7dHJ5e3JldHVybiBoPVN0cmlwZS5KU09OLnBhcnNlKGkpLGEuX3N1Y2Nlc3NIYW5kbGVyKGgsZSxjKSxiKGgsXCJzdWNjZXNzXCIpfWNhdGNoKGope3JldHVybiBnPWosZChjLGYpfX19KHRoaXMpLGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7dmFyIGQsZSxnO2lmKGc9Yi5yZXNwb25zZVRleHQsZT12b2lkIDAsZyYmZy5sZW5ndGgmJmMhPT1mKXRyeXtlPVN0cmlwZS5KU09OLnBhcnNlKGcpfWNhdGNoKGgpe2Q9aCxjPWMrXCJfQU5EX1wiK2Z9Zm9yKDthLl9lcnJvckhhbmRsZXJzLmxlbmd0aD4wOylhLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkoZXx8YixjKTtyZXR1cm4gU3RyaXBlLnJlcG9ydEVycm9yKGMpLFN0cmlwZS5fZmFsbEJhY2tUb09sZFN0cmlwZUpzVGVjaG5pcXVlcygpLFN0cmlwZS5yZXF1ZXN0KGEubywhMCl9fSh0aGlzKSx0aGlzLnJlcXVlc3Q9Yy5jYWxsKHRoaXMsZSxkKX0sYS5wcm90b3R5cGU9e2Fib3J0OmZ1bmN0aW9uKCl7dmFyIGE7cmV0dXJuIHRoaXMuX2Fib3J0ZWQ9ITAsbnVsbCE9KGE9dGhpcy5yZXF1ZXN0KT9hLmFib3J0KCk6dm9pZCAwfX0sdGhpcy5TdHJpcGUueGhyPWZ1bmN0aW9uKGIpe3JldHVybiBiLl9nbG9iYWxDdXN0b21IZWFkZXJzPXRoaXMuX2N1c3RvbUhlYWRlcnMsbmV3IGEoYil9KX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciBhLGIsYyxkPXt9Lmhhc093blByb3BlcnR5O3RoaXMuU3RyaXBlLmlzRG91YmxlTG9hZGVkfHwoYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vcHRpb25zPWEsYS5yZXF1ZXN0SWQ9U3RyaXBlLl9jYWxsQ291bnQsYS5lbmRwb2ludD1TdHJpcGUuZW5kcG9pbnQsYS50cmFja1BlcmY9U3RyaXBlLnRyYWNrUGVyZix0aGlzLmlmcmFtZVRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiBTdHJpcGUuX2ZhbGxCYWNrVG9PbGRTdHJpcGVKc1RlY2huaXF1ZXMoKSxTdHJpcGUuX2lmcmFtZVBlbmRpbmdSZXF1ZXN0c1thLnJlcXVlc3RJZF0mJihTdHJpcGUucmVxdWVzdChTdHJpcGUuX2lmcmFtZVBlbmRpbmdSZXF1ZXN0c1thLnJlcXVlc3RJZF0sITApLGRlbGV0ZSBTdHJpcGUuX2lmcmFtZVBlbmRpbmdSZXF1ZXN0c1thLnJlcXVlc3RJZF0pLFN0cmlwZS5fY2FsbENhY2hlW2EucmVxdWVzdElkXT1mdW5jdGlvbigpe3JldHVybiBTdHJpcGUucmVwb3J0RXJyb3IoXCJUaW1lb3V0RXZlbnR1YWxSZXR1cm5FcnJvclwiKX19LDFlNCksU3RyaXBlLl9pZnJhbWVQZW5kaW5nUmVxdWVzdHNbYS5yZXF1ZXN0SWRdPWEsU3RyaXBlLl9jYWxsQ2FjaGVbYS5yZXF1ZXN0SWRdPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBjbGVhclRpbWVvdXQoYi5pZnJhbWVUaW1lb3V0KSxkZWxldGUgU3RyaXBlLl9pZnJhbWVQZW5kaW5nUmVxdWVzdHNbYS5yZXF1ZXN0SWRdLGEuc3VjY2Vzcy5hcHBseShhLGFyZ3VtZW50cyksXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jb21wbGV0ZT9hLmNvbXBsZXRlKFwic3VjY2Vzc1wiLG51bGwsYSk6dm9pZCAwfX0odGhpcyksU3RyaXBlLl9jYWxsQ291bnQrPTEsU3RyaXBlLl9zb2NrZXQucG9zdE1lc3NhZ2UoU3RyaXBlLkpTT04uc3RyaW5naWZ5KGEpKX0sdGhpcy5TdHJpcGUuaWZyYW1lPWZ1bmN0aW9uKGIpe3JldHVybiBuZXcgYShiKX0sYj1TdHJpcGUuZWFzeVhETSx0aGlzLlN0cmlwZS5faXNDaGFubmVsP1N0cmlwZS5fc29ja2V0PW5ldyBiLlNvY2tldCh7c3dmOlwiXCIrU3RyaXBlLl9pZnJhbWVCYXNlVXJsK1wiL3YyL3N0cmlwZXhkbS5zd2ZcIixvbk1lc3NhZ2U6U3RyaXBlLl9jaGFubmVsTGlzdGVuZXJ9KTpTdHJpcGUuX2lzU2FmZURvbWFpbnx8KGM9ZnVuY3Rpb24oYSl7dmFyIGIsZCxlO1wiY29uc29sZVwiaW4gd2luZG93JiZcIndhcm5cImluIHdpbmRvdy5jb25zb2xlLDEsU3RyaXBlLl9pZnJhbWVDaGFubmVsQ29tcGxldGUuY2FsbChTdHJpcGUsITEpLFN0cmlwZS5fY2FsbENhY2hlPXt9LFN0cmlwZS5yZXBvcnRFcnJvcihcIkZCLVwiK2EpLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxlPU1hdGgucm91bmQoKG5ldyBEYXRlKS5nZXRUaW1lKCkvMWUzKSxkLnNyYz1cIlwiK1N0cmlwZS5faWZyYW1lQmFzZVVybCtcIi92Mi9jc3BibG9ja2VkLmpzP2RvbWFpbj1cIitlbmNvZGVVUklDb21wb25lbnQoZG9jdW1lbnQubG9jYXRpb24uaHJlZikrXCImdGltZXN0YW1wPVwiK2UrXCImaW5mbz1cIitlbmNvZGVVUklDb21wb25lbnQoYSkrXCImcGF5bWVudF91c2VyX2FnZW50PVwiK2VuY29kZVVSSUNvbXBvbmVudChTdHJpcGUuc3RyaXBlanNfdWEpLGI9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF0sYi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkLGIpLGM9ZnVuY3Rpb24oKXt9fSxTdHJpcGUuX3NvY2tldD1uZXcgYi5Tb2NrZXQoe3N3ZjpcIlwiK1N0cmlwZS5faWZyYW1lQmFzZVVybCtcIi92Mi9zdHJpcGV4ZG0uc3dmXCIscmVtb3RlOlwiXCIrU3RyaXBlLl9pZnJhbWVCYXNlVXJsK1wiL3YyL2NoYW5uZWxcIisoU3RyaXBlLmFjY291bnREZXRhaWxzP1wiLXByb3Zpc2lvbmluZ1wiOlwiXCIpK1wiLmh0bWwjX19zdHJpcGVfdHJhbnNwb3J0X19cIixvbk1lc3NhZ2U6U3RyaXBlLl9yZWNlaXZlQ2hhbm5lbFJlbGF5LGFja1RpbWVvdXREdXJhdGlvbjoxZTQsb25Mb2FkOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvY2tldExvYWRUaW1lPStuZXcgRGF0ZSx0aGlzLm9uRXJyb3I9ZnVuY3Rpb24oKXt9LHRoaXMub25Bc3luY0luamVjdD1mdW5jdGlvbigpe30sY2xlYXJUaW1lb3V0KHRoaXMuaW5qZWN0VGltZW91dCksdGhpcy5fc29ja2V0QWNrVGltZT90aGlzLmxvYWRUaW1lb3V0PyhjbGVhclRpbWVvdXQodGhpcy5sb2FkVGltZW91dCksU3RyaXBlLl9pZnJhbWVDaGFubmVsQ29tcGxldGUuY2FsbChTdHJpcGUsITApKTpTdHJpcGUucmVwb3J0RXJyb3IoXCJMb2FkRGVsYXlFcnJvclwiLHRoaXMuX3NvY2tldExvYWRUaW1lLXRoaXMuX3NvY2tldEFja1RpbWUpOnRoaXMuYWNrVGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhLm9uRnJhbWVBY2s9ZnVuY3Rpb24oKXt9LGNsZWFyVGltZW91dChhLmxvYWRUaW1lb3V0KSxjKFwiQWNrVGltZW91dEVycm9yXCIpfX0odGhpcyksdGhpcy5hY2tUaW1lb3V0RHVyYXRpb24pfSxvbkVycm9yOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub25Mb2FkPWZ1bmN0aW9uKCl7fSx0aGlzLm9uQXN5bmNJbmplY3Q9ZnVuY3Rpb24oKXt9LHRoaXMub25GcmFtZUFjaz1mdW5jdGlvbigpe30sY2xlYXJUaW1lb3V0KHRoaXMuYWNrVGltZW91dCksY2xlYXJUaW1lb3V0KHRoaXMuaW5qZWN0VGltZW91dCksY2xlYXJUaW1lb3V0KHRoaXMubG9hZFRpbWVvdXQpLGMoXCJJZnJhbWVPbkVycm9yXCIpfSxvbkludGVybmFsRXJyb3I6ZnVuY3Rpb24oYSl7dmFyIGIsYyxlO3RoaXMub25FcnJvcj1mdW5jdGlvbigpe30sdGhpcy5vbkxvYWQ9ZnVuY3Rpb24oKXt9LHRoaXMub25GcmFtZUFjaz1mdW5jdGlvbigpe30sdGhpcy5vbkFzeW5jSW5qZWN0PWZ1bmN0aW9uKCl7fSxjbGVhclRpbWVvdXQodGhpcy5hY2tUaW1lb3V0KSxjbGVhclRpbWVvdXQodGhpcy5sb2FkVGltZW91dCksY2xlYXJUaW1lb3V0KHRoaXMuaW5qZWN0VGltZW91dCksU3RyaXBlLnJlcG9ydEVycm9yKFwiRkItWERNLVwiK2EpLFN0cmlwZS5fZmFsbEJhY2tUb09sZFN0cmlwZUpzVGVjaG5pcXVlcygpLGU9U3RyaXBlLl9pZnJhbWVQZW5kaW5nUmVxdWVzdHM7Zm9yKGIgaW4gZSlkLmNhbGwoZSxiKSYmKGM9ZVtiXSxTdHJpcGUuX2NhbGxDYWNoZVtjLnJlcXVlc3RJZF09ZnVuY3Rpb24oKXt9LGRlbGV0ZSBTdHJpcGUuX2lmcmFtZVBlbmRpbmdSZXF1ZXN0c1tjLnJlcXVlc3RJZF0sU3RyaXBlLnJlcXVlc3QoYywhMCkpfSxvbkFzeW5jSW5qZWN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmluamVjdFRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5vbkVycm9yPWZ1bmN0aW9uKCl7fSxhLm9uTG9hZD1mdW5jdGlvbigpe30sYS5vbkZyYW1lQWNrPWZ1bmN0aW9uKCl7fSxjbGVhclRpbWVvdXQoYS5hY2tUaW1lb3V0KSxjbGVhclRpbWVvdXQoYS5sb2FkVGltZW91dCksYyhcIkluamVjdFRpbWVvdXRFcnJvclwiKX19KHRoaXMpLHRoaXMuYWNrVGltZW91dER1cmF0aW9uKX0sb25GcmFtZUFjazpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fc29ja2V0QWNrVGltZT0rbmV3IERhdGUsY2xlYXJUaW1lb3V0KHRoaXMuYWNrVGltZW91dCksY2xlYXJUaW1lb3V0KHRoaXMuaW5qZWN0VGltZW91dCksdGhpcy5vbkFzeW5jSW5qZWN0PWZ1bmN0aW9uKCl7fSx0aGlzLm9uRXJyb3I9ZnVuY3Rpb24oKXt9LHRoaXMuYWNrVGltZW91dD9TdHJpcGUuX2lmcmFtZUNoYW5uZWxDb21wbGV0ZS5jYWxsKFN0cmlwZSwhMCk6dGhpcy5fc29ja2V0TG9hZFRpbWU/KHRoaXMub25Mb2FkPWZ1bmN0aW9uKCl7fSxTdHJpcGUucmVwb3J0RXJyb3IoXCJBY2tEZWxheUVycm9yXCIsdGhpcy5fc29ja2V0QWNrVGltZS10aGlzLl9zb2NrZXRMb2FkVGltZSkpOnRoaXMubG9hZFRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYyhcIkxvYWRUaW1lb3V0RXJyb3JcIiksYS5vbkxvYWQ9ZnVuY3Rpb24oKXt9fX0odGhpcyksdGhpcy5hY2tUaW1lb3V0RHVyYXRpb24pfX0pKSl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgYT1bXS5pbmRleE9mfHxmdW5jdGlvbihhKXtmb3IodmFyIGI9MCxjPXRoaXMubGVuZ3RoO2M+YjtiKyspaWYoYiBpbiB0aGlzJiZ0aGlzW2JdPT09YSlyZXR1cm4gYjtyZXR1cm4tMX07dGhpcy5TdHJpcGUuaXNEb3VibGVMb2FkZWR8fCh0aGlzLlN0cmlwZS52YWxpZGF0b3I9e1wiYm9vbGVhblwiOmZ1bmN0aW9uKGEsYil7cmV0dXJuXCJ0cnVlXCIhPT1iJiZcImZhbHNlXCIhPT1iP1wiRW50ZXIgYSBib29sZWFuIHN0cmluZyAodHJ1ZSBvciBmYWxzZSlcIjp2b2lkIDB9LGludGVnZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4vXlxcZCskLy50ZXN0KGIpP3ZvaWQgMDpcIkVudGVyIGFuIGludGVnZXJcIn0scG9zaXRpdmU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4hdGhpcy5pbnRlZ2VyKGEsYikmJnBhcnNlSW50KGIsMTApPjA/dm9pZCAwOlwiRW50ZXIgYSBwb3NpdGl2ZSB2YWx1ZVwifSxyYW5nZTpmdW5jdGlvbihiLGMpe3ZhciBkO3JldHVybiBkPXBhcnNlSW50KGMsMTApLGEuY2FsbChiLGQpPDA/XCJOZWVkcyB0byBiZSBiZXR3ZWVuIFwiK2JbMF0rXCIgYW5kIFwiK2JbYi5sZW5ndGgtMV06dm9pZCAwfSxyZXF1aXJlZDpmdW5jdGlvbihhLGIpe3JldHVybiFhfHxudWxsIT1iJiZcIlwiIT09Yj92b2lkIDA6XCJSZXF1aXJlZFwifSx5ZWFyOmZ1bmN0aW9uKGEsYil7cmV0dXJuL15cXGR7NH0kLy50ZXN0KGIpP3ZvaWQgMDpcIkVudGVyIGEgNC1kaWdpdCB5ZWFyXCJ9LGJpcnRoWWVhcjpmdW5jdGlvbihhLGIpe3ZhciBjO3JldHVybiBjPXRoaXMueWVhcihhLGIpLGM/YzpwYXJzZUludChiLDEwKT4yZTM/XCJZb3UgbXVzdCBiZSBvdmVyIDE4XCI6cGFyc2VJbnQoYiwxMCk8MTkwMD9cIkVudGVyIHlvdXIgYmlydGggeWVhclwiOnZvaWQgMH0sbW9udGg6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5pbnRlZ2VyKGEsYik/XCJQbGVhc2UgZW50ZXIgYSBtb250aFwiOnRoaXMucmFuZ2UoWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyXSxiKT9cIk5lZWRzIHRvIGJlIGJldHdlZW4gMSBhbmQgMTJcIjp2b2lkIDB9LGNob2ljZXM6ZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5jYWxsKGIsYyk8MD9cIk5vdCBhbiBhY2NlcHRhYmxlIHZhbHVlIGZvciB0aGlzIGZpZWxkXCI6dm9pZCAwfSxlbWFpbDpmdW5jdGlvbihhLGIpe3JldHVybi9eW15APFxccz5dK0BbXkA8XFxzPl0rJC8udGVzdChiKT92b2lkIDA6XCJUaGF0IGRvZXNuJ3QgbG9vayBsaWtlIGFuIGVtYWlsIGFkZHJlc3NcIn0sdXJsOmZ1bmN0aW9uKGEsYil7cmV0dXJuL15odHRwcz86XFwvXFwvLitcXC4uKy8udGVzdChiKT92b2lkIDA6XCJOb3QgYSB2YWxpZCB1cmxcIn0sdXNUYXhJRDpmdW5jdGlvbihhLGIpe3JldHVybi9eXFxkezJ9LT9cXGR7MX0tP1xcZHsyfS0/XFxkezR9JC8udGVzdChiKT92b2lkIDA6XCJOb3QgYSB2YWxpZCB0YXggSURcIn0sZWluOmZ1bmN0aW9uKGEsYil7cmV0dXJuL15cXGR7Mn0tP1xcZHs3fSQvLnRlc3QoYik/dm9pZCAwOlwiTm90IGEgdmFsaWQgRUlOXCJ9LHNzbkxhc3Q0OmZ1bmN0aW9uKGEsYil7cmV0dXJuL15cXGR7NH0kLy50ZXN0KGIpP3ZvaWQgMDpcIk5vdCBhIHZhbGlkIGxhc3QgNCBkaWdpdHMgZm9yIGFuIFNTTlwifSxvd25lclBlcnNvbmFsSUQ6ZnVuY3Rpb24oYSxiKXt2YXIgYztyZXR1cm4gYz1mdW5jdGlvbigpe3N3aXRjaChhKXtjYXNlXCJDQVwiOnJldHVybi9eXFxkezN9LT9cXGR7M30tP1xcZHszfSQvLnRlc3QoYik7Y2FzZVwiVVNcIjpyZXR1cm4hMH19KCksYz92b2lkIDA6XCJOb3QgYSB2YWxpZCBJRFwifSxiaXpUYXhJRDpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGcsaCxpLGo7aWYoaD17Q0E6W1wiVGF4IElEXCIsWy9eXFxkezl9JC9dXSxVUzpbXCJFSU5cIixbL15cXGR7Mn0tP1xcZHs3fSQvXV19LGc9aFthXSxudWxsIT1nKXtmb3IoYz1nWzBdLGY9Z1sxXSxkPSExLGk9MCxqPWYubGVuZ3RoO2o+aTtpKyspaWYoZT1mW2ldLGUudGVzdChiKSl7ZD0hMDticmVha31pZighZClyZXR1cm5cIk5vdCBhIHZhbGlkIFwiK2N9fSx6aXA6ZnVuY3Rpb24oYSxiKXt2YXIgYztyZXR1cm4gYz1mdW5jdGlvbigpe3N3aXRjaChhLnRvVXBwZXJDYXNlKCkpe2Nhc2VcIkNBXCI6cmV0dXJuL15bXFxkXFx3XXs2fSQvLnRlc3QobnVsbCE9Yj9iLnJlcGxhY2UoL1xccysvZyxcIlwiKTp2b2lkIDApO2Nhc2VcIlVTXCI6cmV0dXJuL15cXGR7NX0kLy50ZXN0KGIpfHwvXlxcZHs5fSQvLnRlc3QoYil9fSgpLGM/dm9pZCAwOlwiTm90IGEgdmFsaWQgemlwXCJ9LGJhbmtBY2NvdW50TnVtYmVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuL15cXGR7MSwxN30kLy50ZXN0KGIpP3ZvaWQgMDpcIkludmFsaWQgYmFuayBhY2NvdW50IG51bWJlclwifSx1c1JvdXRpbmdOdW1iZXI6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZixnLGg7aWYoIS9eXFxkezl9JC8udGVzdChhKSlyZXR1cm5cIlJvdXRpbmcgbnVtYmVyIG11c3QgaGF2ZSA5IGRpZ2l0c1wiO2ZvcihmPTAsYj1nPTAsaD1hLmxlbmd0aC0xO2g+PWc7Yj1nKz0zKWM9MypwYXJzZUludChhLmNoYXJBdChiKSwxMCksZD03KnBhcnNlSW50KGEuY2hhckF0KGIrMSksMTApLGU9cGFyc2VJbnQoYS5jaGFyQXQoYisyKSwxMCksZis9YytkK2U7cmV0dXJuIDA9PT1mfHxmJTEwIT09MD9cIkludmFsaWQgcm91dGluZyBudW1iZXJcIjp2b2lkIDB9LGNhUm91dGluZ051bWJlcjpmdW5jdGlvbihhKXtyZXR1cm4vXlxcZHs1fVxcLVxcZHszfSQvLnRlc3QoYSk/dm9pZCAwOlwiSW52YWxpZCB0cmFuc2l0IG51bWJlclwifSxyb3V0aW5nTnVtYmVyOmZ1bmN0aW9uKGEsYil7c3dpdGNoKGEudG9VcHBlckNhc2UoKSl7Y2FzZVwiQ0FcIjpyZXR1cm4gdGhpcy5jYVJvdXRpbmdOdW1iZXIoYik7Y2FzZVwiVVNcIjpyZXR1cm4gdGhpcy51c1JvdXRpbmdOdW1iZXIoYil9fSxwaG9uZU51bWJlcjpmdW5jdGlvbihhLGIpe3ZhciBjO3JldHVybiBjPWIucmVwbGFjZSgvW14wLTldL2csXCJcIiksMTAhPT1jLmxlbmd0aD9cIkludmFsaWQgcGhvbmUgbnVtYmVyXCI6dm9pZCAwfSxiaXpEQkE6ZnVuY3Rpb24oYSxiKXtyZXR1cm4vXi57MSwyM30kLy50ZXN0KGIpP3ZvaWQgMDpcIlN0YXRlbWVudCBkZXNjcmlwdG9ycyBjYW4gb25seSBoYXZlIHVwIHRvIDIzIGNoYXJhY3RlcnNcIn0sbmFtZUxlbmd0aDpmdW5jdGlvbihhLGIpe3JldHVybiAxPT09Yi5sZW5ndGg/XCJOYW1lcyBuZWVkIHRvIGJlIGxvbmdlciB0aGFuIG9uZSBjaGFyYWN0ZXJcIjp2b2lkIDB9fSl9LmNhbGwodGhpcyk7Il19
