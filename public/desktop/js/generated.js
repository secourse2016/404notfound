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
        getStripeKey: function(url) {
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'x-access-token': accessToken
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
                    url: 'http://localhost:8080/booking', // has to be changed !!
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

            var fields = [true, true, true, true, true, true, true, true, true];

            $scope.alertFName = false;
            $scope.alertMName = false;
            $scope.alertLName = false;
            $scope.alertPhNumber = false;
            $scope.alertPNumber = false;
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
            if ($scope.email1 == null) {
                fields[5] = false;
                $scope.alertEmail = true;
            }
            if ($scope.emailver == null) {
                fields[6] = false;
                $scope.alertEmail = true;
            }
            if ($scope.email1 != $scope.emailver) {
                fields[7] = false;
                $scope.alertConfirm = true;
            }
            if ($scope.check == null) {
                fields[8] = false;
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
            if ($scope.email1 == null) {
                fieldsMob[5] = false;
                alert("Please enter your email, it must be in this format 'a@xyz.com' ");
            }
            if ($scope.emailver == null) {
                fieldsMob[6] = false;
                alert("Please confirm your email, it must be in this format 'a@xyz.com' ");

            }
            if ($scope.email1 != $scope.emailver) {
                fieldsMob[7] = false;
                alert("The entered emails do not match");
            }
            if ($scope.check == null) {
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
                        console.log(data)
                        $location.path('/confirmation');
                        // api.clearLocal();
                    }, function(err) {

                    })
                }); {
                var booking = api.getBooking();
                if (booking.returnUrl == booking.outgoingUrl || !booking.returnUrl) {
                    if (booking.returnCost)
                        booking.cost = parseInt(booking.returnCost) + parseInt(booking.outgoingCost);
                    else
                        booking.cost = parseInt(booking.outgoingCost);
                    api.getStripeKey("http://" + booking.outgoingUrl + '/stripe/pubkey').then(function(data) {
                      console.log(data)
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDamJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJBcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uID0ge307XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnBvc3QgPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucHV0ID0ge307XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnBhdGNoID0ge307XG59KTtcblxuQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gICAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQsIHJlZk51bTtcbiAgICB2YXIgaXNPdGhlckhvc3RzOyAvLyBzZXQgdG8gZmFsc2UgaW4gZmxpZ2h0c2N0cmwgLHNldCB0byB0cnVlIGZsaWdodHNOZXdDdHJsXG4gICAgdmFyIHN0cmlwZVRva2VuO1xuICAgIHZhciBwYXNzZW5nZXJEYXRhID0gW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3RyaXBlS2V5OiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvYWlycG9ydHMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRGbGlnaHRzOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRPdGhlckZsaWdodHNCdXNpOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9idXNpbmVzcy8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlyY3JhZnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgaWYgKGlzT3RoZXJIb3N0cylcbiAgICAgICAgICAgICAgICBib29raW5nRGF0YS5QYXNzZW5nZXJEZXRhaWxzID0gcGFzc2VuZ2VyRGF0YVxuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG4gICAgICAgICAgICBpZiAoIWlzT3RoZXJIb3N0cykge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGFzc2VuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzZW5nZXJEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRCb29raW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBib29raW5nRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3Nlbk91dGdvaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3NlblJldHVybmluZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRnb2luZ1NlYXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmV0dXJuU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuU2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRSZXRydW5TZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SXNPdGhlckhvc3RzOiBmdW5jdGlvbihvdGhlckhvc3RzKSB7XG4gICAgICAgICAgICBpc090aGVySG9zdHMgPSBvdGhlckhvc3RzO1xuICAgICAgICB9LFxuICAgICAgICBJc090aGVySG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzT3RoZXJIb3N0cztcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYXJMb2NhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgcGFzc2VuZ2VyRGF0YSA9IFtdXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0ge31cbiAgICAgICAgICAgIHJldHVyblNlYXQgPSB7fVxuICAgICAgICAgICAgaXNpc090aGVySG9zdHMgPSBmYWxzZVxuXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKG90aGVySG9zdHMpIHtcbiAgICAgICAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHByaWNlID0gdGhpcy5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyB0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICAgICAgaWYgKCFvdGhlckhvc3RzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ib29raW5nJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiBvdGhlckhvc3RzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZzogYm9va2luZ0RhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogc3RyaXBlVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ib29raW5nJywgLy8gaGFzIHRvIGJlIGNoYW5nZWQgISFcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiBvdGhlckhvc3RzXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGJvb2tpbmdEYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmlwZVRva2VuO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTdHJpcGVUb2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgIHN0cmlwZVRva2VuID0gdG9rZW47XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCIgIEFwcC5jb25maWcoZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZW4nLCB7XG4gICAgICBNQUlOOiB7XG4gICAgICAgIEJPT0tfTk9XOiAnQm9vayBOb3cnLFxuICAgICAgICBGUk9NOiAnRnJvbScsXG4gICAgICAgIEZMWUlOR19GUk9NOiAnRmx5aW5nIGZyb20nLFxuICAgICAgICBERVBBUlRVUkVfREFURTogJ0RlcGFydHVyZSBEYXRlJyxcbiAgICAgICAgVE86ICdUbycsXG4gICAgICAgIEZMWUlOR19UTzogJ0ZseWluZyB0bycsXG4gICAgICAgIFJFRU5UUllfREFURTogJ1JlLWVudHJ5IERhdGUnLFxuICAgICAgICBVTkRFUl8yX1lFQVJTOiAnVW5kZXIgMiB5ZWFycycsXG4gICAgICAgIFJPVU5EX1RSSVA6ICdSb3VuZCBUcmlwJyxcbiAgICAgICAgT05FX1dBWTogJ09uZSBXYXknLFxuICAgICAgICBPVEhFUl9BSVJMSU5FUzogJ1NlYXJjaCBvdGhlciBhaXJsaW5lcycsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ1NlYXJjaCBmb3IgZmxpZ2h0cycsXG4gICAgICAgIFlFQVJTOiBcInllYXJzXCIsXG4gICAgICAgIENISUxEUkVOOiAnY2hpbGRyZW4nLFxuICAgICAgICBDSElMRDogJ2NoaWxkJyxcbiAgICAgICAgQURVTFQ6ICdhZHVsdCcsXG4gICAgICAgIEFEVUxUUzogJ2FkdWx0cycsXG4gICAgICAgIElORkFOVFM6ICdpbmZhbnRzJyxcbiAgICAgICAgSU5GQU5UOiAnaW5mYW50JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgUVVPVEVTX0hPTUU6IHtcbiAgICAgICAgICBPTkU6IFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICBUV086IFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLFxuICAgICAgICAgIFRIUkVFOiBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLFxuICAgICAgICAgIEZPVVI6IFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGTElHSFRTOiB7XG4gICAgICAgIFRJVExFOiAnQ2hvb3NlIGEgRmxpZ2h0JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgU0VBVFNfTEVGVDogJ3NlYXRzIGxlZnQnLFxuICAgICAgICBNT1JFX0RFVEFJTFM6ICdNb3JlIGRldGFpbHMnLFxuICAgICAgICBCT09LOiAnQm9vaycsXG4gICAgICAgIFNFTEVDVDonU2VsZWN0JyxcbiAgICAgICAgRkxJR0hUOiAnRmxpZ2h0JyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdPcGVyYXRlZCBieSdcbiAgICAgIH0sXG4gICAgICBGTElHSFQ6IHtcbiAgICAgICAgRkxJR0hUOiBcIkZsaWdodFwiLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBUSVRMRTogJ0ZsaWdodCBEZXRhaWxzJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdPcGVyYXRlZCBieScsXG4gICAgICAgIE5VTUJFUl9PRl9QQVNTRU5HRVJTOiAnTnVtYmVyIG9mIHBhc3NlbmdlcnMnLFxuICAgICAgICBGTFlJTkdfQ0FMU1M6ICdGbHlpbmcgY2xhc3MnLFxuICAgICAgICBGTElHSFRfRkFSRTogJ0ZsaWdodCBmYXJlJyxcbiAgICAgICAgRkxJR0hUX0ZBQzogJ0ZsaWdodCBmYWNpbGl0aWVzJyxcbiAgICAgICAgUEFTU0VOR0VSOiAncGFzc2VuZ2VyJyxcbiAgICAgICAgUEFTU0VOR0VSUzogJ3Bhc3NlbmdlcnMnXG4gICAgICB9LFxuICAgICAgTkFWOiB7XG4gICAgICAgIEdPX0hPTUU6J0dvIEhvbWUnLFxuICAgICAgICBTVUJNSVQ6ICdTdWJtaXQnLFxuICAgICAgICBORVhUOiAnTmV4dCcsXG4gICAgICAgIEJBQ0s6ICdCYWNrJyxcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIFNFUlZJQ0VTOiAnU2VydmljZXMnLFxuICAgICAgICBPVVJfVEVBTTogJ091ciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICdBYm91dCcsXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJyxcbiAgICAgICAgQ0hPT1NFX0xBTkdVQUdFOidDaG9vc2UgbGFuZ3VhZ2UnLFxuICAgICAgICBFTkdMSVNIOiAnRW5nbGlzaCcsXG4gICAgICAgIEdFUk1BTjonR2VybWFuJ1xuICAgICAgfSxcblxuICAgICAgQ09ORklSTUFUSU9OOiB7XG4gICAgICAgIFRIQU5LX1lPVTogJ1RoYW5rIHlvdScsXG4gICAgICAgIE5BTUU6ICdOYW1lJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBGTElHSFROTzogJ0ZsaWdodCBudW1iZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdEZXBhcnR1cmUnLFxuICAgICAgICBBUlJBSVZBTDogJ0Fycml2YWwnLFxuICAgICAgICBQUklOVDogJ1ByaW50IHRpY2tldCdcbiAgICAgIH0sXG4gICAgICBDT05UQUNUX1VTOiB7XG5cbiAgICAgICAgQ09OVEFDVF9VUzogJ0NvbnRhY3QgVXMnLFxuICAgICAgICBQSE9ORTogJ1Bob25lJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCcsXG4gICAgICAgIExFQVZFX01TRzogJ0xlYXZlIHVzIGEgbWVzc2FnZScsXG4gICAgICAgIFNFTkQ6ICdTZW5kJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnRG8geW91IG1lYW4gNDA0Tm90Rm91bmQgVGVhbT8nXG5cbiAgICAgIH0sXG5cbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICdBYm91dCBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnSGlzdG9yeScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ1RoZSBmaXJzdCBhaXJiZXJsaW4gcGxhbmUgdG9vayBvZmYgb24gMjh0aCBBcHJpbCAxOTc5LiBFeHBlcmllbmNlIHRoZSBoaWdobGlnaHRzIGFuZCBtaWxlc3RvbmVzIGluIGFpcmJlcmxpbnMgaGlzdG9yeSAnLFxuICAgICAgICBPVVJfR09BTDogJ091ciBnb2FsJyxcbiAgICAgICAgT1VSX0dPQUxfUEFSQTogJ0ZpcnN0IEV1cm9wZSwgYW5kIHRoZW4gdGhlIGdsb2JlLCB3aWxsIGJlIGxpbmtlZCBieSBmbGlnaHQsIGFuZCBuYXRpb25zIHNvIGtuaXQgdG9nZXRoZXIgdGhhdCB0aGV5IHdpbGwgZ3JvdyB0byBiZSBuZXh0LWRvb3IgbmVpZ2hib3Jz4oCmIC4gV2hhdCByYWlsd2F5cyBoYXZlIGRvbmUgZm9yIG5hdGlvbnMsIGFpcndheXMgd2lsbCBkbyBmb3IgdGhlIHdvcmxkLicsXG4gICAgICAgIEFfUDogJ0FsbGlhbmNlL3BhcnRuZXJzJyxcbiAgICAgICAgQV9QX1BBUkE6ICdhaXJiZXJsaW4gZ3VhcmFudGVlcyBhIGRlbnNlIGNvbm5lY3Rpb24gbmV0d29yayBhbmQgY29uc3RhbnQgZ3Jvd3RoIHRoYW5rcyB0byB0aGUgY28tb3BlcmF0aW9uIHdpdGggb3RoZXIgYWlybGluZXMuYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLidcbiAgICAgIH0sXG5cbiAgICAgIE9GRkVSUzoge1xuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZWNpYWwgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSUzogJ0ZsaWdodCBPZmZlcnMnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTX1BBUkE6ICdGaW5kIHRoZSBtb3N0IGF0dHJhY3RpdmUgZmFyZSBmb3IgeW91ciBmbGlnaHQnLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LOiAnTGlrZSB1cyBvbiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ0RvbnQgbWlzcyBvdXIgc3BlY2lhbCBvZmZlcnMgb246IHdpdGggb3VyIG5ld3NsZXR0ZXIgYW5kIG9uIEZhY2Vib29rJyxcbiAgICAgICAgSE9URUw6ICdIb3RlbCcsXG4gICAgICAgIEhPVEVMX1BBUkE6ICdTcGVjaWFsIG9mZmVycyBmb3IgeW91ciBob3RlbCBzdGF5IGF3YXkgZnJvbSBvdXIgcGFydG5lcnMgLidcbiAgICAgIH0sXG5cblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG4gICAgICAgIEZJUlNUX05BTUU6ICdGaXJzdCBOYW1lJyxcbiAgICAgICAgTUlERExFX05BTUU6ICdNaWRkbGUgTmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ0xhc3QgTmFtZScsXG4gICAgICAgIFBBU1NfTk86ICdQYXNzcG9ydCBOdW1iZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnUGxhY2UgT2YgQmlydGgnLFxuICAgICAgICBQSE9ORV9OTzogJ1Bob25lIE51bWJlcicsXG4gICAgICAgIEVfTUFJTDogJ0VtYWlsJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ1JlcGVhdCBFbWFpbCcsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHByb3ZpZGVkIG1hdGNoZXMgdGhlIHBhc3Nwb3J0IGluZm9ybWF0aW9uLidcblxuICAgICAgfSxcbiAgICAgIFBBWU1FTlQ6IHtcblxuICAgICAgICBXRV9BQ0NFUFQ6ICdXZSBhY2NlcHQnLFxuICAgICAgICBDQVJEX0lORk86ICdDYXJkIGluZm9ybWF0aW9uOicsXG4gICAgICAgIEVYUF9EQVRFOiAnRXhwaXJlIERhdGU6JyxcbiAgICAgICAgQ09TVDogJ1lvdXIgYm9va2luZyB0b3RhbCBjb3N0J1xuXG4gICAgICB9LFxuXG4gICAgICBTRUFUSU5HOiB7XG5cbiAgICAgICAgU0VBVF9NQVA6ICdTZWF0bWFwJyxcbiAgICAgICAgU0VMRUNURUQ6ICdZb3Ugc2VsZWN0ZWQgc2VhdCdcblxuICAgICAgfSxcblxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ0luZmxpZ2h0IFNlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIHByZXNlbnRzIHRoZSBlY29ub215IGFuZCBidXNpbmVzcyBjbGFzcy4nLFxuICAgICAgICBHX01FQUxTOiAnR291cm1ldCBNZWFscycsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0FpcmJlcmxpbiBpcyB0aGUgcmlnaHQgYWlybGluZSBmb3IgY29ubm9pc3NldXJzOiB0cmVhdCB5b3Vyc2VsZiB0byBvbmUgb2YgdGhlIGRlbGljaW91cyBnb3VybWV0IG1lYWxzIGZyb20gXCJTYW5zaWJhclwiIG9uIGJvYXJkJyxcbiAgICAgICAgQkFHR0FHRTogJ0JhZ2dhZ2UnLFxuICAgICAgICBCQUdHQUdFX1BBUkE6ICdFdmVyeXRoaW5nIHlvdSBuZWVkIHRvIGtub3cgYWJvdXQgZnJlZSBiYWdnYWdlIGFsbG93YW5jZXMsIGNhYmluIGJhZ2dhZ2UgcmVndWxhdGlvbnMgYW5kIHNwZWNpYWwgYmFnZ2FnZS4nXG5cbiAgICAgIH0sXG5cbiAgICB9KTtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcbiAgICAgIE1BSU46IHtcbiAgICAgICAgQk9PS19OT1c6ICdKZXR6dCBidWNoZW4nLFxuICAgICAgICBGUk9NOiAndm9uJyxcbiAgICAgICAgRkxZSU5HX0ZST006ICdBYmZsdWdoYWZlbicsXG4gICAgICAgIERFUEFSVFVSRV9EQVRFOiAnSGluZmx1ZycsXG4gICAgICAgIFRPOiAnbmFjaCcsXG4gICAgICAgIEZMWUlOR19UTzogJ1ppZWxmbHVnaGFmZW4nLFxuICAgICAgICBSRUVOVFJZX0RBVEU6ICdSw7xja2ZsdWcnLFxuICAgICAgICBVTkRFUl8yX1lFQVJTOiAnSsO8bmdlciBhbHMgMiBKYWhyZW4nLFxuICAgICAgICBST1VORF9UUklQOiAnSGluLS9Sw7xja2ZhaHJ0JyxcbiAgICAgICAgT05FX1dBWTogJ051ciBIaW5mbHVnJyxcbiAgICAgICAgT1RIRVJfQUlSTElORVM6ICdBbmRlcmUgRmx1Z2dlc2VsbHNjaGFmdGVuJyxcbiAgICAgICAgU0VBUkNIX0ZPUl9GTElHSFRTOiAnRmzDvGdlIHN1Y2hlbicsXG4gICAgICAgIFlFQVJTOiBcIkphaHJlXCIsXG4gICAgICAgIENISUxEUkVOOiAnS2luZGVyJyxcbiAgICAgICAgQ0hJTEQ6ICdLaW5kJyxcbiAgICAgICAgQURVTFQ6ICdFcndhY2hzZW5lcicsXG4gICAgICAgIEFEVUxUUzogJ0Vyd2FjaHNlbmVuJyxcbiAgICAgICAgSU5GQU5UUzogJ0JhYnlzJyxcbiAgICAgICAgSU5GQU5UOiAnQmFieScsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFFVT1RFU19IT01FOiB7XG4gICAgICAgICAgT05FOiBcIkVpbmZhY2gsIGJlcXVlbSwgc29mb3J0aWdlIEJlc3TDpHRpZ3VuZy5cIixcbiAgICAgICAgICBUV086IFwiWmllbGVuIGF1ZiBkZXIgV2VsdC5cIixcbiAgICAgICAgICBUSFJFRTogXCJBdXRoZW50aXNjaGUgR2FzdGZyZXVuZHNjaGFmdCBlcmxlYmVuLlwiLFxuICAgICAgICAgIEZPVVI6IFwiVmVyd3Vuc2NoZW5lIFplaXQgbWl0IHVucy5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRkxJR0hUUzoge1xuICAgICAgICBUSVRMRTogJ0VpbmVuIEZsdWcgYXVzc3VjaGVuJyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgU0VBVFNfTEVGVDogJ2ZyZWllIFNpdHpwbMOkdHplJyxcbiAgICAgICAgTU9SRV9ERVRBSUxTOiAnTWVociBEZXRhaWxzJyxcbiAgICAgICAgQk9PSzogJ2J1Y2hlbicsXG4gICAgICAgIFNFTEVDVDonV8OkaGxlbicsXG4gICAgICAgIEZMSUdIVDogJ0ZsdWcnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ2JldHJpZWJlbiB2b24nXG4gICAgICB9LFxuICAgICAgRkxJR0hUOiB7XG4gICAgICAgIEZMSUdIVDogXCJGbHVnXCIsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFRJVExFOiAnRGV0YWlscyBkZXMgRmx1Z3MnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ2JldHJpZWJlbiB2b24nLFxuICAgICAgICBOVU1CRVJfT0ZfUEFTU0VOR0VSUzogJ0FuemFobCBkZXIgUGFzc2FnaWVyZScsXG4gICAgICAgIEZMWUlOR19DQUxTUzogJ0JlZsO2cmRlcnVuZ3NrbGFzc2VuJyxcbiAgICAgICAgRkxJR0hUX0ZBUkU6ICdGbHVncHJlaXMnLFxuICAgICAgICBGTElHSFRfRkFDOiAnRGllbnN0bGVpc3R1bmdlbiBkZXMgRmx1Z3MnLFxuICAgICAgICBQQVNTRU5HRVI6ICdQYXNzYWdpZXInLFxuICAgICAgICBQQVNTRU5HRVJTOiAnUGFzc2FnaWVyZSdcbiAgICAgIH0sXG4gICAgICBOQVY6IHtcbiAgICAgICAgR09fSE9NRTonaGVpbWdlaGVuJyxcbiAgICAgICAgU1VCTUlUOiAnZWlucmVpY2hlbicsXG4gICAgICAgIE5FWFQ6ICd3ZWl0ZXInLFxuICAgICAgICBCQUNLOiAnenVyw7xjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlemllbGxlIEFuZ2Vib3RlJyxcbiAgICAgICAgU0VSVklDRVM6ICdEaWVuc3RsZWlzdHVuZ2VuJyxcbiAgICAgICAgT1VSX1RFQU06ICdVbnNlciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICfDnGJlciB1bnMnLFxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCcsXG4gICAgICAgIENIT09TRV9MQU5HVUFHRTonV8OkaGxlIGVpbmUgU3ByYWNoZScsXG4gICAgICAgIEVOR0xJU0g6ICdFbmdsaXNjaCcsXG4gICAgICAgIEdFUk1BTjonRGV1dHNjaCdcbiAgICAgIH0sXG4gICAgICBDT05GSVJNQVRJT046IHtcblxuICAgICAgICBUSEFOS19ZT1U6ICdEYW5rZSBzY2jDtm4nLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIEZMSUdIVE5POiAnRmx1ZyBOdW1tZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdBYmZhaHJ0JyxcbiAgICAgICAgQVJSQUlWQUw6ICdBbmt1bmZ0JyxcbiAgICAgICAgUFJJTlQ6ICdGbHVna2FydGUgYWJkcnVja2VuJ1xuICAgICAgfSxcbiAgICAgIENPTlRBQ1RfVVM6IHtcblxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCcsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIExFQVZFX01TRzogJ0lociBBbmxpZWdlbicsXG4gICAgICAgIFNFTkQ6ICdhYnNjaGlja2VuJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnTWVpbnRlbiBTaWUgZGllIEdydXBwZSB2b24gNDA0Tm90Rm91bmQgPydcblxuICAgICAgfSxcbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICfDnGJlciBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnR2VzY2hpY2h0ZScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ0FtIDI4LiBBcHJpbCAxOTc5IHN0YXJ0ZXQgZWluZSBCb2VpbmcgNzA3IHZvbiBCZXJsaW4tVGVnZWwgbmFjaCBQYWxtYSBkZSBNYWxsb3JjYS4gRGVyIEVyc3RmbHVnIGlzdCBkZXIgQW5mYW5nIGRlciBFcmZvbGdzZ2VzY2hpY2h0ZSB2b24gYWlyYmVybGluLiAnLFxuICAgICAgICBPVVJfR09BTDogJ1Vuc2VyIFppZWwnLFxuICAgICAgICBPVVJfR09BTF9QQVJBOiAnWnVlcnQgRXVyb3BhLCB6dW7DpGNoc3QgZGllIGdhbnplIFdlbHQsIHdlcmRlbiBkdXJjaCBkZW4gRmx1ZyB6dXNhbW1lbiB2ZXJidW5kZW4sIHVuZCBOYXRpb25lbiBlbmcgenVzYW1tZW4gZGFtaXQgc2llIE5hY2hiYXJuIGF1ZndhY2hzZW7igKYgLiBXYXMgZGllIEVpc2JhaG5lbiBmw7xyIGRpZSBOYXRpb25lbiBnZXRhbiBoYXQsIHdpcmQgZGllIEZsw7xnZSBmw7xyIGRhcyBnYW56ZSBXZWx0IHR1bi4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGVyd2VpdGVydCBpaHIgaW50ZXJuYXRpb25hbGVzIFN0cmVja2VubmV0eiwgaW5kZW0gc2llIG1pdCBtZWhyZXJlbiBBaXJsaW5lcyBhbHMgQ29kZXNoYXJlLVBhcnRuZXJuIGtvb3BlcmllcnQuJ1xuXG5cbiAgICAgIH0sXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGV6aWVsbGUgQW5nZWJvdGUnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTOiAnRmx1Z2FuZ2Vib3RlJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZGVuIFNpZSBkaWUgYXR0cmFrdGl2c3RlbiBUYXJpZmUgZsO8ciBJaHJlbiBGbHVnJyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0ZvbGdlbiBTaWUgdW5zIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ1Zlcm1pc3NlbiBTaWUgbmljaHQgdW5zZXJlIHNwZXppZWxsZSBBbmdlYm90ZTogbWl0IHVuc2VyIG5ld3NsZXR0ZXIgdW5kIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU29uZGVyYW5nZWJvdGUgZsO8ciBJaHIgSG90ZWwgd2VnIHZvbiB1bnNlcmUgUGFydG5lcm4gLidcblxuICAgICAgfSxcblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG5cbiAgICAgICAgRklSU1RfTkFNRTogJ1Zvcm5hbWUnLFxuICAgICAgICBNSURETEVfTkFNRTogJ1p3ZWl0bmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ05hY2huYW1lJyxcbiAgICAgICAgUEFTU19OTzogJ1JlaXNlcGFzcyBOdW1tZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnT3J0IGRlcyBHZWJ1cnRzJyxcbiAgICAgICAgUEhPTkVfTk86ICdUZWxlZm9uIE51bW1lcicsXG4gICAgICAgIEVfTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ0UtbWFpbCB3aWVkZXJob2xlbicsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSGllcm1pdCwgYmVzdMOkdGlnZSBpY2gsIGRhc3MgZGllIEluZm9ybWF0aW9uZW4sIGRpZSB2b3JoaW4gZ2VnZWJlbiBzaW5kLCBtZWluZSBQYXNzZGF0ZW4gZW50c3ByaWNoZW4uJ1xuXG4gICAgICB9LFxuICAgICAgUEFZTUVOVDoge1xuXG4gICAgICAgIFdFX0FDQ0VQVDogJ1phaGx1bmdzbWV0aG9kZW4nLFxuICAgICAgICBDQVJEX0lORk86ICdLcmVkaXRrYXJ0ZSBpbmZvcm1hdGlvbmVuOicsXG4gICAgICAgIEVYUF9EQVRFOiAnQWJsYXVmZGF0dW0gSWhyZXIgS2FydGU6JyxcbiAgICAgICAgQ09TVDogJ0dlc2FtdHByZWlzJ1xuXG4gICAgICB9LFxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2l0enBsYXR6cmVzZXJ2aWVydW5nJyxcbiAgICAgICAgU0VMRUNURUQ6ICdTaWUgaGFiZW4gZWluZW4gU2l0enBsYXR6IHJlc2VydmllcnQuJ1xuXG4gICAgICB9LFxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ1NlcnZpY2VzIGFuIGJvYXJkJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIGhlacOfZW4gU2llIGhlcnpsaWNoIHdpbGxrb21tZW4gYW4gQm9yZDogZWNvbm9teSB1bmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXRlc3NlbicsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0ZyZXVlbiBTaWUgc2ljaCBhdWYgQWlyYmVybGlucyBhIGxhIGNhcnRlLVNwZWlzZSA6IFdpciBzZXJ2aWVyZW4gSWhuZW4gdW5zZXJlIHdhcm1lbiBPbi1Ub3AtU3BlaXNlbiwgZGllIGV4dHJhIHZvbSBTYW5zaWJhci1XaXJ0IEhlcmJlcnQgU2Vja2xlciBrcmVpZXJ0IHd1cmRlbi4nLFxuICAgICAgICBCQUdHQUdFOiAnUmVpc2VnZXDDpGNrJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnVW5zZXJlIFJlZ2x1bmdlbiDDvGJlciBBdWZ6dWdlYmVuZGVzIEdlcMOkY2ttZW5nZW4sIMO8YmVyIEhhbmRnZXDDpGNrIHVuZCBTb25kZXJnZXDDpGNrLidcblxuICAgICAgfSxcblxuICAgIH0pO1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdkZScpO1xuICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZScpO1xuXG4gIH0pO1xuIiwiLy8gQGFiZGVscmhtYW4tZXNzYW1cbkFwcC5jb250cm9sbGVyKCdjb25maXJtYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtY29uZmlybWF0aW9uJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDb25maXJtYXRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiR28gSG9tZVwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGFwaS5zdWJtaXRCb29raW5nKCdmYWxzZScpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgLy8gICBhbGVydChkYXRhLmRhdGEpXG4gICAgICAvLyAgIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAvLyB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAvL1xuICAgICAgLy8gfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cbiAgICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG5cbi8vXG4vLyBjb25zb2xlLmxvZyhcImNob3Nlbk91dGdvaW5nRmxpZ2h0XCIpO1xuLy8gICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4vLyBjb25zb2xlLmxvZyhcImNob3NlblJldHVybmluZ0ZsaWdodFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwicGFzc2VuZ2VyXCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UGFzc2VuZ2VyKCkpXG4vLyBjb25zb2xlLmxvZyhcImJvb2tpbmdcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRCb29raW5nKCkpXG4vLyBjb25zb2xlLmxvZyhcImdvaW5nU2VhdFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldE91dGdvaW5nU2VhdCgpKVxuLy8gY29uc29sZS5sb2coXCJyZXRydW5TZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UmV0dXJuU2VhdCgpKVxuXG5cbn0pO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNXaWZpO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5cbiAgaWYgKGJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuZWNvbm9teUZhcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gIGlmIChvdXRBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICBpZiAob3V0QWlyY3JhZnRoYXNXaWZpKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICB9XG4gb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcblxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcblxuICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgJHNjb3BlLnJlYnVzaW5lc3NPckVjb24gPSByZWJ1c2luZXNzT3JFY29uO1xuICAgICRzY29wZS5yZWZhcmUgPSByZWZhcmU7XG4gICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgfVxuICAkc2NvcGUub3V0Z29pbmdGbGlnaHQgPSBvdXRnb2luZ0ZsaWdodDtcbiAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICRzY29wZS5vdXRmYXJlID0gb3V0ZmFyZTtcbiAgJHNjb3BlLm91dGZhY2lsaXRpZXNSZXN1bHQgPSBvdXRmYWNpbGl0aWVzUmVzdWx0O1xuXG59XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCAkcm91dGVQYXJhbXMpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBhcGkuc2V0SXNPdGhlckhvc3RzKGZhbHNlKTtcblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcblxuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHRJRCA9ICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0Ll9pZDtcblxuICAgICAgaWYgKCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodClcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQuX2lkO1xuXG4gICAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcblxuICAgIH1cblxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICAgIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nID0ge1xuICAgICAgXCJyZWZQYXNzZW5nZXJJRFwiOiBbXSxcbiAgICAgIFwiaXNzdWVEYXRlXCI6IG51bGwsXG4gICAgICBcImlzT25lV2F5XCI6ICEkc2NvcGUucm91bmRUcmlwLFxuICAgICAgXCJyZWZFeGl0RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgIFwicmVmUmVFbnRyeUZsaWdodElEXCI6IG51bGwsXG4gICAgICBcInJlY2VpcHROdW1iZXJcIjogbnVsbFxuICAgIH07XG5cbiAgICBpZiAoIW9yaWdpbiB8fCAhZGVzdGluYXRpb24gfHwgIWV4aXREYXRlKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIHZhciBmbGlnaHRzO1xuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgIGZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuXG4gICAgICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJwb3J0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tqXS50YWlsTnVtYmVyID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXRJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG4gICAgICAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlRW50cnlJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgJHNjb3BlLmZsaWdodHMgPSB7XG4gICAgICBcIm91dGdvaW5nRmxpZ2h0c1wiOiBbe1xuICAgICAgICBcIl9pZFwiOiBcIjFcIixcbiAgICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIixcbiAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwMzowMDowMFpcIixcbiAgICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICAgIH0sIHtcbiAgICAgICAgXCJfaWRcIjogXCIyXCIsXG4gICAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDY6MDA6MDBaXCIsXG4gICAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMDg6MDA6MDBaXCIsXG4gICAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9LCB7XG4gICAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDEyOjAwOjAwWlwiLFxuICAgICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE0OjAwOjAwWlwiLFxuICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9LCB7XG4gICAgICAgIFwiX2lkXCI6IFwiNFwiLFxuICAgICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDE3OjAwOjAwWlwiLFxuICAgICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE5OjAwOjAwWlwiLFxuICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9XSxcbiAgICAgIFwicmV0dXJuRmxpZ2h0c1wiOiBbe1xuICAgICAgICBcIl9pZFwiOiBcIjFcIixcbiAgICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQwMTowMDowMFpcIixcbiAgICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQwMzowMDowMFpcIixcbiAgICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICAgIH0sIHtcbiAgICAgICAgXCJfaWRcIjogXCIyXCIsXG4gICAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMDY6MDA6MDBaXCIsXG4gICAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMDg6MDA6MDBaXCIsXG4gICAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9LCB7XG4gICAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDEyOjAwOjAwWlwiLFxuICAgICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE0OjAwOjAwWlwiLFxuICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9LCB7XG4gICAgICAgIFwiX2lkXCI6IFwiNFwiLFxuICAgICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDE3OjAwOjAwWlwiLFxuICAgICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE5OjAwOjAwWlwiLFxuICAgICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgICB9XVxuICAgIH07XG5cbiAgICAkc2NvcGUub3JpZ2luID0gXCJDQUlcIjtcbiAgICAkc2NvcGUuZGVzdGluYXRpb24gPSBcIkpFRFwiO1xuICAgICRzY29wZS5leGl0RGF0ZSA9IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIjtcblxuICAgICRzY29wZS5taW5pTG9nb1BhdGggPSBmdW5jdGlvbihvcGVyYXRvckFpcmxpbmUpIHtcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUgPT09IFwiQWlyIEJlcmxpblwiKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLWJlcmxpbi1taW5pLWxvZ28ucG5nXCJcbiAgICAgIHJldHVybiBcImltZy9vdGhlci1haXJsaW5lLW1pbmktbG9nby5wbmdcIlxuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICB9XG5cbiAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZU91dDtcbiAgfTtcblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywgJyRzdGF0ZVBhcmFtcyddO1xufSBlbHNlIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsICckcm91dGVQYXJhbXMnXTtcbn1cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNDdHJsJywgZmxpZ2h0Q29udHJvbGxlcik7XG4iLCJ2YXIgZmxpZ2h0TmV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgIGFwaS5zZXRJc090aGVySG9zdHModHJ1ZSk7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgICAgXCJwYXNzZW5nZXJEZXRhaWxzXCI6IFt7XG4gICAgICAgICAgICBcImZpcnN0TmFtZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJsYXN0TmFtZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwYXNzcG9ydE51bVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZW1haWxcIjogbnVsbCxcbiAgICAgICAgfV0sXG4gICAgICAgIFwiY2xhc3NcIjogbnVsbCxcbiAgICAgICAgXCJvdXRnb2luZ0ZsaWdodElkXCI6IG51bGwsXG4gICAgICAgIFwicmV0dXJuRmxpZ2h0SWRcIjogbnVsbCxcbiAgICAgICAgXCJwYXltZW50VG9rZW5cIjogbnVsbFxuICAgIH1cblxuICAgIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcblxuICAgIHZhciBpc0Vjb25vbXkgPSAkcm91dGVQYXJhbXMuZmxpZ2h0Q2xhc3MgPT0gXCJFY29ub215XCI7XG4gICAgY29uc29sZS5sb2coaXNFY29ub215KVxuICAgICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICAgIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGlzRWNvbm9teSkge1xuICAgICAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLmdldE90aGVyRmxpZ2h0c0J1c2kob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuY2xhc3MgPSBpc0Vjb25vbXkgPT09IHRydWUgPyBcImVjb25vbXlcIiA6IFwiYnVzaW5lc3NcIjtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gZmxpZ2h0LmZsaWdodElkO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nVXJsID0gZmxpZ2h0LnVybDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0Nvc3QgPSBmbGlnaHQuY29zdDtcblxuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuRmxpZ2h0SWQgPSBmbGlnaHQuZmxpZ2h0SWQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuVXJsID0gZmxpZ2h0LnVybDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5Db3N0ID0gZmxpZ2h0LmNvc3Q7XG5cbiAgICB9XG5cbiAgICAkc2NvcGUuY2hlY2tOZXh0QnRuU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgJiYgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgfVxuXG59XG5cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59IGVsc2Uge1xuICAgIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJywgXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c05ld0N0cmwnLCBmbGlnaHROZXdDb250cm9sbGVyKTtcbiIsIiB2YXIgbWFpbkNvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCR0cmFuc2xhdGUpIHtcbiAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1tYWluJztcblxuICAgJHNjb3BlLmdvID0gZnVuY3Rpb24oKSB7XG4gICAgIGNvbnNvbGUubG9nKCRzY29wZS5zZWxlY3RlZE9yaWdpbik7XG4gICB9XG5cbiAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgJHNjb3BlLmFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICB9KTtcblxuXG4gICAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gPSB1bmRlZmluZWQ7XG4gICAkc2NvcGUuc2VsZWN0ZWREZXN0ID0gdW5kZWZpbmVkO1xuXG4gICBmdW5jdGlvbiBhaXJwb3JzQ29udGFpbnMoaWF0YSkge1xuICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5haXJwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgIGlmIChpYXRhID09ICRzY29wZS5haXJwb3J0c1tpXVsnaWF0YSddKVxuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgIH1cbiAgICAgcmV0dXJuIGZhbHNlO1xuICAgfVxuXG4gICAkc2NvcGUuYnV0dG9uU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgcmV0dXJuICEkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgISRzY29wZS5zZWxlY3RlZERlc3QgfHwgISRzY29wZS5leGl0RGF0ZSB8fCAkc2NvcGUuc2VsZWN0ZWREZXN0ID09ICRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZE9yaWdpbikgfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWREZXN0KTtcbiAgIH1cblxuICAgJHNjb3BlLmZsaWdodCA9IHtcbiAgICAgdHlwZTogXCJvbmVcIlxuICAgfVxuICAgJHNjb3BlLm90aGVyQWlybGluZSA9IHtcbiAgICAgdmFsdWU6IGZhbHNlXG4gICB9XG5cblxuXG4gICAkc2NvcGUuZ29Ub0ZsaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAgdmFyIGV4aXREYXRlLCByZXR1cm5EYXRlO1xuXG4gICAgIGV4aXREYXRlID0gKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApO1xuICAgICBpZiAoJHNjb3BlLnJldHVybkRhdGUpXG4gICAgICAgcmV0dXJuRGF0ZSA9ICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApO1xuXG4gICAgIGlmICgkc2NvcGUub3RoZXJBaXJsaW5lLnZhbHVlKSB7XG4gICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ2ZsaWdodENsYXNzJywkc2NvcGUuY2xhc3NlQnRuVGV4dCk7XG5cbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlXG4gICAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsIHJldHVybkRhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ2ZsaWdodENsYXNzJywkc2NvcGUuY2xhc3NlQnRuVGV4dCk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZSxcbiAgICAgICAgICAgICByZXR1cm5EYXRlOiByZXR1cm5EYXRlXG4gICAgICAgICAgIH0pXG4gICAgICAgfVxuICAgICB9IGVsc2Uge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKS5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdCkuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMClcbiAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMClcbiAgICAgICAgICAgfSlcbiAgICAgICB9XG5cbiAgICAgfVxuXG4gICB9O1xuXG5cblxuXG4gICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICAgc3RyaW5nczogWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5PTkUnKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuVFdPJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLlRIUkVFJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLkZPVVInKV0sXG4gICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgICBsb29wOiB0cnVlXG4gICAgIH0pO1xuXG5cbiAgICAgJGxvY2F0aW9uLnVybCgkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAgJHNjb3BlLmNoaWxkcmVuID0gWycwICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzEgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRCcpLCAnMiAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICczICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzQgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpXTtcbiAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9ICRzY29wZS5jaGlsZHJlblswXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cblxuXG4gICAgICRzY29wZS5hZHVsdHMgPSBbJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFQnKSAsICcyICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnMyAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnNCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVHMnKV07XG4gICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5JTkZBTlQnKSwgJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uSU5GQU5UUycpXTtcbiAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSAkc2NvcGUuaW5mYW50c1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUluZmFudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuXG4gICAgICRzY29wZS5jbGFzc2VzID0gWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5FQ09OT01ZJyksICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5CVVNJTkVTUycpXTtcbiAgICAgJHNjb3BlLmNsYXNzZUJ0blRleHQgPSAkc2NvcGUuY2xhc3Nlc1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jbGFzc2VCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuICAgfVxuXG5cbiB9O1xuXG4gZnVuY3Rpb24gc2V0VXBEYXRlKCRzY29wZSkge1xuICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgIH07XG4gICAkc2NvcGUudG9kYXkoKTtcblxuICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG4gICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUucG9wdXAub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG5cblxuICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICB9XG4gICAkc2NvcGUuZGF0ZU9wdGlvbnMgPSB7XG4gICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDUsIDIyKSxcbiAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgc3RhcnRpbmdEYXk6IDFcbiAgIH07XG4gICAkc2NvcGUucG9wdXAyID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuIH1cblxuIGlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9IGVsc2Uge1xuICAgbWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckdHJhbnNsYXRlJ107XG4gfVxuXG4gQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgbWFpbkNvbnRyb2xsZXIpO1xuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJGaWxsIGluIHlvdXIgZGV0YWlsc1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxpdHk6IG51bGwsXG4gICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICBmaXJzdE5hbWU6IG51bGwsXG4gICAgICAgIG1pZGRsZU5hbWU6IG51bGwsXG4gICAgICAgIGxhc3ROYW1lOiBudWxsLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogbnVsbCxcbiAgICAgICAgcGhvbmVOdW1iZXI6IG51bGwsXG4gICAgICAgIGVtYWlsOiBudWxsXG5cbiAgICB9O1xuXG5cbiAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgICAgICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSAkc2NvcGUudGl0bGVzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlVGl0bGUgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhcGkuZ2V0Q291bnRyaWVzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmNvdW50cmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICB9KTtcblxuXG5cblxuXG5cbiAgICAgICAgdmFyIGNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuXG5cbiAgICAgICAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICAgICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUubmF0aW9uYWxpdHksXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUudGl0bGVzQnRuVGV4dCxcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWUsXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFcblxuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8vYmVmb3JlIHlvdSBsZWF2ZSB0aGUgcGFnZSBtYWtlIHN1cmUgdGhhdCB0aGUgcGFzc2VuZ2VyIG9iamVjdCBpcyBjb21wbGV0ZSBvdGhlcndpc2Ugc2hvdyBhbGVydChcIkZpbGwgaW4gYWxsIGRhdGFcIik7XG5cblxuXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vICAgJHNjb3BlLmFsZXJ0RGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICBpZiAoKCRzY29wZS5maXJzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHx8ICgkc2NvcGUubGFzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5waG9uZU51bWJlciA9PSBudWxsKSB8fCAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWwxID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWx2ZXIgPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnREYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICAgIC8vICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgLy8gICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIC8vICAgaWYgKCFhcGkuaXNPdGhlckhvc3RzKVxuICAgICAgICAgICAgLy8gICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgLy8gICBlbHNlICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV07XG5cbiAgICAgICAgICAgICRzY29wZS5hbGVydEZOYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TE5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydFBoTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcblxuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzBdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Rk5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmxhc3ROYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRMTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbM10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQaE51bWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsdmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMSAhPSAkc2NvcGUuZW1haWx2ZXIpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbN10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2hlY2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbHBhc3NpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZHNbaV0gPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxscGFzc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxwYXNzaW5nID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFwaS5Jc090aGVySG9zdHMoKSkge1xuICAgICAgICAgICAgICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvb3V0Z29pbmcnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLnBhc3NlbmdlckRldGFpbHNbMF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmaXJzdE5hbWVcIjogJHNjb3BlLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3ROYW1lXCI6ICRzY29wZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhc3Nwb3J0TnVtXCI6ICRzY29wZS5wYXNzcG9ydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhc3Nwb3J0RXhwaXJ5RGF0ZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hdGlvbmFsaXR5XCI6ICRzY29wZS5uYXRpb25hbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6ICRzY29wZS5lbWFpbDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhcGkuc2V0Qm9va2luZyhib29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG5cblxuXG4gICAgICAgIHZhciBjb21wbGV0ZTEgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUuTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICAgICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUuY291bnRyaWVzTW9iLFxuICAgICAgICAgICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICAgICAgICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBwb2ludHM6IG51bGwsXG4gICAgICAgICAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHNjb3BlLlRpdGxlTW9iLFxuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLmZpcnN0TmFtZU1vYixcbiAgICAgICAgICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZU1vYixcbiAgICAgICAgICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lTW9iLFxuICAgICAgICAgICAgICAgIHBhc3Nwb3J0TnVtYmVyOiAkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IsXG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlck1vYixcbiAgICAgICAgICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMU1vYlxuXG5cbiAgICAgICAgICAgIH07XG5cblxuXG5cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZTEgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDFNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlck1vYiA9PSBudWxsKSkge1xuICAgICAgICAgICAgLy8gICAgIGFsZXJ0KFwiUGxlYXNlIGZpbGwgaW4gZGF0YTpcIiArIFwiXFxuXCIgKyBcIlBhc3Nwb3J0IE51bWJlciBtdXN0IGJlIDggbnVtYmVyc1wiICsgXCJcXG5cIiArXG4gICAgICAgICAgICAvLyAgICAgICBcIlBob25lIE51bWJlciBtdXN0IGJlIDEwIG51bWJlcnNcIiArIFwiXFxuXCIgKyBcIkVtYWlscyBtdXN0IGJlIGluIGFAeHl6LmNvbSBmb3JtYXRcIik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICBpZiAoJHNjb3BlLmVtYWlsMU1vYiAhPSAkc2NvcGUuZW1haWx2ZXJNb2IpXG4gICAgICAgICAgICAvLyAgICAgICBhbGVydChcIlRoZSBlbnRlcmVkIGVtYWlscyBkbyBub3QgbWF0Y2hcIik7XG4gICAgICAgICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgaWYgKCgkc2NvcGUuY2hlY2tNb2IgPT0gbnVsbCkpXG4gICAgICAgICAgICAvLyAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24geW91IGVudGVyZWRcIilcbiAgICAgICAgICAgIC8vICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb21wbGV0ZTEgPSB0cnVlO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUxID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICRsb2NhdGlvbi5wYXRoKCcvdGFiL3NlYXRpbmcvb3V0Z29pbmcnKTtcbiAgICAgICAgICAgIC8vIH1cblxuXG5cbiAgICAgICAgICAgIHZhciBmaWVsZHNNb2IgPSBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV07XG5cblxuXG5cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbMF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBFbnRlciB5b3VyIGZpcnN0IG5hbWUuXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1pZGRsZU5hbWVNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlsxXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgbWlkZGxlIG5hbWUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5sYXN0TmFtZU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBsYXN0IG5hbWUuXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBob25lTnVtYmVyTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbM10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIHBob25lIG51bWJlciwgaXQgbXVzdCBiZSAxMCBkaWdpdHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIHBhc3Nwb3J0IG51bWJlciwgaXQgbXVzdCBiZSA4IGRpZ2l0cy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzVdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCwgaXQgbXVzdCBiZSBpbiB0aGlzIGZvcm1hdCAnYUB4eXouY29tJyBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsdmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjb25maXJtIHlvdXIgZW1haWwsIGl0IG11c3QgYmUgaW4gdGhpcyBmb3JtYXQgJ2FAeHl6LmNvbScgXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMSAhPSAkc2NvcGUuZW1haWx2ZXIpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbN10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlRoZSBlbnRlcmVkIGVtYWlscyBkbyBub3QgbWF0Y2hcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNoZWNrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbOF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHlvdSd2ZSBlbnRlcmVkXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWxscGFzc2luZ01vYiA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzTW9iLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkc01vYltpXSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxwYXNzaW5nTW9iID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbHBhc3NpbmdNb2IgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG5cbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3RhYi9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICB9XG5cblxuXG59KTtcbiIsIi8vIEBtaXJuYVxuQXBwLmNvbnRyb2xsZXIoJ3BheW1lbnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBhcGkpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgeW91ciBwYXltZW50IG9wdGlvblwiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgICRzY29wZS5mb3JtID0ge1xuICAgICAgICBudW1iZXI6IG51bGwsXG4gICAgICAgIGN2YzogbnVsbCxcbiAgICAgICAgZXhwX21vbnRoOiBudWxsLFxuICAgICAgICBleHBfeWVhcjogbnVsbFxuICAgIH07XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgcGF5P1wiKTtcbiAgICAgICAgaWYgKHIgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAkc2NvcGUueWVhcnNCdG5UZXh0XG4gICAgICAgICAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcblxuXG5cbiAgICAgICAgICAgIGlmICghYXBpLklzT3RoZXJIb3N0cygpKVxuICAgICAgICAgICAgICAgIFN0cmlwZS5jYXJkLmNyZWF0ZVRva2VuKCRzY29wZS5mb3JtLCBmdW5jdGlvbihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuaWQpXG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRTdHJpcGVUb2tlbihyZXNwb25zZS5pZClcbiAgICAgICAgICAgICAgICAgICAgYXBpLnN1Ym1pdEJvb2tpbmcoYXBpLklzT3RoZXJIb3N0cygpKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTsge1xuICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5VcmwgPT0gYm9va2luZy5vdXRnb2luZ1VybCB8fCAhYm9va2luZy5yZXR1cm5VcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuQ29zdClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcucmV0dXJuQ29zdCkgKyBwYXJzZUludChib29raW5nLm91dGdvaW5nQ29zdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgYXBpLmdldFN0cmlwZUtleShcImh0dHA6Ly9cIiArIGJvb2tpbmcub3V0Z29pbmdVcmwgKyAnL3N0cmlwZS9wdWJrZXknKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nJyk7XG4gICAgfVxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJpY2UgPSAwO1xuICAgICAgICBpZiAoYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpIHtcblxuICAgICAgICAgICAgaWYgKGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cblxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUucHJpY2UgPSBwcmljZTtcbiAgICAgICAgJHNjb3BlLnllYXJzID0gWycyMDE2JywgJzIwMTcnLCAnMjAxOCcsICcyMDE5JywgJzIwMjAnLCAnMjAyMScsICcyMDIyJywgJzIwMjMnLCAnMjAyNCddO1xuICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gJHNjb3BlLnllYXJzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICRzY29wZS55ZWFyc0J0blRleHQgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1vbnRocyA9IFsnSmFudWFyeScsICdGZWJ1cmFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9ICRzY29wZS5tb250aHNbMF07XG4gICAgICAgICRzY29wZS5jaGFuZ2VNb250aCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICRzY29wZS5tb250aHNCdG5ObyA9ICRzY29wZS5tb250aHMuaW5kZXhPZih0ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4iLCIvLyBAYWhtZWQtZXNzbWF0XG4gIHZhciBzZWF0aW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2Utc2VhdGluZyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBzaXQ/XCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL3JldHVyaW5nJyk7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRSZXRydW5TZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICB9XG5cblxuXG4gICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXRtYXA7XG5cbiAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG5cbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9XG5cblxuXG4gICAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgICB2YXIgc2NoZW1hID0gWzMsIDUsIDMsIDIwXTtcblxuICAgICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnNlYXJjaENvbG9yID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGlmICghJHNjb3BlLmlzRW1wdHkodGV4dCkpXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdE9jdSc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRFbXB0eSc7XG4gICAgICB9XG4gICAgICAkc2NvcGUuaXNFbXB0eSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXRtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXRtYXBbaV1bJ251bWJlciddID09IHRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWF0bWFwW2ldWydpc0VtcHR5J11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3RTZWF0ID0gZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICRzY29wZS5zZWF0ID0gc2VhdDtcbiAgICAgIH07XG4gICAgfVxuXG5cblxuICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICB2YXIgc2NoZW1hID0gWzIsIDQsIDIsIDldO1xuXG4gICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgfVxuXG5cbn07XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignc2VhdGluZ0N0cmwnLCBzZWF0aW5nQ29udHJvbGxlcik7XG4iXX0=
