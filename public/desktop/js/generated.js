App.config(function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat, refNum;
    var isOtherHosts; // set to false in flightsctrl ,set to true flightsNewCtrl
    var stripeToken;
    var passengerData = [];
    return {
        getStripeKey: function(url) {
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'x-access-token': accessToken,
                    'Content-Type':undefined
                  }
            });
        },
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
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0/1",
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
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy/1",
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
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://localhost:8080/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business/1",
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
        submitBooking: function(otherHosts,url) {
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
                    url: 'http://localhost:8080/booking',
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
                    url: url + '/booking',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': accessToken
                    },
                    data: $.param(bookingData)
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

  App.config(function($translateProvider) {
    $translateProvider.translations('en', {
      MAIN: {
        BOOK_NOW: 'Book Now',
        FROM: 'From',
        FLYING_FROM: 'Flying from',
        DEPARTURE_DATE: 'Departure Date',
        TO: 'To',
        FLYING_TO: 'Flying to',
        REENTRY_DATE: 'Re-entry Date',
        UNDER_2_YEARS: 'Under 2 years',
        ROUND_TRIP: 'Round Trip',
        ONE_WAY: 'One Way',
        OTHER_AIRLINES: 'Search other airlines',
        SEARCH_FOR_FLIGHTS: 'Search for flights',
        YEARS: "years",
        CHILDREN: 'children',
        CHILD: 'child',
        ADULT: 'adult',
        ADULTS: 'adults',
        INFANTS: 'infants',
        INFANT: 'infant',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        QUOTES_HOME: {
          ONE: "Simple, convenient, instant confirmation.",
          TWO: "Destinations all around the globe.",
          THREE: "Experience authentic hospitality.",
          FOUR: "Time to get enchanted."
        }
      },
      FLIGHTS: {
        TITLE: 'Choose a Flight',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        SEATS_LEFT: 'seats left',
        MORE_DETAILS: 'More details',
        BOOK: 'Book',
        SELECT:'Select',
        FLIGHT: 'Flight',
        OPERATED_BY: 'Operated by'
      },
      FLIGHT: {
        FLIGHT: "Flight",
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        TITLE: 'Flight Details',
        OPERATED_BY: 'Operated by',
        NUMBER_OF_PASSENGERS: 'Number of passengers',
        FLYING_CALSS: 'Flying class',
        FLIGHT_FARE: 'Flight fare',
        FLIGHT_FAC: 'Flight facilities',
        PASSENGER: 'passenger',
        PASSENGERS: 'passengers'
      },
      NAV: {
        GO_HOME:'Go Home',
        SUBMIT: 'Submit',
        NEXT: 'Next',
        BACK: 'Back',
        SPECIAL_OFFERS: 'Special Offers',
        SERVICES: 'Services',
        OUR_TEAM: 'Our Team',
        ABOUT: 'About',
        CONTACT_US: 'Contact Us',
        CHOOSE_LANGUAGE:'Choose language',
        ENGLISH: 'English',
        GERMAN:'German'
      },

      CONFIRMATION: {
        THANK_YOU: 'Thank you',
        NAME: 'Name',
        PHONE: 'Phone',
        MAIL: 'E-mail',
        FLIGHTNO: 'Flight number',
        DEPARTURE: 'Departure',
        ARRAIVAL: 'Arrival',
        PRINT: 'Print ticket'
      },
      CONTACT_US: {

        CONTACT_US: 'Contact Us',
        PHONE: 'Phone',
        MAIL: 'E-mail',
        LEAVE_MSG: 'Leave us a message',
        SEND: 'Send'
      },
      four_o_for: {
        //Do you mean 404notfound team ?  in 404.html
        QUESTION: 'Do you mean 404NotFound Team?'

      },

      ABOUT_US: {

        ABOUT: 'About AirBerlin',
        HISTORY: 'History',
        HISTORY_PARA: 'The first airberlin plane took off on 28th April 1979. Experience the highlights and milestones in airberlins history ',
        OUR_GOAL: 'Our goal',
        OUR_GOAL_PARA: 'First Europe, and then the globe, will be linked by flight, and nations so knit together that they will grow to be next-door neighbors… . What railways have done for nations, airways will do for the world.',
        A_P: 'Alliance/partners',
        A_P_PARA: 'airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.'
      },

      OFFERS: {
        SPECIAL_OFFERS: 'Special Offers',
        FLIGHT_OFFERS: 'Flight Offers',
        FLIGHT_OFFERS_PARA: 'Find the most attractive fare for your flight',
        LIKE_FACEBOOK: 'Like us on Facebook',
        LIKE_FACEBOOK_PARA: 'Dont miss our special offers on: with our newsletter and on Facebook',
        HOTEL: 'Hotel',
        HOTEL_PARA: 'Special offers for your hotel stay away from our partners .'
      },


      PASS_DETAILS: {
        FIRST_NAME: 'First Name',
        MIDDLE_NAME: 'Middle Name',
        LAST_NAME: 'Last Name',
        PASS_NO: 'Passport Number',
        PLACE_OFBIRTH: 'Place Of Birth',
        PHONE_NO: 'Phone Number',
        E_MAIL: 'Email',
        REPEAT_E_MAIL: 'Repeat Email',
        VERIFY_PARA: 'I verify the information provided matches the passport information.'

      },
      PAYMENT: {

        WE_ACCEPT: 'We accept',
        CARD_INFO: 'Card information:',
        EXP_DATE: 'Expire Date:',
        COST: 'Your booking total cost'

      },

      SEATING: {

        SEAT_MAP: 'Seatmap',
        SELECTED: 'You selected seat'

      },

      SERVICES: {

        SERVICE: 'Services',
        INFLIGHT_SERVICES: 'Inflight Services',
        INFLIGHT_PARA: '  Airberlin presents the economy and business class.',
        G_MEALS: 'Gourmet Meals',
        G_MEALS_PARA: 'Airberlin is the right airline for connoisseurs: treat yourself to one of the delicious gourmet meals from "Sansibar" on board',
        BAGGAGE: 'Baggage',
        BAGGAGE_PARA: 'Everything you need to know about free baggage allowances, cabin baggage regulations and special baggage.'

      },

    });
    $translateProvider.translations('de', {
      MAIN: {
        BOOK_NOW: 'Jetzt buchen',
        FROM: 'von',
        FLYING_FROM: 'Abflughafen',
        DEPARTURE_DATE: 'Hinflug',
        TO: 'nach',
        FLYING_TO: 'Zielflughafen',
        REENTRY_DATE: 'Rückflug',
        UNDER_2_YEARS: 'Jünger als 2 Jahren',
        ROUND_TRIP: 'Hin-/Rückfahrt',
        ONE_WAY: 'Nur Hinflug',
        OTHER_AIRLINES: 'Andere Fluggesellschaften',
        SEARCH_FOR_FLIGHTS: 'Flüge suchen',
        YEARS: "Jahre",
        CHILDREN: 'Kinder',
        CHILD: 'Kind',
        ADULT: 'Erwachsener',
        ADULTS: 'Erwachsenen',
        INFANTS: 'Babys',
        INFANT: 'Baby',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        QUOTES_HOME: {
          ONE: "Einfach, bequem, sofortige Bestätigung.",
          TWO: "Zielen auf der Welt.",
          THREE: "Authentische Gastfreundschaft erleben.",
          FOUR: "Verwunschene Zeit mit uns."
        }
      },
      FLIGHTS: {
        TITLE: 'Einen Flug aussuchen',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        SEATS_LEFT: 'freie Sitzplätze',
        MORE_DETAILS: 'Mehr Details',
        BOOK: 'buchen',
        SELECT:'Wählen',
        FLIGHT: 'Flug',
        OPERATED_BY: 'betrieben von'
      },
      FLIGHT: {
        FLIGHT: "Flug",
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        TITLE: 'Details des Flugs',
        OPERATED_BY: 'betrieben von',
        NUMBER_OF_PASSENGERS: 'Anzahl der Passagiere',
        FLYING_CALSS: 'Beförderungsklassen',
        FLIGHT_FARE: 'Flugpreis',
        FLIGHT_FAC: 'Dienstleistungen des Flugs',
        PASSENGER: 'Passagier',
        PASSENGERS: 'Passagiere'
      },
      NAV: {
        GO_HOME:'heimgehen',
        SUBMIT: 'einreichen',
        NEXT: 'weiter',
        BACK: 'zurück',
        SPECIAL_OFFERS: 'Spezielle Angebote',
        SERVICES: 'Dienstleistungen',
        OUR_TEAM: 'Unser Team',
        ABOUT: 'Über uns',
        CONTACT_US: 'Unser Kontakt',
        CHOOSE_LANGUAGE:'Wähle eine Sprache',
        ENGLISH: 'Englisch',
        GERMAN:'Deutsch'
      },
      CONFIRMATION: {

        THANK_YOU: 'Danke schön',
        NAME: 'Name',
        PHONE: 'Telefon',
        MAIL: 'E-mail adresse',
        FLIGHTNO: 'Flug Nummer',
        DEPARTURE: 'Abfahrt',
        ARRAIVAL: 'Ankunft',
        PRINT: 'Flugkarte abdrucken'
      },
      CONTACT_US: {

        CONTACT_US: 'Unser Kontakt',
        PHONE: 'Telefon',
        MAIL: 'E-mail adresse',
        LEAVE_MSG: 'Ihr Anliegen',
        SEND: 'abschicken'
      },
      four_o_for: {
        //Do you mean 404notfound team ?  in 404.html
        QUESTION: 'Meinten Sie die Gruppe von 404NotFound ?'

      },
      ABOUT_US: {

        ABOUT: 'Über AirBerlin',
        HISTORY: 'Geschichte',
        HISTORY_PARA: 'Am 28. April 1979 startet eine Boeing 707 von Berlin-Tegel nach Palma de Mallorca. Der Erstflug ist der Anfang der Erfolgsgeschichte von airberlin. ',
        OUR_GOAL: 'Unser Ziel',
        OUR_GOAL_PARA: 'Zuert Europa, zunächst die ganze Welt, werden durch den Flug zusammen verbunden, und Nationen eng zusammen damit sie Nachbarn aufwachsen… . Was die Eisbahnen für die Nationen getan hat, wird die Flüge für das ganze Welt tun.',
        A_P: 'Alliance/partners',
        A_P_PARA: 'airberlin erweitert ihr internationales Streckennetz, indem sie mit mehreren Airlines als Codeshare-Partnern kooperiert.'


      },
      OFFERS: {
        SPECIAL_OFFERS: 'Spezielle Angebote',
        FLIGHT_OFFERS: 'Flugangebote',
        FLIGHT_OFFERS_PARA: 'Finden Sie die attraktivsten Tarife für Ihren Flug',
        LIKE_FACEBOOK: 'Folgen Sie uns auf Facebook',
        LIKE_FACEBOOK_PARA: 'Vermissen Sie nicht unsere spezielle Angebote: mit unser newsletter und auf Facebook',
        HOTEL: 'Hotel',
        HOTEL_PARA: 'Sonderangebote für Ihr Hotel weg von unsere Partnern .'

      },

      PASS_DETAILS: {

        FIRST_NAME: 'Vorname',
        MIDDLE_NAME: 'Zweitname',
        LAST_NAME: 'Nachname',
        PASS_NO: 'Reisepass Nummer',
        PLACE_OFBIRTH: 'Ort des Geburts',
        PHONE_NO: 'Telefon Nummer',
        E_MAIL: 'E-mail adresse',
        REPEAT_E_MAIL: 'E-mail wiederholen',
        VERIFY_PARA: 'Hiermit, bestätige ich, dass die Informationen, die vorhin gegeben sind, meine Passdaten entsprichen.'

      },
      PAYMENT: {

        WE_ACCEPT: 'Zahlungsmethoden',
        CARD_INFO: 'Kreditkarte informationen:',
        EXP_DATE: 'Ablaufdatum Ihrer Karte:',
        COST: 'Gesamtpreis'

      },
      SEATING: {

        SEAT_MAP: 'Sitzplatzreservierung',
        SELECTED: 'Sie haben einen Sitzplatz reserviert.'

      },
      SERVICES: {

        SERVICE: 'Services',
        INFLIGHT_SERVICES: 'Services an board',
        INFLIGHT_PARA: '  Airberlin heißen Sie herzlich willkommen an Bord: economy und business class.',
        G_MEALS: 'Gourmetessen',
        G_MEALS_PARA: 'Freuen Sie sich auf Airberlins a la carte-Speise : Wir servieren Ihnen unsere warmen On-Top-Speisen, die extra vom Sansibar-Wirt Herbert Seckler kreiert wurden.',
        BAGGAGE: 'Reisegepäck',
        BAGGAGE_PARA: 'Unsere Reglungen über Aufzugebendes Gepäckmengen, über Handgepäck und Sondergepäck.'

      },

    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.useSanitizeValueStrategy('escape');

  });

// @abdelrhman-essam
var confirmationController = function($scope, $location,api, $routeParams) {
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
  $scope.flight = api.getChosenOutGoingFlight();

  $scope.passenger = api.getPassenger()[0];

  $scope.booking = $routeParams.booking;
  $scope.notOtherHosts = !api.IsOtherHosts();

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


}
if (Type == 'mobile') {
  confirmationController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
  confirmationController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}

App.controller('confirmationCtrl', confirmationController);

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
var flightController = function($scope, $location, api, $routeParams) {

  $scope.pageClass = 'page-flights';
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";

  api.setIsOtherHosts(false);

  var origin = $routeParams.origin;
  var destination = $routeParams.destination;
  var exitDate = new Date($routeParams.exitDate * 1000);

  $scope.origin = origin;
  $scope.destination = destination;
  $scope.exitDate = exitDate;

  $scope.roundTrip = false;

  if ($routeParams.returnDate) {
    var returnDate = new Date($routeParams.returnDate * 1000);
    $scope.returnDate = returnDate;
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

  var flights;
  var returnDateMill;

  if (returnDate)
    returnDateMill = returnDate.getTime();

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

  $scope.constructDate = function(date) {
    var dateOut = new Date(date);
    return new Date(dateOut.getUTCFullYear(), dateOut.getUTCMonth(), dateOut.getUTCDate(),  dateOut.getUTCHours(), dateOut.getUTCMinutes(), dateOut.getUTCSeconds());
  };

  $scope.goNext = function() {

    api.setOutGoingFlight($scope.selectedOutgoingFlight);
    api.setReturningFlight($scope.selectedReturningFlight);

    $scope.selectedBooking.refExitFlightID = $scope.selectedOutgoingFlight._id;

    if ($scope.selectedReturningFlight)
      $scope.selectedBooking.refReEntryFlightID = $scope.selectedReturningFlight._id;

    api.setBooking($scope.selectedBooking);

    if (Type == "desktop")
      $location.path('/exit-flight');
    else
      $location.go('tab.flight-details');

  }

  $scope.goBack = function() {
    $location.path('/');
  }

  if (!origin || !destination || !exitDate) {
    $location.path('/');
  }

  $scope.checkNextBtnState = function() {
    if ($scope.roundTrip)
      return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
    else
      return $scope.isOutgoingFlightSelected;
  }

  if (Type == 'desktop') {

    $scope.isCollapsed = true;
    $scope.isOutgoingFlightSelected = false;

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

  } else {

    api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
    }, function myError(response) {
      console.log(response.statusText);
    });

    $scope.miniLogoPath = function(operatorAirline) {
      if (operatorAirline === "Air Berlin")
        return "img/air-berlin-mini-logo.png"
      return "img/other-airline-mini-logo.png"
    };

  }

}

if (Type == 'mobile') {
  flightController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
  flightController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}

App.controller('flightsCtrl', flightController);

var flightNewController = function($scope, $location, api, $routeParams) {
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

    var isEconomy = $routeParams.flightClass == "Economy";
    console.log(isEconomy)
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
        $scope.selectedBooking.outgoingFlightId = flight.flightId;
        $scope.selectedBooking.outgoingUrl = flight.url;
        $scope.selectedBooking.outgoingCost = flight.cost;

    }

    $scope.selectReturningFlight = function(flight) {
        $scope.isReturningFlightSelected = true;
        $scope.selectedReturningFlight = flight;
        $scope.selectedBooking.returnFlightId = flight.flightId;
        $scope.selectedBooking.returnUrl = flight.url;
        $scope.selectedBooking.returnCost = flight.cost;

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
    flightNewController.$inject = ['$scope', '$location', 'api', '$routeParams', ];
}


App.controller('flightsNewCtrl', flightNewController);

 var mainController = function($scope, $location, api,$translate) {
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
           .search('exitDate', exitDate)
           .search('flightClass',$scope.classeBtnText);

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
           .search('returnDate', returnDate)
           .search('flightClass',$scope.classeBtnText);
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
       strings: [$translate.instant('MAIN.QUOTES_HOME.ONE'),$translate.instant('MAIN.QUOTES_HOME.TWO'),$translate.instant('MAIN.QUOTES_HOME.THREE'),$translate.instant('MAIN.QUOTES_HOME.FOUR')],
       speed: 120,
       breakLines: false,
       loop: true
     });


     $location.url($location.path());
     setUpDate($scope);

     $scope.children = ['0 ' + $translate.instant('MAIN.CHILDREN'), '1 ' + $translate.instant('MAIN.CHILD'), '2 ' + $translate.instant('MAIN.CHILDREN'), '3 ' + $translate.instant('MAIN.CHILDREN'), '4 ' + $translate.instant('MAIN.CHILDREN')];
     $scope.childrenBtnText = $scope.children[0];
     $scope.changeChildren = function(text) {
       $scope.childrenBtnText = text;
     }



     $scope.adults = ['1 '+$translate.instant('MAIN.ADULT') , '2 '+$translate.instant('MAIN.ADULTS'), '3 ' + $translate.instant('MAIN.ADULTS'), '4 '+$translate.instant('MAIN.ADULTs')];
     $scope.adultBtnText = $scope.adults[0];
     $scope.changeAdult = function(text) {
       $scope.adultBtnText = text;
     }

     $scope.infants = ['0 '+$translate.instant('MAIN.INFANT'), '1 '+$translate.instant('MAIN.INFANTS')];
     $scope.infantBtnText = $scope.infants[0];
     $scope.changeInfant = function(text) {
       $scope.infantBtnText = text;
     }


     $scope.classes = [$translate.instant('MAIN.ECONOMY'), $translate.instant('MAIN.BUSINESS')];
     $scope.classeBtnText = $scope.classes[0];
     $scope.changeClass = function(text) {
       $scope.classeBtnText = text;
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
   mainController.$inject = ['$scope', '$state', 'api','$translate'];
 } else {
   mainController.$inject = ['$scope', '$location', 'api','$translate'];
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



            // if (complete == false) {
            //   $scope.alertData = false;
            //   if (($scope.firstName == null) || ($scope.middleName == null) || ($scope.lastName == null) || ($scope.phoneNumber == null) || ($scope.passportNumber == null) || ($scope.email1 == null) || ($scope.emailver == null)) {
            //     $scope.alertData = true;
            //
            //   } else {
            //     $scope.alertConfirm = false;
            //     if ($scope.email1 != $scope.emailver)
            //       $scope.alertConfirm = true;
            //     else {
            //       $scope.alertCheck = false;
            //       if (($scope.check == null))
            //         $scope.alertCheck = true;
            //       else {
            //         complete = true;
            //       }
            //     }
            //
            //   }
            //
            //
            // }
            // if (complete == true) {
            //   api.setPassenger($scope.passenger);
            //   if (!api.isOtherHosts)
            //     $location.path('/seating/outgoing');
            //   else $location.path('/payment')
            // }

            var fields = [true, true, true, true, true, true, true, true, true, true];

            $scope.alertFName = false;
            $scope.alertMName = false;
            $scope.alertLName = false;
            $scope.alertPhNumber = false;
            $scope.alertPNumber = false;
            $scope.alertCountry = false;
            $scope.alertEmail = false;
            $scope.alertConfirm = false;
            $scope.alertCheck = false;


            if ($scope.firstName == null) {
                fields[0] = false;
                $scope.alertFName = true;
            }
            if ($scope.middleName == null) {
                fields[1] = false;
                $scope.alertMName = true;
            }
            if ($scope.lastName == null) {
                fields[2] = false;
                $scope.alertLName = true;
            }
            if ($scope.phoneNumber == null) {
                fields[3] = false;
                $scope.alertPhNumber = true;
            }
            if ($scope.passportNumber == null) {
                fields[4] = false;
                $scope.alertPNumber = true;
            }
            if ($scope.nationality == null) {
                fields[5] = false;
                $scope.alertCountry = true;
            }
            if ($scope.email1 == null) {
                fields[6] = false;
                $scope.alertEmail = true;
            }
            if ($scope.emailver == null) {
                fields[7] = false;
                $scope.alertEmail = true;
            }
            if ($scope.email1 != $scope.emailver) {
                fields[8] = false;
                $scope.alertConfirm = true;
            }
            if ($scope.check == null) {
                fields[9] = false;
                $scope.alertCheck = true;
            }

            var allpassing = true;

            for (var i = 0; i < fields.length; i++) {
                if (fields[i] == false) {
                    allpassing = false;
                    break;
                }
            }

            if (allpassing == true) {
                if (!api.IsOtherHosts()) {
                    api.setPassenger($scope.passenger);
                    $location.path('/seating/outgoing');

                } else {
                    var booking = api.getBooking();
                    if (Type == 'desktop') {
                        booking.passengerDetails[0] = {
                            "firstName": $scope.firstName,
                            "lastName": $scope.lastName,
                            "passportNum": $scope.passportNumber,
                            "passportExpiryDate": null,
                            "dateOfBirth": null,
                            "nationality": $scope.nationality,
                            "email": $scope.email1
                        }
                    }
                    api.setBooking(booking);
                    $location.path('/payment')
                }
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




            // if (complete1 == false) {
            //
            //   if (($scope.firstNameMob == null) || ($scope.middleNameMob == null) || ($scope.lastNameMob == null) || ($scope.phoneNumberMob == null) || ($scope.passportNumberMob == null) || ($scope.email1Mob == null) || ($scope.emailverMob == null)) {
            //     alert("Please fill in data:" + "\n" + "Passport Number must be 8 numbers" + "\n" +
            //       "Phone Number must be 10 numbers" + "\n" + "Emails must be in a@xyz.com format");
            //
            //   } else {
            //
            //     if ($scope.email1Mob != $scope.emailverMob)
            //       alert("The entered emails do not match");
            //     else {
            //
            //       if (($scope.checkMob == null))
            //         alert("Please verify the information you entered")
            //       else {
            //         complete1 = true;
            //
            //       }
            //     }
            //
            //   }
            //
            //
            // }
            //
            // if (complete1 == true) {
            //   api.setPassenger($scope.passenger);
            //
            //   $location.path('/tab/seating/outgoing');
            // }



            var fieldsMob = [true, true, true, true, true, true, true, true, true];




            if ($scope.firstNameMob == null) {
                fieldsMob[0] = false;
                alert("Please Enter your first name.")
            }
            if ($scope.middleNameMob == null) {
                fieldsMob[1] = false;
                alert("Please enter your middle name.");
            }
            if ($scope.lastNameMob == null) {
                fieldsMob[2] = false;
                alert("Please enter your last name.");

            }
            if ($scope.phoneNumberMob == null) {
                fieldsMob[3] = false;
                alert("Please enter your phone number, it must be 10 digits");
            }
            if ($scope.passportNumberMob == null) {
                fieldsMob[4] = false;
                alert("Please enter your passport number, it must be 8 digits.");
            }
            if ($scope.email1Mob == null) {
                fieldsMob[5] = false;
                alert("Please enter your email, it must be in this format 'a@xyz.com' ");
            }
            if ($scope.emailverMob == null) {
                fieldsMob[6] = false;
                alert("Please confirm your email, it must be in this format 'a@xyz.com' ");

            }
            if ($scope.email1Mob != $scope.emailverMob) {
                fieldsMob[7] = false;
                alert("The entered emails do not match");
            }
            if ($scope.checkMob == null) {
                fieldsMob[8] = false;
                alert("Please verify the information you've entered");
            }

            var allpassingMob = true;

            for (var i = 0; i < fieldsMob.length; i++) {
                if (fieldsMob[i] == false) {
                    allpassingMob = false;
                    break;
                }
            }

            if (allpassingMob == true) {
                api.setPassenger($scope.passenger);

                $location.path('/tab/seating/outgoing');
            }

        };
    }



});

