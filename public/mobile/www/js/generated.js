App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, passengerData, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat;
    var type;
    return {
        setType: function(typeStr) {
            type = typeStr;
            console.log(type)
        },
        getType: function() {
            return type;
        },
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
    // $scope.refDestinationAirportName =refDestinationAirportName;
    // $scope.refOriginAirportName=refOriginAirportName;
    // $scope.aircrafthasSmoking = aircrafthasSmoking;
    // $scope.aircrafthasWifi = aircrafthasWifi;
    // $scope.aircraftModel = aircraftModel;
});

// @abdelrahman-maged

var flightController = function($scope, $location,api,$routeParams) {

      $scope.pageClass = 'page-flights';
      $scope.title = "Choose a Flight";
      $scope.buttonTextNxt = "Next";
      $scope.buttonTextBk = "Back";



      if(api.getType() == 'desktop'){
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

  flightController.$inject = ['$scope', '$location', 'api'];

App.controller('flightsCtrl', flightController);

// App.controller('flightsCtrl', function($scope, $location, $routeParams, api) {
//
//
//
// });

App.controller('flightsNewCtrl', function($scope, $location, $routeParams, api) {

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
})

App.controller('mainCtrl', function($scope, $location, api) {
    $scope.pageClass = 'page-main';
    if(api.getType() == 'desktop'){

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
    //yasmine you're not expecting any parameters. You're only creating a form and you will have
    // the resulting object ready to be sent to the server



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

// console.log("Retrun "+api.getReturnSeat());
// console.log("Outgoing "+api.getOutgoingSeat());
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
  //mirna nty gaya thazary l sprint deh bs khoshy ma3a Ahmed fel seatings bta3to
});

// @ahmed-essmat
App.controller('seatingCtrl', function($scope, $location, $routeParams, api) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
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

});
