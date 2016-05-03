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
  $scope.title = "Confirmation";

  $scope.buttonTextNxt = "Go Home";
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
var flightController = function($scope, $location,api,$routeParams) {

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

    console.log($routeParams)


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
  flightController.$inject = ['$scope', '$location', 'api','$stateParams'];
} else {
  flightController.$inject = ['$scope', '$location', 'api','$routeParams'];
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

 var mainController = function($scope, $location, api) {
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
     return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitDate || $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin) || !airporsContains($scope.selectedDest);
   }

   $scope.flight = {
     type: "one"
   }
   $scope.otherAirline = {
     value: false
   }



   $scope.goToFlights = function() {
     var exitDate, returnDate;

     exitDate = ($scope.exitDate.getTime() / 1000).toFixed(0);
     if ($scope.returnDate)
       returnDate = ($scope.returnDate.getTime() / 1000).toFixed(0);

     if ($scope.otherAirline.value) {
       if ($scope.flight.type == "one")
         if (Type == 'desktop')
           $location.path('/flights-new')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', exitDate);
         else
           $location.go('tab.flights-new', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: exitDate
           })
       else {
         if (Type == 'desktop')
           $location.path('/flights-new')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', exitDate)
           .search('returnDate', returnDate);
         else
           $location.go('tab.flights-new', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: exitDate,
             returnDate: returnDate
           })
       }
     } else {
       if ($scope.flight.type == "one")
       if(Type == 'desktop')
         $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
         else
         $location.go('tab.flights', {
           origin: $scope.selectedOrigin,
           destination: $scope.selectedDest,
           exitDate: ($scope.exitDate.getTime() / 1000).toFixed(0)
         })
       else {
         if(Type == 'desktop')
         $location.path('/flights')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
           .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
           else
           $location.go('tab.flights', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: ($scope.exitDate.getTime() / 1000).toFixed(0),
             returnDate: ($scope.returnDate.getTime() / 1000).toFixed(0)
           })
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


 };

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

 if (Type == 'mobile') {
   mainController.$inject = ['$scope', '$state', 'api'];
 } else {
   mainController.$inject = ['$scope', '$location', 'api'];
 }

 App.controller('mainCtrl', mainController);

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
      console.log(api.getChosenOutGoingFlight());
      console.log(response.id)
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJBcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbiA9IHt9O1xuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHt9O1xuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucHV0ID0ge307XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wYXRjaCA9IHt9O1xufSk7XG5cbkFwcC5mYWN0b3J5KCdhcGknLCBmdW5jdGlvbigkaHR0cCkge1xuICB2YXIgYWNjZXNzVG9rZW4gPSBcImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpwYzNNaU9pSlBibXhwYm1VZ1NsZFVJRUoxYVd4a1pYSWlMQ0pwWVhRaU9qRTBOakV3TkRNeU56Z3NJbVY0Y0NJNk1UUTVNalUzT1RJM09Dd2lZWFZrSWpvaWQzZDNMbVY0WVcxd2JHVXVZMjl0SWl3aWMzVmlJam9pYW5KdlkydGxkRUJsZUdGdGNHeGxMbU52YlNKOS5kWFpWQy0tdXZ0aWdyRkI3VDNmR1RHODROSVlsU25ScWJnYlQ0M3h6RkF3XCJcbiAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQsIHJlZk51bTtcbiAgdmFyIGlzT3RoZXJIb3N0czsgLy8gc2V0IHRvIGZhbHNlIGluIGZsaWdodHNjdHJsICxzZXQgdG8gdHJ1ZSBmbGlnaHRzTmV3Q3RybFxuICB2YXIgc3RyaXBlVG9rZW47XG4gIHZhciBwYXNzZW5nZXJEYXRhID0gW107XG4gIHJldHVybiB7XG4gICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9haXJwb3J0cycsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi8wLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvZWNvbm9teS8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRPdGhlckZsaWdodHNCdXNpOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJy9hcGkvYWlyY3JhZnRzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6ICcvYXBpL2NvdW50cmllcycsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICB9LFxuICAgIHNldFJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgfSxcbiAgICBzZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKHBhc3Nlbmdlcikge1xuICAgICAgcGFzc2VuZ2VyRGF0YS5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICBpZiAoaXNPdGhlckhvc3RzKVxuICAgICAgICBib29raW5nRGF0YS5QYXNzZW5nZXJEZXRhaWxzID0gcGFzc2VuZ2VyRGF0YVxuICAgIH0sXG4gICAgZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNhYmluZXRPdXRnb2luZ0NsYXNzO1xuICAgIH0sXG4gICAgZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjYWJpbmV0UmV0dXJuaW5nQ2xhc3M7XG4gICAgfSxcbiAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG4gICAgICBpZiAoIWlzT3RoZXJIb3N0cykge1xuXG4gICAgICAgIGlmICghYm9va2luZy5leGl0SXNFY29ub215KVxuICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWJvb2tpbmcuY2xhc3MpXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICBpZiAoIWJvb2tpbmcuY2xhc3MpXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICB9XG5cblxuXG4gICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgfSxcblxuICAgIGdldFBhc3NlbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGFzc2VuZ2VyRGF0YTtcbiAgICB9LFxuICAgIGdldEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGJvb2tpbmdEYXRhO1xuICAgIH0sXG4gICAgZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNob3Nlbk91dGdvaW5nRmxpZ2h0O1xuICAgIH0sXG4gICAgZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaG9zZW5SZXR1cm5pbmdGbGlnaHQ7XG4gICAgfSxcbiAgICBnZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG91dGdvaW5nU2VhdDtcbiAgICB9LFxuXG4gICAgZ2V0UmV0dXJuU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmV0dXJuU2VhdDtcbiAgICB9LFxuICAgIHNldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgb3V0Z29pbmdTZWF0ID0gc2VhdDtcbiAgICB9LFxuICAgIHNldFJldHJ1blNlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgIHJldHVyblNlYXQgPSBzZWF0O1xuICAgIH0sXG4gICAgc2V0SXNPdGhlckhvc3RzOiBmdW5jdGlvbihvdGhlckhvc3RzKSB7XG4gICAgICBpc090aGVySG9zdHMgPSBvdGhlckhvc3RzO1xuICAgIH0sXG4gICAgSXNPdGhlckhvc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpc090aGVySG9zdHM7XG4gICAgfSxcbiAgICBjbGVhckxvY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IHt9XG4gICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IHt9XG4gICAgICBwYXNzZW5nZXJEYXRhID0gW11cbiAgICAgIGJvb2tpbmdEYXRhID0ge31cbiAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0ge31cbiAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IHt9XG4gICAgICBvdXRnb2luZ1NlYXQgPSB7fVxuICAgICAgcmV0dXJuU2VhdCA9IHt9XG4gICAgICBpc2lzT3RoZXJIb3N0cyA9IGZhbHNlXG5cbiAgICB9LFxuICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKG90aGVySG9zdHMpIHtcbiAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICBpZiAodGhpcy5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgcHJpY2UgPSB0aGlzLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgIGVsc2VcbiAgICAgICAgcHJpY2UgPSB0aGlzLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgIGlmICh0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICBpZiAodGhpcy5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHByaWNlID0gcHJpY2UgKyB0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICBpZiAoIW90aGVySG9zdHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICB1cmw6ICcvYm9va2luZycsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiBvdGhlckhvc3RzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiAkLnBhcmFtKHtcbiAgICAgICAgICAgIHBhc3NlbmdlcjogcGFzc2VuZ2VyRGF0YSxcbiAgICAgICAgICAgIGJvb2tpbmc6IGJvb2tpbmdEYXRhLFxuICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgb3V0Z29pbmdTZWF0TnVtYmVyOiBvdXRnb2luZ1NlYXQsXG4gICAgICAgICAgICByZXR1cm5TZWF0TnVtYmVyOiByZXR1cm5TZWF0LFxuICAgICAgICAgICAgdG9rZW46IHN0cmlwZVRva2VuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHVybDogJy9ib29raW5nJywgLy8gaGFzIHRvIGJlIGNoYW5nZWQgISFcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6IG90aGVySG9zdHNcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IGJvb2tpbmdEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSxcbiAgICBnZXRTdHJpcGVUb2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3RyaXBlVG9rZW47XG4gICAgfSxcbiAgICBzZXRTdHJpcGVUb2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIHN0cmlwZVRva2VuID0gdG9rZW47XG4gICAgfVxuICB9O1xufSk7XG4iLCIvLyBAYWJkZWxyaG1hbi1lc3NhbVxuQXBwLmNvbnRyb2xsZXIoJ2NvbmZpcm1hdGlvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGkpIHtcbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1jb25maXJtYXRpb24nO1xuICAkc2NvcGUudGl0bGUgPSBcIkNvbmZpcm1hdGlvblwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJHbyBIb21lXCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXBpLnN1Ym1pdEJvb2tpbmcoJ2ZhbHNlJykudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAvLyAgIGFsZXJ0KGRhdGEuZGF0YSlcbiAgICAgIC8vICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vXG4gICAgICAvLyB9KVxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgfVxuXG4gICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUuZ29Tb2NpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3NvY2lhbCcpO1xuXG4gICAgfVxuICAgICRzY29wZS5mbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSBhcGkuZ2V0UGFzc2VuZ2VyKClbMF07XG4gICAgJCgnI3F1b3Rlcy10ZXh0JykudHlwZUl0KHtcbiAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgJ1wiVHJhdmVsIGFuZCBjaGFuZ2Ugb2YgcGxhY2UgaW1wYXJ0IG5ldyB2aWdvciB0byB0aGUgbWluZC5cIi1TZW5lY2EnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyB0ZW5kcyB0byBtYWduaWZ5IGFsbCBodW1hbiBlbW90aW9ucy7igJ0g4oCUIFBldGVyIEhvZWcnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyDigJMgaXQgbGVhdmVzIHlvdSBzcGVlY2hsZXNzLCB0aGVuIHR1cm5zIHlvdSBpbnRvIGEgc3Rvcnl0ZWxsZXIu4oCdIC0gSWJuIEJhdHR1dGEnLFxuICAgICAgICAnIOKAnFdlIHRyYXZlbCwgc29tZSBvZiB1cyBmb3JldmVyLCB0byBzZWVrIG90aGVyIHBsYWNlcywgb3RoZXIgbGl2ZXMsIG90aGVyIHNvdWxzLuKAnSDigJMgQW5haXMgTmluJ1xuICAgICAgXSxcbiAgICAgIHNwZWVkOiA4MCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG4gIH1cblxuLy9cbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuT3V0Z29pbmdGbGlnaHRcIik7XG4vLyAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpO1xuLy8gY29uc29sZS5sb2coXCJwYXNzZW5nZXJcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRQYXNzZW5nZXIoKSlcbi8vIGNvbnNvbGUubG9nKFwiYm9va2luZ1wiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKSlcbi8vIGNvbnNvbGUubG9nKFwiZ29pbmdTZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0T3V0Z29pbmdTZWF0KCkpXG4vLyBjb25zb2xlLmxvZyhcInJldHJ1blNlYXRcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRSZXR1cm5TZWF0KCkpXG5cblxufSk7XG4iLCIvLyBATmFiaWxhXG5BcHAuY29udHJvbGxlcignZmxpZ2h0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkZsaWdodChzKSBEZXRhaWxzXCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuXG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgdmFyIG91dGdvaW5nRmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG4gIHZhciByZXR1cm5GbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCk7XG5cbiAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuXG4gIHZhciBmYWNpbGl0aWVzID0gW1wiU21va2luZyBhcmVhcyBhdmFpbGFibGVcIiwgXCJXaS1GaSBhdmFpbGFiaWxpdHlcIixcbiAgICBcIjQgY3VsdHVyYWwgY3Vpc2luZXNcIiwgXCJJbmZsaWdodCBlbnRlcnRhaW5tZW50XCIsIFwiRXh0cmEgY296eSBzbGVlcGVyZXR0ZVwiLFxuICAgIFwiU2NyZWVucyB0byBzaG93IHlvdXIgZmxpZ2h0IHBhdHRlcm4sIGFpcmNyYWZ0IGFsdGl0dWRlIGFuZCBzcGVlZFwiXG4gIF07XG5pZiAob3V0Z29pbmdGbGlnaHQpe1xuICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuXG5cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIGFycml2YWxEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmFycml2YWxVVEMpO1xuICAgIHJldHVybkZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICB2YXIgYWlyY3JhZnRzID0gW107XG4gIHZhciBvdXRBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciBvdXRBaXJjcmFmdGhhc1dpZmk7XG4gIHZhciByZUFpcmNyYWZ0aGFzU21va2luZztcbiAgdmFyIHJlQWlyY3JhZnRoYXNXaWZpIDtcbiAgYXBpLmdldEFpcmNyYWZ0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlyY3JhZnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICRzY29wZS5vdXRBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IHJldHVybkZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICAgJHNjb3BlLnJlQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuXG4gICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gIHZhciBhaXJwb3J0cyA9IFtdO1xuICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG4gIHZhciBvdXRidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gIHZhciBvdXRmYXJlID0gMDtcblxuICBpZiAoYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuZWNvbm9teUZhcmU7XG4gIH0gZWxzZSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgfVxuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlYnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICAgIHZhciByZWZhcmUgPSAwO1xuICAgIGlmIChib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5lY29ub215RmFyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5idXNpbmVzc0ZhcmU7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dGZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzU21va2luZylcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbiBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNTbW9raW5nKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNXaWZpKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG5cbiAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gICAgfVxuICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuXG4gICAgJHNjb3BlLnJldHVybkZsaWdodCA9IHJldHVybkZsaWdodDtcbiAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLnJlZmFyZSA9IHJlZmFyZTtcbiAgICAkc2NvcGUucmVmYWNpbGl0aWVzUmVzdWx0ID0gcmVmYWNpbGl0aWVzUmVzdWx0O1xuICB9XG4gICRzY29wZS5vdXRnb2luZ0ZsaWdodCA9IG91dGdvaW5nRmxpZ2h0O1xuICAkc2NvcGUub3V0YnVzaW5lc3NPckVjb24gPSBvdXRidXNpbmVzc09yRWNvbjtcbiAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAkc2NvcGUub3V0ZmFjaWxpdGllc1Jlc3VsdCA9IG91dGZhY2lsaXRpZXNSZXN1bHQ7XG5cbn1cbn0pO1xuIiwiLy8gQGFiZGVscmFobWFuLW1hZ2VkXG52YXIgZmxpZ2h0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgYXBpLnNldElzT3RoZXJIb3N0cyhmYWxzZSk7XG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodC5faWRcbiAgICAgIGlmKCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodClcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0Ll9pZFxuICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgICBcInJlZlBhc3NlbmdlcklEXCI6IFtdLFxuICAgICAgXCJpc3N1ZURhdGVcIjogbnVsbCxcbiAgICAgIFwiaXNPbmVXYXlcIjogISRzY29wZS5yb3VuZFRyaXAsXG4gICAgICBcInJlZkV4aXRGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgIFwicmVjZWlwdE51bWJlclwiOiBudWxsXG4gICAgfTtcblxuICAgIGlmICghb3JpZ2luIHx8ICFkZXN0aW5hdGlvbiB8fCAhZXhpdERhdGUpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgdmFyIGZsaWdodHM7XG4gICAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gICAgaWYgKHJldHVybkRhdGUpXG4gICAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICAgYXBpLmdldEZsaWdodHMob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAvLyBmb3JtYXR0aW5nIGRhdGEgdG8gYmUgcHJlc2VudGFibGVcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICB9XG5cbiAgICAgIC8vICRzY29wZS5mbGlnaHRzID0gZmxpZ2h0cy5maWx0ZXIoY2hlY2tDb25zdHJhaW50cyk7XG5cbiAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHM7XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRUYWlsTnVtYmVyKVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuZXhpdElzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgY29uc29sZS5sb2coJHJvdXRlUGFyYW1zKVxuXG5cbiAgICAkc2NvcGUuZmxpZ2h0cyA9IHtcbiAgICBcIm91dGdvaW5nRmxpZ2h0c1wiOiBbe1xuICAgICAgXCJfaWRcIjogXCIxXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDBcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMDM6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjJcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDA2OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwODowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAyXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTI6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE0OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjRcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwM1wiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDE3OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxOTowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfV0sXG4gICAgXCJyZXR1cm5GbGlnaHRzXCI6IFt7XG4gICAgICBcIl9pZFwiOiBcIjFcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMFwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDAxOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQwMzowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiMlwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAxXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMDY6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDA4OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIzXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQxMjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMTQ6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiNFwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAzXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMTc6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE5OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9XVxuICB9O1xuXG4gICAgJHNjb3BlLm9yaWdpbiA9IFwiQ0FJXCI7XG4gICAgJHNjb3BlLmRlc3RpbmF0aW9uID0gXCJKRURcIjtcbiAgICAkc2NvcGUuZXhpdERhdGUgPSBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCI7XG5cbiAgICAkc2NvcGUubWluaUxvZ29QYXRoID0gZnVuY3Rpb24ob3BlcmF0b3JBaXJsaW5lKXtcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUgPT09IFwiQWlyIEJlcmxpblwiKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLWJlcmxpbi1taW5pLWxvZ28ucG5nXCJcbiAgICAgIHJldHVybiBcImltZy9vdGhlci1haXJsaW5lLW1pbmktbG9nby5wbmdcIlxuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICB9XG5cbiAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZU91dDtcbiAgfTtcblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHN0YXRlUGFyYW1zJ107XG59IGVsc2Uge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzQ3RybCcsIGZsaWdodENvbnRyb2xsZXIpO1xuIiwidmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCRyb3V0ZVBhcmFtcykge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICBhcGkuc2V0SXNPdGhlckhvc3RzKHRydWUpO1xuXG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gIH1cblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgXCJwYXNzZW5nZXJEZXRhaWxzXCI6IFt7XG4gICAgICBcImZpcnN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJsYXN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydE51bVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgIFwibmF0aW9uYWxpdHlcIjogbnVsbCxcbiAgICAgIFwiZW1haWxcIjogbnVsbCxcbiAgICB9XSxcbiAgICBcImNsYXNzXCI6IG51bGwsXG4gICAgXCJvdXRnb2luZ0ZsaWdodElkXCI6IG51bGwsXG4gICAgXCJyZXR1cm5GbGlnaHRJZFwiOiBudWxsLFxuICAgIFwicGF5bWVudFRva2VuXCI6IG51bGxcbiAgfVxuXG4gIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gIC8vIFRPRE86IHZhciBpc0Vjb25vbXkgPSAkcm91dGVQYXJhbXMuY2xhc3MgPT09IFwiZWNvbm9teVwiPyB0cnVlIDogZmFsc2U7XG4gIHZhciBpc0Vjb25vbXkgPSB0cnVlO1xuXG4gICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gIH1cblxuICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgaWYgKHJldHVybkRhdGUpXG4gICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICBpZiAoaXNFY29ub215KSB7XG4gICAgYXBpLmdldE90aGVyRmxpZ2h0c0VjbyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSlcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzQnVzaShvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5jbGFzcyA9IGlzRWNvbm9teSA9PT0gdHJ1ZSA/IFwiZWNvbm9teVwiIDogXCJidXNpbmVzc1wiO1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcub3V0Z29pbmdGbGlnaHRJZCA9IGZsaWdodC5faWQ7XG4gIH1cblxuICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJldHVybkZsaWdodElkID0gZmxpZ2h0Ll9pZDtcbiAgfVxuXG4gICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUucm91bmRUcmlwKVxuICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gIH1cblxufVxuXG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn0gZWxzZSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnLF07XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCIgdmFyIG1haW5Db250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG4gICAkc2NvcGUuZ28gPSBmdW5jdGlvbigpIHtcbiAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlbGVjdGVkT3JpZ2luKTtcbiAgIH1cblxuICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAkc2NvcGUuYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgIH0pO1xuXG5cbiAgICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICRzY29wZS5zZWxlY3RlZERlc3QgPSB1bmRlZmluZWQ7XG5cbiAgIGZ1bmN0aW9uIGFpcnBvcnNDb250YWlucyhpYXRhKSB7XG4gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgaWYgKGlhdGEgPT0gJHNjb3BlLmFpcnBvcnRzW2ldWydpYXRhJ10pXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgfVxuICAgICByZXR1cm4gZmFsc2U7XG4gICB9XG5cbiAgICRzY29wZS5idXR0b25TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICByZXR1cm4gISRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhJHNjb3BlLnNlbGVjdGVkRGVzdCB8fCAhJHNjb3BlLmV4aXREYXRlIHx8ICRzY29wZS5zZWxlY3RlZERlc3QgPT0gJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkT3JpZ2luKSB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZERlc3QpO1xuICAgfVxuXG4gICAkc2NvcGUuZmxpZ2h0ID0ge1xuICAgICB0eXBlOiBcIm9uZVwiXG4gICB9XG4gICAkc2NvcGUub3RoZXJBaXJsaW5lID0ge1xuICAgICB2YWx1ZTogZmFsc2VcbiAgIH1cblxuXG5cbiAgICRzY29wZS5nb1RvRmxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgZXhpdERhdGUsIHJldHVybkRhdGU7XG5cbiAgICAgZXhpdERhdGUgPSAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG4gICAgIGlmICgkc2NvcGUucmV0dXJuRGF0ZSlcbiAgICAgICByZXR1cm5EYXRlID0gKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG5cbiAgICAgaWYgKCRzY29wZS5vdGhlckFpcmxpbmUudmFsdWUpIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZVxuICAgICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCByZXR1cm5EYXRlKTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6IHJldHVybkRhdGVcbiAgICAgICAgICAgfSlcbiAgICAgICB9XG4gICAgIH0gZWxzZSB7XG4gICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJykuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KS5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMnLCB7XG4gICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgZXhpdERhdGU6ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKVxuICAgICAgICAgfSlcbiAgICAgICBlbHNlIHtcbiAgICAgICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKVxuICAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICByZXR1cm5EYXRlOiAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKVxuICAgICAgICAgICB9KVxuICAgICAgIH1cblxuICAgICB9XG5cbiAgIH07XG5cblxuXG5cbiAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgICQoJyNtYWluLXRleHQnKS50eXBlSXQoe1xuICAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgIFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIiwgXCJEZXN0aW5hdGlvbnMgYWxsIGFyb3VuZCB0aGUgZ2xvYmUuXCIsIFwiRXhwZXJpZW5jZSBhdXRoZW50aWMgaG9zcGl0YWxpdHkuXCIsIFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICAgXSxcbiAgICAgICBzcGVlZDogMTIwLFxuICAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgIGxvb3A6IHRydWVcbiAgICAgfSk7XG5cblxuXG4gICAgICRsb2NhdGlvbi51cmwoJGxvY2F0aW9uLnBhdGgoKSk7XG4gICAgIHNldFVwRGF0ZSgkc2NvcGUpO1xuXG4gICAgICRzY29wZS5jaGlsZHJlbiA9IFsnMCBjaGlsZHJlbicsICcxIGNoaWxkJywgJzIgY2hpbGRyZW4nLCAnMyBjaGlsZHJlbicsICc0IGNoaWxkcmVuJ107XG4gICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSAkc2NvcGUuY2hpbGRyZW5bMF07XG4gICAgICRzY29wZS5jaGFuZ2VDaGlsZHJlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG5cblxuICAgICAkc2NvcGUuYWR1bHRzID0gWycxIGFkdWx0JywgJzIgYWR1bHRzJywgJzMgYWR1bHRzJywgJzQgYWR1bHRzJ107XG4gICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCBpbmZhbnRzJywgJzEgaW5mYW50J107XG4gICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gJHNjb3BlLmluZmFudHNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VJbmZhbnQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG4gICB9XG5cblxuIH07XG5cbiBmdW5jdGlvbiBzZXRVcERhdGUoJHNjb3BlKSB7XG4gICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgfTtcbiAgICRzY29wZS50b2RheSgpO1xuXG4gICAkc2NvcGUub3BlbjIgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLnBvcHVwMi5vcGVuZWQgPSB0cnVlO1xuICAgfTtcbiAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cC5vcGVuZWQgPSB0cnVlO1xuICAgfTtcblxuXG4gICBmdW5jdGlvbiBkaXNhYmxlZChkYXRhKSB7XG4gICAgIHZhciBkYXRlID0gZGF0YS5kYXRlLFxuICAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgIHJldHVybiBtb2RlID09PSAnZGF5JyAmJiAoZGF0ZS5nZXREYXkoKSA9PT0gMCB8fCBkYXRlLmdldERheSgpID09PSA2KTtcbiAgIH1cbiAgICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgbWF4RGF0ZTogbmV3IERhdGUoMjAyMCwgNSwgMjIpLFxuICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICBzdGFydGluZ0RheTogMVxuICAgfTtcbiAgICRzY29wZS5wb3B1cDIgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gICAkc2NvcGUucG9wdXAgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gfVxuXG4gaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnYXBpJ107XG4gfSBlbHNlIHtcbiAgIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG4gfVxuXG4gQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgbWFpbkNvbnRyb2xsZXIpO1xuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJHNjb3BlLnRpdGxlcyA9IFsnTXInLCAnTXJzJywgJ01zJywgJ0RyJ107XG4gICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAgICRzY29wZS5jaGFuZ2VUaXRsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICBhcGkuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvdW50cmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cblxuXG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgdHlwZTogbnVsbCxcbiAgICAgIGNvdW50cnlDb2RlOiBudWxsLFxuICAgICAgbmF0aW9uYWxpdHk6IG51bGwsXG4gICAgICBzZXg6IG51bGwsXG4gICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICBwb2ludHM6IG51bGwsXG4gICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgZmlyc3ROYW1lOiBudWxsLFxuICAgICAgbWlkZGxlTmFtZTogbnVsbCxcbiAgICAgIGxhc3ROYW1lOiBudWxsLFxuICAgICAgcGFzc3BvcnROdW1iZXI6IG51bGwsXG4gICAgICBwaG9uZU51bWJlcjogbnVsbCxcbiAgICAgIGVtYWlsOiBudWxsXG5cbiAgICB9O1xuXG5cbiAgICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuXG4gICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS50aXRsZXNCdG5UZXh0LFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lLFxuICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxuICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMVxuXG5cbiAgICAgIH07XG4gICAgICAvLy9iZWZvcmUgeW91IGxlYXZlIHRoZSBwYWdlIG1ha2Ugc3VyZSB0aGF0IHRoZSBwYXNzZW5nZXIgb2JqZWN0IGlzIGNvbXBsZXRlIG90aGVyd2lzZSBzaG93IGFsZXJ0KFwiRmlsbCBpbiBhbGwgZGF0YVwiKTtcblxuXG5cbiAgICAgIGlmIChjb21wbGV0ZSA9PSBmYWxzZSkge1xuICAgICAgICAkc2NvcGUuYWxlcnREYXRhID0gZmFsc2U7XG4gICAgICAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSkge1xuICAgICAgICAgICRzY29wZS5hbGVydERhdGEgPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgaWYgKGNvbXBsZXRlID09IHRydWUpIHtcbiAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgaWYgKCFhcGkuaXNPdGhlckhvc3RzKVxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICBlbHNlICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICB9XG5cbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcblxuXG5cbiAgICB2YXIgY29tcGxldGUxID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUuY291bnRyaWVzTW9iLFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS5UaXRsZU1vYixcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZU1vYixcbiAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZU1vYixcbiAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlck1vYixcbiAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFNb2JcblxuXG4gICAgICB9O1xuXG5cblxuXG4gICAgICBpZiAoY29tcGxldGUxID09IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhOlwiICsgXCJcXG5cIiArIFwiUGFzc3BvcnQgTnVtYmVyIG11c3QgYmUgOCBudW1iZXJzXCIgKyBcIlxcblwiICtcbiAgICAgICAgICAgIFwiUGhvbmUgTnVtYmVyIG11c3QgYmUgMTAgbnVtYmVyc1wiICsgXCJcXG5cIiArIFwiRW1haWxzIG11c3QgYmUgaW4gYUB4eXouY29tIGZvcm1hdFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgIT0gJHNjb3BlLmVtYWlsdmVyTW9iKVxuICAgICAgICAgICAgYWxlcnQoXCJUaGUgZW50ZXJlZCBlbWFpbHMgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSlcbiAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UgZW50ZXJlZFwiKVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbXBsZXRlMSA9PSB0cnVlKSB7XG4gICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgfVxuXG4gICAgfTtcbiAgfVxuXG5cblxufSk7XG4iLCIvLyBAbWlybmFcbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXBheW1lbnQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSB5b3VyIHBheW1lbnQgb3B0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgJHNjb3BlLmZvcm0gPSB7XG4gICAgbnVtYmVyOiBudWxsLFxuICAgIGN2YzogbnVsbCxcbiAgICBleHBfbW9udGg6IG51bGwsXG4gICAgZXhwX3llYXI6IG51bGxcbiAgfTtcbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByID0gY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCBwYXk/XCIpO1xuICAgIGlmIChyID09IHRydWUpIHtcbiAgICAkc2NvcGUuZm9ybS5leHBfeWVhciA9ICRzY29wZS55ZWFyc0J0blRleHRcbiAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcbiAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkpO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuaWQpXG4gICAgICBhcGkuc2V0U3RyaXBlVG9rZW4ocmVzcG9uc2UuaWQpXG4gICAgICBhcGkuc3VibWl0Qm9va2luZyhhcGkuSXNPdGhlckhvc3RzKCkpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpO1xuICAgICAgICAvLyBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgIH0pXG4gICAgfSk7XG4gICAgfVxuXG4gICAgLy8gaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZycpO1xuICB9XG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHByaWNlID0gMDtcbiAgICBpZiAoYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgIGVsc2VcbiAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKSB7XG5cbiAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICBlbHNlXG4gICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnByaWNlID0gcHJpY2U7XG4gICAgJHNjb3BlLnllYXJzID0gWycyMDE2JywgJzIwMTcnLCAnMjAxOCcsICcyMDE5JywgJzIwMjAnLCAnMjAyMScsICcyMDIyJywgJzIwMjMnLCAnMjAyNCddO1xuICAgICRzY29wZS55ZWFyc0J0blRleHQgPSAkc2NvcGUueWVhcnNbMF07XG4gICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICAkc2NvcGUubW9udGhzID0gWydKYW51YXJ5JywgJ0ZlYnVyYXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ107XG4gICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICRzY29wZS5jaGFuZ2VNb250aCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICRzY29wZS5tb250aHNCdG5ObyA9ICRzY29wZS5tb250aHMuaW5kZXhPZih0ZXh0KTtcbiAgICB9XG4gIH1cblxufSk7XG4iLCIvLyBAYWhtZWQtZXNzbWF0XG4gIHZhciBzZWF0aW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2Utc2VhdGluZyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBzaXQ/XCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL3JldHVyaW5nJyk7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRSZXRydW5TZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICB9XG5cblxuXG4gICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXRtYXA7XG5cbiAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG5cbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9XG5cblxuXG4gICAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgICB2YXIgc2NoZW1hID0gWzMsIDUsIDMsIDIwXTtcblxuICAgICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnNlYXJjaENvbG9yID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGlmICghJHNjb3BlLmlzRW1wdHkodGV4dCkpXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdE9jdSc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRFbXB0eSc7XG4gICAgICB9XG4gICAgICAkc2NvcGUuaXNFbXB0eSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXRtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXRtYXBbaV1bJ251bWJlciddID09IHRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWF0bWFwW2ldWydpc0VtcHR5J11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3RTZWF0ID0gZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICRzY29wZS5zZWF0ID0gc2VhdDtcbiAgICAgIH07XG4gICAgfVxuXG5cblxuICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICB2YXIgc2NoZW1hID0gWzIsIDQsIDIsIDldO1xuXG4gICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgfVxuXG5cbn07XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignc2VhdGluZ0N0cmwnLCBzZWF0aW5nQ29udHJvbGxlcik7XG4iXX0=
