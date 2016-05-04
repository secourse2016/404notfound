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
                    api.getStripeKey(url + '/stripe/pubkey/').then(function(data) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb24gPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wdXQgPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucGF0Y2ggPSB7fTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xuICAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xufSk7XG5cbkFwcC5mYWN0b3J5KCdhcGknLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICAgIHZhciBjaG9zZW5PdXRnb2luZ0ZsaWdodCwgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0LCBib29raW5nRGF0YSwgY2FiaW5ldE91dGdvaW5nQ2xhc3MsIGNhYmluZXRSZXR1cm5pbmdDbGFzcywgb3V0Z29pbmdTZWF0LCByZXR1cm5TZWF0LCByZWZOdW07XG4gICAgdmFyIGlzT3RoZXJIb3N0czsgLy8gc2V0IHRvIGZhbHNlIGluIGZsaWdodHNjdHJsICxzZXQgdG8gdHJ1ZSBmbGlnaHRzTmV3Q3RybFxuICAgIHZhciBzdHJpcGVUb2tlbjtcbiAgICB2YXIgcGFzc2VuZ2VyRGF0YSA9IFtdO1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldFN0cmlwZUtleTogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6dW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QWlycG9ydHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2FpcnBvcnRzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RmxpZ2h0czogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi8wLzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0VjbzogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgICAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE90aGVyRmxpZ2h0c0J1c2k6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEFpcmNyYWZ0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvYWlyY3JhZnRzJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q291bnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL2NvdW50cmllcycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHNldE91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRSZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKHBhc3Nlbmdlcikge1xuICAgICAgICAgICAgcGFzc2VuZ2VyRGF0YS5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICBpZiAoaXNPdGhlckhvc3RzKVxuICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhLlBhc3NlbmdlckRldGFpbHMgPSBwYXNzZW5nZXJEYXRhXG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRPdXRnb2luZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0T3V0Z29pbmdDbGFzcztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWJpbmV0UmV0dXJuaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEJvb2tpbmc6IGZ1bmN0aW9uKGJvb2tpbmcpIHtcbiAgICAgICAgICAgIGlmICghaXNPdGhlckhvc3RzKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSlcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLmNsYXNzKVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLmNsYXNzKVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgIGJvb2tpbmdEYXRhID0gYm9va2luZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3NlbmdlckRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEJvb2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGJvb2tpbmdEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5PdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuT3V0Z29pbmdGbGlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENob3NlblJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hvc2VuUmV0dXJuaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dGdvaW5nU2VhdDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZXR1cm5TZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5TZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIG91dGdvaW5nU2VhdCA9IHNlYXQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFJldHJ1blNlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgICAgICAgIHJldHVyblNlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRJc090aGVySG9zdHM6IGZ1bmN0aW9uKG90aGVySG9zdHMpIHtcbiAgICAgICAgICAgIGlzT3RoZXJIb3N0cyA9IG90aGVySG9zdHM7XG4gICAgICAgIH0sXG4gICAgICAgIElzT3RoZXJIb3N0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNPdGhlckhvc3RzO1xuICAgICAgICB9LFxuICAgICAgICBjbGVhckxvY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IHt9XG4gICAgICAgICAgICBwYXNzZW5nZXJEYXRhID0gW11cbiAgICAgICAgICAgIGJvb2tpbmdEYXRhID0ge31cbiAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0ge31cbiAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSB7fVxuICAgICAgICAgICAgcmV0dXJuU2VhdCA9IHt9XG4gICAgICAgICAgICBpc2lzT3RoZXJIb3N0cyA9IGZhbHNlXG5cbiAgICAgICAgfSxcbiAgICAgICAgc3VibWl0Qm9va2luZzogZnVuY3Rpb24ob3RoZXJIb3N0cyx1cmwpIHtcbiAgICAgICAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHByaWNlID0gdGhpcy5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICAgICAgICAgIHByaWNlID0gcHJpY2UgKyB0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICAgICAgaWYgKCFvdGhlckhvc3RzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYm9va2luZycsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogb3RoZXJIb3N0c1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlbmdlcjogcGFzc2VuZ2VyRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGJvb2tpbmdEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdTZWF0TnVtYmVyOiBvdXRnb2luZ1NlYXQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5TZWF0TnVtYmVyOiByZXR1cm5TZWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHN0cmlwZVRva2VuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCArICcvYm9va2luZycsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKGJvb2tpbmdEYXRhKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIGdldFN0cmlwZVRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpcGVUb2tlbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgICBzdHJpcGVUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiICBBcHAuY29uZmlnKGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xuICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xuICAgICAgTUFJTjoge1xuICAgICAgICBCT09LX05PVzogJ0Jvb2sgTm93JyxcbiAgICAgICAgRlJPTTogJ0Zyb20nLFxuICAgICAgICBGTFlJTkdfRlJPTTogJ0ZseWluZyBmcm9tJyxcbiAgICAgICAgREVQQVJUVVJFX0RBVEU6ICdEZXBhcnR1cmUgRGF0ZScsXG4gICAgICAgIFRPOiAnVG8nLFxuICAgICAgICBGTFlJTkdfVE86ICdGbHlpbmcgdG8nLFxuICAgICAgICBSRUVOVFJZX0RBVEU6ICdSZS1lbnRyeSBEYXRlJyxcbiAgICAgICAgVU5ERVJfMl9ZRUFSUzogJ1VuZGVyIDIgeWVhcnMnLFxuICAgICAgICBST1VORF9UUklQOiAnUm91bmQgVHJpcCcsXG4gICAgICAgIE9ORV9XQVk6ICdPbmUgV2F5JyxcbiAgICAgICAgT1RIRVJfQUlSTElORVM6ICdTZWFyY2ggb3RoZXIgYWlybGluZXMnLFxuICAgICAgICBTRUFSQ0hfRk9SX0ZMSUdIVFM6ICdTZWFyY2ggZm9yIGZsaWdodHMnLFxuICAgICAgICBZRUFSUzogXCJ5ZWFyc1wiLFxuICAgICAgICBDSElMRFJFTjogJ2NoaWxkcmVuJyxcbiAgICAgICAgQ0hJTEQ6ICdjaGlsZCcsXG4gICAgICAgIEFEVUxUOiAnYWR1bHQnLFxuICAgICAgICBBRFVMVFM6ICdhZHVsdHMnLFxuICAgICAgICBJTkZBTlRTOiAnaW5mYW50cycsXG4gICAgICAgIElORkFOVDogJ2luZmFudCcsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFFVT1RFU19IT01FOiB7XG4gICAgICAgICAgT05FOiBcIlNpbXBsZSwgY29udmVuaWVudCwgaW5zdGFudCBjb25maXJtYXRpb24uXCIsXG4gICAgICAgICAgVFdPOiBcIkRlc3RpbmF0aW9ucyBhbGwgYXJvdW5kIHRoZSBnbG9iZS5cIixcbiAgICAgICAgICBUSFJFRTogXCJFeHBlcmllbmNlIGF1dGhlbnRpYyBob3NwaXRhbGl0eS5cIixcbiAgICAgICAgICBGT1VSOiBcIlRpbWUgdG8gZ2V0IGVuY2hhbnRlZC5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRkxJR0hUUzoge1xuICAgICAgICBUSVRMRTogJ0Nob29zZSBhIEZsaWdodCcsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdzZWF0cyBsZWZ0JyxcbiAgICAgICAgTU9SRV9ERVRBSUxTOiAnTW9yZSBkZXRhaWxzJyxcbiAgICAgICAgQk9PSzogJ0Jvb2snLFxuICAgICAgICBTRUxFQ1Q6J1NlbGVjdCcsXG4gICAgICAgIEZMSUdIVDogJ0ZsaWdodCcsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknXG4gICAgICB9LFxuICAgICAgRkxJR0hUOiB7XG4gICAgICAgIEZMSUdIVDogXCJGbGlnaHRcIixcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgVElUTEU6ICdGbGlnaHQgRGV0YWlscycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknLFxuICAgICAgICBOVU1CRVJfT0ZfUEFTU0VOR0VSUzogJ051bWJlciBvZiBwYXNzZW5nZXJzJyxcbiAgICAgICAgRkxZSU5HX0NBTFNTOiAnRmx5aW5nIGNsYXNzJyxcbiAgICAgICAgRkxJR0hUX0ZBUkU6ICdGbGlnaHQgZmFyZScsXG4gICAgICAgIEZMSUdIVF9GQUM6ICdGbGlnaHQgZmFjaWxpdGllcycsXG4gICAgICAgIFBBU1NFTkdFUjogJ3Bhc3NlbmdlcicsXG4gICAgICAgIFBBU1NFTkdFUlM6ICdwYXNzZW5nZXJzJ1xuICAgICAgfSxcbiAgICAgIE5BVjoge1xuICAgICAgICBHT19IT01FOidHbyBIb21lJyxcbiAgICAgICAgU1VCTUlUOiAnU3VibWl0JyxcbiAgICAgICAgTkVYVDogJ05leHQnLFxuICAgICAgICBCQUNLOiAnQmFjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlY2lhbCBPZmZlcnMnLFxuICAgICAgICBTRVJWSUNFUzogJ1NlcnZpY2VzJyxcbiAgICAgICAgT1VSX1RFQU06ICdPdXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnQWJvdXQnLFxuICAgICAgICBDT05UQUNUX1VTOiAnQ29udGFjdCBVcycsXG4gICAgICAgIENIT09TRV9MQU5HVUFHRTonQ2hvb3NlIGxhbmd1YWdlJyxcbiAgICAgICAgRU5HTElTSDogJ0VuZ2xpc2gnLFxuICAgICAgICBHRVJNQU46J0dlcm1hbidcbiAgICAgIH0sXG5cbiAgICAgIENPTkZJUk1BVElPTjoge1xuICAgICAgICBUSEFOS19ZT1U6ICdUaGFuayB5b3UnLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnUGhvbmUnLFxuICAgICAgICBNQUlMOiAnRS1tYWlsJyxcbiAgICAgICAgRkxJR0hUTk86ICdGbGlnaHQgbnVtYmVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnRGVwYXJ0dXJlJyxcbiAgICAgICAgQVJSQUlWQUw6ICdBcnJpdmFsJyxcbiAgICAgICAgUFJJTlQ6ICdQcmludCB0aWNrZXQnXG4gICAgICB9LFxuICAgICAgQ09OVEFDVF9VUzoge1xuXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBMRUFWRV9NU0c6ICdMZWF2ZSB1cyBhIG1lc3NhZ2UnLFxuICAgICAgICBTRU5EOiAnU2VuZCdcbiAgICAgIH0sXG4gICAgICBmb3VyX29fZm9yOiB7XG4gICAgICAgIC8vRG8geW91IG1lYW4gNDA0bm90Zm91bmQgdGVhbSA/ICBpbiA0MDQuaHRtbFxuICAgICAgICBRVUVTVElPTjogJ0RvIHlvdSBtZWFuIDQwNE5vdEZvdW5kIFRlYW0/J1xuXG4gICAgICB9LFxuXG4gICAgICBBQk9VVF9VUzoge1xuXG4gICAgICAgIEFCT1VUOiAnQWJvdXQgQWlyQmVybGluJyxcbiAgICAgICAgSElTVE9SWTogJ0hpc3RvcnknLFxuICAgICAgICBISVNUT1JZX1BBUkE6ICdUaGUgZmlyc3QgYWlyYmVybGluIHBsYW5lIHRvb2sgb2ZmIG9uIDI4dGggQXByaWwgMTk3OS4gRXhwZXJpZW5jZSB0aGUgaGlnaGxpZ2h0cyBhbmQgbWlsZXN0b25lcyBpbiBhaXJiZXJsaW5zIGhpc3RvcnkgJyxcbiAgICAgICAgT1VSX0dPQUw6ICdPdXIgZ29hbCcsXG4gICAgICAgIE9VUl9HT0FMX1BBUkE6ICdGaXJzdCBFdXJvcGUsIGFuZCB0aGVuIHRoZSBnbG9iZSwgd2lsbCBiZSBsaW5rZWQgYnkgZmxpZ2h0LCBhbmQgbmF0aW9ucyBzbyBrbml0IHRvZ2V0aGVyIHRoYXQgdGhleSB3aWxsIGdyb3cgdG8gYmUgbmV4dC1kb29yIG5laWdoYm9yc+KApiAuIFdoYXQgcmFpbHdheXMgaGF2ZSBkb25lIGZvciBuYXRpb25zLCBhaXJ3YXlzIHdpbGwgZG8gZm9yIHRoZSB3b3JsZC4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLmFpcmJlcmxpbiBndWFyYW50ZWVzIGEgZGVuc2UgY29ubmVjdGlvbiBuZXR3b3JrIGFuZCBjb25zdGFudCBncm93dGggdGhhbmtzIHRvIHRoZSBjby1vcGVyYXRpb24gd2l0aCBvdGhlciBhaXJsaW5lcy4nXG4gICAgICB9LFxuXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIEZMSUdIVF9PRkZFUlM6ICdGbGlnaHQgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZCB0aGUgbW9zdCBhdHRyYWN0aXZlIGZhcmUgZm9yIHlvdXIgZmxpZ2h0JyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0xpa2UgdXMgb24gRmFjZWJvb2snLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LX1BBUkE6ICdEb250IG1pc3Mgb3VyIHNwZWNpYWwgb2ZmZXJzIG9uOiB3aXRoIG91ciBuZXdzbGV0dGVyIGFuZCBvbiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU3BlY2lhbCBvZmZlcnMgZm9yIHlvdXIgaG90ZWwgc3RheSBhd2F5IGZyb20gb3VyIHBhcnRuZXJzIC4nXG4gICAgICB9LFxuXG5cbiAgICAgIFBBU1NfREVUQUlMUzoge1xuICAgICAgICBGSVJTVF9OQU1FOiAnRmlyc3QgTmFtZScsXG4gICAgICAgIE1JRERMRV9OQU1FOiAnTWlkZGxlIE5hbWUnLFxuICAgICAgICBMQVNUX05BTUU6ICdMYXN0IE5hbWUnLFxuICAgICAgICBQQVNTX05POiAnUGFzc3BvcnQgTnVtYmVyJyxcbiAgICAgICAgUExBQ0VfT0ZCSVJUSDogJ1BsYWNlIE9mIEJpcnRoJyxcbiAgICAgICAgUEhPTkVfTk86ICdQaG9uZSBOdW1iZXInLFxuICAgICAgICBFX01BSUw6ICdFbWFpbCcsXG4gICAgICAgIFJFUEVBVF9FX01BSUw6ICdSZXBlYXQgRW1haWwnLFxuICAgICAgICBWRVJJRllfUEFSQTogJ0kgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiBwcm92aWRlZCBtYXRjaGVzIHRoZSBwYXNzcG9ydCBpbmZvcm1hdGlvbi4nXG5cbiAgICAgIH0sXG4gICAgICBQQVlNRU5UOiB7XG5cbiAgICAgICAgV0VfQUNDRVBUOiAnV2UgYWNjZXB0JyxcbiAgICAgICAgQ0FSRF9JTkZPOiAnQ2FyZCBpbmZvcm1hdGlvbjonLFxuICAgICAgICBFWFBfREFURTogJ0V4cGlyZSBEYXRlOicsXG4gICAgICAgIENPU1Q6ICdZb3VyIGJvb2tpbmcgdG90YWwgY29zdCdcblxuICAgICAgfSxcblxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2VhdG1hcCcsXG4gICAgICAgIFNFTEVDVEVEOiAnWW91IHNlbGVjdGVkIHNlYXQnXG5cbiAgICAgIH0sXG5cbiAgICAgIFNFUlZJQ0VTOiB7XG5cbiAgICAgICAgU0VSVklDRTogJ1NlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfU0VSVklDRVM6ICdJbmZsaWdodCBTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1BBUkE6ICcgIEFpcmJlcmxpbiBwcmVzZW50cyB0aGUgZWNvbm9teSBhbmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXQgTWVhbHMnLFxuICAgICAgICBHX01FQUxTX1BBUkE6ICdBaXJiZXJsaW4gaXMgdGhlIHJpZ2h0IGFpcmxpbmUgZm9yIGNvbm5vaXNzZXVyczogdHJlYXQgeW91cnNlbGYgdG8gb25lIG9mIHRoZSBkZWxpY2lvdXMgZ291cm1ldCBtZWFscyBmcm9tIFwiU2Fuc2liYXJcIiBvbiBib2FyZCcsXG4gICAgICAgIEJBR0dBR0U6ICdCYWdnYWdlJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnRXZlcnl0aGluZyB5b3UgbmVlZCB0byBrbm93IGFib3V0IGZyZWUgYmFnZ2FnZSBhbGxvd2FuY2VzLCBjYWJpbiBiYWdnYWdlIHJlZ3VsYXRpb25zIGFuZCBzcGVjaWFsIGJhZ2dhZ2UuJ1xuXG4gICAgICB9LFxuXG4gICAgfSk7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZGUnLCB7XG4gICAgICBNQUlOOiB7XG4gICAgICAgIEJPT0tfTk9XOiAnSmV0enQgYnVjaGVuJyxcbiAgICAgICAgRlJPTTogJ3ZvbicsXG4gICAgICAgIEZMWUlOR19GUk9NOiAnQWJmbHVnaGFmZW4nLFxuICAgICAgICBERVBBUlRVUkVfREFURTogJ0hpbmZsdWcnLFxuICAgICAgICBUTzogJ25hY2gnLFxuICAgICAgICBGTFlJTkdfVE86ICdaaWVsZmx1Z2hhZmVuJyxcbiAgICAgICAgUkVFTlRSWV9EQVRFOiAnUsO8Y2tmbHVnJyxcbiAgICAgICAgVU5ERVJfMl9ZRUFSUzogJ0rDvG5nZXIgYWxzIDIgSmFocmVuJyxcbiAgICAgICAgUk9VTkRfVFJJUDogJ0hpbi0vUsO8Y2tmYWhydCcsXG4gICAgICAgIE9ORV9XQVk6ICdOdXIgSGluZmx1ZycsXG4gICAgICAgIE9USEVSX0FJUkxJTkVTOiAnQW5kZXJlIEZsdWdnZXNlbGxzY2hhZnRlbicsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ0Zsw7xnZSBzdWNoZW4nLFxuICAgICAgICBZRUFSUzogXCJKYWhyZVwiLFxuICAgICAgICBDSElMRFJFTjogJ0tpbmRlcicsXG4gICAgICAgIENISUxEOiAnS2luZCcsXG4gICAgICAgIEFEVUxUOiAnRXJ3YWNoc2VuZXInLFxuICAgICAgICBBRFVMVFM6ICdFcndhY2hzZW5lbicsXG4gICAgICAgIElORkFOVFM6ICdCYWJ5cycsXG4gICAgICAgIElORkFOVDogJ0JhYnknLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBRVU9URVNfSE9NRToge1xuICAgICAgICAgIE9ORTogXCJFaW5mYWNoLCBiZXF1ZW0sIHNvZm9ydGlnZSBCZXN0w6R0aWd1bmcuXCIsXG4gICAgICAgICAgVFdPOiBcIlppZWxlbiBhdWYgZGVyIFdlbHQuXCIsXG4gICAgICAgICAgVEhSRUU6IFwiQXV0aGVudGlzY2hlIEdhc3RmcmV1bmRzY2hhZnQgZXJsZWJlbi5cIixcbiAgICAgICAgICBGT1VSOiBcIlZlcnd1bnNjaGVuZSBaZWl0IG1pdCB1bnMuXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEZMSUdIVFM6IHtcbiAgICAgICAgVElUTEU6ICdFaW5lbiBGbHVnIGF1c3N1Y2hlbicsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdmcmVpZSBTaXR6cGzDpHR6ZScsXG4gICAgICAgIE1PUkVfREVUQUlMUzogJ01laHIgRGV0YWlscycsXG4gICAgICAgIEJPT0s6ICdidWNoZW4nLFxuICAgICAgICBTRUxFQ1Q6J1fDpGhsZW4nLFxuICAgICAgICBGTElHSFQ6ICdGbHVnJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJ1xuICAgICAgfSxcbiAgICAgIEZMSUdIVDoge1xuICAgICAgICBGTElHSFQ6IFwiRmx1Z1wiLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBUSVRMRTogJ0RldGFpbHMgZGVzIEZsdWdzJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJyxcbiAgICAgICAgTlVNQkVSX09GX1BBU1NFTkdFUlM6ICdBbnphaGwgZGVyIFBhc3NhZ2llcmUnLFxuICAgICAgICBGTFlJTkdfQ0FMU1M6ICdCZWbDtnJkZXJ1bmdza2xhc3NlbicsXG4gICAgICAgIEZMSUdIVF9GQVJFOiAnRmx1Z3ByZWlzJyxcbiAgICAgICAgRkxJR0hUX0ZBQzogJ0RpZW5zdGxlaXN0dW5nZW4gZGVzIEZsdWdzJyxcbiAgICAgICAgUEFTU0VOR0VSOiAnUGFzc2FnaWVyJyxcbiAgICAgICAgUEFTU0VOR0VSUzogJ1Bhc3NhZ2llcmUnXG4gICAgICB9LFxuICAgICAgTkFWOiB7XG4gICAgICAgIEdPX0hPTUU6J2hlaW1nZWhlbicsXG4gICAgICAgIFNVQk1JVDogJ2VpbnJlaWNoZW4nLFxuICAgICAgICBORVhUOiAnd2VpdGVyJyxcbiAgICAgICAgQkFDSzogJ3p1csO8Y2snLFxuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZXppZWxsZSBBbmdlYm90ZScsXG4gICAgICAgIFNFUlZJQ0VTOiAnRGllbnN0bGVpc3R1bmdlbicsXG4gICAgICAgIE9VUl9URUFNOiAnVW5zZXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnw5xiZXIgdW5zJyxcbiAgICAgICAgQ09OVEFDVF9VUzogJ1Vuc2VyIEtvbnRha3QnLFxuICAgICAgICBDSE9PU0VfTEFOR1VBR0U6J1fDpGhsZSBlaW5lIFNwcmFjaGUnLFxuICAgICAgICBFTkdMSVNIOiAnRW5nbGlzY2gnLFxuICAgICAgICBHRVJNQU46J0RldXRzY2gnXG4gICAgICB9LFxuICAgICAgQ09ORklSTUFUSU9OOiB7XG5cbiAgICAgICAgVEhBTktfWU9VOiAnRGFua2Ugc2Now7ZuJyxcbiAgICAgICAgTkFNRTogJ05hbWUnLFxuICAgICAgICBQSE9ORTogJ1RlbGVmb24nLFxuICAgICAgICBNQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBGTElHSFROTzogJ0ZsdWcgTnVtbWVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnQWJmYWhydCcsXG4gICAgICAgIEFSUkFJVkFMOiAnQW5rdW5mdCcsXG4gICAgICAgIFBSSU5UOiAnRmx1Z2thcnRlIGFiZHJ1Y2tlbidcbiAgICAgIH0sXG4gICAgICBDT05UQUNUX1VTOiB7XG5cbiAgICAgICAgQ09OVEFDVF9VUzogJ1Vuc2VyIEtvbnRha3QnLFxuICAgICAgICBQSE9ORTogJ1RlbGVmb24nLFxuICAgICAgICBNQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBMRUFWRV9NU0c6ICdJaHIgQW5saWVnZW4nLFxuICAgICAgICBTRU5EOiAnYWJzY2hpY2tlbidcbiAgICAgIH0sXG4gICAgICBmb3VyX29fZm9yOiB7XG4gICAgICAgIC8vRG8geW91IG1lYW4gNDA0bm90Zm91bmQgdGVhbSA/ICBpbiA0MDQuaHRtbFxuICAgICAgICBRVUVTVElPTjogJ01laW50ZW4gU2llIGRpZSBHcnVwcGUgdm9uIDQwNE5vdEZvdW5kID8nXG5cbiAgICAgIH0sXG4gICAgICBBQk9VVF9VUzoge1xuXG4gICAgICAgIEFCT1VUOiAnw5xiZXIgQWlyQmVybGluJyxcbiAgICAgICAgSElTVE9SWTogJ0dlc2NoaWNodGUnLFxuICAgICAgICBISVNUT1JZX1BBUkE6ICdBbSAyOC4gQXByaWwgMTk3OSBzdGFydGV0IGVpbmUgQm9laW5nIDcwNyB2b24gQmVybGluLVRlZ2VsIG5hY2ggUGFsbWEgZGUgTWFsbG9yY2EuIERlciBFcnN0Zmx1ZyBpc3QgZGVyIEFuZmFuZyBkZXIgRXJmb2xnc2dlc2NoaWNodGUgdm9uIGFpcmJlcmxpbi4gJyxcbiAgICAgICAgT1VSX0dPQUw6ICdVbnNlciBaaWVsJyxcbiAgICAgICAgT1VSX0dPQUxfUEFSQTogJ1p1ZXJ0IEV1cm9wYSwgenVuw6RjaHN0IGRpZSBnYW56ZSBXZWx0LCB3ZXJkZW4gZHVyY2ggZGVuIEZsdWcgenVzYW1tZW4gdmVyYnVuZGVuLCB1bmQgTmF0aW9uZW4gZW5nIHp1c2FtbWVuIGRhbWl0IHNpZSBOYWNoYmFybiBhdWZ3YWNoc2Vu4oCmIC4gV2FzIGRpZSBFaXNiYWhuZW4gZsO8ciBkaWUgTmF0aW9uZW4gZ2V0YW4gaGF0LCB3aXJkIGRpZSBGbMO8Z2UgZsO8ciBkYXMgZ2FuemUgV2VsdCB0dW4uJyxcbiAgICAgICAgQV9QOiAnQWxsaWFuY2UvcGFydG5lcnMnLFxuICAgICAgICBBX1BfUEFSQTogJ2FpcmJlcmxpbiBlcndlaXRlcnQgaWhyIGludGVybmF0aW9uYWxlcyBTdHJlY2tlbm5ldHosIGluZGVtIHNpZSBtaXQgbWVocmVyZW4gQWlybGluZXMgYWxzIENvZGVzaGFyZS1QYXJ0bmVybiBrb29wZXJpZXJ0LidcblxuXG4gICAgICB9LFxuICAgICAgT0ZGRVJTOiB7XG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlemllbGxlIEFuZ2Vib3RlJyxcbiAgICAgICAgRkxJR0hUX09GRkVSUzogJ0ZsdWdhbmdlYm90ZScsXG4gICAgICAgIEZMSUdIVF9PRkZFUlNfUEFSQTogJ0ZpbmRlbiBTaWUgZGllIGF0dHJha3RpdnN0ZW4gVGFyaWZlIGbDvHIgSWhyZW4gRmx1ZycsXG4gICAgICAgIExJS0VfRkFDRUJPT0s6ICdGb2xnZW4gU2llIHVucyBhdWYgRmFjZWJvb2snLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LX1BBUkE6ICdWZXJtaXNzZW4gU2llIG5pY2h0IHVuc2VyZSBzcGV6aWVsbGUgQW5nZWJvdGU6IG1pdCB1bnNlciBuZXdzbGV0dGVyIHVuZCBhdWYgRmFjZWJvb2snLFxuICAgICAgICBIT1RFTDogJ0hvdGVsJyxcbiAgICAgICAgSE9URUxfUEFSQTogJ1NvbmRlcmFuZ2Vib3RlIGbDvHIgSWhyIEhvdGVsIHdlZyB2b24gdW5zZXJlIFBhcnRuZXJuIC4nXG5cbiAgICAgIH0sXG5cbiAgICAgIFBBU1NfREVUQUlMUzoge1xuXG4gICAgICAgIEZJUlNUX05BTUU6ICdWb3JuYW1lJyxcbiAgICAgICAgTUlERExFX05BTUU6ICdad2VpdG5hbWUnLFxuICAgICAgICBMQVNUX05BTUU6ICdOYWNobmFtZScsXG4gICAgICAgIFBBU1NfTk86ICdSZWlzZXBhc3MgTnVtbWVyJyxcbiAgICAgICAgUExBQ0VfT0ZCSVJUSDogJ09ydCBkZXMgR2VidXJ0cycsXG4gICAgICAgIFBIT05FX05POiAnVGVsZWZvbiBOdW1tZXInLFxuICAgICAgICBFX01BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIFJFUEVBVF9FX01BSUw6ICdFLW1haWwgd2llZGVyaG9sZW4nLFxuICAgICAgICBWRVJJRllfUEFSQTogJ0hpZXJtaXQsIGJlc3TDpHRpZ2UgaWNoLCBkYXNzIGRpZSBJbmZvcm1hdGlvbmVuLCBkaWUgdm9yaGluIGdlZ2ViZW4gc2luZCwgbWVpbmUgUGFzc2RhdGVuIGVudHNwcmljaGVuLidcblxuICAgICAgfSxcbiAgICAgIFBBWU1FTlQ6IHtcblxuICAgICAgICBXRV9BQ0NFUFQ6ICdaYWhsdW5nc21ldGhvZGVuJyxcbiAgICAgICAgQ0FSRF9JTkZPOiAnS3JlZGl0a2FydGUgaW5mb3JtYXRpb25lbjonLFxuICAgICAgICBFWFBfREFURTogJ0FibGF1ZmRhdHVtIElocmVyIEthcnRlOicsXG4gICAgICAgIENPU1Q6ICdHZXNhbXRwcmVpcydcblxuICAgICAgfSxcbiAgICAgIFNFQVRJTkc6IHtcblxuICAgICAgICBTRUFUX01BUDogJ1NpdHpwbGF0enJlc2VydmllcnVuZycsXG4gICAgICAgIFNFTEVDVEVEOiAnU2llIGhhYmVuIGVpbmVuIFNpdHpwbGF0eiByZXNlcnZpZXJ0LidcblxuICAgICAgfSxcbiAgICAgIFNFUlZJQ0VTOiB7XG5cbiAgICAgICAgU0VSVklDRTogJ1NlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfU0VSVklDRVM6ICdTZXJ2aWNlcyBhbiBib2FyZCcsXG4gICAgICAgIElORkxJR0hUX1BBUkE6ICcgIEFpcmJlcmxpbiBoZWnDn2VuIFNpZSBoZXJ6bGljaCB3aWxsa29tbWVuIGFuIEJvcmQ6IGVjb25vbXkgdW5kIGJ1c2luZXNzIGNsYXNzLicsXG4gICAgICAgIEdfTUVBTFM6ICdHb3VybWV0ZXNzZW4nLFxuICAgICAgICBHX01FQUxTX1BBUkE6ICdGcmV1ZW4gU2llIHNpY2ggYXVmIEFpcmJlcmxpbnMgYSBsYSBjYXJ0ZS1TcGVpc2UgOiBXaXIgc2VydmllcmVuIElobmVuIHVuc2VyZSB3YXJtZW4gT24tVG9wLVNwZWlzZW4sIGRpZSBleHRyYSB2b20gU2Fuc2liYXItV2lydCBIZXJiZXJ0IFNlY2tsZXIga3JlaWVydCB3dXJkZW4uJyxcbiAgICAgICAgQkFHR0FHRTogJ1JlaXNlZ2Vww6RjaycsXG4gICAgICAgIEJBR0dBR0VfUEFSQTogJ1Vuc2VyZSBSZWdsdW5nZW4gw7xiZXIgQXVmenVnZWJlbmRlcyBHZXDDpGNrbWVuZ2VuLCDDvGJlciBIYW5kZ2Vww6RjayB1bmQgU29uZGVyZ2Vww6Rjay4nXG5cbiAgICAgIH0sXG5cbiAgICB9KTtcblxuICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgnZGUnKTtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGUnKTtcblxuICB9KTtcbiIsIi8vIEBhYmRlbHJobWFuLWVzc2FtXG5BcHAuY29udHJvbGxlcignY29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSkge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWNvbmZpcm1hdGlvbic7XG4gICRzY29wZS50aXRsZSA9IFwiQ29uZmlybWF0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIkdvIEhvbWVcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhcGkuc3VibWl0Qm9va2luZygnZmFsc2UnKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIC8vICAgYWxlcnQoZGF0YS5kYXRhKVxuICAgICAgLy8gICBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgLy8gfSxmdW5jdGlvbihlcnIpe1xuICAgICAgLy9cbiAgICAgIC8vIH0pXG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZighYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgICRzY29wZS5nb1NvY2lhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvc29jaWFsJyk7XG5cbiAgICB9XG5cbiAgICAkKCcjcXVvdGVzLXRleHQnKS50eXBlSXQoe1xuICAgICAgc3RyaW5nczogW1xuICAgICAgICAnXCJUcmF2ZWwgYW5kIGNoYW5nZSBvZiBwbGFjZSBpbXBhcnQgbmV3IHZpZ29yIHRvIHRoZSBtaW5kLlwiLVNlbmVjYScsXG4gICAgICAgICAn4oCcVHJhdmVsaW5nIHRlbmRzIHRvIG1hZ25pZnkgYWxsIGh1bWFuIGVtb3Rpb25zLuKAnSDigJQgUGV0ZXIgSG9lZycsXG4gICAgICAgICAn4oCcVHJhdmVsaW5nIOKAkyBpdCBsZWF2ZXMgeW91IHNwZWVjaGxlc3MsIHRoZW4gdHVybnMgeW91IGludG8gYSBzdG9yeXRlbGxlci7igJ0gLSBJYm4gQmF0dHV0YScsXG4gICAgICAgICcg4oCcV2UgdHJhdmVsLCBzb21lIG9mIHVzIGZvcmV2ZXIsIHRvIHNlZWsgb3RoZXIgcGxhY2VzLCBvdGhlciBsaXZlcywgb3RoZXIgc291bHMu4oCdIOKAkyBBbmFpcyBOaW4nXG4gICAgICBdLFxuICAgICAgc3BlZWQ6IDgwLFxuICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfSk7XG5cbiAgfWVsc2V7XG5cbiAgfVxuICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgJHNjb3BlLnBhc3NlbmdlciA9IGFwaS5nZXRQYXNzZW5nZXIoKVswXTtcblxuXG59KTtcbiIsIi8vIEBOYWJpbGFcbkFwcC5jb250cm9sbGVyKCdmbGlnaHREZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodCc7XG4gICRzY29wZS50aXRsZSA9IFwiRmxpZ2h0KHMpIERldGFpbHNcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG5cblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgIH1cblxuICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICB2YXIgb3V0Z29pbmdGbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcbiAgdmFyIHJldHVybkZsaWdodCA9IGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKTtcblxuICB2YXIgYm9va2luZyA9IGFwaS5nZXRCb29raW5nKCk7XG5cbiAgdmFyIGZhY2lsaXRpZXMgPSBbXCJTbW9raW5nIGFyZWFzIGF2YWlsYWJsZVwiLCBcIldpLUZpIGF2YWlsYWJpbGl0eVwiLFxuICAgIFwiNCBjdWx0dXJhbCBjdWlzaW5lc1wiLCBcIkluZmxpZ2h0IGVudGVydGFpbm1lbnRcIiwgXCJFeHRyYSBjb3p5IHNsZWVwZXJldHRlXCIsXG4gICAgXCJTY3JlZW5zIHRvIHNob3cgeW91ciBmbGlnaHQgcGF0dGVybiwgYWlyY3JhZnQgYWx0aXR1ZGUgYW5kIHNwZWVkXCJcbiAgXTtcbmlmIChvdXRnb2luZ0ZsaWdodCl7XG4gIHZhciBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgb3V0Z29pbmdGbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICB2YXIgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDKTtcbiAgb3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG5cblxuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICAgIHJldHVybkZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgYXJyaXZhbERhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuICB9XG4gIHZhciBhaXJjcmFmdHMgPSBbXTtcbiAgdmFyIG91dEFpcmNyYWZ0aGFzU21va2luZztcbiAgdmFyIG91dEFpcmNyYWZ0aGFzV2lmaTtcbiAgdmFyIHJlQWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgcmVBaXJjcmFmdGhhc1dpZmkgO1xuICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJjcmFmdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gb3V0Z29pbmdGbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgJHNjb3BlLm91dEFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgIGlmIChhaXJjcmFmdHNbaV0udGFpbE51bWJlciA9PT0gcmV0dXJuRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1dpZmkgPSBhaXJjcmFmdHNbaV0uaGFzV2lmaTtcbiAgICAgICAgICAkc2NvcGUucmVBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG5cbiAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgdmFyIGFpcnBvcnRzID0gW107XG4gIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhaXJwb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZTtcbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICAgJHNjb3BlLnJlUmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcbiAgdmFyIG91dGJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgdmFyIG91dGZhcmUgPSAwO1xuXG4gIGlmIChib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5lY29ub215RmFyZTtcbiAgfSBlbHNlIHtcbiAgICBvdXRidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuYnVzaW5lc3NGYXJlO1xuICB9XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gICAgdmFyIHJlZmFyZSA9IDA7XG4gICAgaWYgKGJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiRWNvbm9teVwiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmVjb25vbXlGYXJlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgICAgcmVmYXJlID0gcmV0dXJuRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICBpZiAob3V0QWlyY3JhZnRoYXNTbW9raW5nKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzV2lmaSlcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG5cbiAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpIHtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzRdKTtcbiAgfVxuIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzBdKTtcbiAgICBpZiAocmVBaXJjcmFmdGhhc1dpZmkpXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG5cbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzRdKTtcbiAgICB9XG4gICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG5cbiAgICAkc2NvcGUucmV0dXJuRmxpZ2h0ID0gcmV0dXJuRmxpZ2h0O1xuICAgICRzY29wZS5yZWJ1c2luZXNzT3JFY29uID0gcmVidXNpbmVzc09yRWNvbjtcbiAgICAkc2NvcGUucmVmYXJlID0gcmVmYXJlO1xuICAgICRzY29wZS5yZWZhY2lsaXRpZXNSZXN1bHQgPSByZWZhY2lsaXRpZXNSZXN1bHQ7XG4gIH1cbiAgJHNjb3BlLm91dGdvaW5nRmxpZ2h0ID0gb3V0Z29pbmdGbGlnaHQ7XG4gICRzY29wZS5vdXRidXNpbmVzc09yRWNvbiA9IG91dGJ1c2luZXNzT3JFY29uO1xuICAkc2NvcGUub3V0ZmFyZSA9IG91dGZhcmU7XG4gICRzY29wZS5vdXRmYWNpbGl0aWVzUmVzdWx0ID0gb3V0ZmFjaWxpdGllc1Jlc3VsdDtcblxufVxufSk7XG4iLCIvLyBAYWJkZWxyYWhtYW4tbWFnZWRcbnZhciBmbGlnaHRDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwgJHJvdXRlUGFyYW1zKSB7XG5cbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodHMnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgYXBpLnNldElzT3RoZXJIb3N0cyhmYWxzZSk7XG5cbiAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgJHNjb3BlLm9yaWdpbiA9IG9yaWdpbjtcbiAgJHNjb3BlLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICRzY29wZS5leGl0RGF0ZSA9IGV4aXREYXRlO1xuXG4gICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgJHNjb3BlLnJldHVybkRhdGUgPSByZXR1cm5EYXRlO1xuICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICBcInJlZlBhc3NlbmdlcklEXCI6IFtdLFxuICAgIFwiaXNzdWVEYXRlXCI6IG51bGwsXG4gICAgXCJpc09uZVdheVwiOiAhJHNjb3BlLnJvdW5kVHJpcCxcbiAgICBcInJlZkV4aXRGbGlnaHRJRFwiOiBudWxsLFxuICAgIFwicmVmUmVFbnRyeUZsaWdodElEXCI6IG51bGwsXG4gICAgXCJyZWNlaXB0TnVtYmVyXCI6IG51bGxcbiAgfTtcblxuICB2YXIgZmxpZ2h0cztcbiAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gIGlmIChyZXR1cm5EYXRlKVxuICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG5cbiAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXRJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG4gICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlRW50cnlJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICB9XG5cbiAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gbmV3IERhdGUoZGF0ZU91dC5nZXRVVENGdWxsWWVhcigpLCBkYXRlT3V0LmdldFVUQ01vbnRoKCksIGRhdGVPdXQuZ2V0VVRDRGF0ZSgpLCAgZGF0ZU91dC5nZXRVVENIb3VycygpLCBkYXRlT3V0LmdldFVUQ01pbnV0ZXMoKSwgZGF0ZU91dC5nZXRVVENTZWNvbmRzKCkpO1xuICB9O1xuXG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuXG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodC5faWQ7XG5cbiAgICBpZiAoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KVxuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQuX2lkO1xuXG4gICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG5cbiAgICBpZiAoVHlwZSA9PSBcImRlc2t0b3BcIilcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZXhpdC1mbGlnaHQnKTtcbiAgICBlbHNlXG4gICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHQtZGV0YWlscycpO1xuXG4gIH1cblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gIGlmICghb3JpZ2luIHx8ICFkZXN0aW5hdGlvbiB8fCAhZXhpdERhdGUpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICB9XG5cbiAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICByZXR1cm4gJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgJiYgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgfVxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICBhcGkuZ2V0RmxpZ2h0cyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICBmbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAvIDYwKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgIGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uID0gaG91cnMgKyBcImggXCIgKyBtaW51dGVzICsgXCJtXCI7XG5cbiAgICAgIH1cblxuICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiAvIDYwKTtcbiAgICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiAlIDYwO1xuXG4gICAgICAgICAgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uID0gaG91cnMgKyBcImggXCIgKyBtaW51dGVzICsgXCJtXCI7XG5cbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgICRzY29wZS5mbGlnaHRzID0gZmxpZ2h0cztcblxuICAgICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICBhaXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRUYWlsTnVtYmVyKVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgfSBlbHNlIHtcblxuICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUubWluaUxvZ29QYXRoID0gZnVuY3Rpb24ob3BlcmF0b3JBaXJsaW5lKSB7XG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lID09PSBcIkFpciBCZXJsaW5cIilcbiAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1iZXJsaW4tbWluaS1sb2dvLnBuZ1wiXG4gICAgICByZXR1cm4gXCJpbWcvb3RoZXItYWlybGluZS1taW5pLWxvZ28ucG5nXCJcbiAgICB9O1xuXG4gIH1cblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnYXBpJywgJyRzdGF0ZVBhcmFtcyddO1xufSBlbHNlIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsICckcm91dGVQYXJhbXMnXTtcbn1cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNDdHJsJywgZmxpZ2h0Q29udHJvbGxlcik7XG4iLCJ2YXIgZmxpZ2h0TmV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgIGFwaS5zZXRJc090aGVySG9zdHModHJ1ZSk7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFwaS5zZXRPdXRHb2luZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCk7XG4gICAgICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZyA9IHtcbiAgICAgICAgXCJwYXNzZW5nZXJEZXRhaWxzXCI6IFt7XG4gICAgICAgICAgICBcImZpcnN0TmFtZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJsYXN0TmFtZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwYXNzcG9ydE51bVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiZW1haWxcIjogbnVsbCxcbiAgICAgICAgfV0sXG4gICAgICAgIFwiY2xhc3NcIjogbnVsbCxcbiAgICAgICAgXCJvdXRnb2luZ0ZsaWdodElkXCI6IG51bGwsXG4gICAgICAgIFwicmV0dXJuRmxpZ2h0SWRcIjogbnVsbCxcbiAgICAgICAgXCJwYXltZW50VG9rZW5cIjogbnVsbFxuICAgIH1cblxuICAgIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9ICRyb3V0ZVBhcmFtcy5kZXN0aW5hdGlvbjtcbiAgICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcblxuICAgIHZhciBpc0Vjb25vbXkgPSAkcm91dGVQYXJhbXMuZmxpZ2h0Q2xhc3MgPT0gXCJFY29ub215XCI7XG4gICAgY29uc29sZS5sb2coaXNFY29ub215KVxuICAgICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICAgIGlmICgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSkge1xuICAgICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGlzRWNvbm9teSkge1xuICAgICAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLmdldE90aGVyRmxpZ2h0c0J1c2kob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuY2xhc3MgPSBpc0Vjb25vbXkgPT09IHRydWUgPyBcImVjb25vbXlcIiA6IFwiYnVzaW5lc3NcIjtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gZmxpZ2h0LmZsaWdodElkO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nVXJsID0gZmxpZ2h0LnVybDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5vdXRnb2luZ0Nvc3QgPSBmbGlnaHQuY29zdDtcblxuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuRmxpZ2h0SWQgPSBmbGlnaHQuZmxpZ2h0SWQ7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmV0dXJuVXJsID0gZmxpZ2h0LnVybDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5Db3N0ID0gZmxpZ2h0LmNvc3Q7XG5cbiAgICB9XG5cbiAgICAkc2NvcGUuY2hlY2tOZXh0QnRuU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgJiYgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgfVxuXG59XG5cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59IGVsc2Uge1xuICAgIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJywgXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c05ld0N0cmwnLCBmbGlnaHROZXdDb250cm9sbGVyKTtcbiIsIiB2YXIgbWFpbkNvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCR0cmFuc2xhdGUpIHtcbiAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1tYWluJztcblxuICAgJHNjb3BlLmdvID0gZnVuY3Rpb24oKSB7XG4gICAgIGNvbnNvbGUubG9nKCRzY29wZS5zZWxlY3RlZE9yaWdpbik7XG4gICB9XG4gICAkc2NvcGUuZXhpdERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICRzY29wZS5haXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgfSk7XG5cblxuICAgJHNjb3BlLnNlbGVjdGVkT3JpZ2luID0gdW5kZWZpbmVkO1xuICAgJHNjb3BlLnNlbGVjdGVkRGVzdCA9IHVuZGVmaW5lZDtcblxuICAgZnVuY3Rpb24gYWlycG9yc0NvbnRhaW5zKGlhdGEpIHtcbiAgICAvLyAgaWYoICRzY29wZS5haXJwb3J0cylcbiAgICAvLyAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICBpZiAoaWF0YSA9PSAkc2NvcGUuYWlycG9ydHNbaV1bJ2lhdGEnXSlcbiAgICAvLyAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vICB9XG4gICAgIHJldHVybiB0cnVlO1xuICAgfVxuXG4gICAkc2NvcGUuYnV0dG9uU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgcmV0dXJuICEkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgISRzY29wZS5zZWxlY3RlZERlc3QgfHwgISRzY29wZS5leGl0RGF0ZSB8fCAkc2NvcGUuc2VsZWN0ZWREZXN0ID09ICRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZE9yaWdpbikgfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWREZXN0KTtcbiAgIH1cblxuICAgJHNjb3BlLmZsaWdodCA9IHtcbiAgICAgdHlwZTogXCJvbmVcIlxuICAgfVxuICAgJHNjb3BlLm90aGVyQWlybGluZSA9IHtcbiAgICAgdmFsdWU6IGZhbHNlXG4gICB9XG5cblxuXG4gICAkc2NvcGUuZ29Ub0ZsaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAgdmFyIGV4aXREYXRlLCByZXR1cm5EYXRlO1xuXG4gICAgIGV4aXREYXRlID0gKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApO1xuICAgICBpZiAoJHNjb3BlLnJldHVybkRhdGUpXG4gICAgICAgcmV0dXJuRGF0ZSA9ICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApO1xuXG4gICAgIGlmICgkc2NvcGUub3RoZXJBaXJsaW5lLnZhbHVlKSB7XG4gICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ2ZsaWdodENsYXNzJywkc2NvcGUuY2xhc3NlQnRuVGV4dCk7XG5cbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlXG4gICAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsIHJldHVybkRhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ2ZsaWdodENsYXNzJywkc2NvcGUuY2xhc3NlQnRuVGV4dCk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZSxcbiAgICAgICAgICAgICByZXR1cm5EYXRlOiByZXR1cm5EYXRlXG4gICAgICAgICAgIH0pXG4gICAgICAgfVxuICAgICB9IGVsc2Uge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKS5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdCkuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMClcbiAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMClcbiAgICAgICAgICAgfSlcbiAgICAgICB9XG5cbiAgICAgfVxuXG4gICB9O1xuXG5cblxuXG4gICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgJCgnI21haW4tdGV4dCcpLnR5cGVJdCh7XG4gICAgICAgc3RyaW5nczogWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5PTkUnKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuVFdPJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLlRIUkVFJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLkZPVVInKV0sXG4gICAgICAgc3BlZWQ6IDEyMCxcbiAgICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgICBsb29wOiB0cnVlXG4gICAgIH0pO1xuXG5cbiAgICAgJGxvY2F0aW9uLnVybCgkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgc2V0VXBEYXRlKCRzY29wZSk7XG5cbiAgICAgJHNjb3BlLmNoaWxkcmVuID0gWycwICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzEgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRCcpLCAnMiAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICczICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzQgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpXTtcbiAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9ICRzY29wZS5jaGlsZHJlblswXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNoaWxkcmVuID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cblxuXG4gICAgICRzY29wZS5hZHVsdHMgPSBbJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFQnKSAsICcyICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnMyAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUUycpLCAnNCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVHMnKV07XG4gICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSAkc2NvcGUuYWR1bHRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQWR1bHQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuICAgICAkc2NvcGUuaW5mYW50cyA9IFsnMCAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5JTkZBTlQnKSwgJzEgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uSU5GQU5UUycpXTtcbiAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSAkc2NvcGUuaW5mYW50c1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUluZmFudCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuXG4gICAgICRzY29wZS5jbGFzc2VzID0gWyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5FQ09OT01ZJyksICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5CVVNJTkVTUycpXTtcbiAgICAgJHNjb3BlLmNsYXNzZUJ0blRleHQgPSAkc2NvcGUuY2xhc3Nlc1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5jbGFzc2VCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuICAgfVxuXG5cbiB9O1xuXG4gZnVuY3Rpb24gc2V0VXBEYXRlKCRzY29wZSkge1xuICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgIH07XG4gICAkc2NvcGUudG9kYXkoKTtcblxuICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG4gICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUucG9wdXAub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG5cblxuICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICB9XG4gICAkc2NvcGUuZGF0ZU9wdGlvbnMgPSB7XG4gICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDUsIDIyKSxcbiAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgc3RhcnRpbmdEYXk6IDFcbiAgIH07XG4gICAkc2NvcGUucG9wdXAyID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuIH1cblxuIGlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9IGVsc2Uge1xuICAgbWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckdHJhbnNsYXRlJ107XG4gfVxuXG4gQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgbWFpbkNvbnRyb2xsZXIpO1xuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJGaWxsIGluIHlvdXIgZGV0YWlsc1wiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuICAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aXRsZXMgPSBbJ01yJywgJ01ycycsICdNcycsICdEciddO1xuICAgICAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9ICRzY29wZS50aXRsZXNbMF07XG4gICAgICAgICRzY29wZS5jaGFuZ2VUaXRsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0pO1xuXG5cblxuXG4gICAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuXG5cbiAgICAgICAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICAgICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUubmF0aW9uYWxpdHksXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUudGl0bGVzQnRuVGV4dCxcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWUsXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFcblxuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8vYmVmb3JlIHlvdSBsZWF2ZSB0aGUgcGFnZSBtYWtlIHN1cmUgdGhhdCB0aGUgcGFzc2VuZ2VyIG9iamVjdCBpcyBjb21wbGV0ZSBvdGhlcndpc2Ugc2hvdyBhbGVydChcIkZpbGwgaW4gYWxsIGRhdGFcIik7XG5cblxuXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vICAgJHNjb3BlLmFsZXJ0RGF0YSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICBpZiAoKCRzY29wZS5maXJzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHx8ICgkc2NvcGUubGFzdE5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5waG9uZU51bWJlciA9PSBudWxsKSB8fCAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWwxID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWx2ZXIgPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnREYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcilcbiAgICAgICAgICAgIC8vICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vICAgICAgIGlmICgoJHNjb3BlLmNoZWNrID09IG51bGwpKVxuICAgICAgICAgICAgLy8gICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIC8vICAgaWYgKCFhcGkuaXNPdGhlckhvc3RzKVxuICAgICAgICAgICAgLy8gICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgLy8gICBlbHNlICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV07XG5cbiAgICAgICAgICAgICRzY29wZS5hbGVydEZOYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0TE5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydFBoTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRDb3VudHJ5ID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRFbWFpbCA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcblxuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzBdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Rk5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5taWRkbGVOYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRNTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmxhc3ROYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRMTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbM10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQaE51bWJlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbNF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRQTnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubmF0aW9uYWxpdHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s1XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENvdW50cnkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s2XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydEVtYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWx2ZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s3XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydEVtYWlsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxICE9ICRzY29wZS5lbWFpbHZlcikge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydENvbmZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5jaGVjayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzldID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q2hlY2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWxscGFzc2luZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkc1tpXSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxwYXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbHBhc3NpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghYXBpLklzT3RoZXJIb3N0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcucGFzc2VuZ2VyRGV0YWlsc1swXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZpcnN0TmFtZVwiOiAkc2NvcGUuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFzdE5hbWVcIjogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3BvcnROdW1cIjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFzc3BvcnRFeHBpcnlEYXRlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRlT2ZCaXJ0aFwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmF0aW9uYWxpdHlcIjogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogJHNjb3BlLmVtYWlsMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRCb29raW5nKGJvb2tpbmcpO1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcblxuXG5cbiAgICAgICAgdmFyIGNvbXBsZXRlMSA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAgICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgICAgICAgICAgbmF0aW9uYWxpdHk6ICRzY29wZS5jb3VudHJpZXNNb2IsXG4gICAgICAgICAgICAgICAgc2V4OiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hdGlvbmFsSUQ6IG51bGwsXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBleHBpcnlEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUuVGl0bGVNb2IsXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICAgICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lTW9iLFxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWVNb2IsXG4gICAgICAgICAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyTW9iLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxTW9iXG5cblxuICAgICAgICAgICAgfTtcblxuXG5cblxuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlMSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgICAvLyAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhOlwiICsgXCJcXG5cIiArIFwiUGFzc3BvcnQgTnVtYmVyIG11c3QgYmUgOCBudW1iZXJzXCIgKyBcIlxcblwiICtcbiAgICAgICAgICAgIC8vICAgICAgIFwiUGhvbmUgTnVtYmVyIG11c3QgYmUgMTAgbnVtYmVyc1wiICsgXCJcXG5cIiArIFwiRW1haWxzIG11c3QgYmUgaW4gYUB4eXouY29tIGZvcm1hdFwiKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgIGlmICgkc2NvcGUuZW1haWwxTW9iICE9ICRzY29wZS5lbWFpbHZlck1vYilcbiAgICAgICAgICAgIC8vICAgICAgIGFsZXJ0KFwiVGhlIGVudGVyZWQgZW1haWxzIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgICAgIC8vICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICBpZiAoKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UgZW50ZXJlZFwiKVxuICAgICAgICAgICAgLy8gICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZTEgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgICAgICAgLy8gfVxuXG5cblxuICAgICAgICAgICAgdmFyIGZpZWxkc01vYiA9IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXTtcblxuXG5cblxuICAgICAgICAgICAgaWYgKCRzY29wZS5maXJzdE5hbWVNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlswXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIEVudGVyIHlvdXIgZmlyc3QgbmFtZS5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzFdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBtaWRkbGUgbmFtZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbMl0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZS5cIik7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlszXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgcGhvbmUgbnVtYmVyLCBpdCBtdXN0IGJlIDEwIGRpZ2l0c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGFzc3BvcnROdW1iZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls0XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgcGFzc3BvcnQgbnVtYmVyLCBpdCBtdXN0IGJlIDggZGlnaXRzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbNV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIGVtYWlsLCBpdCBtdXN0IGJlIGluIHRoaXMgZm9ybWF0ICdhQHh5ei5jb20nIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWx2ZXJNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls2XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGNvbmZpcm0geW91ciBlbWFpbCwgaXQgbXVzdCBiZSBpbiB0aGlzIGZvcm1hdCAnYUB4eXouY29tJyBcIik7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZW1haWwxTW9iICE9ICRzY29wZS5lbWFpbHZlck1vYikge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls3XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlIGVudGVyZWQgZW1haWxzIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2hlY2tNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24geW91J3ZlIGVudGVyZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhbGxwYXNzaW5nTW9iID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHNNb2IubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRzTW9iW2ldID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbHBhc3NpbmdNb2IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxscGFzc2luZ01vYiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcblxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdGFiL3BheW1lbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgIH1cblxuXG5cbn0pO1xuIiwiLy8gQG1pcm5hXG4gdmFyIHBheW1lbnRDdHJsID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBhcGkpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgeW91ciBwYXltZW50IG9wdGlvblwiO1xuXG4gICAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgICRzY29wZS5mb3JtID0ge1xuICAgICAgICBudW1iZXI6IG51bGwsXG4gICAgICAgIGN2YzogbnVsbCxcbiAgICAgICAgZXhwX21vbnRoOiBudWxsLFxuICAgICAgICBleHBfeWVhcjogbnVsbFxuICAgIH07XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgcGF5P1wiKTtcbiAgICAgICAgaWYgKHIgPT0gdHJ1ZSkge1xuXG5cblxuICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAkc2NvcGUueWVhcnNCdG5UZXh0XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX21vbnRoID0gcGFyc2VJbnQoJHNjb3BlLm1vbnRocy5pbmRleE9mKCRzY29wZS5tb250aHNCdG5UZXh0KSkgKyAxXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX3llYXIgPSAocGFyc2VJbnQobmV3IERhdGUoJHNjb3BlLmRhdGUpLmdldFllYXIoKSkpICsgMjAwMCAtIDEwMFxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLmV4cF9tb250aCA9IG5ldyBEYXRlKCRzY29wZS5kYXRlKS5nZXRNb250aCgpXG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZm9ybSlcbiAgICAgICAgICAgIH1cblxuXG5cblxuICAgICAgICAgICAgaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5pZClcbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldFN0cmlwZVRva2VuKHJlc3BvbnNlLmlkKVxuICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyhhcGkuSXNPdGhlckhvc3RzKCkpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YS5lcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5VcmwgPT0gYm9va2luZy5vdXRnb2luZ1VybCB8fCAhYm9va2luZy5yZXR1cm5VcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuQ29zdClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcucmV0dXJuQ29zdCkgKyBwYXJzZUludChib29raW5nLm91dGdvaW5nQ29zdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL1wiICsgYm9va2luZy5vdXRnb2luZ1VybDtcbiAgICAgICAgICAgICAgICAgICAgYXBpLmdldFN0cmlwZUtleSh1cmwgKyAnL3N0cmlwZS9wdWJrZXkvJykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zZXRCb29raW5nKGJvb2tpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zdWJtaXRCb29raW5nKHRydWUsIHVybCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoJ3BrX3Rlc3RfU2lZMHhhdzdxM0xObHBDbmtocG82MGp0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5jb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5kYXRhLmVycm9yTWVzc2FnZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9oZXJlIHdlIHNob3VsZCBzZW5kIHR3byByZXFldXN0c1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0Z29pbmdCb29raW5nID0gYm9va2luZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHVybkJvb2tpbmcgPSBib29raW5nO1xuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0Jvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdCb29raW5nLnJldHVybkZsaWdodElkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLnJldHVybkNvc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gYm9va2luZy5yZXR1cm5GbGlnaHRJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIGJvb2tpbmcub3V0Z29pbmdVcmw7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRTdHJpcGVLZXkodXJsICsgJy9zdHJpcGUvcHVia2V5JykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0Jvb2tpbmcucGF5bWVudFRva2VuID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcob3V0Z29pbmdCb29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5yZWZOdW0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5VcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyBib29raW5nLnJldHVyblVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleScpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcocmV0dXJuQm9va2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleSgncGtfdGVzdF9TaVkweGF3N3EzTE5scENua2hwbzYwanQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuY29uZmlybWF0aW9uJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YS5lcnJvck1lc3NhZ2UpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nJyk7XG4gICAgfVxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsICcyMDE3JywgJzIwMTgnLCAnMjAxOScsICcyMDIwJywgJzIwMjEnLCAnMjAyMicsICcyMDIzJywgJzIwMjQnXTtcbiAgICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidXJhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuTm8gPSAkc2NvcGUubW9udGhzLmluZGV4T2YodGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHByaWNlID0gMDtcbiAgICBpZiAoYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgZWxzZVxuICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSkge1xuXG4gICAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG5cbiAgICB9XG5cblxuICAgICRzY29wZS5wcmljZSA9IHByaWNlO1xufVxuXG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIHBheW1lbnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGh0dHAnLCAnYXBpJ107XG59IGVsc2Uge1xuICBwYXltZW50Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRodHRwJywgJ2FwaSddO1xufVxuXG5BcHAuY29udHJvbGxlcigncGF5bWVudEN0cmwnLCBwYXltZW50Q3RybCk7XG4iLCIvLyBAYWhtZWQtZXNzbWF0XG4gIHZhciBzZWF0aW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2Utc2VhdGluZyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBzaXQ/XCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL3JldHVyaW5nJyk7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRSZXRydW5TZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICB9XG5cblxuXG4gICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXRtYXA7XG5cbiAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG5cbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9XG5cblxuXG4gICAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgICB2YXIgc2NoZW1hID0gWzMsIDUsIDMsIDIwXTtcblxuICAgICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnNlYXJjaENvbG9yID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGlmICghJHNjb3BlLmlzRW1wdHkodGV4dCkpXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdE9jdSc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRFbXB0eSc7XG4gICAgICB9XG4gICAgICAkc2NvcGUuaXNFbXB0eSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXRtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXRtYXBbaV1bJ251bWJlciddID09IHRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWF0bWFwW2ldWydpc0VtcHR5J11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3RTZWF0ID0gZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICRzY29wZS5zZWF0ID0gc2VhdDtcbiAgICAgIH07XG4gICAgfVxuXG5cblxuICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICB2YXIgc2NoZW1hID0gWzIsIDQsIDIsIDldO1xuXG4gICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgfVxuXG5cbn07XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignc2VhdGluZ0N0cmwnLCBzZWF0aW5nQ29udHJvbGxlcik7XG4iXX0=