// @mirna
App.controller('paymentCtrl', function($scope, $location, $http, api) {
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




            if (!api.IsOtherHosts())
                Stripe.card.createToken($scope.form, function(status, response) {
                    console.log(api.getChosenOutGoingFlight());
                    console.log(response.id)
                    api.setStripeToken(response.id)
                    api.submitBooking(api.IsOtherHosts()).then(function(data) {
                        $location.path('/confirmation').search('booking', data.data.refNum);
                        // api.clearLocal();
                    }, function(err) {

                    })
                });
                else
                 {
                var booking = api.getBooking();
                if (booking.returnUrl == booking.outgoingUrl || !booking.returnUrl) {
                    if (booking.returnCost)
                        booking.cost = parseInt(booking.returnCost) + parseInt(booking.outgoingCost);
                    else
                        booking.cost = parseInt(booking.outgoingCost);
                    var url = "http://" + booking.outgoingUrl;
                    api.getStripeKey(url + '/stripe/pubkey/').then(function(data) {
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            console.log("Stripe Token " + response.id)
                            booking.paymentToken = response.id;
                            api.setBooking(booking);
                            api.submitBooking(true, url).then(function(data) {
                                $location.path('/confirmation').search('booking', data.data.refNum);

                            })

                        }, function(err) {
                          console.log(err)
                        })
                    }, function(status) {
                        console.log(status)
                    })

                } else {
                    //here we should send two reqeusts
                    var outgoingBooking = booking;
                    var returnBooking = booking;
                    outgoingBooking.cost = parseInt(booking.outgoingCost);
                    outgoingBooking.returnFlightId = null;
                    if (booking.returnUrl) {
                        returnBooking.cost = parseInt(booking.returnCost);
                        returnBooking.outgoingFlightId = booking.returnFlightId;
                    }

                    var url = "http://" + booking.outgoingUrl;
                    api.getStripeKey(url + '/stripe/pubkey').then(function(data) {
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            console.log( response)
                            outgoingBooking.paymentToken = response.id;
                            api.setBooking(outgoingBooking);
                            api.submitBooking(true, url).then(function(data) {
                                // $location.path('/confirmation').search('booking', data.data.refNum);
                                if( booking.returnUrl){
                                  var url = "http://" + booking.returnUrl;
                                  api.getStripeKey(url + '/stripe/pubkey').then(function(data) {
                                      Stripe.setPublishableKey(data.data)
                                      Stripe.card.createToken($scope.form, function(status, response) {
                                          console.log(response)
                                          returnBooking.paymentToken = response.id;
                                          api.setBooking(returnBooking);
                                          api.submitBooking(true, url).then(function(data) {
                                              // $location.path('/confirmation').search('booking', data.data.refNum);

                                          })

                                      }, function(err) {
                                        console.log(err)
                                      })
                                  }, function(status) {
                                      console.log(status)
                                  })
                                }


                            })

                        }, function(err) {
                          console.log(err)
                        })
                    }, function(status) {
                        console.log(status)
                    })


                }
            }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb24gPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wdXQgPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucGF0Y2ggPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xuICAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xufSk7XG5cbkFwcC5mYWN0b3J5KCdhcGknLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICAgIHZhciBjaG9zZW5PdXRnb2luZ0ZsaWdodCwgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0LCBib29raW5nRGF0YSwgY2FiaW5ldE91dGdvaW5nQ2xhc3MsIGNhYmluZXRSZXR1cm5pbmdDbGFzcywgb3V0Z29pbmdTZWF0LCByZXR1cm5TZWF0LCByZWZOdW07XG4gICAgdmFyIGlzT3RoZXJIb3N0czsgLy8gc2V0IHRvIGZhbHNlIGluIGZsaWdodHNjdHJsICxzZXQgdG8gdHJ1ZSBmbGlnaHRzTmV3Q3RybFxuICAgIHZhciBzdHJpcGVUb2tlbjtcbiAgICB2YXIgcGFzc2VuZ2VyRGF0YSA9IFtdO1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0cmlwZUtleTogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6dW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvYWlycG9ydHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRPdGhlckZsaWdodHNCdXNpOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgaWYgKGlzT3RoZXJIb3N0cylcbiAgICAgICAgICAgICAgICBib29raW5nRGF0YS5QYXNzZW5nZXJEZXRhaWxzID0gcGFzc2VuZ2VyRGF0YVxuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG4gICAgICAgICAgICBpZiAoIWlzT3RoZXJIb3N0cykge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGFzc2VuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzZW5nZXJEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRCb29raW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBib29raW5nRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3Nlbk91dGdvaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3NlblJldHVybmluZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRnb2luZ1NlYXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmV0dXJuU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuU2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRSZXRydW5TZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SXNPdGhlckhvc3RzOiBmdW5jdGlvbihvdGhlckhvc3RzKSB7XG4gICAgICAgICAgICBpc090aGVySG9zdHMgPSBvdGhlckhvc3RzO1xuICAgICAgICB9LFxuICAgICAgICBJc090aGVySG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzT3RoZXJIb3N0cztcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYXJMb2NhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgcGFzc2VuZ2VyRGF0YSA9IFtdXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0ge31cbiAgICAgICAgICAgIHJldHVyblNlYXQgPSB7fVxuICAgICAgICAgICAgaXNpc090aGVySG9zdHMgPSBmYWxzZVxuXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKG90aGVySG9zdHMsdXJsKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICAgICAgcHJpY2UgPSB0aGlzLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgICAgIGlmICghb3RoZXJIb3N0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvYm9va2luZycsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogb3RoZXJIb3N0c1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlbmdlcjogcGFzc2VuZ2VyRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGJvb2tpbmdEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdTZWF0TnVtYmVyOiBvdXRnb2luZ1NlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5TZWF0TnVtYmVyOiByZXR1cm5TZWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHN0cmlwZVRva2VuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCArICcvYm9va2luZycsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKGJvb2tpbmdEYXRhKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIGdldFN0cmlwZVRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpcGVUb2tlbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgICBzdHJpcGVUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiICBBcHAuY29uZmlnKGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xuICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xuICAgICAgTUFJTjoge1xuICAgICAgICBCT09LX05PVzogJ0Jvb2sgTm93JyxcbiAgICAgICAgRlJPTTogJ0Zyb20nLFxuICAgICAgICBGTFlJTkdfRlJPTTogJ0ZseWluZyBmcm9tJyxcbiAgICAgICAgREVQQVJUVVJFX0RBVEU6ICdEZXBhcnR1cmUgRGF0ZScsXG4gICAgICAgIFRPOiAnVG8nLFxuICAgICAgICBGTFlJTkdfVE86ICdGbHlpbmcgdG8nLFxuICAgICAgICBSRUVOVFJZX0RBVEU6ICdSZS1lbnRyeSBEYXRlJyxcbiAgICAgICAgVU5ERVJfMl9ZRUFSUzogJ1VuZGVyIDIgeWVhcnMnLFxuICAgICAgICBST1VORF9UUklQOiAnUm91bmQgVHJpcCcsXG4gICAgICAgIE9ORV9XQVk6ICdPbmUgV2F5JyxcbiAgICAgICAgT1RIRVJfQUlSTElORVM6ICdTZWFyY2ggb3RoZXIgYWlybGluZXMnLFxuICAgICAgICBTRUFSQ0hfRk9SX0ZMSUdIVFM6ICdTZWFyY2ggZm9yIGZsaWdodHMnLFxuICAgICAgICBZRUFSUzogXCJ5ZWFyc1wiLFxuICAgICAgICBDSElMRFJFTjogJ2NoaWxkcmVuJyxcbiAgICAgICAgQ0hJTEQ6ICdjaGlsZCcsXG4gICAgICAgIEFEVUxUOiAnYWR1bHQnLFxuICAgICAgICBBRFVMVFM6ICdhZHVsdHMnLFxuICAgICAgICBJTkZBTlRTOiAnaW5mYW50cycsXG4gICAgICAgIElORkFOVDogJ2luZmFudCcsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFFVT1RFU19IT01FOiB7XG4gICAgICAgICAgT05FOiBcIlNpbXBsZSwgY29udmVuaWVudCwgaW5zdGFudCBjb25maXJtYXRpb24uXCIsXG4gICAgICAgICAgVFdPOiBcIkRlc3RpbmF0aW9ucyBhbGwgYXJvdW5kIHRoZSBnbG9iZS5cIixcbiAgICAgICAgICBUSFJFRTogXCJFeHBlcmllbmNlIGF1dGhlbnRpYyBob3NwaXRhbGl0eS5cIixcbiAgICAgICAgICBGT1VSOiBcIlRpbWUgdG8gZ2V0IGVuY2hhbnRlZC5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRkxJR0hUUzoge1xuICAgICAgICBUSVRMRTogJ0Nob29zZSBhIEZsaWdodCcsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdzZWF0cyBsZWZ0JyxcbiAgICAgICAgTU9SRV9ERVRBSUxTOiAnTW9yZSBkZXRhaWxzJyxcbiAgICAgICAgQk9PSzogJ0Jvb2snLFxuICAgICAgICBTRUxFQ1Q6J1NlbGVjdCcsXG4gICAgICAgIEZMSUdIVDogJ0ZsaWdodCcsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknXG4gICAgICB9LFxuICAgICAgRkxJR0hUOiB7XG4gICAgICAgIEZMSUdIVDogXCJGbGlnaHRcIixcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgVElUTEU6ICdGbGlnaHQgRGV0YWlscycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknLFxuICAgICAgICBOVU1CRVJfT0ZfUEFTU0VOR0VSUzogJ051bWJlciBvZiBwYXNzZW5nZXJzJyxcbiAgICAgICAgRkxZSU5HX0NBTFNTOiAnRmx5aW5nIGNsYXNzJyxcbiAgICAgICAgRkxJR0hUX0ZBUkU6ICdGbGlnaHQgZmFyZScsXG4gICAgICAgIEZMSUdIVF9GQUM6ICdGbGlnaHQgZmFjaWxpdGllcycsXG4gICAgICAgIFBBU1NFTkdFUjogJ3Bhc3NlbmdlcicsXG4gICAgICAgIFBBU1NFTkdFUlM6ICdwYXNzZW5nZXJzJ1xuICAgICAgfSxcbiAgICAgIE5BVjoge1xuICAgICAgICBHT19IT01FOidHbyBIb21lJyxcbiAgICAgICAgU1VCTUlUOiAnU3VibWl0JyxcbiAgICAgICAgTkVYVDogJ05leHQnLFxuICAgICAgICBCQUNLOiAnQmFjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlY2lhbCBPZmZlcnMnLFxuICAgICAgICBTRVJWSUNFUzogJ1NlcnZpY2VzJyxcbiAgICAgICAgT1VSX1RFQU06ICdPdXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnQWJvdXQnLFxuICAgICAgICBDT05UQUNUX1VTOiAnQ29udGFjdCBVcycsXG4gICAgICAgIENIT09TRV9MQU5HVUFHRTonQ2hvb3NlIGxhbmd1YWdlJyxcbiAgICAgICAgRU5HTElTSDogJ0VuZ2xpc2gnLFxuICAgICAgICBHRVJNQU46J0dlcm1hbidcbiAgICAgIH0sXG5cbiAgICAgIENPTkZJUk1BVElPTjoge1xuICAgICAgICBUSEFOS19ZT1U6ICdUaGFuayB5b3UnLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnUGhvbmUnLFxuICAgICAgICBNQUlMOiAnRS1tYWlsJyxcbiAgICAgICAgRkxJR0hUTk86ICdGbGlnaHQgbnVtYmVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnRGVwYXJ0dXJlJyxcbiAgICAgICAgQVJSQUlWQUw6ICdBcnJpdmFsJyxcbiAgICAgICAgUFJJTlQ6ICdQcmludCB0aWNrZXQnXG4gICAgICB9LFxuICAgICAgQ09OVEFDVF9VUzoge1xuXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBMRUFWRV9NU0c6ICdMZWF2ZSB1cyBhIG1lc3NhZ2UnLFxuICAgICAgICBTRU5EOiAnU2VuZCdcbiAgICAgIH0sXG4gICAgICBmb3VyX29fZm9yOiB7XG4gICAgICAgIC8vRG8geW91IG1lYW4gNDA0bm90Zm91bmQgdGVhbSA/ICBpbiA0MDQuaHRtbFxuICAgICAgICBRVUVTVElPTjogJ0RvIHlvdSBtZWFuIDQwNE5vdEZvdW5kIFRlYW0/J1xuXG4gICAgICB9LFxuXG4gICAgICBBQk9VVF9VUzoge1xuXG4gICAgICAgIEFCT1VUOiAnQWJvdXQgQWlyQmVybGluJyxcbiAgICAgICAgSElTVE9SWTogJ0hpc3RvcnknLFxuICAgICAgICBISVNUT1JZX1BBUkE6ICdUaGUgZmlyc3QgYWlyYmVybGluIHBsYW5lIHRvb2sgb2ZmIG9uIDI4dGggQXByaWwgMTk3OS4gRXhwZXJpZW5jZSB0aGUgaGlnaGxpZ2h0cyBhbmQgbWlsZXN0b25lcyBpbiBhaXJiZXJsaW5zIGhpc3RvcnkgJyxcbiAgICAgICAgT1VSX0dPQUw6ICdPdXIgZ29hbCcsXG4gICAgICAgIE9VUl9HT0FMX1BBUkE6ICdGaXJzdCBFdXJvcGUsIGFuZCB0aGVuIHRoZSBnbG9iZSwgd2lsbCBiZSBsaW5rZWQgYnkgZmxpZ2h0LCBhbmQgbmF0aW9ucyBzbyBrbml0IHRvZ2V0aGVyIHRoYXQgdGhleSB3aWxsIGdyb3cgdG8gYmUgbmV4dC1kb29yIG5laWdoYm9yc+KApiAuIFdoYXQgcmFpbHdheXMgaGF2ZSBkb25lIGZvciBuYXRpb25zLCBhaXJ3YXlzIHdpbGwgZG8gZm9yIHRoZSB3b3JsZC4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLmFpcmJlcmxpbiBndWFyYW50ZWVzIGEgZGVuc2UgY29ubmVjdGlvbiBuZXR3b3JrIGFuZCBjb25zdGFudCBncm93dGggdGhhbmtzIHRvIHRoZSBjby1vcGVyYXRpb24gd2l0aCBvdGhlciBhaXJsaW5lcy4nXG4gICAgICB9LFxuXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIEZMSUdIVF9PRkZFUlM6ICdGbGlnaHQgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZCB0aGUgbW9zdCBhdHRyYWN0aXZlIGZhcmUgZm9yIHlvdXIgZmxpZ2h0JyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0xpa2UgdXMgb24gRmFjZWJvb2snLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LX1BBUkE6ICdEb250IG1pc3Mgb3VyIHNwZWNpYWwgb2ZmZXJzIG9uOiB3aXRoIG91ciBuZXdzbGV0dGVyIGFuZCBvbiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU3BlY2lhbCBvZmZlcnMgZm9yIHlvdXIgaG90ZWwgc3RheSBhd2F5IGZyb20gb3VyIHBhcnRuZXJzIC4nXG4gICAgICB9LFxuXG5cbiAgICAgIFBBU1NfREVUQUlMUzoge1xuICAgICAgICBGSVJTVF9OQU1FOiAnRmlyc3QgTmFtZScsXG4gICAgICAgIE1JRERMRV9OQU1FOiAnTWlkZGxlIE5hbWUnLFxuICAgICAgICBMQVNUX05BTUU6ICdMYXN0IE5hbWUnLFxuICAgICAgICBQQVNTX05POiAnUGFzc3BvcnQgTnVtYmVyJyxcbiAgICAgICAgUExBQ0VfT0ZCSVJUSDogJ1BsYWNlIE9mIEJpcnRoJyxcbiAgICAgICAgUEhPTkVfTk86ICdQaG9uZSBOdW1iZXInLFxuICAgICAgICBFX01BSUw6ICdFbWFpbCcsXG4gICAgICAgIFJFUEVBVF9FX01BSUw6ICdSZXBlYXQgRW1haWwnLFxuICAgICAgICBWRVJJRllfUEFSQTogJ0kgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiBwcm92aWRlZCBtYXRjaGVzIHRoZSBwYXNzcG9ydCBpbmZvcm1hdGlvbi4nXG5cbiAgICAgIH0sXG4gICAgICBQQVlNRU5UOiB7XG5cbiAgICAgICAgV0VfQUNDRVBUOiAnV2UgYWNjZXB0JyxcbiAgICAgICAgQ0FSRF9JTkZPOiAnQ2FyZCBpbmZvcm1hdGlvbjonLFxuICAgICAgICBFWFBfREFURTogJ0V4cGlyZSBEYXRlOicsXG4gICAgICAgIENPU1Q6ICdZb3VyIGJvb2tpbmcgdG90YWwgY29zdCdcblxuICAgICAgfSxcblxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2VhdG1hcCcsXG4gICAgICAgIFNFTEVDVEVEOiAnWW91IHNlbGVjdGVkIHNlYXQnXG5cbiAgICAgIH0sXG5cbiAgICAgIFNFUlZJQ0VTOiB7XG5cbiAgICAgICAgU0VSVklDRTogJ1NlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfU0VSVklDRVM6ICdJbmZsaWdodCBTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1BBUkE6ICcgIEFpcmJlcmxpbiBwcmVzZW50cyB0aGUgZWNvbm9teSBhbmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXQgTWVhbHMnLFxuICAgICAgICBHX01FQUxTX1BBUkE6ICdBaXJiZXJsaW4gaXMgdGhlIHJpZ2h0IGFpcmxpbmUgZm9yIGNvbm5vaXNzZXVyczogdHJlYXQgeW91cnNlbGYgdG8gb25lIG9mIHRoZSBkZWxpY2lvdXMgZ291cm1ldCBtZWFscyBmcm9tIFwiU2Fuc2liYXJcIiBvbiBib2FyZCcsXG4gICAgICAgIEJBR0dBR0U6ICdCYWdnYWdlJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnRXZlcnl0aGluZyB5b3UgbmVlZCB0byBrbm93IGFib3V0IGZyZWUgYmFnZ2FnZSBhbGxvd2FuY2VzLCBjYWJpbiBiYWdnYWdlIHJlZ3VsYXRpb25zIGFuZCBzcGVjaWFsIGJhZ2dhZ2UuJ1xuXG4gICAgICB9LFxuXG4gICAgfSk7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZGUnLCB7XG4gICAgICBNQUlOOiB7XG4gICAgICAgIEJPT0tfTk9XOiAnSmV0enQgYnVjaGVuJyxcbiAgICAgICAgRlJPTTogJ3ZvbicsXG4gICAgICAgIEZMWUlOR19GUk9NOiAnQWJmbHVnaGFmZW4nLFxuICAgICAgICBERVBBUlRVUkVfREFURTogJ0hpbmZsdWcnLFxuICAgICAgICBUTzogJ25hY2gnLFxuICAgICAgICBGTFlJTkdfVE86ICdaaWVsZmx1Z2hhZmVuJyxcbiAgICAgICAgUkVFTlRSWV9EQVRFOiAnUsO8Y2tmbHVnJyxcbiAgICAgICAgVU5ERVJfMl9ZRUFSUzogJ0rDvG5nZXIgYWxzIDIgSmFocmVuJyxcbiAgICAgICAgUk9VTkRfVFJJUDogJ0hpbi0vUsO8Y2tmYWhydCcsXG4gICAgICAgIE9ORV9XQVk6ICdOdXIgSGluZmx1ZycsXG4gICAgICAgIE9USEVSX0FJUkxJTkVTOiAnQW5kZXJlIEZsdWdnZXNlbGxzY2hhZnRlbicsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ0Zsw7xnZSBzdWNoZW4nLFxuICAgICAgICBZRUFSUzogXCJKYWhyZVwiLFxuICAgICAgICBDSElMRFJFTjogJ0tpbmRlcicsXG4gICAgICAgIENISUxEOiAnS2luZCcsXG4gICAgICAgIEFEVUxUOiAnRXJ3YWNoc2VuZXInLFxuICAgICAgICBBRFVMVFM6ICdFcndhY2hzZW5lbicsXG4gICAgICAgIElORkFOVFM6ICdCYWJ5cycsXG4gICAgICAgIElORkFOVDogJ0JhYnknLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBRVU9URVNfSE9NRToge1xuICAgICAgICAgIE9ORTogXCJFaW5mYWNoLCBiZXF1ZW0sIHNvZm9ydGlnZSBCZXN0w6R0aWd1bmcuXCIsXG4gICAgICAgICAgVFdPOiBcIlppZWxlbiBhdWYgZGVyIFdlbHQuXCIsXG4gICAgICAgICAgVEhSRUU6IFwiQXV0aGVudGlzY2hlIEdhc3RmcmV1bmRzY2hhZnQgZXJsZWJlbi5cIixcbiAgICAgICAgICBGT1VSOiBcIlZlcnd1bnNjaGVuZSBaZWl0IG1pdCB1bnMuXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEZMSUdIVFM6IHtcbiAgICAgICAgVElUTEU6ICdFaW5lbiBGbHVnIGF1c3N1Y2hlbicsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdmcmVpZSBTaXR6cGzDpHR6ZScsXG4gICAgICAgIE1PUkVfREVUQUlMUzogJ01laHIgRGV0YWlscycsXG4gICAgICAgIEJPT0s6ICdidWNoZW4nLFxuICAgICAgICBTRUxFQ1Q6J1fDpGhsZW4nLFxuICAgICAgICBGTElHSFQ6ICdGbHVnJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJ1xuICAgICAgfSxcbiAgICAgIEZMSUdIVDoge1xuICAgICAgICBGTElHSFQ6IFwiRmx1Z1wiLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBUSVRMRTogJ0RldGFpbHMgZGVzIEZsdWdzJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJyxcbiAgICAgICAgTlVNQkVSX09GX1BBU1NFTkdFUlM6ICdBbnphaGwgZGVyIFBhc3NhZ2llcmUnLFxuICAgICAgICBGTFlJTkdfQ0FMU1M6ICdCZWbDtnJkZXJ1bmdza2xhc3NlbicsXG4gICAgICAgIEZMSUdIVF9GQVJFOiAnRmx1Z3ByZWlzJyxcbiAgICAgICAgRkxJR0hUX0ZBQzogJ0RpZW5zdGxlaXN0dW5nZW4gZGVzIEZsdWdzJyxcbiAgICAgICAgUEFTU0VOR0VSOiAnUGFzc2FnaWVyJyxcbiAgICAgICAgUEFTU0VOR0VSUzogJ1Bhc3NhZ2llcmUnXG4gICAgICB9LFxuICAgICAgTkFWOiB7XG4gICAgICAgIEdPX0hPTUU6J2hlaW1nZWhlbicsXG4gICAgICAgIFNVQk1JVDogJ2VpbnJlaWNoZW4nLFxuICAgICAgICBORVhUOiAnd2VpdGVyJyxcbiAgICAgICAgQkFDSzogJ3p1csO8Y2snLFxuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZXppZWxsZSBBbmdlYm90ZScsXG4gICAgICAgIFNFUlZJQ0VTOiAnRGllbnN0bGVpc3R1bmdlbicsXG4gICAgICAgIE9VUl9URUFNOiAnVW5zZXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnw5xiZXIgdW5zJyxcbiAgICAgICAgQ09OVEFDVF9VUzogJ1Vuc2VyIEtvbnRha3QnLFxuICAgICAgICBDSE9PU0VfTEFOR1VBR0U6J1fDpGhsZSBlaW5lIFNwcmFjaGUnLFxuICAgICAgICBFTkdMSVNIOiAnRW5nbGlzY2gnLFxuICAgICAgICBHRVJNQU46J0RldXRzY2gnXG4gICAgICB9LFxuICAgICAgQ09ORklSTUFUSU9OOiB7XG5cbiAgICAgICAgVEhBTktfWU9VOiAnRGFua2Ugc2Now7ZuJyxcbiAgICAgICAgTkFNRTogJ05hbWUnLFxuICAgICAgICBQSE9ORTogJ1RlbGVmb24nLFxuICAgICAgICBNQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBGTElHSFROTzogJ0ZsdWcgTnVtbWVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnQWJmYWhydCcsXG4gICAgICAgIEFSUkFJVkFMOiAnQW5rdW5mdCcsXG4gICAgICAgIFBSSU5UOiAnRmx1Z2thcnRlIGFiZHJ1Y2tlbidcbiAgICAgIH0sXG4gICAgICBDT05UQUNUX1VTOiB7XG5cbiAgICAgICAgQ09OVEFDVF9VUzogJ1Vuc2VyIEtvbnRha3QnLFxuICAgICAgICBQSE9ORTogJ1RlbGVmb24nLFxuICAgICAgICBNQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBMRUFWRV9NU0c6ICdJaHIgQW5saWVnZW4nLFxuICAgICAgICBTRU5EOiAnYWJzY2hpY2tlbidcbiAgICAgIH0sXG4gICAgICBmb3VyX29fZm9yOiB7XG4gICAgICAgIC8vRG8geW91IG1lYW4gNDA0bm90Zm91bmQgdGVhbSA/ICBpbiA0MDQuaHRtbFxuICAgICAgICBRVUVTVElPTjogJ01laW50ZW4gU2llIGRpZSBHcnVwcGUgdm9uIDQwNE5vdEZvdW5kID8nXG5cbiAgICAgIH0sXG4gICAgICBBQk9VVF9VUzoge1xuXG4gICAgICAgIEFCT1VUOiAnw5xiZXIgQWlyQmVybGluJyxcbiAgICAgICAgSElTVE9SWTogJ0dlc2NoaWNodGUnLFxuICAgICAgICBISVNUT1JZX1BBUkE6ICdBbSAyOC4gQXByaWwgMTk3OSBzdGFydGV0IGVpbmUgQm9laW5nIDcwNyB2b24gQmVybGluLVRlZ2VsIG5hY2ggUGFsbWEgZGUgTWFsbG9yY2EuIERlciBFcnN0Zmx1ZyBpc3QgZGVyIEFuZmFuZyBkZXIgRXJmb2xnc2dlc2NoaWNodGUgdm9uIGFpcmJlcmxpbi4gJyxcbiAgICAgICAgT1VSX0dPQUw6ICdVbnNlciBaaWVsJyxcbiAgICAgICAgT1VSX0dPQUxfUEFSQTogJ1p1ZXJ0IEV1cm9wYSwgenVuw6RjaHN0IGRpZSBnYW56ZSBXZWx0LCB3ZXJkZW4gZHVyY2ggZGVuIEZsdWcgenVzYW1tZW4gdmVyYnVuZGVuLCB1bmQgTmF0aW9uZW4gZW5nIHp1c2FtbWVuIGRhbWl0IHNpZSBOYWNoYmFybiBhdWZ3YWNoc2Vu4oCmIC4gV2FzIGRpZSBFaXNiYWhuZW4gZsO8ciBkaWUgTmF0aW9uZW4gZ2V0YW4gaGF0LCB3aXJkIGRpZSBGbMO8Z2UgZsO8ciBkYXMgZ2FuemUgV2VsdCB0dW4uJyxcbiAgICAgICAgQV9QOiAnQWxsaWFuY2UvcGFydG5lcnMnLFxuICAgICAgICBBX1BfUEFSQTogJ2FpcmJlcmxpbiBlcndlaXRlcnQgaWhyIGludGVybmF0aW9uYWxlcyBTdHJlY2tlbm5ldHosIGluZGVtIHNpZSBtaXQgbWVocmVyZW4gQWlybGluZXMgYWxzIENvZGVzaGFyZS1QYXJ0bmVybiBrb29wZXJpZXJ0LidcblxuXG4gICAgICB9LFxuICAgICAgT0ZGRVJTOiB7XG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlemllbGxlIEFuZ2Vib3RlJyxcbiAgICAgICAgRkxJR0hUX09GRkVSUzogJ0ZsdWdhbmdlYm90ZScsXG4gICAgICAgIEZMSUdIVF9PRkZFUlNfUEFSQTogJ0ZpbmRlbiBTaWUgZGllIGF0dHJha3RpdnN0ZW4gVGFyaWZlIGbDvHIgSWhyZW4gRmx1ZycsXG4gICAgICAgIExJS0VfRkFDRUJPT0s6ICdGb2xnZW4gU2llIHVucyBhdWYgRmFjZWJvb2snLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LX1BBUkE6ICdWZXJtaXNzZW4gU2llIG5pY2h0IHVuc2VyZSBzcGV6aWVsbGUgQW5nZWJvdGU6IG1pdCB1bnNlciBuZXdzbGV0dGVyIHVuZCBhdWYgRmFjZWJvb2snLFxuICAgICAgICBIT1RFTDogJ0hvdGVsJyxcbiAgICAgICAgSE9URUxfUEFSQTogJ1NvbmRlcmFuZ2Vib3RlIGbDvHIgSWhyIEhvdGVsIHdlZyB2b24gdW5zZXJlIFBhcnRuZXJuIC4nXG5cbiAgICAgIH0sXG5cbiAgICAgIFBBU1NfREVUQUlMUzoge1xuXG4gICAgICAgIEZJUlNUX05BTUU6ICdWb3JuYW1lJyxcbiAgICAgICAgTUlERExFX05BTUU6ICdad2VpdG5hbWUnLFxuICAgICAgICBMQVNUX05BTUU6ICdOYWNobmFtZScsXG4gICAgICAgIFBBU1NfTk86ICdSZWlzZXBhc3MgTnVtbWVyJyxcbiAgICAgICAgUExBQ0VfT0ZCSVJUSDogJ09ydCBkZXMgR2VidXJ0cycsXG4gICAgICAgIFBIT05FX05POiAnVGVsZWZvbiBOdW1tZXInLFxuICAgICAgICBFX01BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIFJFUEVBVF9FX01BSUw6ICdFLW1haWwgd2llZGVyaG9sZW4nLFxuICAgICAgICBWRVJJRllfUEFSQTogJ0hpZXJtaXQsIGJlc3TDpHRpZ2UgaWNoLCBkYXNzIGRpZSBJbmZvcm1hdGlvbmVuLCBkaWUgdm9yaGluIGdlZ2ViZW4gc2luZCwgbWVpbmUgUGFzc2RhdGVuIGVudHNwcmljaGVuLidcblxuICAgICAgfSxcbiAgICAgIFBBWU1FTlQ6IHtcblxuICAgICAgICBXRV9BQ0NFUFQ6ICdaYWhsdW5nc21ldGhvZGVuJyxcbiAgICAgICAgQ0FSRF9JTkZPOiAnS3JlZGl0a2FydGUgaW5mb3JtYXRpb25lbjonLFxuICAgICAgICBFWFBfREFURTogJ0FibGF1ZmRhdHVtIElocmVyIEthcnRlOicsXG4gICAgICAgIENPU1Q6ICdHZXNhbXRwcmVpcydcblxuICAgICAgfSxcbiAgICAgIFNFQVRJTkc6IHtcblxuICAgICAgICBTRUFUX01BUDogJ1NpdHpwbGF0enJlc2VydmllcnVuZycsXG4gICAgICAgIFNFTEVDVEVEOiAnU2llIGhhYmVuIGVpbmVuIFNpdHpwbGF0eiByZXNlcnZpZXJ0LidcblxuICAgICAgfSxcbiAgICAgIFNFUlZJQ0VTOiB7XG5cbiAgICAgICAgU0VSVklDRTogJ1NlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfU0VSVklDRVM6ICdTZXJ2aWNlcyBhbiBib2FyZCcsXG4gICAgICAgIElORkxJR0hUX1BBUkE6ICcgIEFpcmJlcmxpbiBoZWnDn2VuIFNpZSBoZXJ6bGljaCB3aWxsa29tbWVuIGFuIEJvcmQ6IGVjb25vbXkgdW5kIGJ1c2luZXNzIGNsYXNzLicsXG4gICAgICAgIEdfTUVBTFM6ICdHb3VybWV0ZXNzZW4nLFxuICAgICAgICBHX01FQUxTX1BBUkE6ICdGcmV1ZW4gU2llIHNpY2ggYXVmIEFpcmJlcmxpbnMgYSBsYSBjYXJ0ZS1TcGVpc2UgOiBXaXIgc2VydmllcmVuIElobmVuIHVuc2VyZSB3YXJtZW4gT24tVG9wLVNwZWlzZW4sIGRpZSBleHRyYSB2b20gU2Fuc2liYXItV2lydCBIZXJiZXJ0IFNlY2tsZXIga3JlaWVydCB3dXJkZW4uJyxcbiAgICAgICAgQkFHR0FHRTogJ1JlaXNlZ2Vww6RjaycsXG4gICAgICAgIEJBR0dBR0VfUEFSQTogJ1Vuc2VyZSBSZWdsdW5nZW4gw7xiZXIgQXVmenVnZWJlbmRlcyBHZXDDpGNrbWVuZ2VuLCDDvGJlciBIYW5kZ2Vww6RjayB1bmQgU29uZGVyZ2Vww6Rjay4nXG5cbiAgICAgIH0sXG5cbiAgICB9KTtcblxuICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgnZGUnKTtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGUnKTtcblxuICB9KTtcbiIsIi8vIEBhYmRlbHJobWFuLWVzc2FtXG52YXIgY29uZmlybWF0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtY29uZmlybWF0aW9uJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDb25maXJtYXRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiR28gSG9tZVwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGFwaS5zdWJtaXRCb29raW5nKCdmYWxzZScpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgLy8gICBhbGVydChkYXRhLmRhdGEpXG4gICAgICAvLyAgIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAvLyB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAvL1xuICAgICAgLy8gfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cblxuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG4gICRzY29wZS5mbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcblxuICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuXG4gICRzY29wZS5ib29raW5nID0gJHJvdXRlUGFyYW1zLmJvb2tpbmc7XG4gICRzY29wZS5ub3RPdGhlckhvc3RzID0gIWFwaS5Jc090aGVySG9zdHMoKTtcblxuLy9cbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuT3V0Z29pbmdGbGlnaHRcIik7XG4vLyAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpO1xuLy8gY29uc29sZS5sb2coXCJwYXNzZW5nZXJcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRQYXNzZW5nZXIoKSlcbi8vIGNvbnNvbGUubG9nKFwiYm9va2luZ1wiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKSlcbi8vIGNvbnNvbGUubG9nKFwiZ29pbmdTZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0T3V0Z29pbmdTZWF0KCkpXG4vLyBjb25zb2xlLmxvZyhcInJldHJ1blNlYXRcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRSZXR1cm5TZWF0KCkpXG5cblxufVxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgY29uZmlybWF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsICckc3RhdGVQYXJhbXMnXTtcbn0gZWxzZSB7XG4gIGNvbmZpcm1hdGlvbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdjb25maXJtYXRpb25DdHJsJywgY29uZmlybWF0aW9uQ29udHJvbGxlcik7XG4iLCIvLyBATmFiaWxhXG5BcHAuY29udHJvbGxlcignZmxpZ2h0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkZsaWdodChzKSBEZXRhaWxzXCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuXG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgdmFyIG91dGdvaW5nRmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG4gIHZhciByZXR1cm5GbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCk7XG5cbiAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuXG4gIHZhciBmYWNpbGl0aWVzID0gW1wiU21va2luZyBhcmVhcyBhdmFpbGFibGVcIiwgXCJXaS1GaSBhdmFpbGFiaWxpdHlcIixcbiAgICBcIjQgY3VsdHVyYWwgY3Vpc2luZXNcIiwgXCJJbmZsaWdodCBlbnRlcnRhaW5tZW50XCIsIFwiRXh0cmEgY296eSBzbGVlcGVyZXR0ZVwiLFxuICAgIFwiU2NyZWVucyB0byBzaG93IHlvdXIgZmxpZ2h0IHBhdHRlcm4sIGFpcmNyYWZ0IGFsdGl0dWRlIGFuZCBzcGVlZFwiXG4gIF07XG5pZiAob3V0Z29pbmdGbGlnaHQpe1xuICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuXG5cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIGFycml2YWxEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmFycml2YWxVVEMpO1xuICAgIHJldHVybkZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICB2YXIgYWlyY3JhZnRzID0gW107XG4gIHZhciBvdXRBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciBvdXRBaXJjcmFmdGhhc1dpZmk7XG4gIHZhciByZUFpcmNyYWZ0aGFzU21va2luZztcbiAgdmFyIHJlQWlyY3JhZnRoYXNXaWZpIDtcbiAgYXBpLmdldEFpcmNyYWZ0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlyY3JhZnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICRzY29wZS5vdXRBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IHJldHVybkZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICAgJHNjb3BlLnJlQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuXG4gICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gIHZhciBhaXJwb3J0cyA9IFtdO1xuICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG4gIHZhciBvdXRidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gIHZhciBvdXRmYXJlID0gMDtcblxuICBpZiAoYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuZWNvbm9teUZhcmU7XG4gIH0gZWxzZSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgfVxuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlYnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICAgIHZhciByZWZhcmUgPSAwO1xuICAgIGlmIChib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5lY29ub215RmFyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5idXNpbmVzc0ZhcmU7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dGZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzU21va2luZylcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbiBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNTbW9raW5nKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNXaWZpKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG5cbiAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gICAgfVxuICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuXG4gICAgJHNjb3BlLnJldHVybkZsaWdodCA9IHJldHVybkZsaWdodDtcbiAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLnJlZmFyZSA9IHJlZmFyZTtcbiAgICAkc2NvcGUucmVmYWNpbGl0aWVzUmVzdWx0ID0gcmVmYWNpbGl0aWVzUmVzdWx0O1xuICB9XG4gICRzY29wZS5vdXRnb2luZ0ZsaWdodCA9IG91dGdvaW5nRmxpZ2h0O1xuICAkc2NvcGUub3V0YnVzaW5lc3NPckVjb24gPSBvdXRidXNpbmVzc09yRWNvbjtcbiAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAkc2NvcGUub3V0ZmFjaWxpdGllc1Jlc3VsdCA9IG91dGZhY2lsaXRpZXNSZXN1bHQ7XG5cbn1cbn0pO1xuIiwiLy8gQGFiZGVscmFobWFuLW1hZ2VkXG52YXIgZmxpZ2h0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksICRyb3V0ZVBhcmFtcykge1xuXG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gIGFwaS5zZXRJc090aGVySG9zdHMoZmFsc2UpO1xuXG4gIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gICRzY29wZS5vcmlnaW4gPSBvcmlnaW47XG4gICRzY29wZS5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAkc2NvcGUuZXhpdERhdGUgPSBleGl0RGF0ZTtcblxuICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgdmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSAqIDEwMDApO1xuICAgICRzY29wZS5yZXR1cm5EYXRlID0gcmV0dXJuRGF0ZTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgXCJyZWZQYXNzZW5nZXJJRFwiOiBbXSxcbiAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgIFwiaXNPbmVXYXlcIjogISRzY29wZS5yb3VuZFRyaXAsXG4gICAgXCJyZWZFeGl0RmxpZ2h0SURcIjogbnVsbCxcbiAgICBcInJlZlJlRW50cnlGbGlnaHRJRFwiOiBudWxsLFxuICAgIFwicmVjZWlwdE51bWJlclwiOiBudWxsXG4gIH07XG5cbiAgdmFyIGZsaWdodHM7XG4gIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICBpZiAocmV0dXJuRGF0ZSlcbiAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5leGl0SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gZmxpZ2h0Ll9pZDtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gZmxpZ2h0Ll9pZDtcbiAgfVxuXG4gICRzY29wZS5jb25zdHJ1Y3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXRlT3V0ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVPdXQuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZU91dC5nZXRVVENNb250aCgpLCBkYXRlT3V0LmdldFVUQ0RhdGUoKSwgIGRhdGVPdXQuZ2V0VVRDSG91cnMoKSwgZGF0ZU91dC5nZXRVVENNaW51dGVzKCksIGRhdGVPdXQuZ2V0VVRDU2Vjb25kcygpKTtcbiAgfTtcblxuICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQuX2lkO1xuXG4gICAgaWYgKCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodClcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0Ll9pZDtcblxuICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuXG4gICAgaWYgKFR5cGUgPT0gXCJkZXNrdG9wXCIpXG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgZWxzZVxuICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0LWRldGFpbHMnKTtcblxuICB9XG5cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gIH1cblxuICBpZiAoIW9yaWdpbiB8fCAhZGVzdGluYXRpb24gfHwgIWV4aXREYXRlKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUucm91bmRUcmlwKVxuICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gIH1cblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcblxuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgYXBpLmdldEZsaWdodHMob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICB9XG5cbiAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHM7XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tqXS50YWlsTnVtYmVyID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBhcGkuZ2V0RmxpZ2h0cyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLm1pbmlMb2dvUGF0aCA9IGZ1bmN0aW9uKG9wZXJhdG9yQWlybGluZSkge1xuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZSA9PT0gXCJBaXIgQmVybGluXCIpXG4gICAgICAgIHJldHVybiBcImltZy9haXItYmVybGluLW1pbmktbG9nby5wbmdcIlxuICAgICAgcmV0dXJuIFwiaW1nL290aGVyLWFpcmxpbmUtbWluaS1sb2dvLnBuZ1wiXG4gICAgfTtcblxuICB9XG5cbn1cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsICckc3RhdGVQYXJhbXMnXTtcbn0gZWxzZSB7XG4gIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzQ3RybCcsIGZsaWdodENvbnRyb2xsZXIpO1xuIiwidmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICBhcGkuc2V0SXNPdGhlckhvc3RzKHRydWUpO1xuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgICAgIFwicGFzc2VuZ2VyRGV0YWlsc1wiOiBbe1xuICAgICAgICAgICAgXCJmaXJzdE5hbWVcIjogbnVsbCxcbiAgICAgICAgICAgIFwibGFzdE5hbWVcIjogbnVsbCxcbiAgICAgICAgICAgIFwicGFzc3BvcnROdW1cIjogbnVsbCxcbiAgICAgICAgICAgIFwicGFzc3BvcnRFeHBpcnlEYXRlXCI6IG51bGwsXG4gICAgICAgICAgICBcImRhdGVPZkJpcnRoXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6IG51bGwsXG4gICAgICAgICAgICBcImVtYWlsXCI6IG51bGwsXG4gICAgICAgIH1dLFxuICAgICAgICBcImNsYXNzXCI6IG51bGwsXG4gICAgICAgIFwib3V0Z29pbmdGbGlnaHRJZFwiOiBudWxsLFxuICAgICAgICBcInJldHVybkZsaWdodElkXCI6IG51bGwsXG4gICAgICAgIFwicGF5bWVudFRva2VuXCI6IG51bGxcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICB2YXIgaXNFY29ub215ID0gJHJvdXRlUGFyYW1zLmZsaWdodENsYXNzID09IFwiRWNvbm9teVwiO1xuICAgIGNvbnNvbGUubG9nKGlzRWNvbm9teSlcbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgICAgdmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSAqIDEwMDApO1xuICAgICAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICAgIGlmIChpc0Vjb25vbXkpIHtcbiAgICAgICAgYXBpLmdldE90aGVyRmxpZ2h0c0VjbyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSlcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaS5nZXRPdGhlckZsaWdodHNCdXNpKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmNsYXNzID0gaXNFY29ub215ID09PSB0cnVlID8gXCJlY29ub215XCIgOiBcImJ1c2luZXNzXCI7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcub3V0Z29pbmdGbGlnaHRJZCA9IGZsaWdodC5mbGlnaHRJZDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ1VybCA9IGZsaWdodC51cmw7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcub3V0Z29pbmdDb3N0ID0gZmxpZ2h0LmNvc3Q7XG5cbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJldHVybkZsaWdodElkID0gZmxpZ2h0LmZsaWdodElkO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJldHVyblVybCA9IGZsaWdodC51cmw7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuQ29zdCA9IGZsaWdodC5jb3N0O1xuXG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKVxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxufVxuXG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICAgZmxpZ2h0TmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufSBlbHNlIHtcbiAgICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywgJyRyb3V0ZVBhcmFtcycsIF07XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCIgdmFyIG1haW5Db250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwkdHJhbnNsYXRlKSB7XG4gICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtbWFpbic7XG5cbiAgICRzY29wZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgICBjb25zb2xlLmxvZygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pO1xuICAgfVxuXG4gICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICRzY29wZS5haXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgfSk7XG5cblxuICAgJHNjb3BlLnNlbGVjdGVkT3JpZ2luID0gdW5kZWZpbmVkO1xuICAgJHNjb3BlLnNlbGVjdGVkRGVzdCA9IHVuZGVmaW5lZDtcblxuICAgZnVuY3Rpb24gYWlycG9yc0NvbnRhaW5zKGlhdGEpIHtcbiAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICBpZiAoaWF0YSA9PSAkc2NvcGUuYWlycG9ydHNbaV1bJ2lhdGEnXSlcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICB9XG4gICAgIHJldHVybiBmYWxzZTtcbiAgIH1cblxuICAgJHNjb3BlLmJ1dHRvblN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgIHJldHVybiAhJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICEkc2NvcGUuc2VsZWN0ZWREZXN0IHx8ICEkc2NvcGUuZXhpdERhdGUgfHwgJHNjb3BlLnNlbGVjdGVkRGVzdCA9PSAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkRGVzdCk7XG4gICB9XG5cbiAgICRzY29wZS5mbGlnaHQgPSB7XG4gICAgIHR5cGU6IFwib25lXCJcbiAgIH1cbiAgICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgIHZhbHVlOiBmYWxzZVxuICAgfVxuXG5cblxuICAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBleGl0RGF0ZSwgcmV0dXJuRGF0ZTtcblxuICAgICBleGl0RGF0ZSA9ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcbiAgICAgaWYgKCRzY29wZS5yZXR1cm5EYXRlKVxuICAgICAgIHJldHVybkRhdGUgPSAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcblxuICAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsIGV4aXREYXRlKVxuICAgICAgICAgICAuc2VhcmNoKCdmbGlnaHRDbGFzcycsJHNjb3BlLmNsYXNzZUJ0blRleHQpO1xuXG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZVxuICAgICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCByZXR1cm5EYXRlKVxuICAgICAgICAgICAuc2VhcmNoKCdmbGlnaHRDbGFzcycsJHNjb3BlLmNsYXNzZUJ0blRleHQpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzLW5ldycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogZXhpdERhdGUsXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogcmV0dXJuRGF0ZVxuICAgICAgICAgICB9KVxuICAgICAgIH1cbiAgICAgfSBlbHNlIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApXG4gICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6ICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApXG4gICAgICAgICAgIH0pXG4gICAgICAgfVxuXG4gICAgIH1cblxuICAgfTtcblxuXG5cblxuICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICQoJyNtYWluLXRleHQnKS50eXBlSXQoe1xuICAgICAgIHN0cmluZ3M6IFskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuT05FJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLlRXTycpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5USFJFRScpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5GT1VSJyldLFxuICAgICAgIHNwZWVkOiAxMjAsXG4gICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICAgbG9vcDogdHJ1ZVxuICAgICB9KTtcblxuXG4gICAgICRsb2NhdGlvbi51cmwoJGxvY2F0aW9uLnBhdGgoKSk7XG4gICAgIHNldFVwRGF0ZSgkc2NvcGUpO1xuXG4gICAgICRzY29wZS5jaGlsZHJlbiA9IFsnMCAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICcxICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTEQnKSwgJzIgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnMyAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICc0ICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKV07XG4gICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSAkc2NvcGUuY2hpbGRyZW5bMF07XG4gICAgICRzY29wZS5jaGFuZ2VDaGlsZHJlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG5cblxuICAgICAkc2NvcGUuYWR1bHRzID0gWycxICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUJykgLCAnMiAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVFMnKSwgJzMgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVFMnKSwgJzQgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRzJyldO1xuICAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gJHNjb3BlLmFkdWx0c1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUFkdWx0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cbiAgICAgJHNjb3BlLmluZmFudHMgPSBbJzAgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uSU5GQU5UJyksICcxICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLklORkFOVFMnKV07XG4gICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gJHNjb3BlLmluZmFudHNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VJbmZhbnQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cblxuICAgICAkc2NvcGUuY2xhc3NlcyA9IFskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uRUNPTk9NWScpLCAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQlVTSU5FU1MnKV07XG4gICAgICRzY29wZS5jbGFzc2VCdG5UZXh0ID0gJHNjb3BlLmNsYXNzZXNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VDbGFzcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuY2xhc3NlQnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cbiAgIH1cblxuXG4gfTtcblxuIGZ1bmN0aW9uIHNldFVwRGF0ZSgkc2NvcGUpIHtcbiAgICRzY29wZS50b2RheSA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUuZXhpdERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAkc2NvcGUucmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICB9O1xuICAgJHNjb3BlLnRvZGF5KCk7XG5cbiAgICRzY29wZS5vcGVuMiA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUucG9wdXAyLm9wZW5lZCA9IHRydWU7XG4gICB9O1xuICAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLnBvcHVwLm9wZW5lZCA9IHRydWU7XG4gICB9O1xuXG5cbiAgIGZ1bmN0aW9uIGRpc2FibGVkKGRhdGEpIHtcbiAgICAgdmFyIGRhdGUgPSBkYXRhLmRhdGUsXG4gICAgICAgbW9kZSA9IGRhdGEubW9kZTtcbiAgICAgcmV0dXJuIG1vZGUgPT09ICdkYXknICYmIChkYXRlLmdldERheSgpID09PSAwIHx8IGRhdGUuZ2V0RGF5KCkgPT09IDYpO1xuICAgfVxuICAgJHNjb3BlLmRhdGVPcHRpb25zID0ge1xuICAgICBmb3JtYXRZZWFyOiAneXknLFxuICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgyMDIwLCA1LCAyMiksXG4gICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgIHN0YXJ0aW5nRGF5OiAxXG4gICB9O1xuICAgJHNjb3BlLnBvcHVwMiA9IHtcbiAgICAgb3BlbmVkOiBmYWxzZVxuICAgfTtcbiAgICRzY29wZS5wb3B1cCA9IHtcbiAgICAgb3BlbmVkOiBmYWxzZVxuICAgfTtcbiB9XG5cbiBpZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICAgbWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICdhcGknLCckdHJhbnNsYXRlJ107XG4gfSBlbHNlIHtcbiAgIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHRyYW5zbGF0ZSddO1xuIH1cblxuIEFwcC5jb250cm9sbGVyKCdtYWluQ3RybCcsIG1haW5Db250cm9sbGVyKTtcbiIsIi8vIEB5YXNzbWluZVxuQXBwLmNvbnRyb2xsZXIoJ3Bhc3NlbmdlckRldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAgICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cbiAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgICAgICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlVGl0bGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhcGkuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmNvdW50cmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICB9KTtcblxuXG5cblxuICAgICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuXG4gICAgICAgICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGU6IG51bGwsIC8vYWNjb3JkaW5nIHRvIGNvdW50cnlcbiAgICAgICAgICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICAgICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICAgICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgICAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHNjb3BlLnRpdGxlc0J0blRleHQsXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlcixcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxXG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vL2JlZm9yZSB5b3UgbGVhdmUgdGhlIHBhZ2UgbWFrZSBzdXJlIHRoYXQgdGhlIHBhc3NlbmdlciBvYmplY3QgaXMgY29tcGxldGUgb3RoZXJ3aXNlIHNob3cgYWxlcnQoXCJGaWxsIGluIGFsbCBkYXRhXCIpO1xuXG5cblxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyAgICRzY29wZS5hbGVydERhdGEgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlciA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMSA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyID09IG51bGwpKSB7XG4gICAgICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0RGF0YSA9IHRydWU7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICRzY29wZS5hbGVydENvbmZpcm0gPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgICBpZiAoJHNjb3BlLmVtYWlsMSAhPSAkc2NvcGUuZW1haWx2ZXIpXG4gICAgICAgICAgICAvLyAgICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICRzY29wZS5hbGVydENoZWNrID0gZmFsc2U7XG4gICAgICAgICAgICAvLyAgICAgICBpZiAoKCRzY29wZS5jaGVjayA9PSBudWxsKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG4gICAgICAgICAgICAvLyAgIGlmICghYXBpLmlzT3RoZXJIb3N0cylcbiAgICAgICAgICAgIC8vICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgICAgIC8vICAgZWxzZSAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gW3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWVdO1xuXG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRGTmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TU5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydExOYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRQaE51bWJlciA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0UE51bWJlciA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q291bnRyeSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0RW1haWwgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gZmFsc2U7XG5cblxuICAgICAgICAgICAgaWYgKCRzY29wZS5maXJzdE5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1swXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydEZOYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubWlkZGxlTmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzFdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TU5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TE5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5waG9uZU51bWJlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzNdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0UGhOdW1iZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5wYXNzcG9ydE51bWJlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0UE51bWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLm5hdGlvbmFsaXR5ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDb3VudHJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsdmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbN10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMSAhPSAkc2NvcGUuZW1haWx2ZXIpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbOF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2hlY2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s5XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbHBhc3NpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZHNbaV0gPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxscGFzc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxwYXNzaW5nID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFwaS5Jc090aGVySG9zdHMoKSkge1xuICAgICAgICAgICAgICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvb3V0Z29pbmcnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLnBhc3NlbmdlckRldGFpbHNbMF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmaXJzdE5hbWVcIjogJHNjb3BlLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3ROYW1lXCI6ICRzY29wZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhc3Nwb3J0TnVtXCI6ICRzY29wZS5wYXNzcG9ydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhc3Nwb3J0RXhwaXJ5RGF0ZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6ICRzY29wZS5uYXRpb25hbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6ICRzY29wZS5lbWFpbDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhib29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG5cblxuXG4gICAgICAgIHZhciBjb21wbGV0ZTEgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUuTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICAgICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUuY291bnRyaWVzTW9iLFxuICAgICAgICAgICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICAgICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgICAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHNjb3BlLlRpdGxlTW9iLFxuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLmZpcnN0TmFtZU1vYixcbiAgICAgICAgICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZU1vYixcbiAgICAgICAgICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lTW9iLFxuICAgICAgICAgICAgICAgIHBhc3Nwb3J0TnVtYmVyOiAkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IsXG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlck1vYixcbiAgICAgICAgICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMU1vYlxuXG5cbiAgICAgICAgICAgIH07XG5cblxuXG5cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZTEgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDFNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlck1vYiA9PSBudWxsKSkge1xuICAgICAgICAgICAgLy8gICAgIGFsZXJ0KFwiUGxlYXNlIGZpbGwgaW4gZGF0YTpcIiArIFwiXFxuXCIgKyBcIlBhc3Nwb3J0IE51bWJlciBtdXN0IGJlIDggbnVtYmVyc1wiICsgXCJcXG5cIiArXG4gICAgICAgICAgICAvLyAgICAgICBcIlBob25lIE51bWJlciBtdXN0IGJlIDEwIG51bWJlcnNcIiArIFwiXFxuXCIgKyBcIkVtYWlscyBtdXN0IGJlIGluIGFAeHl6LmNvbSBmb3JtYXRcIik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICBpZiAoJHNjb3BlLmVtYWlsMU1vYiAhPSAkc2NvcGUuZW1haWx2ZXJNb2IpXG4gICAgICAgICAgICAvLyAgICAgICBhbGVydChcIlRoZSBlbnRlcmVkIGVtYWlscyBkbyBub3QgbWF0Y2hcIik7XG4gICAgICAgICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgaWYgKCgkc2NvcGUuY2hlY2tNb2IgPT0gbnVsbCkpXG4gICAgICAgICAgICAvLyAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24geW91IGVudGVyZWRcIilcbiAgICAgICAgICAgIC8vICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb21wbGV0ZTEgPSB0cnVlO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUxID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICRsb2NhdGlvbi5wYXRoKCcvdGFiL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgICAgIC8vIH1cblxuXG5cbiAgICAgICAgICAgIHZhciBmaWVsZHNNb2IgPSBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV07XG5cblxuXG5cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbMF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBFbnRlciB5b3VyIGZpcnN0IG5hbWUuXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1pZGRsZU5hbWVNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlsxXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgbWlkZGxlIG5hbWUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5sYXN0TmFtZU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBsYXN0IG5hbWUuXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBob25lTnVtYmVyTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbM10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIHBob25lIG51bWJlciwgaXQgbXVzdCBiZSAxMCBkaWdpdHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIHBhc3Nwb3J0IG51bWJlciwgaXQgbXVzdCBiZSA4IGRpZ2l0cy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzVdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCwgaXQgbXVzdCBiZSBpbiB0aGlzIGZvcm1hdCAnYUB4eXouY29tJyBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjb25maXJtIHlvdXIgZW1haWwsIGl0IG11c3QgYmUgaW4gdGhpcyBmb3JtYXQgJ2FAeHl6LmNvbScgXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMU1vYiAhPSAkc2NvcGUuZW1haWx2ZXJNb2IpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbN10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBlbnRlcmVkIGVtYWlscyBkbyBub3QgbWF0Y2hcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNoZWNrTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbOF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHlvdSd2ZSBlbnRlcmVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWxscGFzc2luZ01vYiA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzTW9iLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkc01vYltpXSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxwYXNzaW5nTW9iID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbHBhc3NpbmdNb2IgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG5cbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3RhYi9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICB9XG5cblxuXG59KTtcbiIsIi8vIEBtaXJuYVxuQXBwLmNvbnRyb2xsZXIoJ3BheW1lbnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBhcGkpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgeW91ciBwYXltZW50IG9wdGlvblwiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgICRzY29wZS5mb3JtID0ge1xuICAgICAgICBudW1iZXI6IG51bGwsXG4gICAgICAgIGN2YzogbnVsbCxcbiAgICAgICAgZXhwX21vbnRoOiBudWxsLFxuICAgICAgICBleHBfeWVhcjogbnVsbFxuICAgIH07XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgcGF5P1wiKTtcbiAgICAgICAgaWYgKHIgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAkc2NvcGUueWVhcnNCdG5UZXh0XG4gICAgICAgICAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcblxuXG5cblxuICAgICAgICAgICAgaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5pZClcbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldFN0cmlwZVRva2VuKHJlc3BvbnNlLmlkKVxuICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyhhcGkuSXNPdGhlckhvc3RzKCkpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuICAgICAgICAgICAgICAgIGlmIChib29raW5nLnJldHVyblVybCA9PSBib29raW5nLm91dGdvaW5nVXJsIHx8ICFib29raW5nLnJldHVyblVybCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5Db3N0KVxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZy5jb3N0ID0gcGFyc2VJbnQoYm9va2luZy5yZXR1cm5Db3N0KSArIHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZy5jb3N0ID0gcGFyc2VJbnQoYm9va2luZy5vdXRnb2luZ0Nvc3QpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyBib29raW5nLm91dGdvaW5nVXJsO1xuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleS8nKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleShkYXRhLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RyaXBlIFRva2VuIFwiICsgcmVzcG9uc2UuaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZy5wYXltZW50VG9rZW4gPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhib29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpLnNlYXJjaCgnYm9va2luZycsIGRhdGEuZGF0YS5yZWZOdW0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9oZXJlIHdlIHNob3VsZCBzZW5kIHR3byByZXFldXN0c1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0Z29pbmdCb29raW5nID0gYm9va2luZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHVybkJvb2tpbmcgPSBib29raW5nO1xuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0Jvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdCb29raW5nLnJldHVybkZsaWdodElkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLnJldHVybkNvc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gYm9va2luZy5yZXR1cm5GbGlnaHRJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIGJvb2tpbmcub3V0Z29pbmdVcmw7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRTdHJpcGVLZXkodXJsICsgJy9zdHJpcGUvcHVia2V5JykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdCb29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zZXRCb29raW5nKG91dGdvaW5nQm9va2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcodHJ1ZSwgdXJsKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGJvb2tpbmcucmV0dXJuVXJsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyBib29raW5nLnJldHVyblVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleScpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcocmV0dXJuQm9va2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvY29uZmlybWF0aW9uJykuc2VhcmNoKCdib29raW5nJywgZGF0YS5kYXRhLnJlZk51bSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmICghYXBpLklzT3RoZXJIb3N0cygpKVxuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZycpO1xuICAgIH1cblxuICAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXBpLmdldFBhc3NlbmdlcigpKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgICAgaWYgKGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKSB7XG5cbiAgICAgICAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLnByaWNlID0gcHJpY2U7XG4gICAgICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsICcyMDE3JywgJzIwMTgnLCAnMjAxOScsICcyMDIwJywgJzIwMjEnLCAnMjAyMicsICcyMDIzJywgJzIwMjQnXTtcbiAgICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidXJhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuTm8gPSAkc2NvcGUubW9udGhzLmluZGV4T2YodGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuIiwiLy8gQGFobWVkLWVzc21hdFxuICB2YXIgc2VhdGluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGksJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXNlYXRpbmcnO1xuICAgICRzY29wZS50aXRsZSA9IFwiV2hlcmUgd291bGQgeW91IGxpa2UgdG8gc2l0P1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9yZXR1cmluZycpO1xuICAgICAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0UmV0cnVuU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgfVxuXG5cblxuICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYXBpLmdldFBhc3NlbmdlcigpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzZWF0bWFwO1xuXG4gICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuXG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmlzRWNvbm9teVRleHQgPSBhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfVxuXG5cblxuICAgICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgICAgdmFyIHNjaGVtYSA9IFszLCA1LCAzLCAyMF07XG5cbiAgICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5zZWFyY2hDb2xvciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBpZiAoISRzY29wZS5pc0VtcHR5KHRleHQpKVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRPY3UnO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0RW1wdHknO1xuICAgICAgfVxuICAgICAgJHNjb3BlLmlzRW1wdHkgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWF0bWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChzZWF0bWFwW2ldWydudW1iZXInXSA9PSB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc2VhdG1hcFtpXVsnaXNFbXB0eSddXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICAkc2NvcGUuc2VsZWN0U2VhdCA9IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAkc2NvcGUuc2VhdCA9IHNlYXQ7XG4gICAgICB9O1xuICAgIH1cblxuXG5cbiAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgdmFyIHNjaGVtYSA9IFsyLCA0LCAyLCA5XTtcblxuICAgICRzY29wZS5hcnJheTEgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICRzY29wZS5ib2IgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkyLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMl07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgIH1cblxuXG59O1xuXG5cbmlmKFR5cGUgPT0gJ21vYmlsZScpe1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaSddO1xufWVsc2V7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ3NlYXRpbmdDdHJsJywgc2VhdGluZ0NvbnRyb2xsZXIpO1xuIl19
