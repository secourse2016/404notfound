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
                        'gamed': 'hamed'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0",
                    headers: {
                        'x-access-token': accessToken,
                        'gamed': 'hamed'


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



if(Type == 'desktop'){
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
  var outgoingFlight = api.getChosenOutGoingFlight();
  var returnFlight = api.getChosenReturningFlight();

  var booking = api.getBooking();

  var facilities = ["Smoking areas available", "Wi-Fi availability",
      "4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
      "Screens to show your flight pattern, aircraft altitude and speed"
  ];

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
  var reAircrafthasWifi =false;
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


    // $scope.refDestinationAirportName =refDestinationAirportName;
    // $scope.refOriginAirportName=refOriginAirportName;
    // $scope.aircrafthasSmoking = aircrafthasSmoking;
    // $scope.aircrafthasWifi = aircrafthasWifi;
    // $scope.aircraftModel = aircraftModel;
});

// @abdelrahman-maged
var flightController = function($scope, $location,$routeParams,api) {

      $scope.pageClass = 'page-flights';
      $scope.title = "Choose a Flight";
      $scope.buttonTextNxt = "Next";
      $scope.buttonTextBk = "Back";



      if(Type == 'desktop'){
        $scope.isCollapsed = true;
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

        $scope.selectedBooking = {
            "refPassengerID": null,
            "exitDepartureUTC": null,
            "reEntryDepartureUTC": null,
            "issueDate": null,
            "isOneWay": !$scope.roundTrip,
            "refExitFlightNumber": null,
            "refReEntryFlightNumber": null,
            "receiptNumber": null
        };

        // var origin = "TXL";
        // var destination = "JFK";
        // var exitDate = new Date(1459555200 * 1000);

        if (!origin || !destination || !exitDate) {
            $location.path('/');
        }

        var flights;
        var returnDateMill;
        if (returnDate)
            returnDateMill = returnDate.getTime();
            // console.log(exitDate.toISOString())
        api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
            // console.log(response)
            flights = response.data
            console.log(response.data)
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

            // throwing away flights.outgoingFlights not fitting constraints
            // function checkConstraints(flight) {
            //
            //     var flightDate = new Date(flight.departureUTC);
            //
            //     return flight.refOriginAirport === origin && flight.refDestinationAirport === destination && flightDate.getDay() === exitDate.getDay() && flightDate.getMonth() === exitDate.getMonth() && flightDate.getFullYear() === exitDate.getFullYear();
            //
            // }

            // $scope.flights = flights.filter(checkConstraints);
            if($scope.roundTrip )
            for (i = 0; i < flights.returnFlights.length; i++) {

                var departureDate = new Date(flights.returnFlights[i].departureUTC);
                flights.returnFlights[i].departureUTC = departureDate.toUTCString();

                var arrivalDate = new Date(flights.returnFlights[i].arrivalUTC);
                flights.returnFlights[i].arrivalUTC = arrivalDate.toUTCString();

                var hours = Math.floor(flights.returnFlights[i].duration / 60);
                var minutes = flights.returnFlights[i].duration % 60;

                flights.returnFlights[i].duration = hours + "h " + minutes + "m";

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
                if($scope.roundTrip)
                for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                    for (var j = 0; j < airports.length; j++) {

                        if (airports[j].iata === $scope.flights.returnFlights[i].refOriginAirport)
                            $scope.flights.returnFlights[i].refOriginAirportName = airports[j].name;

                        if (airports[j].iata === $scope.flights.returnFlights[i].refDestinationAirport)
                            $scope.flights.returnFlights[i].refDestinationAirportName = airports[j].name;

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

                if($scope.roundTrip)
                for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                    for (var j = 0; j < aircrafts.length; j++) {

                        if (aircrafts[j].tailNumber === $scope.flights.returnFlights[i].refAircraftTailNumber)
                            $scope.flights.returnFlights[i].refAircraftModel = aircrafts[j].model;

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

            $scope.selectedBooking.exitDepartureUTC = flight.departureUTC;
            $scope.selectedBooking.exitIsEconomy = isEconomy;
            // $scope.selectedBooking.isOneWay = $scope.roundTrip;
            $scope.selectedBooking.refExitFlightNumber = flight.number;
        }

        $scope.selectReturningFlight = function(flight, isEconomy) {

            $scope.isReturningFlightSelected = true;
            $scope.selectedReturningFlight = flight;

            $scope.selectedBooking.reEntryDepartureUTC = flight.departureUTC;
            $scope.selectedBooking.reEntryIsEconomy = isEconomy;
            // $scope.selectedBooking.isOneWay = $scope.roundTrip;
            $scope.selectedBooking.refReEntryFlightNumber = flight.number;
        }


        $scope.checkNextBtnState = function() {
            if ($scope.roundTrip) {
                return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
            } else {
                return $scope.isOutgoingFlightSelected;
            }
        }
      }else{

      }

      // console.log($scope.roundTrip)



}

if(Type == 'mobile'){
  flightController.$inject = ['$scope', '$location', 'api'];
}else{
  flightController.$inject = ['$scope', '$location','$routeParams', 'api'];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3Rvcmllcy5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbInNldFVwRGF0ZSIsIiRzY29wZSIsInRvZGF5IiwiZXhpdERhdGUiLCJEYXRlIiwicmV0dXJuRGF0ZSIsIm9wZW4yIiwicG9wdXAyIiwib3BlbmVkIiwib3BlbiIsInBvcHVwIiwiZGF0ZU9wdGlvbnMiLCJmb3JtYXRZZWFyIiwibWF4RGF0ZSIsIm1pbkRhdGUiLCJzdGFydGluZ0RheSIsIkFwcCIsImZhY3RvcnkiLCIkaHR0cCIsImNob3Nlbk91dGdvaW5nRmxpZ2h0IiwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0IiwicGFzc2VuZ2VyRGF0YSIsImJvb2tpbmdEYXRhIiwiY2FiaW5ldE91dGdvaW5nQ2xhc3MiLCJjYWJpbmV0UmV0dXJuaW5nQ2xhc3MiLCJvdXRnb2luZ1NlYXQiLCJyZXR1cm5TZWF0IiwiYWNjZXNzVG9rZW4iLCJnZXRBaXJwb3J0cyIsIm1ldGhvZCIsInVybCIsImhlYWRlcnMiLCJ4LWFjY2Vzcy10b2tlbiIsIndlYnNpdGUiLCJnZXRGbGlnaHRzIiwib3JpZ2luIiwiZGVzdGluYXRpb24iLCJnYW1lZCIsImdldE90aGVyRmxpZ2h0c0VjbyIsIm90aGVyLWhvc3RzIiwiZ2V0T3RoZXJGbGlnaHRzQnVzaSIsImdldEFpcmNyYWZ0cyIsImdldENvdW50cmllcyIsInNldE91dEdvaW5nRmxpZ2h0IiwiZmxpZ2h0Iiwic2V0UmV0dXJuaW5nRmxpZ2h0Iiwic2V0UGFzc2VuZ2VyIiwicGFzc2VuZ2VyIiwiZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MiLCJnZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MiLCJzZXRCb29raW5nIiwiYm9va2luZyIsImV4aXRJc0Vjb25vbXkiLCJyZUVudHJ5SXNFY29ub215IiwiZ2V0UGFzc2VuZ2VyIiwiZ2V0Qm9va2luZyIsImdldENob3Nlbk91dEdvaW5nRmxpZ2h0IiwiZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0IiwiZ2V0T3V0Z29pbmdTZWF0IiwiZ2V0UmV0dXJuU2VhdCIsInNldE91dGdvaW5nU2VhdCIsInNlYXQiLCJzZXRSZXRydW5TZWF0IiwiY2xlYXJMb2NhbCIsInN1Ym1pdEJvb2tpbmciLCJkYXRhIiwib3V0Z29pbmdTZWF0TnVtYmVyIiwicmV0dXJuU2VhdE51bWJlciIsImNvbnRyb2xsZXIiLCIkbG9jYXRpb24iLCJhcGkiLCJwYWdlQ2xhc3MiLCJ0aXRsZSIsImJ1dHRvblRleHROeHQiLCJidXR0b25UZXh0QmsiLCJUeXBlIiwiZ29OZXh0IiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsImVyciIsInBhdGgiLCJnb0JhY2siLCJnb1NvY2lhbCIsIiQiLCJ0eXBlSXQiLCJzdHJpbmdzIiwic3BlZWQiLCJicmVha0xpbmVzIiwibG9vcCIsIm91dGdvaW5nRmxpZ2h0IiwicmV0dXJuRmxpZ2h0IiwiZmFjaWxpdGllcyIsImRlcGFydHVyZURhdGUiLCJkZXBhcnR1cmVVVEMiLCJ0b1VUQ1N0cmluZyIsImFycml2YWxEYXRlIiwiYXJyaXZhbFVUQyIsImFpcmNyYWZ0cyIsIm91dEFpcmNyYWZ0aGFzU21va2luZyIsIm91dEFpcmNyYWZ0aGFzV2lmaSIsInJlQWlyY3JhZnRoYXNTbW9raW5nIiwicmVBaXJjcmFmdGhhc1dpZmkiLCJyZXNwb25zZSIsImkiLCJsZW5ndGgiLCJ0YWlsTnVtYmVyIiwicmVmQWlyY3JhZnRUYWlsTnVtYmVyIiwiaGFzU21va2luZyIsImhhc1dpZmkiLCJvdXRBaXJjcmFmdE1vZGVsIiwibW9kZWwiLCJyZUFpcmNyYWZ0TW9kZWwiLCJzdGF0dXNUZXh0Iiwib3V0UmVmT3JpZ2luQWlycG9ydE5hbWUiLCJvdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lIiwiYWlycG9ydHMiLCJpYXRhIiwicmVmT3JpZ2luQWlycG9ydCIsIm5hbWUiLCJyZWZEZXN0aW5hdGlvbkFpcnBvcnQiLCJyZVJlZk9yaWdpbkFpcnBvcnROYW1lIiwicmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lIiwib3V0YnVzaW5lc3NPckVjb24iLCJvdXRmYXJlIiwiZWNvbm9teUZhcmUiLCJidXNpbmVzc0ZhcmUiLCJyZWJ1c2luZXNzT3JFY29uIiwicmVmYXJlIiwib3V0ZmFjaWxpdGllc1Jlc3VsdCIsInB1c2giLCJyZWZhY2lsaXRpZXNSZXN1bHQiLCJmbGlnaHRDb250cm9sbGVyIiwiJHJvdXRlUGFyYW1zIiwiaXNDb2xsYXBzZWQiLCJpc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQiLCJzZWxlY3RlZE91dGdvaW5nRmxpZ2h0Iiwic2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQiLCJzZWxlY3RlZEJvb2tpbmciLCJyb3VuZFRyaXAiLCJyZWZQYXNzZW5nZXJJRCIsImV4aXREZXBhcnR1cmVVVEMiLCJyZUVudHJ5RGVwYXJ0dXJlVVRDIiwiaXNzdWVEYXRlIiwiaXNPbmVXYXkiLCJyZWZFeGl0RmxpZ2h0TnVtYmVyIiwicmVmUmVFbnRyeUZsaWdodE51bWJlciIsInJlY2VpcHROdW1iZXIiLCJmbGlnaHRzIiwicmV0dXJuRGF0ZU1pbGwiLCJnZXRUaW1lIiwib3V0Z29pbmdGbGlnaHRzIiwiaG91cnMiLCJNYXRoIiwiZmxvb3IiLCJkdXJhdGlvbiIsIm1pbnV0ZXMiLCJyZXR1cm5GbGlnaHRzIiwiaiIsInJlZk9yaWdpbkFpcnBvcnROYW1lIiwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSIsInJlZkFpcmNyYWZ0TW9kZWwiLCJzZWxlY3RPdXRnb2luZ0ZsaWdodCIsImlzRWNvbm9teSIsIm51bWJlciIsInNlbGVjdFJldHVybmluZ0ZsaWdodCIsImlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQiLCJjaGVja05leHRCdG5TdGF0ZSIsIiRpbmplY3QiLCJmbGlnaHROZXdDb250cm9sbGVyIiwidG9JU09TdHJpbmciLCJhaXJwb3JzQ29udGFpbnMiLCJ0eXBlIiwib3RoZXJBaXJsaW5lIiwidmFsdWUiLCJnb1RvRmxpZ2h0cyIsInNlYXJjaCIsInNlbGVjdGVkT3JpZ2luIiwic2VsZWN0ZWREZXN0IiwidG9GaXhlZCIsImNoaWxkcmVuIiwiY2hpbGRyZW5CdG5UZXh0IiwiY2hhbmdlQ2hpbGRyZW4iLCJ0ZXh0IiwiYWR1bHRzIiwiYWR1bHRCdG5UZXh0IiwiY2hhbmdlQWR1bHQiLCJpbmZhbnRzIiwiaW5mYW50QnRuVGV4dCIsImNoYW5nZUluZmFudCIsInVuZGVmaW5lZCIsImJ1dHRvblN0YXRlIiwidGl0bGVzIiwidGl0bGVzQnRuVGV4dCIsImNoYW5nZVRpdGxlIiwiY291bnRyaWVzIiwiY291bnRyeUNvZGUiLCJuYXRpb25hbGl0eSIsInNleCIsImJpcnRoRGF0ZSIsImJpcnRoUGxhY2UiLCJuYXRpb25hbElEIiwiYXV0aG9yaXR5IiwiZXhwaXJ5RGF0ZSIsInBvaW50cyIsIm1lbWJlcnNoaXAiLCJmaXJzdE5hbWUiLCJtaWRkbGVOYW1lIiwibGFzdE5hbWUiLCJwYXNzcG9ydE51bWJlciIsInBob25lTnVtYmVyIiwiZW1haWwiLCJjb21wbGV0ZSIsImVtYWlsMSIsImVtYWlsdmVyIiwiY2hlY2siLCJwcmljZSIsInllYXJzIiwieWVhcnNCdG5UZXh0IiwiY2hhbmdlWWVhciIsIm1vbnRocyIsIm1vbnRoc0J0blRleHQiLCJjaGFuZ2VNb250aCIsInNlYXRpbmdDb250cm9sbGVyIiwib3V0Z29pbmciLCJzZWF0bWFwIiwiaXNFY29ub215VGV4dCIsImFscGhhYml0cyIsInNjaGVtYSIsImFycmF5MSIsImFycmF5MiIsImFycmF5MyIsImJvYiIs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QUNBcUosa0JBQUF2RCxTQUFBLFNBQUEsWUFBQSxPQUVBdUQsa0JBQUF2RCxTQUFBLFNBQUEsWUFBQSxlQUFBLE9BSUF6SixJQUFBb0QsV0FBQSxjQUFBNEoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gICAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIHBhc3NlbmdlckRhdGEsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvYWlycG9ydHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMFwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdnYW1lZCc6ICdoYW1lZCdcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiLzBcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnZ2FtZWQnOiAnaGFtZWQnXG5cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzRWNvOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvZWNvbm9teVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215XCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzQnVzaTogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2J1c2luZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2J1c2luZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEgPSBwYXNzZW5nZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRPdXRnb2luZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0T3V0Z29pbmdDbGFzcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0UmV0dXJuaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEJvb2tpbmc6IGZ1bmN0aW9uKGJvb2tpbmcpIHtcblxuICAgICAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KVxuICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcblxuXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFBhc3NlbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzc2VuZ2VyRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9va2luZ0RhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3Nlbk91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5PdXRnb2luZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5SZXR1cm5pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0Z29pbmdTZWF0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJldHVyblNlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJldHVyblNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0cnVuU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyTG9jYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEgPSB7fVxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0ge31cbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHt9XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0ge31cbiAgICAgICAgfSxcbiAgICAgICAgc3VibWl0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvYm9va2luZycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYXNzZW5nZXI6IHBhc3NlbmdlckRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGJvb2tpbmdEYXRhLFxuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU2VhdE51bWJlcjogcmV0dXJuU2VhdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiLy8gQGFiZGVscmhtYW4tZXNzYW1cbkFwcC5jb250cm9sbGVyKCdjb25maXJtYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtY29uZmlybWF0aW9uJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDb25maXJtIHlvdXIgZmxpZ2h0XCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIkNvbmZpcm0/XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgYWxlcnQoZGF0YS5kYXRhKVxuICAgICAgICBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgfSxmdW5jdGlvbihlcnIpe1xuXG4gICAgICB9KVxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgfVxuXG4gICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUuZ29Tb2NpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3NvY2lhbCcpO1xuXG4gICAgfVxuICAgICRzY29wZS5mbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSBhcGkuZ2V0UGFzc2VuZ2VyKCk7XG4gICAgJCgnI3F1b3Rlcy10ZXh0JykudHlwZUl0KHtcbiAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgJ1wiVHJhdmVsIGFuZCBjaGFuZ2Ugb2YgcGxhY2UgaW1wYXJ0IG5ldyB2aWdvciB0byB0aGUgbWluZC5cIi1TZW5lY2EnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyB0ZW5kcyB0byBtYWduaWZ5IGFsbCBodW1hbiBlbW90aW9ucy7igJ0g4oCUIFBldGVyIEhvZWcnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyDigJMgaXQgbGVhdmVzIHlvdSBzcGVlY2hsZXNzLCB0aGVuIHR1cm5zIHlvdSBpbnRvIGEgc3Rvcnl0ZWxsZXIu4oCdIC0gSWJuIEJhdHR1dGEnLFxuICAgICAgICAnIOKAnFdlIHRyYXZlbCwgc29tZSBvZiB1cyBmb3JldmVyLCB0byBzZWVrIG90aGVyIHBsYWNlcywgb3RoZXIgbGl2ZXMsIG90aGVyIHNvdWxzLuKAnSDigJMgQW5haXMgTmluJ1xuICAgICAgXSxcbiAgICAgIHNwZWVkOiA4MCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG4gIH1cblxuLy9cbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuT3V0Z29pbmdGbGlnaHRcIik7XG4vLyAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpO1xuLy8gY29uc29sZS5sb2coXCJwYXNzZW5nZXJcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRQYXNzZW5nZXIoKSlcbi8vIGNvbnNvbGUubG9nKFwiYm9va2luZ1wiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKSlcbi8vIGNvbnNvbGUubG9nKFwiZ29pbmdTZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0T3V0Z29pbmdTZWF0KCkpXG4vLyBjb25zb2xlLmxvZyhcInJldHJ1blNlYXRcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRSZXR1cm5TZWF0KCkpXG5cblxufSk7XG4iLCIvLyBATmFiaWxhXG5BcHAuY29udHJvbGxlcignZmxpZ2h0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodCc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cblxuaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gIH1cblxuICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgfVxuICB2YXIgb3V0Z29pbmdGbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcbiAgdmFyIHJldHVybkZsaWdodCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKTtcblxuICB2YXIgYm9va2luZyA9IGFwaS5nZXRCb29raW5nKCk7XG5cbiAgdmFyIGZhY2lsaXRpZXMgPSBbXCJTbW9raW5nIGFyZWFzIGF2YWlsYWJsZVwiLCBcIldpLUZpIGF2YWlsYWJpbGl0eVwiLFxuICAgICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICAgIFwiU2NyZWVucyB0byBzaG93IHlvdXIgZmxpZ2h0IHBhdHRlcm4sIGFpcmNyYWZ0IGFsdGl0dWRlIGFuZCBzcGVlZFwiXG4gIF07XG5cbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgICAgIHJldHVybkZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICAgIHJldHVybkZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICB2YXIgYWlyY3JhZnRzID0gW107XG4gIHZhciBvdXRBaXJjcmFmdGhhc1Ntb2tpbmcgPSBmYWxzZTtcbiAgdmFyIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGZhbHNlO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBmYWxzZTtcbiAgdmFyIHJlQWlyY3JhZnRoYXNXaWZpID1mYWxzZTtcbiAgYXBpLmdldEFpcmNyYWZ0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gb3V0Z29pbmdGbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgICAgIG91dEFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICAgICAgICBvdXRBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgICAgICAgJHNjb3BlLm91dEFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICByZUFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICAgICAgICAgICAgcmVBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuXG4gICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gIHZhciBhaXJwb3J0cyA9IFtdO1xuICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICBhaXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcbiAgdmFyIG91dGJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgdmFyIG91dGZhcmUgPSAwO1xuXG4gIGlmIChib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuZWNvbm9teUZhcmU7XG4gIH0gZWxzZSB7XG4gICAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgdmFyIHJlYnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICAgICAgdmFyIHJlZmFyZSA9IDA7XG4gICAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5lY29ub215RmFyZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICAgICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgICAgfVxuICB9XG4gIHZhciBvdXRmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gIGlmIChvdXRBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbiAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICB2YXIgcmVmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gICAgICBpZiAocmVBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gICAgICBpZiAocmVBaXJjcmFmdGhhc1dpZmkpXG4gICAgICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG4gICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgICAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgICAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgICAgfVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG5cbiAgICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgICAkc2NvcGUucmVmYXJlID0gcmVmYXJlO1xuICAgICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgICB9XG4gICAgJHNjb3BlLm91dGdvaW5nRmxpZ2h0ID0gb3V0Z29pbmdGbGlnaHQ7XG4gICAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAgICRzY29wZS5vdXRmYWNpbGl0aWVzUmVzdWx0ID0gb3V0ZmFjaWxpdGllc1Jlc3VsdDtcbn1cblxuXG4gICAgLy8gJHNjb3BlLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPXJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gICAgLy8gJHNjb3BlLnJlZk9yaWdpbkFpcnBvcnROYW1lPXJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgIC8vICRzY29wZS5haXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdGhhc1Ntb2tpbmc7XG4gICAgLy8gJHNjb3BlLmFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0aGFzV2lmaTtcbiAgICAvLyAkc2NvcGUuYWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0TW9kZWw7XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwkcm91dGVQYXJhbXMsYXBpKSB7XG5cbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAgICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cblxuICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cblxuICAgICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgICAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgICAgICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcblxuXG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHVzZXIgaGFzIHNlbGVjdGVkIGEgZmxpZ2h0XG4gICAgICAgICAgICAvLyBhbmQgdGhlbiBjYWxsIGFwaS5zZXRGbGlnaHQoY2hvc2VuRmxpZ2h0KVxuICAgICAgICAgICAgLy9pZiB0aGUgdXNlciBoYXNuJ3Qgc2VsZWN0ZWQgYSBmbGlnaHQgcmV0dXJuIHByZXZlbnQgaGltIGZyb20gcHJvY2VlZGluZ1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICAgICAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcbiAgICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgICAgICAgIFwicmVmUGFzc2VuZ2VySURcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZXhpdERlcGFydHVyZVVUQ1wiOiBudWxsLFxuICAgICAgICAgICAgXCJyZUVudHJ5RGVwYXJ0dXJlVVRDXCI6IG51bGwsXG4gICAgICAgICAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICAgICAgICAgIFwicmVmRXhpdEZsaWdodE51bWJlclwiOiBudWxsLFxuICAgICAgICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0TnVtYmVyXCI6IG51bGwsXG4gICAgICAgICAgICBcInJlY2VpcHROdW1iZXJcIjogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHZhciBvcmlnaW4gPSBcIlRYTFwiO1xuICAgICAgICAvLyB2YXIgZGVzdGluYXRpb24gPSBcIkpGS1wiO1xuICAgICAgICAvLyB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgxNDU5NTU1MjAwICogMTAwMCk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4gfHwgIWRlc3RpbmF0aW9uIHx8ICFleGl0RGF0ZSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmbGlnaHRzO1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG4gICAgICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGV4aXREYXRlLnRvSVNPU3RyaW5nKCkpXG4gICAgICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgIGZsaWdodHMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuICAgICAgICAgICAgLy8gZm9ybWF0dGluZyBkYXRhIHRvIGJlIHByZXNlbnRhYmxlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIHZhciBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5hcnJpdmFsVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgICAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0aHJvd2luZyBhd2F5IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzIG5vdCBmaXR0aW5nIGNvbnN0cmFpbnRzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBjaGVja0NvbnN0cmFpbnRzKGZsaWdodCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICB2YXIgZmxpZ2h0RGF0ZSA9IG5ldyBEYXRlKGZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQgPT09IG9yaWdpbiAmJiBmbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0ID09PSBkZXN0aW5hdGlvbiAmJiBmbGlnaHREYXRlLmdldERheSgpID09PSBleGl0RGF0ZS5nZXREYXkoKSAmJiBmbGlnaHREYXRlLmdldE1vbnRoKCkgPT09IGV4aXREYXRlLmdldE1vbnRoKCkgJiYgZmxpZ2h0RGF0ZS5nZXRGdWxsWWVhcigpID09PSBleGl0RGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy8gJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzLmZpbHRlcihjaGVja0NvbnN0cmFpbnRzKTtcbiAgICAgICAgICAgIGlmKCRzY29wZS5yb3VuZFRyaXAgKVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDKTtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmFycml2YWxVVEMpO1xuICAgICAgICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuICAgICAgICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZigkc2NvcGUucm91bmRUcmlwKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZigkc2NvcGUucm91bmRUcmlwKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXREZXBhcnR1cmVVVEMgPSBmbGlnaHQuZGVwYXJ0dXJlVVRDO1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5leGl0SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHROdW1iZXIgPSBmbGlnaHQubnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcblxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5RGVwYXJ0dXJlVVRDID0gZmxpZ2h0LmRlcGFydHVyZVVUQztcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgICAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0TnVtYmVyID0gZmxpZ2h0Lm51bWJlcjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG5cbiAgICAgIH1cblxuICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnJvdW5kVHJpcClcblxuXG5cbn1cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCckcm91dGVQYXJhbXMnLCAnYXBpJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNDdHJsJywgZmxpZ2h0Q29udHJvbGxlcik7XG4iLCJcbnZhciBmbGlnaHROZXdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sJHJvdXRlUGFyYW1zLGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG5cblxuXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcblxuICAgIH1cblxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHVzZXIgaGFzIHNlbGVjdGVkIGEgZmxpZ2h0XG4gICAgICAgIC8vIGFuZCB0aGVuIGNhbGwgYXBpLnNldEZsaWdodChjaG9zZW5GbGlnaHQpXG4gICAgICAgIC8vaWYgdGhlIHVzZXIgaGFzbid0IHNlbGVjdGVkIGEgZmxpZ2h0IHJldHVybiBwcmV2ZW50IGhpbSBmcm9tIHByb2NlZWRpbmdcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuICAgIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgZmxpZ2h0cztcbiAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG4gICAgaWYgKHJldHVybkRhdGUpXG4gICAgICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc29sZS5sb2coZXhpdERhdGUudG9JU09TdHJpbmcoKSlcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KVxufVxuXG5cbmlmKFR5cGUgPT0gJ21vYmlsZScpe1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgZmxpZ2h0TmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywgJ2FwaSddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzTmV3Q3RybCcsIGZsaWdodE5ld0NvbnRyb2xsZXIpO1xuIiwiQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1tYWluJztcblxuXG5cbiAgICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG5cbiAgICAgICQoJyNtYWluLXRleHQnKS50eXBlSXQoe1xuICAgICAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgICAgICAgXCJTaW1wbGUsIGNvbnZlbmllbnQsIGluc3RhbnQgY29uZmlybWF0aW9uLlwiLCBcIkRlc3RpbmF0aW9ucyBhbGwgYXJvdW5kIHRoZSBnbG9iZS5cIiwgXCJFeHBlcmllbmNlIGF1dGhlbnRpYyBob3NwaXRhbGl0eS5cIiwgXCJUaW1lIHRvIGdldCBlbmNoYW50ZWQuXCJcbiAgICAgICAgICBdLFxuICAgICAgICAgIHNwZWVkOiAxMjAsXG4gICAgICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICAgICAgbG9vcDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICAkc2NvcGUuZmxpZ2h0ID0ge1xuICAgICAgICAgIHR5cGU6IFwib25lXCJcbiAgICAgIH1cbiAgICAgICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgICB2YWx1ZTpmYWxzZVxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5vdGhlckFpcmxpbmUudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJykuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KS5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgICAgICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgICAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICB9O1xuICAgICAgJGxvY2F0aW9uLnVybCgkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgIHNldFVwRGF0ZSgkc2NvcGUpO1xuXG4gICAgICAkc2NvcGUuY2hpbGRyZW4gPSBbJzAgY2hpbGRyZW4nLCAnMSBjaGlsZCcsICcyIGNoaWxkcmVuJywgJzMgY2hpbGRyZW4nLCAnNCBjaGlsZHJlbiddO1xuICAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9ICRzY29wZS5jaGlsZHJlblswXTtcbiAgICAgICRzY29wZS5jaGFuZ2VDaGlsZHJlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gdGV4dDtcbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5hZHVsdHMgPSBbJzEgYWR1bHQnLCAnMiBhZHVsdHMnLCAnMyBhZHVsdHMnLCAnNCBhZHVsdHMnXTtcbiAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUFkdWx0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSB0ZXh0O1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCBpbmZhbnRzJywgJzEgaW5mYW50J107XG4gICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9ICRzY29wZS5pbmZhbnRzWzBdO1xuICAgICAgJHNjb3BlLmNoYW5nZUluZmFudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gPSB1bmRlZmluZWQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWREZXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgICBmdW5jdGlvbiBhaXJwb3JzQ29udGFpbnMoaWF0YSkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChpYXRhID09ICRzY29wZS5haXJwb3J0c1tpXVsnaWF0YSddKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmJ1dHRvblN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICEkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgISRzY29wZS5zZWxlY3RlZERlc3QgfHwgISRzY29wZS5leGl0RGF0ZSB8fCAkc2NvcGUuc2VsZWN0ZWREZXN0ID09ICRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZE9yaWdpbikgfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWREZXN0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcblxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBzZXRVcERhdGUoJHNjb3BlKSB7XG4gICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgICB9O1xuICAgICRzY29wZS50b2RheSgpO1xuXG4gICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgICB9O1xuICAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5wb3B1cC5vcGVuZWQgPSB0cnVlO1xuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIGRpc2FibGVkKGRhdGEpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBkYXRhLmRhdGUsXG4gICAgICAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICAgfVxuICAgICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoMjAyMCwgNSwgMjIpLFxuICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICBzdGFydGluZ0RheTogMVxuICAgIH07XG4gICAgJHNjb3BlLnBvcHVwMiA9IHtcbiAgICAgICAgb3BlbmVkOiBmYWxzZVxuICAgIH07XG4gICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICAgICBvcGVuZWQ6IGZhbHNlXG4gICAgfTtcbn1cbiIsIi8vIEB5YXNzbWluZVxuQXBwLmNvbnRyb2xsZXIoJ3Bhc3NlbmdlckRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUudGl0bGUgPSBcIkZpbGwgaW4geW91ciBkZXRhaWxzXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5pZihUeXBlID09ICdkZXNrdG9wJyl7XG4gIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgJHNjb3BlLnRpdGxlcyA9IFsnTXInLCAnTXJzJywgJ01zJywgJ0RyJ107XG4gICRzY29wZS50aXRsZXNCdG5UZXh0ID0gJHNjb3BlLnRpdGxlc1swXTtcbiAgJHNjb3BlLmNoYW5nZVRpdGxlID0gZnVuY3Rpb24odGV4dCkge1xuICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgfVxuXG4gIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLmNvdW50cmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG5cblxuXG5cbiAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY291bnRyeUNvZGU6IG51bGwsXG4gICAgICAgIG5hdGlvbmFsaXR5Om51bGwsXG4gICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgIGZpcnN0TmFtZSA6bnVsbCxcbiAgICAgICAgbWlkZGxlTmFtZTogbnVsbCxcbiAgICAgICAgbGFzdE5hbWU6bnVsbCxcbiAgICAgICAgcGFzc3BvcnROdW1iZXI6IG51bGwsXG4gICAgICAgIHBob25lTnVtYmVyOm51bGwsXG4gICAgICAgIGVtYWlsOiBudWxsXG5cbiAgICAgICB9O1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIE5vdyB5b3UgaGF2ZSAkc2NvcGUubmF0aW9uYWxpdHkgYW5kICRzY29wZS50aXRsZXNCdG5UZXh0IHlvdSBjYW4gdXNlIHRoZW0gaW4geW91ciBvYmplY3RcbiAgdmFyIGNvbXBsZXRlID0gZmFsc2U7XG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuICAvKmlmKCFhcGkuZ2V0Q2hvc2VuRmxpZ2h0KCkpXG4gIHtcbiAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gIGFsZXJ0KFwiWW91IGhhdmUgdG8gY2hvb3NlIGEgZmxpZ2h0XCIpO1xuICB9Ki9cbiAgLy9UaGUgcmV2ZXJ0aW5nIHRvIHRoZSBmbGlnaHRzIHBhZ2VcblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICB0eXBlOiBudWxsLFxuICAgICAgY291bnRyeUNvZGU6IG51bGwsIC8vYWNjb3JkaW5nIHRvIGNvdW50cnlcbiAgICAgIG5hdGlvbmFsaXR5OiRzY29wZS5uYXRpb25hbGl0eSxcbiAgICAgIHNleDogbnVsbCxcbiAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgIHBvaW50czogbnVsbCxcbiAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICB0aXRsZTogJHNjb3BlLnRpdGxlc0J0blRleHQsXG4gICAgICBmaXJzdE5hbWUgOiAkc2NvcGUuZmlyc3ROYW1lLFxuICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWUsXG4gICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlcixcbiAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXIsXG4gICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMVxuXG5cbiAgICAgICB9O1xuICAgIC8vL2JlZm9yZSB5b3UgbGVhdmUgdGhlIHBhZ2UgbWFrZSBzdXJlIHRoYXQgdGhlIHBhc3NlbmdlciBvYmplY3QgaXMgY29tcGxldGUgb3RoZXJ3aXNlIHNob3cgYWxlcnQoXCJGaWxsIGluIGFsbCBkYXRhXCIpO1xuXG5cblxuICBpZihjb21wbGV0ZSA9PSBmYWxzZSl7XG4gICAgICAgIGlmKCgkc2NvcGUuZmlyc3ROYW1lID09bnVsbCl8fCgkc2NvcGUubWlkZGxlTmFtZSA9PW51bGwpfHwoJHNjb3BlLmxhc3ROYW1lID09bnVsbCl8fCgkc2NvcGUucGhvbmVOdW1iZXIgPT1udWxsKXx8KCRzY29wZS5wYXNzcG9ydE51bWJlciA9PW51bGwpKVxuICAgICAgICB7XG4gICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhXCIpO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBpZigkc2NvcGUuZW1haWwxIT0kc2NvcGUuZW1haWx2ZXIpXG4gICAgICAgICAgYWxlcnQoXCJUaGUgcmVwZWF0ZWQgZW1haWwgZG9lc250IG1hdGNoIHRoZSBmaXJzdCBlbWFpbFwiKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKCgkc2NvcGUuY2hlY2s9PW51bGwpKVxuICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgY2hlY2sgdGhlIGJveFwiKTtcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgIH1cbiAgICAgIGlmKGNvbXBsZXRlPT10cnVlKXtcbiAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcbiAgICB9XG59XG5cblxufSk7XG4iLCIvLyBAbWlybmFcbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSkge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXBheW1lbnQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSB5b3VyIHBheW1lbnQgb3B0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlBheSFcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKTtcbiAgfVxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nJyk7XG4gIH1cblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG5cbiAgICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICBpZihhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgIGVsc2VcbiAgICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICBpZihhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpe1xuXG4gICAgICAgICAgaWYoYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG5cbiAgICAgICAgfVxuXG5cbiAgICAgICRzY29wZS5wcmljZSA9IHByaWNlO1xuICAgICAgJHNjb3BlLnllYXJzID0gWycyMDE2JywnMjAxNycsJzIwMTgnLCcyMDE5JywnMjAyMCcsJzIwMjEnLCcyMDIyJywnMjAyMycsJzIwMjQnXTtcbiAgICAgICRzY29wZS55ZWFyc0J0blRleHQgPSAkc2NvcGUueWVhcnNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9IHRleHQ7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCdGZWJ1cmFyeScsJ01hcmNoJywnQXByaWwnLCdNYXknLCdKdW5lJywnSnVseScsJ0F1Z3VzdCcsJ1NlcHRlbWJlcicsJ09jdG9iZXInLCdOb3ZlbWJlcicsJ0RlY2VtYmVyJ107XG4gICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9ICRzY29wZS5tb250aHNbMF07XG4gICAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gdGV4dDtcbiAgICAgIH0gICAgXG4gIH1cblxufSk7XG4iLCIvLyBAYWhtZWQtZXNzbWF0XG4gIHZhciBzZWF0aW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyxhcGkpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2Utc2VhdGluZyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBzaXQ/XCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL3JldHVyaW5nJyk7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRSZXRydW5TZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICB9XG5cblxuXG4gICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXRtYXA7XG5cbiAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG5cbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9XG5cblxuXG4gICAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgICB2YXIgc2NoZW1hID0gWzMsIDUsIDMsIDIwXTtcblxuICAgICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnNlYXJjaENvbG9yID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGlmICghJHNjb3BlLmlzRW1wdHkodGV4dCkpXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdE9jdSc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRFbXB0eSc7XG4gICAgICB9XG4gICAgICAkc2NvcGUuaXNFbXB0eSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXRtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXRtYXBbaV1bJ251bWJlciddID09IHRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWF0bWFwW2ldWydpc0VtcHR5J11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3RTZWF0ID0gZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICRzY29wZS5zZWF0ID0gc2VhdDtcbiAgICAgIH07XG4gICAgfVxuXG5cbn07XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsJyRyb3V0ZVBhcmFtcycsICdhcGknXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignc2VhdGluZ0N0cmwnLCBzZWF0aW5nQ29udHJvbGxlcik7XG4iXX0=
