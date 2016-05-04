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
                method: 'POST',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/stripe/internal/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param({
                    url: url
                })
            });
        },
        getAirports: function() {
            return $http({
                method: 'GET',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/airports',
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
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0/1",
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
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy/1",
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
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business/1",
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
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/aircrafts',
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
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/booking',
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

  }else{

  }
  $scope.flight = api.getChosenOutGoingFlight();


  $scope.passenger = api.getPassenger()[0];

  $scope.booking = $routeParams.booking;
  $scope.notOtherHosts = !api.IsOtherHosts();

  $scope.passenger = api.getPassenger()[0];


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
        return new Date(dateOut.getUTCFullYear(), dateOut.getUTCMonth(), dateOut.getUTCDate(), dateOut.getUTCHours(), dateOut.getUTCMinutes(), dateOut.getUTCSeconds());
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


        $scope.isEconomy = Boolean($routeParams.isEconomy);
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

  if (Type == "desktop") {
    $scope.isCollapsed = false;
    $scope.isOutgoingFlightSelected = false;
  } else {

    String.prototype.contains = function(it) {
      return this.indexOf(it) != -1;
    };

    $scope.miniLogoPath = function(operatorAirline) {

      if (operatorAirline === "Air Berlin")
        return "img/air-berlin-mini-logo.png"
        
      if (operatorAirline.toLowerCase().contains("swiss"))
        return "img/swiss-air-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("austrian"))
        return "img/austrian-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("hawaiian"))
        return "img/hawaiian-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("zealand"))
        return "img/air-new-zealand-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("klm"))
        return "img/klm-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("madagascar"))
        return "img/air-madagascar-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("iberia"))
        return "img/iberia-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("united"))
        return "img/united-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("delta"))
        return "img/delta-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("turkish"))
        return "img/turkish-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("france"))
        return "img/air-france-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("canada"))
        return "img/airline-canada-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("alaska"))
        return "img/alaska-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("alitalia"))
        return "img/alitalia-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("cathay"))
        return "img/cathay-pacific-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("dragon"))
        return "img/dragon-air-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("japan"))
        return "img/japan-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("malaysia"))
        return "img/malaysia-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("northwest"))
        return "img/northwest-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("south"))
        return "img/south-african-airways-logo.png"
      if (operatorAirline.toLowerCase().contains("virgin"))
        return "img/virgin-australia-mini-logo.png"

      return "img/other-airline-mini-logo.png"

    };

  }

  api.setIsOtherHosts(true);

  $scope.goNext = function() {

    api.setOutGoingFlight($scope.selectedOutgoingFlight);
    api.setReturningFlight($scope.selectedReturningFlight);
    api.setBooking($scope.selectedBooking);

    if (Type == "desktop")
      $location.path('/passenger-details');
    else
      $location.go('tab.passenger-details');

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

  $scope.origin = origin;
  $scope.destination = destination;
  $scope.exitDate = exitDate;

if($routeParams.flightClass)
  var isEconomy = $routeParams.flightClass == "Economy";
if($routeParams.isEconomy)
var isEconomy = Boolean($routeParams.isEconomy);

  // var isEconomy = true;
  $scope.roundTrip = false;

  if ($routeParams.returnDate) {
    var returnDate = new Date($routeParams.returnDate * 1000);
    $scope.returnDate = returnDate;
    $scope.roundTrip = true;
  }

  var returnDateMill;

  if (returnDate)
    returnDateMill = returnDate.getTime();

  if (isEconomy) {
    api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
      console.log(response.data);
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
  flightNewController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
  flightNewController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}


App.controller('flightsNewCtrl', flightNewController);

 var mainController = function($scope, $location, api,$translate) {
   $scope.pageClass = 'page-main';

   $scope.go = function() {
     console.log($scope.selectedOrigin);
   }
   $scope.exitDate = new Date();
   $scope.returnDate = new Date();

   api.getAirports().then(function mySucces(response) {
     $scope.airports = response.data;
   }, function myError(response) {
     console.log(response.statusText);
   });


   $scope.selectedOrigin = undefined;
   $scope.selectedDest = undefined;

   function airporsContains(iata) {
    //  if( $scope.airports)
    //  for (var i = 0; i < $scope.airports.length; i++) {
    //    if (iata == $scope.airports[i]['iata'])
    //      return true;
    //  }
     return true;
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
             exitDate: exitDate,
             isEconomy: !$scope.isBusiness
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
             returnDate: returnDate,
             isEconomy: !$scope.isBusiness

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
           exitDate: ($scope.exitDate.getTime() / 1000).toFixed(0),
           isEconomy: !$scope.isBusiness

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
             returnDate: ($scope.returnDate.getTime() / 1000).toFixed(0),
             isEconomy: !$scope.isBusiness

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
                    $location.path('/payment');

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

                $location.path('/tab/payment');
            }

        };
    }



});

// @mirna
var paymentCtrl = function($scope, $location, $http, api) {
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



            if (Type == 'desktop') {
                $scope.form.exp_year = $scope.yearsBtnText
                $scope.form.exp_month = parseInt($scope.months.indexOf($scope.monthsBtnText)) + 1

            } else {
                $scope.form.exp_year = (parseInt(new Date($scope.date).getYear())) + 2000 - 100
                $scope.form.exp_month = new Date($scope.date).getMonth()

                console.log($scope.form)
            }



            if (!api.IsOtherHosts())
                Stripe.card.createToken($scope.form, function(status, response) {
                    console.log(api.getChosenOutGoingFlight());
                    console.log(response.id)
                    api.setStripeToken(response.id)
                    api.submitBooking(api.IsOtherHosts()).then(function(data) {
                        console.log(data)
                        if (data.data.refNum)
                            if (Type == 'desktop')
                                $location.path('/confirmation').search('booking', data.data.refNum);
                            else
                                $location.go('tab.confirmation', {
                                    booking: data.data.refNum
                                })

                        else
                            alert(data.data.errorMessage)
                            // api.clearLocal();
                    }, function(err) {

                    })
                });
            else {
                var booking = api.getBooking();
                if (booking.returnUrl == booking.outgoingUrl || !booking.returnUrl) {
                    if (booking.returnCost)
                        booking.cost = parseInt(booking.returnCost) + parseInt(booking.outgoingCost);
                    else
                        booking.cost = parseInt(booking.outgoingCost);
                    var url = "http://" + booking.outgoingUrl;
                    console.log(url + '/stripe/pubkey/')
                    api.getStripeKey(url + '/stripe/pubkey/').then(function(data) {
                      console.log(data)
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            booking.paymentToken = response.id;
                            api.setBooking(booking);
                            api.submitBooking(true, url).then(function(data) {
                                console.log(data)
                                if (data.data.refNum) {
                                    Stripe.setPublishableKey('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
                                    if (Type == 'desktop')
                                        $location.path('/confirmation').search('booking', data.data.refNum);
                                    else
                                        $location.go('tab.confirmation', {
                                            booking: data.data.refNum
                                        })

                                } else
                                    alert(data.data.errorMessage)

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
                      console.log(data.data)
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            outgoingBooking.paymentToken = response.id;
                            api.setBooking(outgoingBooking);
                            api.submitBooking(true, url).then(function(data) {
                                console.log(data)
                                    // $location.path('/confirmation').search('booking', data.data.refNum);
                                if (data.data.refNum)
                                    if (booking.returnUrl) {
                                        var url = "http://" + booking.returnUrl;
                                        api.getStripeKey(url + '/stripe/pubkey').then(function(data) {
                                            Stripe.setPublishableKey(data.data)
                                            Stripe.card.createToken($scope.form, function(status, response) {

                                                returnBooking.paymentToken = response.id;
                                                api.setBooking(returnBooking);
                                                api.submitBooking(true, url).then(function(data) {
                                                    if (data.data.refNum) {
                                                        Stripe.setPublishableKey('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
                                                        if (Type == 'desktop')
                                                            $location.path('/confirmation').search('booking', data.data.refNum);
                                                        else
                                                            $location.go('tab.confirmation', {
                                                                booking: data.data.refNum
                                                            })
                                                    } else
                                                        alert(data.data.errorMessage)

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
        $location.path('/passenger-details');
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
    $scope.otherHosts = api.IsOtherHosts();
    console.log(api.getBooking().outgoingCost)
    if ($scope.otherHosts) {
        if (api.getBooking().returnCost)
            $scope.price = parseInt(api.getBooking().outgoingCost) + parseInt(api.getBooking().returnCost);
        else
            $scope.price = parseInt(api.getBooking().outgoingCost)
        console.log($scope.price)
    } else {
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
    }
}


if (Type == 'mobile') {
    paymentCtrl.$inject = ['$scope', '$state', '$http', 'api'];
} else {
    paymentCtrl.$inject = ['$scope', '$location', '$http', 'api'];
}

App.controller('paymentCtrl', paymentCtrl);

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbiA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0ID0ge307XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wYXRjaCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XG4gICAgIGRlbGV0ZSAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ107XG59KTtcblxuQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gICAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQsIHJlZk51bTtcbiAgICB2YXIgaXNPdGhlckhvc3RzOyAvLyBzZXQgdG8gZmFsc2UgaW4gZmxpZ2h0c2N0cmwgLHNldCB0byB0cnVlIGZsaWdodHNOZXdDdHJsXG4gICAgdmFyIHN0cmlwZVRva2VuO1xuICAgIHZhciBwYXNzZW5nZXJEYXRhID0gW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3RyaXBlS2V5OiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9zdHJpcGUvaW50ZXJuYWwvJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBnZXRBaXJwb3J0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvYWlycG9ydHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiLzAvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi8wLzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzRWNvOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvZWNvbm9teS8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3RoZXJGbGlnaHRzQnVzaTogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9haXJjcmFmdHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvY291bnRyaWVzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFBhc3NlbmdlcjogZnVuY3Rpb24ocGFzc2VuZ2VyKSB7XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIGlmIChpc090aGVySG9zdHMpXG4gICAgICAgICAgICAgICAgYm9va2luZ0RhdGEuUGFzc2VuZ2VyRGV0YWlscyA9IHBhc3NlbmdlckRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhYmluZXRPdXRnb2luZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhYmluZXRSZXR1cm5pbmdDbGFzcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0Qm9va2luZzogZnVuY3Rpb24oYm9va2luZykge1xuICAgICAgICAgICAgaWYgKCFpc090aGVySG9zdHMpIHtcblxuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5leGl0SXNFY29ub215KVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcuY2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcuY2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSBib29raW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBhc3NlbmdlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzc2VuZ2VyRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYm9va2luZ0RhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3Nlbk91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5PdXRnb2luZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9zZW5SZXR1cm5pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0Z29pbmdTZWF0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJldHVyblNlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJldHVyblNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0cnVuU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldElzT3RoZXJIb3N0czogZnVuY3Rpb24ob3RoZXJIb3N0cykge1xuICAgICAgICAgICAgaXNPdGhlckhvc3RzID0gb3RoZXJIb3N0cztcbiAgICAgICAgfSxcbiAgICAgICAgSXNPdGhlckhvc3RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpc090aGVySG9zdHM7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyTG9jYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0ge31cbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEgPSBbXVxuICAgICAgICAgICAgYm9va2luZ0RhdGEgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0ge31cbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHt9XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0ge31cbiAgICAgICAgICAgIGlzaXNPdGhlckhvc3RzID0gZmFsc2VcblxuICAgICAgICB9LFxuICAgICAgICBzdWJtaXRCb29raW5nOiBmdW5jdGlvbihvdGhlckhvc3RzLHVybCkge1xuICAgICAgICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgICAgIHByaWNlID0gdGhpcy5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcHJpY2UgPSB0aGlzLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyB0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgICAgICBpZiAoIW90aGVySG9zdHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9ib29raW5nJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiBvdGhlckhvc3RzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZzogYm9va2luZ0RhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogc3RyaXBlVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsICsgJy9ib29raW5nJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oYm9va2luZ0RhdGEpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmlwZVRva2VuO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTdHJpcGVUb2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgIHN0cmlwZVRva2VuID0gdG9rZW47XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCIgIEFwcC5jb25maWcoZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZW4nLCB7XG4gICAgICBNQUlOOiB7XG4gICAgICAgIEJPT0tfTk9XOiAnQm9vayBOb3cnLFxuICAgICAgICBGUk9NOiAnRnJvbScsXG4gICAgICAgIEZMWUlOR19GUk9NOiAnRmx5aW5nIGZyb20nLFxuICAgICAgICBERVBBUlRVUkVfREFURTogJ0RlcGFydHVyZSBEYXRlJyxcbiAgICAgICAgVE86ICdUbycsXG4gICAgICAgIEZMWUlOR19UTzogJ0ZseWluZyB0bycsXG4gICAgICAgIFJFRU5UUllfREFURTogJ1JlLWVudHJ5IERhdGUnLFxuICAgICAgICBVTkRFUl8yX1lFQVJTOiAnVW5kZXIgMiB5ZWFycycsXG4gICAgICAgIFJPVU5EX1RSSVA6ICdSb3VuZCBUcmlwJyxcbiAgICAgICAgT05FX1dBWTogJ09uZSBXYXknLFxuICAgICAgICBPVEhFUl9BSVJMSU5FUzogJ1NlYXJjaCBvdGhlciBhaXJsaW5lcycsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ1NlYXJjaCBmb3IgZmxpZ2h0cycsXG4gICAgICAgIFlFQVJTOiBcInllYXJzXCIsXG4gICAgICAgIENISUxEUkVOOiAnY2hpbGRyZW4nLFxuICAgICAgICBDSElMRDogJ2NoaWxkJyxcbiAgICAgICAgQURVTFQ6ICdhZHVsdCcsXG4gICAgICAgIEFEVUxUUzogJ2FkdWx0cycsXG4gICAgICAgIElORkFOVFM6ICdpbmZhbnRzJyxcbiAgICAgICAgSU5GQU5UOiAnaW5mYW50JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgUVVPVEVTX0hPTUU6IHtcbiAgICAgICAgICBPTkU6IFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICBUV086IFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLFxuICAgICAgICAgIFRIUkVFOiBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLFxuICAgICAgICAgIEZPVVI6IFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGTElHSFRTOiB7XG4gICAgICAgIFRJVExFOiAnQ2hvb3NlIGEgRmxpZ2h0JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgU0VBVFNfTEVGVDogJ3NlYXRzIGxlZnQnLFxuICAgICAgICBNT1JFX0RFVEFJTFM6ICdNb3JlIGRldGFpbHMnLFxuICAgICAgICBCT09LOiAnQm9vaycsXG4gICAgICAgIFNFTEVDVDonU2VsZWN0JyxcbiAgICAgICAgRkxJR0hUOiAnRmxpZ2h0JyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdPcGVyYXRlZCBieSdcbiAgICAgIH0sXG4gICAgICBGTElHSFQ6IHtcbiAgICAgICAgRkxJR0hUOiBcIkZsaWdodFwiLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBUSVRMRTogJ0ZsaWdodCBEZXRhaWxzJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdPcGVyYXRlZCBieScsXG4gICAgICAgIE5VTUJFUl9PRl9QQVNTRU5HRVJTOiAnTnVtYmVyIG9mIHBhc3NlbmdlcnMnLFxuICAgICAgICBGTFlJTkdfQ0FMU1M6ICdGbHlpbmcgY2xhc3MnLFxuICAgICAgICBGTElHSFRfRkFSRTogJ0ZsaWdodCBmYXJlJyxcbiAgICAgICAgRkxJR0hUX0ZBQzogJ0ZsaWdodCBmYWNpbGl0aWVzJyxcbiAgICAgICAgUEFTU0VOR0VSOiAncGFzc2VuZ2VyJyxcbiAgICAgICAgUEFTU0VOR0VSUzogJ3Bhc3NlbmdlcnMnXG4gICAgICB9LFxuICAgICAgTkFWOiB7XG4gICAgICAgIEdPX0hPTUU6J0dvIEhvbWUnLFxuICAgICAgICBTVUJNSVQ6ICdTdWJtaXQnLFxuICAgICAgICBORVhUOiAnTmV4dCcsXG4gICAgICAgIEJBQ0s6ICdCYWNrJyxcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIFNFUlZJQ0VTOiAnU2VydmljZXMnLFxuICAgICAgICBPVVJfVEVBTTogJ091ciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICdBYm91dCcsXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJyxcbiAgICAgICAgQ0hPT1NFX0xBTkdVQUdFOidDaG9vc2UgbGFuZ3VhZ2UnLFxuICAgICAgICBFTkdMSVNIOiAnRW5nbGlzaCcsXG4gICAgICAgIEdFUk1BTjonR2VybWFuJ1xuICAgICAgfSxcblxuICAgICAgQ09ORklSTUFUSU9OOiB7XG4gICAgICAgIFRIQU5LX1lPVTogJ1RoYW5rIHlvdScsXG4gICAgICAgIE5BTUU6ICdOYW1lJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBGTElHSFROTzogJ0ZsaWdodCBudW1iZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdEZXBhcnR1cmUnLFxuICAgICAgICBBUlJBSVZBTDogJ0Fycml2YWwnLFxuICAgICAgICBQUklOVDogJ1ByaW50IHRpY2tldCdcbiAgICAgIH0sXG4gICAgICBDT05UQUNUX1VTOiB7XG5cbiAgICAgICAgQ09OVEFDVF9VUzogJ0NvbnRhY3QgVXMnLFxuICAgICAgICBQSE9ORTogJ1Bob25lJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCcsXG4gICAgICAgIExFQVZFX01TRzogJ0xlYXZlIHVzIGEgbWVzc2FnZScsXG4gICAgICAgIFNFTkQ6ICdTZW5kJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnRG8geW91IG1lYW4gNDA0Tm90Rm91bmQgVGVhbT8nXG5cbiAgICAgIH0sXG5cbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICdBYm91dCBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnSGlzdG9yeScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ1RoZSBmaXJzdCBhaXJiZXJsaW4gcGxhbmUgdG9vayBvZmYgb24gMjh0aCBBcHJpbCAxOTc5LiBFeHBlcmllbmNlIHRoZSBoaWdobGlnaHRzIGFuZCBtaWxlc3RvbmVzIGluIGFpcmJlcmxpbnMgaGlzdG9yeSAnLFxuICAgICAgICBPVVJfR09BTDogJ091ciBnb2FsJyxcbiAgICAgICAgT1VSX0dPQUxfUEFSQTogJ0ZpcnN0IEV1cm9wZSwgYW5kIHRoZW4gdGhlIGdsb2JlLCB3aWxsIGJlIGxpbmtlZCBieSBmbGlnaHQsIGFuZCBuYXRpb25zIHNvIGtuaXQgdG9nZXRoZXIgdGhhdCB0aGV5IHdpbGwgZ3JvdyB0byBiZSBuZXh0LWRvb3IgbmVpZ2hib3Jz4oCmIC4gV2hhdCByYWlsd2F5cyBoYXZlIGRvbmUgZm9yIG5hdGlvbnMsIGFpcndheXMgd2lsbCBkbyBmb3IgdGhlIHdvcmxkLicsXG4gICAgICAgIEFfUDogJ0FsbGlhbmNlL3BhcnRuZXJzJyxcbiAgICAgICAgQV9QX1BBUkE6ICdhaXJiZXJsaW4gZ3VhcmFudGVlcyBhIGRlbnNlIGNvbm5lY3Rpb24gbmV0d29yayBhbmQgY29uc3RhbnQgZ3Jvd3RoIHRoYW5rcyB0byB0aGUgY28tb3BlcmF0aW9uIHdpdGggb3RoZXIgYWlybGluZXMuYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLidcbiAgICAgIH0sXG5cbiAgICAgIE9GRkVSUzoge1xuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZWNpYWwgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSUzogJ0ZsaWdodCBPZmZlcnMnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTX1BBUkE6ICdGaW5kIHRoZSBtb3N0IGF0dHJhY3RpdmUgZmFyZSBmb3IgeW91ciBmbGlnaHQnLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LOiAnTGlrZSB1cyBvbiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ0RvbnQgbWlzcyBvdXIgc3BlY2lhbCBvZmZlcnMgb246IHdpdGggb3VyIG5ld3NsZXR0ZXIgYW5kIG9uIEZhY2Vib29rJyxcbiAgICAgICAgSE9URUw6ICdIb3RlbCcsXG4gICAgICAgIEhPVEVMX1BBUkE6ICdTcGVjaWFsIG9mZmVycyBmb3IgeW91ciBob3RlbCBzdGF5IGF3YXkgZnJvbSBvdXIgcGFydG5lcnMgLidcbiAgICAgIH0sXG5cblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG4gICAgICAgIEZJUlNUX05BTUU6ICdGaXJzdCBOYW1lJyxcbiAgICAgICAgTUlERExFX05BTUU6ICdNaWRkbGUgTmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ0xhc3QgTmFtZScsXG4gICAgICAgIFBBU1NfTk86ICdQYXNzcG9ydCBOdW1iZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnUGxhY2UgT2YgQmlydGgnLFxuICAgICAgICBQSE9ORV9OTzogJ1Bob25lIE51bWJlcicsXG4gICAgICAgIEVfTUFJTDogJ0VtYWlsJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ1JlcGVhdCBFbWFpbCcsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHByb3ZpZGVkIG1hdGNoZXMgdGhlIHBhc3Nwb3J0IGluZm9ybWF0aW9uLidcblxuICAgICAgfSxcbiAgICAgIFBBWU1FTlQ6IHtcblxuICAgICAgICBXRV9BQ0NFUFQ6ICdXZSBhY2NlcHQnLFxuICAgICAgICBDQVJEX0lORk86ICdDYXJkIGluZm9ybWF0aW9uOicsXG4gICAgICAgIEVYUF9EQVRFOiAnRXhwaXJlIERhdGU6JyxcbiAgICAgICAgQ09TVDogJ1lvdXIgYm9va2luZyB0b3RhbCBjb3N0J1xuXG4gICAgICB9LFxuXG4gICAgICBTRUFUSU5HOiB7XG5cbiAgICAgICAgU0VBVF9NQVA6ICdTZWF0bWFwJyxcbiAgICAgICAgU0VMRUNURUQ6ICdZb3Ugc2VsZWN0ZWQgc2VhdCdcblxuICAgICAgfSxcblxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ0luZmxpZ2h0IFNlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIHByZXNlbnRzIHRoZSBlY29ub215IGFuZCBidXNpbmVzcyBjbGFzcy4nLFxuICAgICAgICBHX01FQUxTOiAnR291cm1ldCBNZWFscycsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0FpcmJlcmxpbiBpcyB0aGUgcmlnaHQgYWlybGluZSBmb3IgY29ubm9pc3NldXJzOiB0cmVhdCB5b3Vyc2VsZiB0byBvbmUgb2YgdGhlIGRlbGljaW91cyBnb3VybWV0IG1lYWxzIGZyb20gXCJTYW5zaWJhclwiIG9uIGJvYXJkJyxcbiAgICAgICAgQkFHR0FHRTogJ0JhZ2dhZ2UnLFxuICAgICAgICBCQUdHQUdFX1BBUkE6ICdFdmVyeXRoaW5nIHlvdSBuZWVkIHRvIGtub3cgYWJvdXQgZnJlZSBiYWdnYWdlIGFsbG93YW5jZXMsIGNhYmluIGJhZ2dhZ2UgcmVndWxhdGlvbnMgYW5kIHNwZWNpYWwgYmFnZ2FnZS4nXG5cbiAgICAgIH0sXG5cbiAgICB9KTtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcbiAgICAgIE1BSU46IHtcbiAgICAgICAgQk9PS19OT1c6ICdKZXR6dCBidWNoZW4nLFxuICAgICAgICBGUk9NOiAndm9uJyxcbiAgICAgICAgRkxZSU5HX0ZST006ICdBYmZsdWdoYWZlbicsXG4gICAgICAgIERFUEFSVFVSRV9EQVRFOiAnSGluZmx1ZycsXG4gICAgICAgIFRPOiAnbmFjaCcsXG4gICAgICAgIEZMWUlOR19UTzogJ1ppZWxmbHVnaGFmZW4nLFxuICAgICAgICBSRUVOVFJZX0RBVEU6ICdSw7xja2ZsdWcnLFxuICAgICAgICBVTkRFUl8yX1lFQVJTOiAnSsO8bmdlciBhbHMgMiBKYWhyZW4nLFxuICAgICAgICBST1VORF9UUklQOiAnSGluLS9Sw7xja2ZhaHJ0JyxcbiAgICAgICAgT05FX1dBWTogJ051ciBIaW5mbHVnJyxcbiAgICAgICAgT1RIRVJfQUlSTElORVM6ICdBbmRlcmUgRmx1Z2dlc2VsbHNjaGFmdGVuJyxcbiAgICAgICAgU0VBUkNIX0ZPUl9GTElHSFRTOiAnRmzDvGdlIHN1Y2hlbicsXG4gICAgICAgIFlFQVJTOiBcIkphaHJlXCIsXG4gICAgICAgIENISUxEUkVOOiAnS2luZGVyJyxcbiAgICAgICAgQ0hJTEQ6ICdLaW5kJyxcbiAgICAgICAgQURVTFQ6ICdFcndhY2hzZW5lcicsXG4gICAgICAgIEFEVUxUUzogJ0Vyd2FjaHNlbmVuJyxcbiAgICAgICAgSU5GQU5UUzogJ0JhYnlzJyxcbiAgICAgICAgSU5GQU5UOiAnQmFieScsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFFVT1RFU19IT01FOiB7XG4gICAgICAgICAgT05FOiBcIkVpbmZhY2gsIGJlcXVlbSwgc29mb3J0aWdlIEJlc3TDpHRpZ3VuZy5cIixcbiAgICAgICAgICBUV086IFwiWmllbGVuIGF1ZiBkZXIgV2VsdC5cIixcbiAgICAgICAgICBUSFJFRTogXCJBdXRoZW50aXNjaGUgR2FzdGZyZXVuZHNjaGFmdCBlcmxlYmVuLlwiLFxuICAgICAgICAgIEZPVVI6IFwiVmVyd3Vuc2NoZW5lIFplaXQgbWl0IHVucy5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRkxJR0hUUzoge1xuICAgICAgICBUSVRMRTogJ0VpbmVuIEZsdWcgYXVzc3VjaGVuJyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgU0VBVFNfTEVGVDogJ2ZyZWllIFNpdHpwbMOkdHplJyxcbiAgICAgICAgTU9SRV9ERVRBSUxTOiAnTWVociBEZXRhaWxzJyxcbiAgICAgICAgQk9PSzogJ2J1Y2hlbicsXG4gICAgICAgIFNFTEVDVDonV8OkaGxlbicsXG4gICAgICAgIEZMSUdIVDogJ0ZsdWcnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ2JldHJpZWJlbiB2b24nXG4gICAgICB9LFxuICAgICAgRkxJR0hUOiB7XG4gICAgICAgIEZMSUdIVDogXCJGbHVnXCIsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFRJVExFOiAnRGV0YWlscyBkZXMgRmx1Z3MnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ2JldHJpZWJlbiB2b24nLFxuICAgICAgICBOVU1CRVJfT0ZfUEFTU0VOR0VSUzogJ0FuemFobCBkZXIgUGFzc2FnaWVyZScsXG4gICAgICAgIEZMWUlOR19DQUxTUzogJ0JlZsO2cmRlcnVuZ3NrbGFzc2VuJyxcbiAgICAgICAgRkxJR0hUX0ZBUkU6ICdGbHVncHJlaXMnLFxuICAgICAgICBGTElHSFRfRkFDOiAnRGllbnN0bGVpc3R1bmdlbiBkZXMgRmx1Z3MnLFxuICAgICAgICBQQVNTRU5HRVI6ICdQYXNzYWdpZXInLFxuICAgICAgICBQQVNTRU5HRVJTOiAnUGFzc2FnaWVyZSdcbiAgICAgIH0sXG4gICAgICBOQVY6IHtcbiAgICAgICAgR09fSE9NRTonaGVpbWdlaGVuJyxcbiAgICAgICAgU1VCTUlUOiAnZWlucmVpY2hlbicsXG4gICAgICAgIE5FWFQ6ICd3ZWl0ZXInLFxuICAgICAgICBCQUNLOiAnenVyw7xjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlemllbGxlIEFuZ2Vib3RlJyxcbiAgICAgICAgU0VSVklDRVM6ICdEaWVuc3RsZWlzdHVuZ2VuJyxcbiAgICAgICAgT1VSX1RFQU06ICdVbnNlciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICfDnGJlciB1bnMnLFxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCcsXG4gICAgICAgIENIT09TRV9MQU5HVUFHRTonV8OkaGxlIGVpbmUgU3ByYWNoZScsXG4gICAgICAgIEVOR0xJU0g6ICdFbmdsaXNjaCcsXG4gICAgICAgIEdFUk1BTjonRGV1dHNjaCdcbiAgICAgIH0sXG4gICAgICBDT05GSVJNQVRJT046IHtcblxuICAgICAgICBUSEFOS19ZT1U6ICdEYW5rZSBzY2jDtm4nLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIEZMSUdIVE5POiAnRmx1ZyBOdW1tZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdBYmZhaHJ0JyxcbiAgICAgICAgQVJSQUlWQUw6ICdBbmt1bmZ0JyxcbiAgICAgICAgUFJJTlQ6ICdGbHVna2FydGUgYWJkcnVja2VuJ1xuICAgICAgfSxcbiAgICAgIENPTlRBQ1RfVVM6IHtcblxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCcsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIExFQVZFX01TRzogJ0lociBBbmxpZWdlbicsXG4gICAgICAgIFNFTkQ6ICdhYnNjaGlja2VuJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnTWVpbnRlbiBTaWUgZGllIEdydXBwZSB2b24gNDA0Tm90Rm91bmQgPydcblxuICAgICAgfSxcbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICfDnGJlciBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnR2VzY2hpY2h0ZScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ0FtIDI4LiBBcHJpbCAxOTc5IHN0YXJ0ZXQgZWluZSBCb2VpbmcgNzA3IHZvbiBCZXJsaW4tVGVnZWwgbmFjaCBQYWxtYSBkZSBNYWxsb3JjYS4gRGVyIEVyc3RmbHVnIGlzdCBkZXIgQW5mYW5nIGRlciBFcmZvbGdzZ2VzY2hpY2h0ZSB2b24gYWlyYmVybGluLiAnLFxuICAgICAgICBPVVJfR09BTDogJ1Vuc2VyIFppZWwnLFxuICAgICAgICBPVVJfR09BTF9QQVJBOiAnWnVlcnQgRXVyb3BhLCB6dW7DpGNoc3QgZGllIGdhbnplIFdlbHQsIHdlcmRlbiBkdXJjaCBkZW4gRmx1ZyB6dXNhbW1lbiB2ZXJidW5kZW4sIHVuZCBOYXRpb25lbiBlbmcgenVzYW1tZW4gZGFtaXQgc2llIE5hY2hiYXJuIGF1ZndhY2hzZW7igKYgLiBXYXMgZGllIEVpc2JhaG5lbiBmw7xyIGRpZSBOYXRpb25lbiBnZXRhbiBoYXQsIHdpcmQgZGllIEZsw7xnZSBmw7xyIGRhcyBnYW56ZSBXZWx0IHR1bi4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGVyd2VpdGVydCBpaHIgaW50ZXJuYXRpb25hbGVzIFN0cmVja2VubmV0eiwgaW5kZW0gc2llIG1pdCBtZWhyZXJlbiBBaXJsaW5lcyBhbHMgQ29kZXNoYXJlLVBhcnRuZXJuIGtvb3BlcmllcnQuJ1xuXG5cbiAgICAgIH0sXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGV6aWVsbGUgQW5nZWJvdGUnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTOiAnRmx1Z2FuZ2Vib3RlJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZGVuIFNpZSBkaWUgYXR0cmFrdGl2c3RlbiBUYXJpZmUgZsO8ciBJaHJlbiBGbHVnJyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0ZvbGdlbiBTaWUgdW5zIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ1Zlcm1pc3NlbiBTaWUgbmljaHQgdW5zZXJlIHNwZXppZWxsZSBBbmdlYm90ZTogbWl0IHVuc2VyIG5ld3NsZXR0ZXIgdW5kIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU29uZGVyYW5nZWJvdGUgZsO8ciBJaHIgSG90ZWwgd2VnIHZvbiB1bnNlcmUgUGFydG5lcm4gLidcblxuICAgICAgfSxcblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG5cbiAgICAgICAgRklSU1RfTkFNRTogJ1Zvcm5hbWUnLFxuICAgICAgICBNSURETEVfTkFNRTogJ1p3ZWl0bmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ05hY2huYW1lJyxcbiAgICAgICAgUEFTU19OTzogJ1JlaXNlcGFzcyBOdW1tZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnT3J0IGRlcyBHZWJ1cnRzJyxcbiAgICAgICAgUEhPTkVfTk86ICdUZWxlZm9uIE51bW1lcicsXG4gICAgICAgIEVfTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ0UtbWFpbCB3aWVkZXJob2xlbicsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSGllcm1pdCwgYmVzdMOkdGlnZSBpY2gsIGRhc3MgZGllIEluZm9ybWF0aW9uZW4sIGRpZSB2b3JoaW4gZ2VnZWJlbiBzaW5kLCBtZWluZSBQYXNzZGF0ZW4gZW50c3ByaWNoZW4uJ1xuXG4gICAgICB9LFxuICAgICAgUEFZTUVOVDoge1xuXG4gICAgICAgIFdFX0FDQ0VQVDogJ1phaGx1bmdzbWV0aG9kZW4nLFxuICAgICAgICBDQVJEX0lORk86ICdLcmVkaXRrYXJ0ZSBpbmZvcm1hdGlvbmVuOicsXG4gICAgICAgIEVYUF9EQVRFOiAnQWJsYXVmZGF0dW0gSWhyZXIgS2FydGU6JyxcbiAgICAgICAgQ09TVDogJ0dlc2FtdHByZWlzJ1xuXG4gICAgICB9LFxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2l0enBsYXR6cmVzZXJ2aWVydW5nJyxcbiAgICAgICAgU0VMRUNURUQ6ICdTaWUgaGFiZW4gZWluZW4gU2l0enBsYXR6IHJlc2VydmllcnQuJ1xuXG4gICAgICB9LFxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ1NlcnZpY2VzIGFuIGJvYXJkJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIGhlacOfZW4gU2llIGhlcnpsaWNoIHdpbGxrb21tZW4gYW4gQm9yZDogZWNvbm9teSB1bmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXRlc3NlbicsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0ZyZXVlbiBTaWUgc2ljaCBhdWYgQWlyYmVybGlucyBhIGxhIGNhcnRlLVNwZWlzZSA6IFdpciBzZXJ2aWVyZW4gSWhuZW4gdW5zZXJlIHdhcm1lbiBPbi1Ub3AtU3BlaXNlbiwgZGllIGV4dHJhIHZvbSBTYW5zaWJhci1XaXJ0IEhlcmJlcnQgU2Vja2xlciBrcmVpZXJ0IHd1cmRlbi4nLFxuICAgICAgICBCQUdHQUdFOiAnUmVpc2VnZXDDpGNrJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnVW5zZXJlIFJlZ2x1bmdlbiDDvGJlciBBdWZ6dWdlYmVuZGVzIEdlcMOkY2ttZW5nZW4sIMO8YmVyIEhhbmRnZXDDpGNrIHVuZCBTb25kZXJnZXDDpGNrLidcblxuICAgICAgfSxcblxuICAgIH0pO1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdkZScpO1xuICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZScpO1xuXG4gIH0pO1xuIiwiLy8gQGFiZGVscmhtYW4tZXNzYW1cbnZhciBjb25maXJtYXRpb25Db250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1jb25maXJtYXRpb24nO1xuICAkc2NvcGUudGl0bGUgPSBcIkNvbmZpcm1hdGlvblwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJHbyBIb21lXCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXBpLnN1Ym1pdEJvb2tpbmcoJ2ZhbHNlJykudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAvLyAgIGFsZXJ0KGRhdGEuZGF0YSlcbiAgICAgIC8vICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vXG4gICAgICAvLyB9KVxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgfVxuXG4gICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUuZ29Tb2NpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3NvY2lhbCcpO1xuXG4gICAgfVxuXG4gICAgJCgnI3F1b3Rlcy10ZXh0JykudHlwZUl0KHtcbiAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgJ1wiVHJhdmVsIGFuZCBjaGFuZ2Ugb2YgcGxhY2UgaW1wYXJ0IG5ldyB2aWdvciB0byB0aGUgbWluZC5cIi1TZW5lY2EnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyB0ZW5kcyB0byBtYWduaWZ5IGFsbCBodW1hbiBlbW90aW9ucy7igJ0g4oCUIFBldGVyIEhvZWcnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyDigJMgaXQgbGVhdmVzIHlvdSBzcGVlY2hsZXNzLCB0aGVuIHR1cm5zIHlvdSBpbnRvIGEgc3Rvcnl0ZWxsZXIu4oCdIC0gSWJuIEJhdHR1dGEnLFxuICAgICAgICAnIOKAnFdlIHRyYXZlbCwgc29tZSBvZiB1cyBmb3JldmVyLCB0byBzZWVrIG90aGVyIHBsYWNlcywgb3RoZXIgbGl2ZXMsIG90aGVyIHNvdWxzLuKAnSDigJMgQW5haXMgTmluJ1xuICAgICAgXSxcbiAgICAgIHNwZWVkOiA4MCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG4gIH1lbHNle1xuXG4gIH1cbiAgJHNjb3BlLmZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuXG5cbiAgJHNjb3BlLnBhc3NlbmdlciA9IGFwaS5nZXRQYXNzZW5nZXIoKVswXTtcblxuICAkc2NvcGUuYm9va2luZyA9ICRyb3V0ZVBhcmFtcy5ib29raW5nO1xuICAkc2NvcGUubm90T3RoZXJIb3N0cyA9ICFhcGkuSXNPdGhlckhvc3RzKCk7XG5cbiAgJHNjb3BlLnBhc3NlbmdlciA9IGFwaS5nZXRQYXNzZW5nZXIoKVswXTtcblxuXG59XG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBjb25maXJtYXRpb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnYXBpJywgJyRzdGF0ZVBhcmFtcyddO1xufSBlbHNlIHtcbiAgY29uZmlybWF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsICckcm91dGVQYXJhbXMnXTtcbn1cblxuQXBwLmNvbnRyb2xsZXIoJ2NvbmZpcm1hdGlvbkN0cmwnLCBjb25maXJtYXRpb25Db250cm9sbGVyKTtcbiIsIi8vIEBOYWJpbGFcbkFwcC5jb250cm9sbGVyKCdmbGlnaHREZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodCc7XG4gICRzY29wZS50aXRsZSA9IFwiRmxpZ2h0KHMpIERldGFpbHNcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgIH1cblxuICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICB2YXIgb3V0Z29pbmdGbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcbiAgdmFyIHJldHVybkZsaWdodCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKTtcblxuICB2YXIgYm9va2luZyA9IGFwaS5nZXRCb29raW5nKCk7XG5cbiAgdmFyIGZhY2lsaXRpZXMgPSBbXCJTbW9raW5nIGFyZWFzIGF2YWlsYWJsZVwiLCBcIldpLUZpIGF2YWlsYWJpbGl0eVwiLFxuICAgIFwiNCBjdWx0dXJhbCBjdWlzaW5lc1wiLCBcIkluZmxpZ2h0IGVudGVydGFpbm1lbnRcIiwgXCJFeHRyYSBjb3p5IHNsZWVwZXJldHRlXCIsXG4gICAgXCJTY3JlZW5zIHRvIHNob3cgeW91ciBmbGlnaHQgcGF0dGVybiwgYWlyY3JhZnQgYWx0aXR1ZGUgYW5kIHNwZWVkXCJcbiAgXTtcbmlmIChvdXRnb2luZ0ZsaWdodCl7XG4gIHZhciBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgb3V0Z29pbmdGbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDKTtcbiAgb3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG5cblxuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICAgIHJldHVybkZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuICB9XG4gIHZhciBhaXJjcmFmdHMgPSBbXTtcbiAgdmFyIG91dEFpcmNyYWZ0aGFzU21va2luZztcbiAgdmFyIG91dEFpcmNyYWZ0aGFzV2lmaTtcbiAgdmFyIHJlQWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgcmVBaXJjcmFmdGhhc1dpZmkgO1xuICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJjcmFmdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gb3V0Z29pbmdGbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgJHNjb3BlLm91dEFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gcmV0dXJuRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgICAkc2NvcGUucmVBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG5cbiAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgdmFyIGFpcnBvcnRzID0gW107XG4gIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcbiAgdmFyIG91dGJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgdmFyIG91dGZhcmUgPSAwO1xuXG4gIGlmIChib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5lY29ub215RmFyZTtcbiAgfSBlbHNlIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuYnVzaW5lc3NGYXJlO1xuICB9XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gICAgdmFyIHJlZmFyZSA9IDA7XG4gICAgaWYgKGJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmVjb25vbXlGYXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICBpZiAob3V0QWlyY3JhZnRoYXNTbW9raW5nKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzV2lmaSlcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG5cbiAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzRdKTtcbiAgfVxuIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1dpZmkpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG5cbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzRdKTtcbiAgICB9XG4gICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG5cbiAgICAkc2NvcGUucmV0dXJuRmxpZ2h0ID0gcmV0dXJuRmxpZ2h0O1xuICAgICRzY29wZS5yZWJ1c2luZXNzT3JFY29uID0gcmVidXNpbmVzc09yRWNvbjtcbiAgICAkc2NvcGUucmVmYXJlID0gcmVmYXJlO1xuICAgICRzY29wZS5yZWZhY2lsaXRpZXNSZXN1bHQgPSByZWZhY2lsaXRpZXNSZXN1bHQ7XG4gIH1cbiAgJHNjb3BlLm91dGdvaW5nRmxpZ2h0ID0gb3V0Z29pbmdGbGlnaHQ7XG4gICRzY29wZS5vdXRidXNpbmVzc09yRWNvbiA9IG91dGJ1c2luZXNzT3JFY29uO1xuICAkc2NvcGUub3V0ZmFyZSA9IG91dGZhcmU7XG4gICRzY29wZS5vdXRmYWNpbGl0aWVzUmVzdWx0ID0gb3V0ZmFjaWxpdGllc1Jlc3VsdDtcblxufVxufSk7XG4iLCIvLyBAYWJkZWxyYWhtYW4tbWFnZWRcbnZhciBmbGlnaHRDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwgJHJvdXRlUGFyYW1zKSB7XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGFwaS5zZXRJc090aGVySG9zdHMoZmFsc2UpO1xuXG4gICAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICAgIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gICAgJHNjb3BlLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAkc2NvcGUuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAkc2NvcGUuZXhpdERhdGUgPSBleGl0RGF0ZTtcblxuICAgICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICAgIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAgICRzY29wZS5yZXR1cm5EYXRlID0gcmV0dXJuRGF0ZTtcbiAgICAgICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgICAgXCJyZWZQYXNzZW5nZXJJRFwiOiBbXSxcbiAgICAgICAgXCJpc3N1ZURhdGVcIjogbnVsbCxcbiAgICAgICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICAgICAgXCJyZWZFeGl0RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgICAgXCJyZWNlaXB0TnVtYmVyXCI6IG51bGxcbiAgICB9O1xuXG4gICAgdmFyIGZsaWdodHM7XG4gICAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gICAgaWYgKHJldHVybkRhdGUpXG4gICAgICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuZXhpdElzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgICAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHZhciBkYXRlT3V0ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlT3V0LmdldFVUQ0Z1bGxZZWFyKCksIGRhdGVPdXQuZ2V0VVRDTW9udGgoKSwgZGF0ZU91dC5nZXRVVENEYXRlKCksIGRhdGVPdXQuZ2V0VVRDSG91cnMoKSwgZGF0ZU91dC5nZXRVVENNaW51dGVzKCksIGRhdGVPdXQuZ2V0VVRDU2Vjb25kcygpKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcblxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHRJRCA9ICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0Ll9pZDtcblxuICAgICAgICBpZiAoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KVxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQuX2lkO1xuXG4gICAgICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuXG4gICAgICAgIGlmIChUeXBlID09IFwiZGVza3RvcFwiKVxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHQtZGV0YWlscycpO1xuXG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIGlmICghb3JpZ2luIHx8ICFkZXN0aW5hdGlvbiB8fCAhZXhpdERhdGUpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY2hlY2tOZXh0QnRuU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgJiYgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIGZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgICAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5mbGlnaHRzID0gZmxpZ2h0cztcblxuICAgICAgICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJwb3J0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXBpLmdldEFpcmNyYWZ0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuXG4gICAgICAgICRzY29wZS5pc0Vjb25vbXkgPSBCb29sZWFuKCRyb3V0ZVBhcmFtcy5pc0Vjb25vbXkpO1xuICAgICAgICBhcGkuZ2V0RmxpZ2h0cyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm1pbmlMb2dvUGF0aCA9IGZ1bmN0aW9uKG9wZXJhdG9yQWlybGluZSkge1xuICAgICAgICAgICAgaWYgKG9wZXJhdG9yQWlybGluZSA9PT0gXCJBaXIgQmVybGluXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1iZXJsaW4tbWluaS1sb2dvLnBuZ1wiXG4gICAgICAgICAgICByZXR1cm4gXCJpbWcvb3RoZXItYWlybGluZS1taW5pLWxvZ28ucG5nXCJcbiAgICAgICAgfTtcblxuICAgIH1cblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICAgIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICdhcGknLCAnJHN0YXRlUGFyYW1zJ107XG59IGVsc2Uge1xuICAgIGZsaWdodENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzQ3RybCcsIGZsaWdodENvbnRyb2xsZXIpO1xuIiwidmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCAkcm91dGVQYXJhbXMpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZiAoVHlwZSA9PSBcImRlc2t0b3BcIikge1xuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcbiAgfSBlbHNlIHtcblxuICAgIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihpdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihpdCkgIT0gLTE7XG4gICAgfTtcblxuICAgICRzY29wZS5taW5pTG9nb1BhdGggPSBmdW5jdGlvbihvcGVyYXRvckFpcmxpbmUpIHtcblxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZSA9PT0gXCJBaXIgQmVybGluXCIpXG4gICAgICAgIHJldHVybiBcImltZy9haXItYmVybGluLW1pbmktbG9nby5wbmdcIlxuICAgICAgICBcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcInN3aXNzXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvc3dpc3MtYWlyLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiYXVzdHJpYW5cIikpXG4gICAgICAgIHJldHVybiBcImltZy9hdXN0cmlhbi1haXJsaW5lcy1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcImhhd2FpaWFuXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvaGF3YWlpYW4tYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJ6ZWFsYW5kXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLW5ldy16ZWFsYW5kLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwia2xtXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcva2xtLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwibWFkYWdhc2NhclwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1tYWRhZ2FzY2FyLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiaWJlcmlhXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvaWJlcmlhLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwidW5pdGVkXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvdW5pdGVkLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiZGVsdGFcIikpXG4gICAgICAgIHJldHVybiBcImltZy9kZWx0YS1haXJsaW5lcy1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcInR1cmtpc2hcIikpXG4gICAgICAgIHJldHVybiBcImltZy90dXJraXNoLWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiZnJhbmNlXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLWZyYW5jZS1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcImNhbmFkYVwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2FpcmxpbmUtY2FuYWRhLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiYWxhc2thXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWxhc2thLWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiYWxpdGFsaWFcIikpXG4gICAgICAgIHJldHVybiBcImltZy9hbGl0YWxpYS1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcImNhdGhheVwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2NhdGhheS1wYWNpZmljLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiZHJhZ29uXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvZHJhZ29uLWFpci1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcImphcGFuXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvamFwYW4tYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJtYWxheXNpYVwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL21hbGF5c2lhLWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwibm9ydGh3ZXN0XCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvbm9ydGh3ZXN0LWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwic291dGhcIikpXG4gICAgICAgIHJldHVybiBcImltZy9zb3V0aC1hZnJpY2FuLWFpcndheXMtbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwidmlyZ2luXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvdmlyZ2luLWF1c3RyYWxpYS1taW5pLWxvZ28ucG5nXCJcblxuICAgICAgcmV0dXJuIFwiaW1nL290aGVyLWFpcmxpbmUtbWluaS1sb2dvLnBuZ1wiXG5cbiAgICB9O1xuXG4gIH1cblxuICBhcGkuc2V0SXNPdGhlckhvc3RzKHRydWUpO1xuXG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuXG4gICAgaWYgKFR5cGUgPT0gXCJkZXNrdG9wXCIpXG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgZWxzZVxuICAgICAgJGxvY2F0aW9uLmdvKCd0YWIucGFzc2VuZ2VyLWRldGFpbHMnKTtcblxuICB9XG5cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gIH1cblxuICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nID0ge1xuICAgIFwicGFzc2VuZ2VyRGV0YWlsc1wiOiBbe1xuICAgICAgXCJmaXJzdE5hbWVcIjogbnVsbCxcbiAgICAgIFwibGFzdE5hbWVcIjogbnVsbCxcbiAgICAgIFwicGFzc3BvcnROdW1cIjogbnVsbCxcbiAgICAgIFwicGFzc3BvcnRFeHBpcnlEYXRlXCI6IG51bGwsXG4gICAgICBcImRhdGVPZkJpcnRoXCI6IG51bGwsXG4gICAgICBcIm5hdGlvbmFsaXR5XCI6IG51bGwsXG4gICAgICBcImVtYWlsXCI6IG51bGwsXG4gICAgfV0sXG4gICAgXCJjbGFzc1wiOiBudWxsLFxuICAgIFwib3V0Z29pbmdGbGlnaHRJZFwiOiBudWxsLFxuICAgIFwicmV0dXJuRmxpZ2h0SWRcIjogbnVsbCxcbiAgICBcInBheW1lbnRUb2tlblwiOiBudWxsXG4gIH1cblxuICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcblxuICAkc2NvcGUub3JpZ2luID0gb3JpZ2luO1xuICAkc2NvcGUuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgJHNjb3BlLmV4aXREYXRlID0gZXhpdERhdGU7XG5cbmlmKCRyb3V0ZVBhcmFtcy5mbGlnaHRDbGFzcylcbiAgdmFyIGlzRWNvbm9teSA9ICRyb3V0ZVBhcmFtcy5mbGlnaHRDbGFzcyA9PSBcIkVjb25vbXlcIjtcbmlmKCRyb3V0ZVBhcmFtcy5pc0Vjb25vbXkpXG52YXIgaXNFY29ub215ID0gQm9vbGVhbigkcm91dGVQYXJhbXMuaXNFY29ub215KTtcblxuICAvLyB2YXIgaXNFY29ub215ID0gdHJ1ZTtcbiAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAkc2NvcGUucmV0dXJuRGF0ZSA9IHJldHVybkRhdGU7XG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gIH1cblxuICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgaWYgKHJldHVybkRhdGUpXG4gICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICBpZiAoaXNFY29ub215KSB7XG4gICAgYXBpLmdldE90aGVyRmxpZ2h0c0VjbyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXBpLmdldE90aGVyRmxpZ2h0c0J1c2kob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuY2xhc3MgPSBpc0Vjb25vbXkgPT09IHRydWUgPyBcImVjb25vbXlcIiA6IFwiYnVzaW5lc3NcIjtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nRmxpZ2h0SWQgPSBmbGlnaHQuZmxpZ2h0SWQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ1VybCA9IGZsaWdodC51cmw7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0Nvc3QgPSBmbGlnaHQuY29zdDtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuRmxpZ2h0SWQgPSBmbGlnaHQuZmxpZ2h0SWQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5VcmwgPSBmbGlnaHQudXJsO1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuQ29zdCA9IGZsaWdodC5jb3N0O1xuICB9XG5cbiAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuXG4gIH1cblxufVxuXG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICdhcGknLCAnJHN0YXRlUGFyYW1zJ107XG59IGVsc2Uge1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywgJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzTmV3Q3RybCcsIGZsaWdodE5ld0NvbnRyb2xsZXIpO1xuIiwiIHZhciBtYWluQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksJHRyYW5zbGF0ZSkge1xuICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG4gICAkc2NvcGUuZ28gPSBmdW5jdGlvbigpIHtcbiAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlbGVjdGVkT3JpZ2luKTtcbiAgIH1cbiAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAkc2NvcGUucmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgJHNjb3BlLmFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICB9KTtcblxuXG4gICAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gPSB1bmRlZmluZWQ7XG4gICAkc2NvcGUuc2VsZWN0ZWREZXN0ID0gdW5kZWZpbmVkO1xuXG4gICBmdW5jdGlvbiBhaXJwb3JzQ29udGFpbnMoaWF0YSkge1xuICAgIC8vICBpZiggJHNjb3BlLmFpcnBvcnRzKVxuICAgIC8vICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5haXJwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgIGlmIChpYXRhID09ICRzY29wZS5haXJwb3J0c1tpXVsnaWF0YSddKVxuICAgIC8vICAgICAgcmV0dXJuIHRydWU7XG4gICAgLy8gIH1cbiAgICAgcmV0dXJuIHRydWU7XG4gICB9XG5cbiAgICRzY29wZS5idXR0b25TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICByZXR1cm4gISRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhJHNjb3BlLnNlbGVjdGVkRGVzdCB8fCAhJHNjb3BlLmV4aXREYXRlIHx8ICRzY29wZS5zZWxlY3RlZERlc3QgPT0gJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkT3JpZ2luKSB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZERlc3QpO1xuICAgfVxuXG4gICAkc2NvcGUuZmxpZ2h0ID0ge1xuICAgICB0eXBlOiBcIm9uZVwiXG4gICB9XG4gICAkc2NvcGUub3RoZXJBaXJsaW5lID0ge1xuICAgICB2YWx1ZTogZmFsc2VcbiAgIH1cblxuXG5cbiAgICRzY29wZS5nb1RvRmxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgZXhpdERhdGUsIHJldHVybkRhdGU7XG5cbiAgICAgZXhpdERhdGUgPSAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG4gICAgIGlmICgkc2NvcGUucmV0dXJuRGF0ZSlcbiAgICAgICByZXR1cm5EYXRlID0gKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG5cbiAgICAgaWYgKCRzY29wZS5vdGhlckFpcmxpbmUudmFsdWUpIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSlcbiAgICAgICAgICAgLnNlYXJjaCgnZmxpZ2h0Q2xhc3MnLCRzY29wZS5jbGFzc2VCdG5UZXh0KTtcblxuICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzLW5ldycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogZXhpdERhdGUsXG4gICAgICAgICAgICAgaXNFY29ub215OiAhJHNjb3BlLmlzQnVzaW5lc3NcbiAgICAgICAgICAgfSlcbiAgICAgICBlbHNlIHtcbiAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsIGV4aXREYXRlKVxuICAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgLnNlYXJjaCgnZmxpZ2h0Q2xhc3MnLCRzY29wZS5jbGFzc2VCdG5UZXh0KTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6IHJldHVybkRhdGUsXG4gICAgICAgICAgICAgaXNFY29ub215OiAhJHNjb3BlLmlzQnVzaW5lc3NcblxuICAgICAgICAgICB9KVxuICAgICAgIH1cbiAgICAgfSBlbHNlIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApLFxuICAgICAgICAgICBpc0Vjb25vbXk6ICEkc2NvcGUuaXNCdXNpbmVzc1xuXG4gICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6ICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgIGlzRWNvbm9teTogISRzY29wZS5pc0J1c2luZXNzXG5cbiAgICAgICAgICAgfSlcbiAgICAgICB9XG5cbiAgICAgfVxuXG4gICB9O1xuXG5cblxuXG4gICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICAgc3RyaW5nczogWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5PTkUnKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuVFdPJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLlRIUkVFJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLkZPVVInKV0sXG4gICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgICBsb29wOiB0cnVlXG4gICAgIH0pO1xuXG5cbiAgICAgJGxvY2F0aW9uLnVybCgkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAgJHNjb3BlLmNoaWxkcmVuID0gWycwICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzEgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRCcpLCAnMiAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICczICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzQgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpXTtcbiAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9ICRzY29wZS5jaGlsZHJlblswXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cblxuXG4gICAgICRzY29wZS5hZHVsdHMgPSBbJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFQnKSAsICcyICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnMyAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnNCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVHMnKV07XG4gICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5JTkZBTlQnKSwgJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uSU5GQU5UUycpXTtcbiAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSAkc2NvcGUuaW5mYW50c1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUluZmFudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuXG4gICAgICRzY29wZS5jbGFzc2VzID0gWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5FQ09OT01ZJyksICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5CVVNJTkVTUycpXTtcbiAgICAgJHNjb3BlLmNsYXNzZUJ0blRleHQgPSAkc2NvcGUuY2xhc3Nlc1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jbGFzc2VCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuICAgfVxuXG5cbiB9O1xuXG4gZnVuY3Rpb24gc2V0VXBEYXRlKCRzY29wZSkge1xuICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgIH07XG4gICAkc2NvcGUudG9kYXkoKTtcblxuICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG4gICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUucG9wdXAub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG5cblxuICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICB9XG4gICAkc2NvcGUuZGF0ZU9wdGlvbnMgPSB7XG4gICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDUsIDIyKSxcbiAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgc3RhcnRpbmdEYXk6IDFcbiAgIH07XG4gICAkc2NvcGUucG9wdXAyID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuIH1cblxuIGlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9IGVsc2Uge1xuICAgbWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckdHJhbnNsYXRlJ107XG4gfVxuXG4gQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgbWFpbkNvbnRyb2xsZXIpO1xuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJGaWxsIGluIHlvdXIgZGV0YWlsc1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuICAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aXRsZXMgPSBbJ01yJywgJ01ycycsICdNcycsICdEciddO1xuICAgICAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9ICRzY29wZS50aXRsZXNbMF07XG4gICAgICAgICRzY29wZS5jaGFuZ2VUaXRsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG5cblxuXG4gICAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuXG5cbiAgICAgICAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICAgICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUubmF0aW9uYWxpdHksXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUudGl0bGVzQnRuVGV4dCxcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWUsXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFcblxuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8vYmVmb3JlIHlvdSBsZWF2ZSB0aGUgcGFnZSBtYWtlIHN1cmUgdGhhdCB0aGUgcGFzc2VuZ2VyIG9iamVjdCBpcyBjb21wbGV0ZSBvdGhlcndpc2Ugc2hvdyBhbGVydChcIkZpbGwgaW4gYWxsIGRhdGFcIik7XG5cblxuXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vICAgJHNjb3BlLmFsZXJ0RGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICBpZiAoKCRzY29wZS5maXJzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHx8ICgkc2NvcGUubGFzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5waG9uZU51bWJlciA9PSBudWxsKSB8fCAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWwxID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWx2ZXIgPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnREYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICAgIC8vICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgLy8gICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIC8vICAgaWYgKCFhcGkuaXNPdGhlckhvc3RzKVxuICAgICAgICAgICAgLy8gICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgLy8gICBlbHNlICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV07XG5cbiAgICAgICAgICAgICRzY29wZS5hbGVydEZOYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TE5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydFBoTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRDb3VudHJ5ID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcblxuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzBdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Rk5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmxhc3ROYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRMTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbM10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQaE51bWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubmF0aW9uYWxpdHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s1XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENvdW50cnkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s2XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydEVtYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWx2ZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s3XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydEVtYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcikge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5jaGVjayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzldID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWxscGFzc2luZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkc1tpXSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxwYXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbHBhc3NpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghYXBpLklzT3RoZXJIb3N0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcucGFzc2VuZ2VyRGV0YWlsc1swXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZpcnN0TmFtZVwiOiAkc2NvcGUuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFzdE5hbWVcIjogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3BvcnROdW1cIjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3BvcnRFeHBpcnlEYXRlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRlT2ZCaXJ0aFwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogJHNjb3BlLmVtYWlsMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRCb29raW5nKGJvb2tpbmcpO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcblxuXG5cbiAgICAgICAgdmFyIGNvbXBsZXRlMSA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAgICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgICAgICAgICAgbmF0aW9uYWxpdHk6ICRzY29wZS5jb3VudHJpZXNNb2IsXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUuVGl0bGVNb2IsXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICAgICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lTW9iLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWVNb2IsXG4gICAgICAgICAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyTW9iLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxTW9iXG5cblxuICAgICAgICAgICAgfTtcblxuXG5cblxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlMSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgICAvLyAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhOlwiICsgXCJcXG5cIiArIFwiUGFzc3BvcnQgTnVtYmVyIG11c3QgYmUgOCBudW1iZXJzXCIgKyBcIlxcblwiICtcbiAgICAgICAgICAgIC8vICAgICAgIFwiUGhvbmUgTnVtYmVyIG11c3QgYmUgMTAgbnVtYmVyc1wiICsgXCJcXG5cIiArIFwiRW1haWxzIG11c3QgYmUgaW4gYUB4eXouY29tIGZvcm1hdFwiKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgIGlmICgkc2NvcGUuZW1haWwxTW9iICE9ICRzY29wZS5lbWFpbHZlck1vYilcbiAgICAgICAgICAgIC8vICAgICAgIGFsZXJ0KFwiVGhlIGVudGVyZWQgZW1haWxzIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgICAgIC8vICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICBpZiAoKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UgZW50ZXJlZFwiKVxuICAgICAgICAgICAgLy8gICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZTEgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgLy8gfVxuXG5cblxuICAgICAgICAgICAgdmFyIGZpZWxkc01vYiA9IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXTtcblxuXG5cblxuICAgICAgICAgICAgaWYgKCRzY29wZS5maXJzdE5hbWVNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlswXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIEVudGVyIHlvdXIgZmlyc3QgbmFtZS5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzFdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBtaWRkbGUgbmFtZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbMl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZS5cIik7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlszXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgcGhvbmUgbnVtYmVyLCBpdCBtdXN0IGJlIDEwIGRpZ2l0c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls0XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgcGFzc3BvcnQgbnVtYmVyLCBpdCBtdXN0IGJlIDggZGlnaXRzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIGVtYWlsLCBpdCBtdXN0IGJlIGluIHRoaXMgZm9ybWF0ICdhQHh5ei5jb20nIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWx2ZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls2XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGNvbmZpcm0geW91ciBlbWFpbCwgaXQgbXVzdCBiZSBpbiB0aGlzIGZvcm1hdCAnYUB4eXouY29tJyBcIik7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxTW9iICE9ICRzY29wZS5lbWFpbHZlck1vYikge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls3XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGVudGVyZWQgZW1haWxzIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2hlY2tNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24geW91J3ZlIGVudGVyZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhbGxwYXNzaW5nTW9iID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHNNb2IubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRzTW9iW2ldID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbHBhc3NpbmdNb2IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxscGFzc2luZ01vYiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcblxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdGFiL3BheW1lbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgIH1cblxuXG5cbn0pO1xuIiwiLy8gQG1pcm5hXG52YXIgcGF5bWVudEN0cmwgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgJGh0dHAsIGFwaSkge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1wYXltZW50JztcbiAgICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSB5b3VyIHBheW1lbnQgb3B0aW9uXCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiU3VibWl0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgJHNjb3BlLmZvcm0gPSB7XG4gICAgICAgIG51bWJlcjogbnVsbCxcbiAgICAgICAgY3ZjOiBudWxsLFxuICAgICAgICBleHBfbW9udGg6IG51bGwsXG4gICAgICAgIGV4cF95ZWFyOiBudWxsXG4gICAgfTtcblxuXG5cblxuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgcGF5P1wiKTtcbiAgICAgICAgaWYgKHIgPT0gdHJ1ZSkge1xuXG5cblxuICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAkc2NvcGUueWVhcnNCdG5UZXh0XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX21vbnRoID0gcGFyc2VJbnQoJHNjb3BlLm1vbnRocy5pbmRleE9mKCRzY29wZS5tb250aHNCdG5UZXh0KSkgKyAxXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAocGFyc2VJbnQobmV3IERhdGUoJHNjb3BlLmRhdGUpLmdldFllYXIoKSkpICsgMjAwMCAtIDEwMFxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLmV4cF9tb250aCA9IG5ldyBEYXRlKCRzY29wZS5kYXRlKS5nZXRNb250aCgpXG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZm9ybSlcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgIGlmICghYXBpLklzT3RoZXJIb3N0cygpKVxuICAgICAgICAgICAgICAgIFN0cmlwZS5jYXJkLmNyZWF0ZVRva2VuKCRzY29wZS5mb3JtLCBmdW5jdGlvbihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuaWQpXG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRTdHJpcGVUb2tlbihyZXNwb25zZS5pZClcbiAgICAgICAgICAgICAgICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcoYXBpLklzT3RoZXJIb3N0cygpKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLnJlZk51bSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY29uZmlybWF0aW9uJykuc2VhcmNoKCdib29raW5nJywgZGF0YS5kYXRhLnJlZk51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5jb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nOiBkYXRhLmRhdGEucmVmTnVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhLmRhdGEuZXJyb3JNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYm9va2luZyA9IGFwaS5nZXRCb29raW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuVXJsID09IGJvb2tpbmcub3V0Z29pbmdVcmwgfHwgIWJvb2tpbmcucmV0dXJuVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib29raW5nLnJldHVybkNvc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLnJldHVybkNvc3QpICsgcGFyc2VJbnQoYm9va2luZy5vdXRnb2luZ0Nvc3QpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLm91dGdvaW5nQ29zdCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIGJvb2tpbmcub3V0Z29pbmdVcmw7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybCArICcvc3RyaXBlL3B1YmtleS8nKVxuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleS8nKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLnNldFB1Ymxpc2hhYmxlS2V5KGRhdGEuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5jYXJkLmNyZWF0ZVRva2VuKCRzY29wZS5mb3JtLCBmdW5jdGlvbihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZy5wYXltZW50VG9rZW4gPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhib29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLnJlZk51bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLnNldFB1Ymxpc2hhYmxlS2V5KCdwa190ZXN0X1NpWTB4YXc3cTNMTmxwQ25raHBvNjBqdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY29uZmlybWF0aW9uJykuc2VhcmNoKCdib29raW5nJywgZGF0YS5kYXRhLnJlZk51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuY29uZmlybWF0aW9uJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nOiBkYXRhLmRhdGEucmVmTnVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YS5lcnJvck1lc3NhZ2UpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vaGVyZSB3ZSBzaG91bGQgc2VuZCB0d28gcmVxZXVzdHNcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dGdvaW5nQm9va2luZyA9IGJvb2tpbmc7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXR1cm5Cb29raW5nID0gYm9va2luZztcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdCb29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLm91dGdvaW5nQ29zdCk7XG4gICAgICAgICAgICAgICAgICAgIG91dGdvaW5nQm9va2luZy5yZXR1cm5GbGlnaHRJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib29raW5nLnJldHVyblVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuQm9va2luZy5jb3N0ID0gcGFyc2VJbnQoYm9va2luZy5yZXR1cm5Db3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybkJvb2tpbmcub3V0Z29pbmdGbGlnaHRJZCA9IGJvb2tpbmcucmV0dXJuRmxpZ2h0SWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyBib29raW5nLm91dGdvaW5nVXJsO1xuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleScpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleShkYXRhLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGdvaW5nQm9va2luZy5wYXltZW50VG9rZW4gPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhvdXRnb2luZ0Jvb2tpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zdWJtaXRCb29raW5nKHRydWUsIHVybCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpLnNlYXJjaCgnYm9va2luZycsIGRhdGEuZGF0YS5yZWZOdW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLnJlZk51bSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChib29raW5nLnJldHVyblVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIGJvb2tpbmcucmV0dXJuVXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5nZXRTdHJpcGVLZXkodXJsICsgJy9zdHJpcGUvcHVia2V5JykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleShkYXRhLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5jYXJkLmNyZWF0ZVRva2VuKCRzY29wZS5mb3JtLCBmdW5jdGlvbihzdGF0dXMsIHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybkJvb2tpbmcucGF5bWVudFRva2VuID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhyZXR1cm5Cb29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zdWJtaXRCb29raW5nKHRydWUsIHVybCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5yZWZOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLnNldFB1Ymxpc2hhYmxlS2V5KCdwa190ZXN0X1NpWTB4YXc3cTNMTmxwQ25raHBvNjBqdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpLnNlYXJjaCgnYm9va2luZycsIGRhdGEuZGF0YS5yZWZOdW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5jb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZzogZGF0YS5kYXRhLnJlZk51bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5kYXRhLmVycm9yTWVzc2FnZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiAoIWFwaS5Jc090aGVySG9zdHMoKSlcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgfVxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsICcyMDE3JywgJzIwMTgnLCAnMjAxOScsICcyMDIwJywgJzIwMjEnLCAnMjAyMicsICcyMDIzJywgJzIwMjQnXTtcbiAgICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidXJhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuTm8gPSAkc2NvcGUubW9udGhzLmluZGV4T2YodGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgJHNjb3BlLm90aGVySG9zdHMgPSBhcGkuSXNPdGhlckhvc3RzKCk7XG4gICAgY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKS5vdXRnb2luZ0Nvc3QpXG4gICAgaWYgKCRzY29wZS5vdGhlckhvc3RzKSB7XG4gICAgICAgIGlmIChhcGkuZ2V0Qm9va2luZygpLnJldHVybkNvc3QpXG4gICAgICAgICAgICAkc2NvcGUucHJpY2UgPSBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLm91dGdvaW5nQ29zdCkgKyBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLnJldHVybkNvc3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAkc2NvcGUucHJpY2UgPSBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLm91dGdvaW5nQ29zdClcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByaWNlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSkge1xuXG4gICAgICAgICAgICBpZiAoYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5wcmljZSA9IHByaWNlO1xuICAgIH1cbn1cblxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICAgIHBheW1lbnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGh0dHAnLCAnYXBpJ107XG59IGVsc2Uge1xuICAgIHBheW1lbnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJGh0dHAnLCAnYXBpJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIHBheW1lbnRDdHJsKTtcbiIsIi8vIEBhaG1lZC1lc3NtYXRcbiAgdmFyIHNlYXRpbmdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpLCRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1zZWF0aW5nJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIldoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIHNpdD9cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvcmV0dXJpbmcnKTtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXBpLnNldFJldHJ1blNlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIH1cblxuXG5cbiAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VhdG1hcDtcblxuICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcblxuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH1cblxuXG5cbiAgICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICAgIHZhciBzY2hlbWEgPSBbMywgNSwgMywgMjBdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc2VhcmNoQ29sb3IgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgaWYgKCEkc2NvcGUuaXNFbXB0eSh0ZXh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0T2N1JztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdEVtcHR5JztcbiAgICAgIH1cbiAgICAgICRzY29wZS5pc0VtcHR5ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhdG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoc2VhdG1hcFtpXVsnbnVtYmVyJ10gPT0gdGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXRtYXBbaV1bJ2lzRW1wdHknXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnNlbGVjdFNlYXQgPSBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgJHNjb3BlLnNlYXQgPSBzZWF0O1xuICAgICAgfTtcbiAgICB9XG5cblxuXG4gICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgIHZhciBzY2hlbWEgPSBbMiwgNCwgMiwgOV07XG5cbiAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICB9XG5cblxufTtcblxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdzZWF0aW5nQ3RybCcsIHNlYXRpbmdDb250cm9sbGVyKTtcbiJdfQ==
