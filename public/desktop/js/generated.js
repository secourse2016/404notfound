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

  App.config(function($translateProvider) {
    $translateProvider.translations('en', {
      MAIN: {
        BOOK_NOW: 'Book Now',
        FROM: 'From',
        DEPARTURE_DATE: 'Departure Date',
        TO: 'To',
        UNDER_2_YEARS: 'Under 2 years',
        ROUND_TRIP: 'Round Trip',
        ONE_WAY: 'One Way',
        SEARCH_FOR_FLIGHTS: 'Search for flights',
        YEARS: "years",
        CHILDREN: 'children',
        CHILD: 'child',
        ADULT: 'adult',
        ADULTS: 'adults',
        INFANTS: 'infants',
        INFANT: 'infant',
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
        NEXT: 'Next',
        BACK: 'Back',
        SPECIAL_OFFERS: 'Special Offers',
        SERVICES: 'Services',
        OUR_TEAM: 'Our Team',
        ABOUT: 'About',
        CONTACT_US: 'Contact Us'
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
        DEPARTURE_DATE: 'Hinflug',
        TO: 'nach',
        UNDER_2_YEARS: 'Jünger als 2 Jahren',
        ROUND_TRIP: 'Hin-und Rückfahrt',
        ONE_WAY: 'Nur Hinflug',
        SEARCH_FOR_FLIGHTS: 'Flüge suchen',
        YEARS: "Jahre",
        CHILDREN: 'Kinder',
        CHILD: 'Kind',
        ADULT: 'Erwachsener',
        ADULTS: 'Erwachsenen',
        INFANTS: 'Babys',
        INFANT: 'Baby',
        QUOTES_HOME: {
          ONE: "Simple, convenient, instant confirmation.",
          TWO: "Destinations all around the globe.",
          THREE: "Experience authentic hospitality.",
          FOUR: "Time to get enchanted."
        }
      },
      FLIGHTS: {
        TITLE: 'Einen Flug aussuchen',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        SEATS_LEFT: 'freie Sitzplätze',
        MORE_DETAILS: 'Mehr Details',
        BOOK: 'buchen',
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
        NEXT: 'weiter',
        BACK: 'zurück',
        SPECIAL_OFFERS: 'Spezielle Angebote',
        SERVICES: 'Dienstleistungen',
        OUR_TEAM: 'Unser Team',
        ABOUT: 'Über uns',
        CONTACT_US: 'Unser Kontakt'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb24gPSB7fTtcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnBvc3QgPSB7fTtcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHt9O1xuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucGF0Y2ggPSB7fTtcbn0pO1xuXG5BcHAuZmFjdG9yeSgnYXBpJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gIHZhciBjaG9zZW5PdXRnb2luZ0ZsaWdodCwgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0LCBib29raW5nRGF0YSwgY2FiaW5ldE91dGdvaW5nQ2xhc3MsIGNhYmluZXRSZXR1cm5pbmdDbGFzcywgb3V0Z29pbmdTZWF0LCByZXR1cm5TZWF0LCByZWZOdW07XG4gIHZhciBpc090aGVySG9zdHM7IC8vIHNldCB0byBmYWxzZSBpbiBmbGlnaHRzY3RybCAsc2V0IHRvIHRydWUgZmxpZ2h0c05ld0N0cmxcbiAgdmFyIHN0cmlwZVRva2VuO1xuICB2YXIgcGFzc2VuZ2VyRGF0YSA9IFtdO1xuICByZXR1cm4ge1xuICAgIGdldEFpcnBvcnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvYWlycG9ydHMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0RmxpZ2h0czogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAnZmFsc2UnXG5cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiLzAvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG5cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRPdGhlckZsaWdodHNFY286IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvZWNvbm9teS8xXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgZ2V0T3RoZXJGbGlnaHRzQnVzaTogZnVuY3Rpb24ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUsIHJldHVybkRhdGUpIHtcbiAgICAgIGlmICghcmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIHVybDogJy9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvXCIgKyByZXR1cm5EYXRlICsgXCIvYnVzaW5lc3MvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGdldEFpcmNyYWZ0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6ICcvYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRDb3VudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgc2V0T3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgfSxcbiAgICBzZXRSZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgIH0sXG4gICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgIHBhc3NlbmdlckRhdGEucHVzaChwYXNzZW5nZXIpO1xuICAgICAgaWYgKGlzT3RoZXJIb3N0cylcbiAgICAgICAgYm9va2luZ0RhdGEuUGFzc2VuZ2VyRGV0YWlscyA9IHBhc3NlbmdlckRhdGFcbiAgICB9LFxuICAgIGdldENhYmluZXRPdXRnb2luZ0NsYXNzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjYWJpbmV0T3V0Z29pbmdDbGFzcztcbiAgICB9LFxuICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgIH0sXG4gICAgc2V0Qm9va2luZzogZnVuY3Rpb24oYm9va2luZykge1xuICAgICAgaWYgKCFpc090aGVySG9zdHMpIHtcblxuICAgICAgICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSlcbiAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgIGlmICghYm9va2luZy5yZUVudHJ5SXNFY29ub215KVxuICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFib29raW5nLmNsYXNzKVxuICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgaWYgKCFib29raW5nLmNsYXNzKVxuICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuICAgICAgfVxuXG5cblxuICAgICAgYm9va2luZ0RhdGEgPSBib29raW5nO1xuICAgIH0sXG5cbiAgICBnZXRQYXNzZW5nZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBhc3NlbmdlckRhdGE7XG4gICAgfSxcbiAgICBnZXRCb29raW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBib29raW5nRGF0YTtcbiAgICB9LFxuICAgIGdldENob3Nlbk91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaG9zZW5PdXRnb2luZ0ZsaWdodDtcbiAgICB9LFxuICAgIGdldENob3NlblJldHVybmluZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hvc2VuUmV0dXJuaW5nRmxpZ2h0O1xuICAgIH0sXG4gICAgZ2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvdXRnb2luZ1NlYXQ7XG4gICAgfSxcblxuICAgIGdldFJldHVyblNlYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJldHVyblNlYXQ7XG4gICAgfSxcbiAgICBzZXRPdXRnb2luZ1NlYXQ6IGZ1bmN0aW9uKHNlYXQpIHtcbiAgICAgIG91dGdvaW5nU2VhdCA9IHNlYXQ7XG4gICAgfSxcbiAgICBzZXRSZXRydW5TZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICByZXR1cm5TZWF0ID0gc2VhdDtcbiAgICB9LFxuICAgIHNldElzT3RoZXJIb3N0czogZnVuY3Rpb24ob3RoZXJIb3N0cykge1xuICAgICAgaXNPdGhlckhvc3RzID0gb3RoZXJIb3N0cztcbiAgICB9LFxuICAgIElzT3RoZXJIb3N0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXNPdGhlckhvc3RzO1xuICAgIH0sXG4gICAgY2xlYXJMb2NhbDogZnVuY3Rpb24oKSB7XG4gICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSB7fVxuICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSB7fVxuICAgICAgcGFzc2VuZ2VyRGF0YSA9IFtdXG4gICAgICBib29raW5nRGF0YSA9IHt9XG4gICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IHt9XG4gICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSB7fVxuICAgICAgb3V0Z29pbmdTZWF0ID0ge31cbiAgICAgIHJldHVyblNlYXQgPSB7fVxuICAgICAgaXNpc090aGVySG9zdHMgPSBmYWxzZVxuXG4gICAgfSxcbiAgICBzdWJtaXRCb29raW5nOiBmdW5jdGlvbihvdGhlckhvc3RzKSB7XG4gICAgICB2YXIgcHJpY2UgPSAwO1xuICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgIHByaWNlID0gdGhpcy5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICBlbHNlXG4gICAgICAgIHByaWNlID0gdGhpcy5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmJ1c2luZXNzRmFyZVxuXG4gICAgICBpZiAodGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSlcbiAgICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgIHByaWNlID0gcHJpY2UgKyB0aGlzLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgaWYgKCFvdGhlckhvc3RzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgdXJsOiAnL2Jvb2tpbmcnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogb3RoZXJIb3N0c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTogJC5wYXJhbSh7XG4gICAgICAgICAgICBwYXNzZW5nZXI6IHBhc3NlbmdlckRhdGEsXG4gICAgICAgICAgICBib29raW5nOiBib29raW5nRGF0YSxcbiAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgIG91dGdvaW5nU2VhdE51bWJlcjogb3V0Z29pbmdTZWF0LFxuICAgICAgICAgICAgcmV0dXJuU2VhdE51bWJlcjogcmV0dXJuU2VhdCxcbiAgICAgICAgICAgIHRva2VuOiBzdHJpcGVUb2tlblxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICB1cmw6ICcvYm9va2luZycsIC8vIGhhcyB0byBiZSBjaGFuZ2VkICEhXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiBvdGhlckhvc3RzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiBib29raW5nRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0sXG4gICAgZ2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN0cmlwZVRva2VuO1xuICAgIH0sXG4gICAgc2V0U3RyaXBlVG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICBzdHJpcGVUb2tlbiA9IHRva2VuO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiICBBcHAuY29uZmlnKGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xuICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xuICAgICAgTUFJTjoge1xuICAgICAgICBCT09LX05PVzogJ0Jvb2sgTm93JyxcbiAgICAgICAgRlJPTTogJ0Zyb20nLFxuICAgICAgICBERVBBUlRVUkVfREFURTogJ0RlcGFydHVyZSBEYXRlJyxcbiAgICAgICAgVE86ICdUbycsXG4gICAgICAgIFVOREVSXzJfWUVBUlM6ICdVbmRlciAyIHllYXJzJyxcbiAgICAgICAgUk9VTkRfVFJJUDogJ1JvdW5kIFRyaXAnLFxuICAgICAgICBPTkVfV0FZOiAnT25lIFdheScsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ1NlYXJjaCBmb3IgZmxpZ2h0cycsXG4gICAgICAgIFlFQVJTOiBcInllYXJzXCIsXG4gICAgICAgIENISUxEUkVOOiAnY2hpbGRyZW4nLFxuICAgICAgICBDSElMRDogJ2NoaWxkJyxcbiAgICAgICAgQURVTFQ6ICdhZHVsdCcsXG4gICAgICAgIEFEVUxUUzogJ2FkdWx0cycsXG4gICAgICAgIElORkFOVFM6ICdpbmZhbnRzJyxcbiAgICAgICAgSU5GQU5UOiAnaW5mYW50JyxcbiAgICAgICAgUVVPVEVTX0hPTUU6IHtcbiAgICAgICAgICBPTkU6IFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICBUV086IFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLFxuICAgICAgICAgIFRIUkVFOiBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLFxuICAgICAgICAgIEZPVVI6IFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGTElHSFRTOiB7XG4gICAgICAgIFRJVExFOiAnQ2hvb3NlIGEgRmxpZ2h0JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgU0VBVFNfTEVGVDogJ3NlYXRzIGxlZnQnLFxuICAgICAgICBNT1JFX0RFVEFJTFM6ICdNb3JlIGRldGFpbHMnLFxuICAgICAgICBCT09LOiAnQm9vaycsXG4gICAgICAgIEZMSUdIVDogJ0ZsaWdodCcsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknXG4gICAgICB9LFxuICAgICAgRkxJR0hUOiB7XG4gICAgICAgIEZMSUdIVDogXCJGbGlnaHRcIixcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgVElUTEU6ICdGbGlnaHQgRGV0YWlscycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnT3BlcmF0ZWQgYnknLFxuICAgICAgICBOVU1CRVJfT0ZfUEFTU0VOR0VSUzogJ051bWJlciBvZiBwYXNzZW5nZXJzJyxcbiAgICAgICAgRkxZSU5HX0NBTFNTOiAnRmx5aW5nIGNsYXNzJyxcbiAgICAgICAgRkxJR0hUX0ZBUkU6ICdGbGlnaHQgZmFyZScsXG4gICAgICAgIEZMSUdIVF9GQUM6ICdGbGlnaHQgZmFjaWxpdGllcycsXG4gICAgICAgIFBBU1NFTkdFUjogJ3Bhc3NlbmdlcicsXG4gICAgICAgIFBBU1NFTkdFUlM6ICdwYXNzZW5nZXJzJ1xuICAgICAgfSxcbiAgICAgIE5BVjoge1xuICAgICAgICBORVhUOiAnTmV4dCcsXG4gICAgICAgIEJBQ0s6ICdCYWNrJyxcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIFNFUlZJQ0VTOiAnU2VydmljZXMnLFxuICAgICAgICBPVVJfVEVBTTogJ091ciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICdBYm91dCcsXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJ1xuICAgICAgfSxcblxuICAgICAgQ09ORklSTUFUSU9OOiB7XG4gICAgICAgIFRIQU5LX1lPVTogJ1RoYW5rIHlvdScsXG4gICAgICAgIE5BTUU6ICdOYW1lJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBGTElHSFROTzogJ0ZsaWdodCBudW1iZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdEZXBhcnR1cmUnLFxuICAgICAgICBBUlJBSVZBTDogJ0Fycml2YWwnLFxuICAgICAgICBQUklOVDogJ1ByaW50IHRpY2tldCdcbiAgICAgIH0sXG4gICAgICBDT05UQUNUX1VTOiB7XG5cbiAgICAgICAgQ09OVEFDVF9VUzogJ0NvbnRhY3QgVXMnLFxuICAgICAgICBQSE9ORTogJ1Bob25lJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCcsXG4gICAgICAgIExFQVZFX01TRzogJ0xlYXZlIHVzIGEgbWVzc2FnZScsXG4gICAgICAgIFNFTkQ6ICdTZW5kJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnRG8geW91IG1lYW4gNDA0Tm90Rm91bmQgVGVhbT8nXG5cbiAgICAgIH0sXG5cbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICdBYm91dCBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnSGlzdG9yeScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ1RoZSBmaXJzdCBhaXJiZXJsaW4gcGxhbmUgdG9vayBvZmYgb24gMjh0aCBBcHJpbCAxOTc5LiBFeHBlcmllbmNlIHRoZSBoaWdobGlnaHRzIGFuZCBtaWxlc3RvbmVzIGluIGFpcmJlcmxpbnMgaGlzdG9yeSAnLFxuICAgICAgICBPVVJfR09BTDogJ091ciBnb2FsJyxcbiAgICAgICAgT1VSX0dPQUxfUEFSQTogJ0ZpcnN0IEV1cm9wZSwgYW5kIHRoZW4gdGhlIGdsb2JlLCB3aWxsIGJlIGxpbmtlZCBieSBmbGlnaHQsIGFuZCBuYXRpb25zIHNvIGtuaXQgdG9nZXRoZXIgdGhhdCB0aGV5IHdpbGwgZ3JvdyB0byBiZSBuZXh0LWRvb3IgbmVpZ2hib3Jz4oCmIC4gV2hhdCByYWlsd2F5cyBoYXZlIGRvbmUgZm9yIG5hdGlvbnMsIGFpcndheXMgd2lsbCBkbyBmb3IgdGhlIHdvcmxkLicsXG4gICAgICAgIEFfUDogJ0FsbGlhbmNlL3BhcnRuZXJzJyxcbiAgICAgICAgQV9QX1BBUkE6ICdhaXJiZXJsaW4gZ3VhcmFudGVlcyBhIGRlbnNlIGNvbm5lY3Rpb24gbmV0d29yayBhbmQgY29uc3RhbnQgZ3Jvd3RoIHRoYW5rcyB0byB0aGUgY28tb3BlcmF0aW9uIHdpdGggb3RoZXIgYWlybGluZXMuYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLidcbiAgICAgIH0sXG5cbiAgICAgIE9GRkVSUzoge1xuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZWNpYWwgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSUzogJ0ZsaWdodCBPZmZlcnMnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTX1BBUkE6ICdGaW5kIHRoZSBtb3N0IGF0dHJhY3RpdmUgZmFyZSBmb3IgeW91ciBmbGlnaHQnLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LOiAnTGlrZSB1cyBvbiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ0RvbnQgbWlzcyBvdXIgc3BlY2lhbCBvZmZlcnMgb246IHdpdGggb3VyIG5ld3NsZXR0ZXIgYW5kIG9uIEZhY2Vib29rJyxcbiAgICAgICAgSE9URUw6ICdIb3RlbCcsXG4gICAgICAgIEhPVEVMX1BBUkE6ICdTcGVjaWFsIG9mZmVycyBmb3IgeW91ciBob3RlbCBzdGF5IGF3YXkgZnJvbSBvdXIgcGFydG5lcnMgLidcbiAgICAgIH0sXG5cblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG4gICAgICAgIEZJUlNUX05BTUU6ICdGaXJzdCBOYW1lJyxcbiAgICAgICAgTUlERExFX05BTUU6ICdNaWRkbGUgTmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ0xhc3QgTmFtZScsXG4gICAgICAgIFBBU1NfTk86ICdQYXNzcG9ydCBOdW1iZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnUGxhY2UgT2YgQmlydGgnLFxuICAgICAgICBQSE9ORV9OTzogJ1Bob25lIE51bWJlcicsXG4gICAgICAgIEVfTUFJTDogJ0VtYWlsJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ1JlcGVhdCBFbWFpbCcsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHByb3ZpZGVkIG1hdGNoZXMgdGhlIHBhc3Nwb3J0IGluZm9ybWF0aW9uLidcblxuICAgICAgfSxcbiAgICAgIFBBWU1FTlQ6IHtcblxuICAgICAgICBXRV9BQ0NFUFQ6ICdXZSBhY2NlcHQnLFxuICAgICAgICBDQVJEX0lORk86ICdDYXJkIGluZm9ybWF0aW9uOicsXG4gICAgICAgIEVYUF9EQVRFOiAnRXhwaXJlIERhdGU6JyxcbiAgICAgICAgQ09TVDogJ1lvdXIgYm9va2luZyB0b3RhbCBjb3N0J1xuXG4gICAgICB9LFxuXG4gICAgICBTRUFUSU5HOiB7XG5cbiAgICAgICAgU0VBVF9NQVA6ICdTZWF0bWFwJyxcbiAgICAgICAgU0VMRUNURUQ6ICdZb3Ugc2VsZWN0ZWQgc2VhdCdcblxuICAgICAgfSxcblxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ0luZmxpZ2h0IFNlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIHByZXNlbnRzIHRoZSBlY29ub215IGFuZCBidXNpbmVzcyBjbGFzcy4nLFxuICAgICAgICBHX01FQUxTOiAnR291cm1ldCBNZWFscycsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0FpcmJlcmxpbiBpcyB0aGUgcmlnaHQgYWlybGluZSBmb3IgY29ubm9pc3NldXJzOiB0cmVhdCB5b3Vyc2VsZiB0byBvbmUgb2YgdGhlIGRlbGljaW91cyBnb3VybWV0IG1lYWxzIGZyb20gXCJTYW5zaWJhclwiIG9uIGJvYXJkJyxcbiAgICAgICAgQkFHR0FHRTogJ0JhZ2dhZ2UnLFxuICAgICAgICBCQUdHQUdFX1BBUkE6ICdFdmVyeXRoaW5nIHlvdSBuZWVkIHRvIGtub3cgYWJvdXQgZnJlZSBiYWdnYWdlIGFsbG93YW5jZXMsIGNhYmluIGJhZ2dhZ2UgcmVndWxhdGlvbnMgYW5kIHNwZWNpYWwgYmFnZ2FnZS4nXG5cbiAgICAgIH0sXG5cbiAgICB9KTtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcbiAgICAgIE1BSU46IHtcbiAgICAgICAgQk9PS19OT1c6ICdKZXR6dCBidWNoZW4nLFxuICAgICAgICBGUk9NOiAndm9uJyxcbiAgICAgICAgREVQQVJUVVJFX0RBVEU6ICdIaW5mbHVnJyxcbiAgICAgICAgVE86ICduYWNoJyxcbiAgICAgICAgVU5ERVJfMl9ZRUFSUzogJ0rDvG5nZXIgYWxzIDIgSmFocmVuJyxcbiAgICAgICAgUk9VTkRfVFJJUDogJ0hpbi11bmQgUsO8Y2tmYWhydCcsXG4gICAgICAgIE9ORV9XQVk6ICdOdXIgSGluZmx1ZycsXG4gICAgICAgIFNFQVJDSF9GT1JfRkxJR0hUUzogJ0Zsw7xnZSBzdWNoZW4nLFxuICAgICAgICBZRUFSUzogXCJKYWhyZVwiLFxuICAgICAgICBDSElMRFJFTjogJ0tpbmRlcicsXG4gICAgICAgIENISUxEOiAnS2luZCcsXG4gICAgICAgIEFEVUxUOiAnRXJ3YWNoc2VuZXInLFxuICAgICAgICBBRFVMVFM6ICdFcndhY2hzZW5lbicsXG4gICAgICAgIElORkFOVFM6ICdCYWJ5cycsXG4gICAgICAgIElORkFOVDogJ0JhYnknLFxuICAgICAgICBRVU9URVNfSE9NRToge1xuICAgICAgICAgIE9ORTogXCJTaW1wbGUsIGNvbnZlbmllbnQsIGluc3RhbnQgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgIFRXTzogXCJEZXN0aW5hdGlvbnMgYWxsIGFyb3VuZCB0aGUgZ2xvYmUuXCIsXG4gICAgICAgICAgVEhSRUU6IFwiRXhwZXJpZW5jZSBhdXRoZW50aWMgaG9zcGl0YWxpdHkuXCIsXG4gICAgICAgICAgRk9VUjogXCJUaW1lIHRvIGdldCBlbmNoYW50ZWQuXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEZMSUdIVFM6IHtcbiAgICAgICAgVElUTEU6ICdFaW5lbiBGbHVnIGF1c3N1Y2hlbicsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdmcmVpZSBTaXR6cGzDpHR6ZScsXG4gICAgICAgIE1PUkVfREVUQUlMUzogJ01laHIgRGV0YWlscycsXG4gICAgICAgIEJPT0s6ICdidWNoZW4nLFxuICAgICAgICBGTElHSFQ6ICdGbHVnJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJ1xuICAgICAgfSxcbiAgICAgIEZMSUdIVDoge1xuICAgICAgICBGTElHSFQ6IFwiRmx1Z1wiLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBUSVRMRTogJ0RldGFpbHMgZGVzIEZsdWdzJyxcbiAgICAgICAgT1BFUkFURURfQlk6ICdiZXRyaWViZW4gdm9uJyxcbiAgICAgICAgTlVNQkVSX09GX1BBU1NFTkdFUlM6ICdBbnphaGwgZGVyIFBhc3NhZ2llcmUnLFxuICAgICAgICBGTFlJTkdfQ0FMU1M6ICdCZWbDtnJkZXJ1bmdza2xhc3NlbicsXG4gICAgICAgIEZMSUdIVF9GQVJFOiAnRmx1Z3ByZWlzJyxcbiAgICAgICAgRkxJR0hUX0ZBQzogJ0RpZW5zdGxlaXN0dW5nZW4gZGVzIEZsdWdzJyxcbiAgICAgICAgUEFTU0VOR0VSOiAnUGFzc2FnaWVyJyxcbiAgICAgICAgUEFTU0VOR0VSUzogJ1Bhc3NhZ2llcmUnXG4gICAgICB9LFxuICAgICAgTkFWOiB7XG4gICAgICAgIE5FWFQ6ICd3ZWl0ZXInLFxuICAgICAgICBCQUNLOiAnenVyw7xjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlemllbGxlIEFuZ2Vib3RlJyxcbiAgICAgICAgU0VSVklDRVM6ICdEaWVuc3RsZWlzdHVuZ2VuJyxcbiAgICAgICAgT1VSX1RFQU06ICdVbnNlciBUZWFtJyxcbiAgICAgICAgQUJPVVQ6ICfDnGJlciB1bnMnLFxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCdcbiAgICAgIH0sXG4gICAgICBDT05GSVJNQVRJT046IHtcblxuICAgICAgICBUSEFOS19ZT1U6ICdEYW5rZSBzY2jDtm4nLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIEZMSUdIVE5POiAnRmx1ZyBOdW1tZXInLFxuICAgICAgICBERVBBUlRVUkU6ICdBYmZhaHJ0JyxcbiAgICAgICAgQVJSQUlWQUw6ICdBbmt1bmZ0JyxcbiAgICAgICAgUFJJTlQ6ICdGbHVna2FydGUgYWJkcnVja2VuJ1xuXG4gICAgICB9LFxuICAgICAgQ09OVEFDVF9VUzoge1xuXG4gICAgICAgIENPTlRBQ1RfVVM6ICdVbnNlciBLb250YWt0JyxcbiAgICAgICAgUEhPTkU6ICdUZWxlZm9uJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgTEVBVkVfTVNHOiAnSWhyIEFubGllZ2VuJyxcbiAgICAgICAgU0VORDogJ2Fic2NoaWNrZW4nXG4gICAgICB9LFxuICAgICAgZm91cl9vX2Zvcjoge1xuICAgICAgICAvL0RvIHlvdSBtZWFuIDQwNG5vdGZvdW5kIHRlYW0gPyAgaW4gNDA0Lmh0bWxcbiAgICAgICAgUVVFU1RJT046ICdNZWludGVuIFNpZSBkaWUgR3J1cHBlIHZvbiA0MDROb3RGb3VuZCA/J1xuXG4gICAgICB9LFxuICAgICAgQUJPVVRfVVM6IHtcblxuICAgICAgICBBQk9VVDogJ8OcYmVyIEFpckJlcmxpbicsXG4gICAgICAgIEhJU1RPUlk6ICdHZXNjaGljaHRlJyxcbiAgICAgICAgSElTVE9SWV9QQVJBOiAnQW0gMjguIEFwcmlsIDE5Nzkgc3RhcnRldCBlaW5lIEJvZWluZyA3MDcgdm9uIEJlcmxpbi1UZWdlbCBuYWNoIFBhbG1hIGRlIE1hbGxvcmNhLiBEZXIgRXJzdGZsdWcgaXN0IGRlciBBbmZhbmcgZGVyIEVyZm9sZ3NnZXNjaGljaHRlIHZvbiBhaXJiZXJsaW4uICcsXG4gICAgICAgIE9VUl9HT0FMOiAnVW5zZXIgWmllbCcsXG4gICAgICAgIE9VUl9HT0FMX1BBUkE6ICdadWVydCBFdXJvcGEsIHp1bsOkY2hzdCBkaWUgZ2FuemUgV2VsdCwgd2VyZGVuIGR1cmNoIGRlbiBGbHVnIHp1c2FtbWVuIHZlcmJ1bmRlbiwgdW5kIE5hdGlvbmVuIGVuZyB6dXNhbW1lbiBkYW1pdCBzaWUgTmFjaGJhcm4gYXVmd2FjaHNlbuKApiAuIFdhcyBkaWUgRWlzYmFobmVuIGbDvHIgZGllIE5hdGlvbmVuIGdldGFuIGhhdCwgd2lyZCBkaWUgRmzDvGdlIGbDvHIgZGFzIGdhbnplIFdlbHQgdHVuLicsXG4gICAgICAgIEFfUDogJ0FsbGlhbmNlL3BhcnRuZXJzJyxcbiAgICAgICAgQV9QX1BBUkE6ICdhaXJiZXJsaW4gZXJ3ZWl0ZXJ0IGlociBpbnRlcm5hdGlvbmFsZXMgU3RyZWNrZW5uZXR6LCBpbmRlbSBzaWUgbWl0IG1laHJlcmVuIEFpcmxpbmVzIGFscyBDb2Rlc2hhcmUtUGFydG5lcm4ga29vcGVyaWVydC4nXG5cblxuICAgICAgfSxcbiAgICAgIE9GRkVSUzoge1xuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZXppZWxsZSBBbmdlYm90ZScsXG4gICAgICAgIEZMSUdIVF9PRkZFUlM6ICdGbHVnYW5nZWJvdGUnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTX1BBUkE6ICdGaW5kZW4gU2llIGRpZSBhdHRyYWt0aXZzdGVuIFRhcmlmZSBmw7xyIElocmVuIEZsdWcnLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LOiAnRm9sZ2VuIFNpZSB1bnMgYXVmIEZhY2Vib29rJyxcbiAgICAgICAgTElLRV9GQUNFQk9PS19QQVJBOiAnVmVybWlzc2VuIFNpZSBuaWNodCB1bnNlcmUgc3BlemllbGxlIEFuZ2Vib3RlOiBtaXQgdW5zZXIgbmV3c2xldHRlciB1bmQgYXVmIEZhY2Vib29rJyxcbiAgICAgICAgSE9URUw6ICdIb3RlbCcsXG4gICAgICAgIEhPVEVMX1BBUkE6ICdTb25kZXJhbmdlYm90ZSBmw7xyIElociBIb3RlbCB3ZWcgdm9uIHVuc2VyZSBQYXJ0bmVybiAuJ1xuXG4gICAgICB9LFxuXG4gICAgICBQQVNTX0RFVEFJTFM6IHtcblxuICAgICAgICBGSVJTVF9OQU1FOiAnVm9ybmFtZScsXG4gICAgICAgIE1JRERMRV9OQU1FOiAnWndlaXRuYW1lJyxcbiAgICAgICAgTEFTVF9OQU1FOiAnTmFjaG5hbWUnLFxuICAgICAgICBQQVNTX05POiAnUmVpc2VwYXNzIE51bW1lcicsXG4gICAgICAgIFBMQUNFX09GQklSVEg6ICdPcnQgZGVzIEdlYnVydHMnLFxuICAgICAgICBQSE9ORV9OTzogJ1RlbGVmb24gTnVtbWVyJyxcbiAgICAgICAgRV9NQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBSRVBFQVRfRV9NQUlMOiAnRS1tYWlsIHdpZWRlcmhvbGVuJyxcbiAgICAgICAgVkVSSUZZX1BBUkE6ICdIaWVybWl0LCBiZXN0w6R0aWdlIGljaCwgZGFzcyBkaWUgSW5mb3JtYXRpb25lbiwgZGllIHZvcmhpbiBnZWdlYmVuIHNpbmQsIG1laW5lIFBhc3NkYXRlbiBlbnRzcHJpY2hlbi4nXG5cbiAgICAgIH0sXG4gICAgICBQQVlNRU5UOiB7XG5cbiAgICAgICAgV0VfQUNDRVBUOiAnWmFobHVuZ3NtZXRob2RlbicsXG4gICAgICAgIENBUkRfSU5GTzogJ0tyZWRpdGthcnRlIGluZm9ybWF0aW9uZW46JyxcbiAgICAgICAgRVhQX0RBVEU6ICdBYmxhdWZkYXR1bSBJaHJlciBLYXJ0ZTonLFxuICAgICAgICBDT1NUOiAnR2VzYW10cHJlaXMnXG5cbiAgICAgIH0sXG4gICAgICBTRUFUSU5HOiB7XG5cbiAgICAgICAgU0VBVF9NQVA6ICdTaXR6cGxhdHpyZXNlcnZpZXJ1bmcnLFxuICAgICAgICBTRUxFQ1RFRDogJ1NpZSBoYWJlbiBlaW5lbiBTaXR6cGxhdHogcmVzZXJ2aWVydC4nXG5cbiAgICAgIH0sXG4gICAgICBTRVJWSUNFUzoge1xuXG4gICAgICAgIFNFUlZJQ0U6ICdTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1NFUlZJQ0VTOiAnU2VydmljZXMgYW4gYm9hcmQnLFxuICAgICAgICBJTkZMSUdIVF9QQVJBOiAnICBBaXJiZXJsaW4gaGVpw59lbiBTaWUgaGVyemxpY2ggd2lsbGtvbW1lbiBhbiBCb3JkOiBlY29ub215IHVuZCBidXNpbmVzcyBjbGFzcy4nLFxuICAgICAgICBHX01FQUxTOiAnR291cm1ldGVzc2VuJyxcbiAgICAgICAgR19NRUFMU19QQVJBOiAnRnJldWVuIFNpZSBzaWNoIGF1ZiBBaXJiZXJsaW5zIGEgbGEgY2FydGUtU3BlaXNlIDogV2lyIHNlcnZpZXJlbiBJaG5lbiB1bnNlcmUgd2FybWVuIE9uLVRvcC1TcGVpc2VuLCBkaWUgZXh0cmEgdm9tIFNhbnNpYmFyLVdpcnQgSGVyYmVydCBTZWNrbGVyIGtyZWllcnQgd3VyZGVuLicsXG4gICAgICAgIEJBR0dBR0U6ICdSZWlzZWdlcMOkY2snLFxuICAgICAgICBCQUdHQUdFX1BBUkE6ICdVbnNlcmUgUmVnbHVuZ2VuIMO8YmVyIEF1Znp1Z2ViZW5kZXMgR2Vww6Rja21lbmdlbiwgw7xiZXIgSGFuZGdlcMOkY2sgdW5kIFNvbmRlcmdlcMOkY2suJ1xuXG4gICAgICB9LFxuXG4gICAgfSk7XG5cbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2RlJyk7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlJyk7XG5cbiAgfSk7XG4iLCIvLyBAYWJkZWxyaG1hbi1lc3NhbVxuQXBwLmNvbnRyb2xsZXIoJ2NvbmZpcm1hdGlvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGkpIHtcbiAgICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1jb25maXJtYXRpb24nO1xuICAkc2NvcGUudGl0bGUgPSBcIkNvbmZpcm1hdGlvblwiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJHbyBIb21lXCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZihUeXBlID09ICdkZXNrdG9wJyl7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXBpLnN1Ym1pdEJvb2tpbmcoJ2ZhbHNlJykudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAvLyAgIGFsZXJ0KGRhdGEuZGF0YSlcbiAgICAgIC8vICAgYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vXG4gICAgICAvLyB9KVxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgfVxuXG4gICAgaWYoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighYXBpLmdldFBhc3NlbmdlcigpKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUuZ29Tb2NpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3NvY2lhbCcpO1xuXG4gICAgfVxuICAgICRzY29wZS5mbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKTtcblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSBhcGkuZ2V0UGFzc2VuZ2VyKClbMF07XG4gICAgJCgnI3F1b3Rlcy10ZXh0JykudHlwZUl0KHtcbiAgICAgIHN0cmluZ3M6IFtcbiAgICAgICAgJ1wiVHJhdmVsIGFuZCBjaGFuZ2Ugb2YgcGxhY2UgaW1wYXJ0IG5ldyB2aWdvciB0byB0aGUgbWluZC5cIi1TZW5lY2EnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyB0ZW5kcyB0byBtYWduaWZ5IGFsbCBodW1hbiBlbW90aW9ucy7igJ0g4oCUIFBldGVyIEhvZWcnLFxuICAgICAgICAgJ+KAnFRyYXZlbGluZyDigJMgaXQgbGVhdmVzIHlvdSBzcGVlY2hsZXNzLCB0aGVuIHR1cm5zIHlvdSBpbnRvIGEgc3Rvcnl0ZWxsZXIu4oCdIC0gSWJuIEJhdHR1dGEnLFxuICAgICAgICAnIOKAnFdlIHRyYXZlbCwgc29tZSBvZiB1cyBmb3JldmVyLCB0byBzZWVrIG90aGVyIHBsYWNlcywgb3RoZXIgbGl2ZXMsIG90aGVyIHNvdWxzLuKAnSDigJMgQW5haXMgTmluJ1xuICAgICAgXSxcbiAgICAgIHNwZWVkOiA4MCxcbiAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xuXG4gIH1cblxuLy9cbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuT3V0Z29pbmdGbGlnaHRcIik7XG4vLyAgIGNvbnNvbGUubG9nKGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwiY2hvc2VuUmV0dXJuaW5nRmxpZ2h0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpO1xuLy8gY29uc29sZS5sb2coXCJwYXNzZW5nZXJcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRQYXNzZW5nZXIoKSlcbi8vIGNvbnNvbGUubG9nKFwiYm9va2luZ1wiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKSlcbi8vIGNvbnNvbGUubG9nKFwiZ29pbmdTZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0T3V0Z29pbmdTZWF0KCkpXG4vLyBjb25zb2xlLmxvZyhcInJldHJ1blNlYXRcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRSZXR1cm5TZWF0KCkpXG5cblxufSk7XG4iLCIvLyBATmFiaWxhXG5BcHAuY29udHJvbGxlcignZmxpZ2h0RGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkZsaWdodChzKSBEZXRhaWxzXCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuXG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgdmFyIG91dGdvaW5nRmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG4gIHZhciByZXR1cm5GbGlnaHQgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCk7XG5cbiAgdmFyIGJvb2tpbmcgPSBhcGkuZ2V0Qm9va2luZygpO1xuXG4gIHZhciBmYWNpbGl0aWVzID0gW1wiU21va2luZyBhcmVhcyBhdmFpbGFibGVcIiwgXCJXaS1GaSBhdmFpbGFiaWxpdHlcIixcbiAgICBcIjQgY3VsdHVyYWwgY3Vpc2luZXNcIiwgXCJJbmZsaWdodCBlbnRlcnRhaW5tZW50XCIsIFwiRXh0cmEgY296eSBzbGVlcGVyZXR0ZVwiLFxuICAgIFwiU2NyZWVucyB0byBzaG93IHlvdXIgZmxpZ2h0IHBhdHRlcm4sIGFpcmNyYWZ0IGFsdGl0dWRlIGFuZCBzcGVlZFwiXG4gIF07XG5pZiAob3V0Z29pbmdGbGlnaHQpe1xuICB2YXIgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgdmFyIGFycml2YWxEYXRlID0gbmV3IERhdGUob3V0Z29pbmdGbGlnaHQuYXJyaXZhbFVUQyk7XG4gIG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMgPSBhcnJpdmFsRGF0ZS50b1VUQ1N0cmluZygpO1xuXG5cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuZGVwYXJ0dXJlVVRDID0gZGVwYXJ0dXJlRGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIGFycml2YWxEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmFycml2YWxVVEMpO1xuICAgIHJldHVybkZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICB2YXIgYWlyY3JhZnRzID0gW107XG4gIHZhciBvdXRBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciBvdXRBaXJjcmFmdGhhc1dpZmk7XG4gIHZhciByZUFpcmNyYWZ0aGFzU21va2luZztcbiAgdmFyIHJlQWlyY3JhZnRoYXNXaWZpIDtcbiAgYXBpLmdldEFpcmNyYWZ0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlyY3JhZnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkFpcmNyYWZ0VGFpbE51bWJlcikge1xuICAgICAgICBvdXRBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICRzY29wZS5vdXRBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2ldLm1vZGVsO1xuICAgICAgfVxuICAgICAgaWYgKHJldHVybkZsaWdodCkge1xuICAgICAgICBpZiAoYWlyY3JhZnRzW2ldLnRhaWxOdW1iZXIgPT09IHJldHVybkZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzU21va2luZyA9IGFpcmNyYWZ0c1tpXS5oYXNTbW9raW5nO1xuICAgICAgICAgIHJlQWlyY3JhZnRoYXNXaWZpID0gYWlyY3JhZnRzW2ldLmhhc1dpZmk7XG4gICAgICAgICAgJHNjb3BlLnJlQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuXG4gICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZTtcbiAgJHNjb3BlLm91dFJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gIHZhciBhaXJwb3J0cyA9IFtdO1xuICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSBvdXRnb2luZ0ZsaWdodC5yZWZPcmlnaW5BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmRGVzdGluYXRpb25BaXJwb3J0KSB7XG4gICAgICAgICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgJHNjb3BlLnJlUmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWU7XG4gICAgICAgIGlmIChhaXJwb3J0c1tpXS5pYXRhID09PSByZXR1cm5GbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAgICRzY29wZS5yZVJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9XG4gIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfSk7XG4gIHZhciBvdXRidXNpbmVzc09yRWNvbiA9IFwiXCI7XG4gIHZhciBvdXRmYXJlID0gMDtcblxuICBpZiAoYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICBvdXRmYXJlID0gb3V0Z29pbmdGbGlnaHQuZWNvbm9teUZhcmU7XG4gIH0gZWxzZSB7XG4gICAgb3V0YnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmJ1c2luZXNzRmFyZTtcbiAgfVxuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlYnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICAgIHZhciByZWZhcmUgPSAwO1xuICAgIGlmIChib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkVjb25vbXlcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5lY29ub215RmFyZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVidXNpbmVzc09yRWNvbiA9IFwiQnVzaW5lc3NcIjtcbiAgICAgIHJlZmFyZSA9IHJldHVybkZsaWdodC5idXNpbmVzc0ZhcmU7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dGZhY2lsaXRpZXNSZXN1bHQgPSBbXTtcbiAgaWYgKG91dEFpcmNyYWZ0aGFzU21va2luZylcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gIGlmIChvdXRBaXJjcmFmdGhhc1dpZmkpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gIGlmICghYm9va2luZy5leGl0SXNFY29ub215KSB7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMl0pO1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gIH1cbiBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s1XSk7XG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICB2YXIgcmVmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNTbW9raW5nKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1swXSk7XG4gICAgaWYgKHJlQWlyY3JhZnRoYXNXaWZpKVxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1sxXSk7XG5cbiAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSkge1xuXG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbM10pO1xuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1s0XSk7XG4gICAgfVxuICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuXG4gICAgJHNjb3BlLnJldHVybkZsaWdodCA9IHJldHVybkZsaWdodDtcbiAgICAkc2NvcGUucmVidXNpbmVzc09yRWNvbiA9IHJlYnVzaW5lc3NPckVjb247XG4gICAgJHNjb3BlLnJlZmFyZSA9IHJlZmFyZTtcbiAgICAkc2NvcGUucmVmYWNpbGl0aWVzUmVzdWx0ID0gcmVmYWNpbGl0aWVzUmVzdWx0O1xuICB9XG4gICRzY29wZS5vdXRnb2luZ0ZsaWdodCA9IG91dGdvaW5nRmxpZ2h0O1xuICAkc2NvcGUub3V0YnVzaW5lc3NPckVjb24gPSBvdXRidXNpbmVzc09yRWNvbjtcbiAgJHNjb3BlLm91dGZhcmUgPSBvdXRmYXJlO1xuICAkc2NvcGUub3V0ZmFjaWxpdGllc1Jlc3VsdCA9IG91dGZhY2lsaXRpZXNSZXN1bHQ7XG5cbn1cbn0pO1xuIiwiLy8gQGFiZGVscmFobWFuLW1hZ2VkXG52YXIgZmxpZ2h0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcblxuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgYXBpLnNldElzT3RoZXJIb3N0cyhmYWxzZSk7XG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuXG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodC5faWRcbiAgICAgIGlmKCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodClcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0Ll9pZFxuICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgICBcInJlZlBhc3NlbmdlcklEXCI6IFtdLFxuICAgICAgXCJpc3N1ZURhdGVcIjogbnVsbCxcbiAgICAgIFwiaXNPbmVXYXlcIjogISRzY29wZS5yb3VuZFRyaXAsXG4gICAgICBcInJlZkV4aXRGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgXCJyZWZSZUVudHJ5RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgIFwicmVjZWlwdE51bWJlclwiOiBudWxsXG4gICAgfTtcblxuICAgIGlmICghb3JpZ2luIHx8ICFkZXN0aW5hdGlvbiB8fCAhZXhpdERhdGUpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgdmFyIGZsaWdodHM7XG4gICAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gICAgaWYgKHJldHVybkRhdGUpXG4gICAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gICAgYXBpLmdldEZsaWdodHMob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAvLyBmb3JtYXR0aW5nIGRhdGEgdG8gYmUgcHJlc2VudGFibGVcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICB9XG5cbiAgICAgIC8vICRzY29wZS5mbGlnaHRzID0gZmxpZ2h0cy5maWx0ZXIoY2hlY2tDb25zdHJhaW50cyk7XG5cbiAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgdmFyIG1pbnV0ZXMgPSBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gJSA2MDtcblxuICAgICAgICAgIGZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHM7XG5cbiAgICAgIGFwaS5nZXRBaXJwb3J0cygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlycG9ydHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0KVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfSk7XG5cbiAgICAgIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJjcmFmdHMubGVuZ3RoOyBqKyspIHtcblxuICAgICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRUYWlsTnVtYmVyKVxuICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuZXhpdElzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZFeGl0RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQsIGlzRWNvbm9teSkge1xuICAgICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZUVudHJ5SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQm9va2luZy5pc09uZVdheSA9ICRzY29wZS5yb3VuZFRyaXA7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoZWNrTmV4dEJ0blN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgY29uc29sZS5sb2coJHJvdXRlUGFyYW1zKVxuXG5cbiAgICAkc2NvcGUuZmxpZ2h0cyA9IHtcbiAgICBcIm91dGdvaW5nRmxpZ2h0c1wiOiBbe1xuICAgICAgXCJfaWRcIjogXCIxXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDBcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQwMTowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMDM6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjJcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDA2OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQwODowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAyXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMTI6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDE0OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjRcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwM1wiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDE3OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxOTowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfV0sXG4gICAgXCJyZXR1cm5GbGlnaHRzXCI6IFt7XG4gICAgICBcIl9pZFwiOiBcIjFcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMFwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDAxOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQwMzowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiMlwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAxXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMDY6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDA4OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIzXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDJcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQxMjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMTQ6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiNFwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAzXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMTc6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE5OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9XVxuICB9O1xuXG4gICAgJHNjb3BlLm9yaWdpbiA9IFwiQ0FJXCI7XG4gICAgJHNjb3BlLmRlc3RpbmF0aW9uID0gXCJKRURcIjtcbiAgICAkc2NvcGUuZXhpdERhdGUgPSBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCI7XG5cbiAgICAkc2NvcGUubWluaUxvZ29QYXRoID0gZnVuY3Rpb24ob3BlcmF0b3JBaXJsaW5lKXtcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUgPT09IFwiQWlyIEJlcmxpblwiKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLWJlcmxpbi1taW5pLWxvZ28ucG5nXCJcbiAgICAgIHJldHVybiBcImltZy9vdGhlci1haXJsaW5lLW1pbmktbG9nby5wbmdcIlxuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0T3V0Z29pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICAgICRzY29wZS5zZWxlY3RSZXR1cm5pbmdGbGlnaHQgPSBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5faWQpO1xuICAgIH1cblxuICB9XG5cbiAgJHNjb3BlLmNvbnN0cnVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZU91dDtcbiAgfTtcblxufVxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHN0YXRlUGFyYW1zJ107XG59IGVsc2Uge1xuICBmbGlnaHRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzQ3RybCcsIGZsaWdodENvbnRyb2xsZXIpO1xuIiwidmFyIGZsaWdodE5ld0NvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCRyb3V0ZVBhcmFtcykge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0cyc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIGEgRmxpZ2h0XCI7XG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcbiAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSBmYWxzZTtcblxuICBhcGkuc2V0SXNPdGhlckhvc3RzKHRydWUpO1xuXG4gICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICBhcGkuc2V0T3V0R29pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQpO1xuICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICBhcGkuc2V0Qm9va2luZygkc2NvcGUuc2VsZWN0ZWRCb29raW5nKTtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gIH1cblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgXCJwYXNzZW5nZXJEZXRhaWxzXCI6IFt7XG4gICAgICBcImZpcnN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJsYXN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydE51bVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgIFwibmF0aW9uYWxpdHlcIjogbnVsbCxcbiAgICAgIFwiZW1haWxcIjogbnVsbCxcbiAgICB9XSxcbiAgICBcImNsYXNzXCI6IG51bGwsXG4gICAgXCJvdXRnb2luZ0ZsaWdodElkXCI6IG51bGwsXG4gICAgXCJyZXR1cm5GbGlnaHRJZFwiOiBudWxsLFxuICAgIFwicGF5bWVudFRva2VuXCI6IG51bGxcbiAgfVxuXG4gIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gIC8vIFRPRE86IHZhciBpc0Vjb25vbXkgPSAkcm91dGVQYXJhbXMuY2xhc3MgPT09IFwiZWNvbm9teVwiPyB0cnVlIDogZmFsc2U7XG4gIHZhciBpc0Vjb25vbXkgPSB0cnVlO1xuXG4gICRzY29wZS5yb3VuZFRyaXAgPSBmYWxzZTtcblxuICBpZiAoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUpIHtcbiAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IHRydWU7XG4gIH1cblxuICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgaWYgKHJldHVybkRhdGUpXG4gICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICBpZiAoaXNFY29ub215KSB7XG4gICAgYXBpLmdldE90aGVyRmxpZ2h0c0VjbyhvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSlcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzQnVzaShvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5jbGFzcyA9IGlzRWNvbm9teSA9PT0gdHJ1ZSA/IFwiZWNvbm9teVwiIDogXCJidXNpbmVzc1wiO1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcub3V0Z29pbmdGbGlnaHRJZCA9IGZsaWdodC5faWQ7XG4gIH1cblxuICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgJHNjb3BlLmlzUmV0dXJuaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJldHVybkZsaWdodElkID0gZmxpZ2h0Ll9pZDtcbiAgfVxuXG4gICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUucm91bmRUcmlwKVxuICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gIH1cblxufVxuXG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn0gZWxzZSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnLF07XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCIgdmFyIG1haW5Db250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwkdHJhbnNsYXRlKSB7XG4gICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtbWFpbic7XG5cbiAgICRzY29wZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgICBjb25zb2xlLmxvZygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pO1xuICAgfVxuXG4gICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICRzY29wZS5haXJwb3J0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgfSk7XG5cblxuICAgJHNjb3BlLnNlbGVjdGVkT3JpZ2luID0gdW5kZWZpbmVkO1xuICAgJHNjb3BlLnNlbGVjdGVkRGVzdCA9IHVuZGVmaW5lZDtcblxuICAgZnVuY3Rpb24gYWlycG9yc0NvbnRhaW5zKGlhdGEpIHtcbiAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYWlycG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICBpZiAoaWF0YSA9PSAkc2NvcGUuYWlycG9ydHNbaV1bJ2lhdGEnXSlcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICB9XG4gICAgIHJldHVybiBmYWxzZTtcbiAgIH1cblxuICAgJHNjb3BlLmJ1dHRvblN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgIHJldHVybiAhJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICEkc2NvcGUuc2VsZWN0ZWREZXN0IHx8ICEkc2NvcGUuZXhpdERhdGUgfHwgJHNjb3BlLnNlbGVjdGVkRGVzdCA9PSAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkRGVzdCk7XG4gICB9XG5cbiAgICRzY29wZS5mbGlnaHQgPSB7XG4gICAgIHR5cGU6IFwib25lXCJcbiAgIH1cbiAgICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgIHZhbHVlOiBmYWxzZVxuICAgfVxuXG5cblxuICAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBleGl0RGF0ZSwgcmV0dXJuRGF0ZTtcblxuICAgICBleGl0RGF0ZSA9ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcbiAgICAgaWYgKCRzY29wZS5yZXR1cm5EYXRlKVxuICAgICAgIHJldHVybkRhdGUgPSAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcblxuICAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsIGV4aXREYXRlKTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlXG4gICAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsIHJldHVybkRhdGUpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzLW5ldycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogZXhpdERhdGUsXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogcmV0dXJuRGF0ZVxuICAgICAgICAgICB9KVxuICAgICAgIH1cbiAgICAgfSBlbHNlIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKS5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbikuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApXG4gICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6ICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApXG4gICAgICAgICAgIH0pXG4gICAgICAgfVxuXG4gICAgIH1cblxuICAgfTtcblxuXG5cblxuICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICQoJyNtYWluLXRleHQnKS50eXBlSXQoe1xuICAgICAgIHN0cmluZ3M6IFskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuT05FJyksJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLlRXTycpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5USFJFRScpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5GT1VSJyldLFxuICAgICAgIHNwZWVkOiAxMjAsXG4gICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICAgbG9vcDogdHJ1ZVxuICAgICB9KTtcblxuXG4gICAgICRsb2NhdGlvbi51cmwoJGxvY2F0aW9uLnBhdGgoKSk7XG4gICAgIHNldFVwRGF0ZSgkc2NvcGUpO1xuXG4gICAgICRzY29wZS5jaGlsZHJlbiA9IFsnMCAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICcxICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTEQnKSwgJzIgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnMyAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyksICc0ICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKV07XG4gICAgICRzY29wZS5jaGlsZHJlbkJ0blRleHQgPSAkc2NvcGUuY2hpbGRyZW5bMF07XG4gICAgICRzY29wZS5jaGFuZ2VDaGlsZHJlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG5cblxuICAgICAkc2NvcGUuYWR1bHRzID0gWycxICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUJykgLCAnMiAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVFMnKSwgJzMgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVFMnKSwgJzQgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRzJyldO1xuICAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gJHNjb3BlLmFkdWx0c1swXTtcbiAgICAgJHNjb3BlLmNoYW5nZUFkdWx0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5hZHVsdEJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG5cbiAgICAgJHNjb3BlLmluZmFudHMgPSBbJzAgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uSU5GQU5UJyksICcxICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLklORkFOVFMnKV07XG4gICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gJHNjb3BlLmluZmFudHNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VJbmZhbnQgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmluZmFudEJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG4gICB9XG5cblxuIH07XG5cbiBmdW5jdGlvbiBzZXRVcERhdGUoJHNjb3BlKSB7XG4gICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgfTtcbiAgICRzY29wZS50b2RheSgpO1xuXG4gICAkc2NvcGUub3BlbjIgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLnBvcHVwMi5vcGVuZWQgPSB0cnVlO1xuICAgfTtcbiAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cC5vcGVuZWQgPSB0cnVlO1xuICAgfTtcblxuXG4gICBmdW5jdGlvbiBkaXNhYmxlZChkYXRhKSB7XG4gICAgIHZhciBkYXRlID0gZGF0YS5kYXRlLFxuICAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgIHJldHVybiBtb2RlID09PSAnZGF5JyAmJiAoZGF0ZS5nZXREYXkoKSA9PT0gMCB8fCBkYXRlLmdldERheSgpID09PSA2KTtcbiAgIH1cbiAgICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgbWF4RGF0ZTogbmV3IERhdGUoMjAyMCwgNSwgMjIpLFxuICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICBzdGFydGluZ0RheTogMVxuICAgfTtcbiAgICRzY29wZS5wb3B1cDIgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gICAkc2NvcGUucG9wdXAgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gfVxuXG4gaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnYXBpJywnJHRyYW5zbGF0ZSddO1xuIH0gZWxzZSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9XG5cbiBBcHAuY29udHJvbGxlcignbWFpbkN0cmwnLCBtYWluQ29udHJvbGxlcik7XG4iLCIvLyBAeWFzc21pbmVcbkFwcC5jb250cm9sbGVyKCdwYXNzZW5nZXJEZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnRpdGxlID0gXCJGaWxsIGluIHlvdXIgZGV0YWlsc1wiO1xuXG4gICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9ICRzY29wZS50aXRsZXNbMF07XG4gICAgJHNjb3BlLmNoYW5nZVRpdGxlID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcblxuXG5cblxuICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICB0eXBlOiBudWxsLFxuICAgICAgY291bnRyeUNvZGU6IG51bGwsXG4gICAgICBuYXRpb25hbGl0eTogbnVsbCxcbiAgICAgIHNleDogbnVsbCxcbiAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgIHBvaW50czogbnVsbCxcbiAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICBmaXJzdE5hbWU6IG51bGwsXG4gICAgICBtaWRkbGVOYW1lOiBudWxsLFxuICAgICAgbGFzdE5hbWU6IG51bGwsXG4gICAgICBwYXNzcG9ydE51bWJlcjogbnVsbCxcbiAgICAgIHBob25lTnVtYmVyOiBudWxsLFxuICAgICAgZW1haWw6IG51bGxcblxuICAgIH07XG5cblxuICAgIHZhciBjb21wbGV0ZSA9IGZhbHNlO1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcblxuXG5cbiAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUubmF0aW9uYWxpdHksXG4gICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICB0aXRsZTogJHNjb3BlLnRpdGxlc0J0blRleHQsXG4gICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLmZpcnN0TmFtZSxcbiAgICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWUsXG4gICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICAgIHBhc3Nwb3J0TnVtYmVyOiAkc2NvcGUucGFzc3BvcnROdW1iZXIsXG4gICAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXIsXG4gICAgICAgIGVtYWlsOiAkc2NvcGUuZW1haWwxXG5cblxuICAgICAgfTtcbiAgICAgIC8vL2JlZm9yZSB5b3UgbGVhdmUgdGhlIHBhZ2UgbWFrZSBzdXJlIHRoYXQgdGhlIHBhc3NlbmdlciBvYmplY3QgaXMgY29tcGxldGUgb3RoZXJ3aXNlIHNob3cgYWxlcnQoXCJGaWxsIGluIGFsbCBkYXRhXCIpO1xuXG5cblxuICAgICAgaWYgKGNvbXBsZXRlID09IGZhbHNlKSB7XG4gICAgICAgICRzY29wZS5hbGVydERhdGEgPSBmYWxzZTtcbiAgICAgICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlciA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMSA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyID09IG51bGwpKSB7XG4gICAgICAgICAgJHNjb3BlLmFsZXJ0RGF0YSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDEgIT0gJHNjb3BlLmVtYWlsdmVyKVxuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCgkc2NvcGUuY2hlY2sgPT0gbnVsbCkpXG4gICAgICAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICB9XG4gICAgICBpZiAoY29tcGxldGUgPT0gdHJ1ZSkge1xuICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICBpZiAoIWFwaS5pc090aGVySG9zdHMpXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAgIGVsc2UgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50JylcbiAgICAgIH1cblxuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgfVxuICB9IGVsc2Uge1xuXG5cblxuICAgIHZhciBjb21wbGV0ZTEgPSBmYWxzZTtcblxuICAgICRzY29wZS5OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY291bnRyeUNvZGU6IG51bGwsIC8vYWNjb3JkaW5nIHRvIGNvdW50cnlcbiAgICAgICAgbmF0aW9uYWxpdHk6ICRzY29wZS5jb3VudHJpZXNNb2IsXG4gICAgICAgIHNleDogbnVsbCxcbiAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICBiaXJ0aFBsYWNlOiBudWxsLFxuICAgICAgICBuYXRpb25hbElEOiBudWxsLFxuICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgIGlzc3VlRGF0ZTogbnVsbCxcbiAgICAgICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICBtZW1iZXJzaGlwOiBudWxsLFxuICAgICAgICB0aXRsZTogJHNjb3BlLlRpdGxlTW9iLFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWVNb2IsXG4gICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lTW9iLFxuICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lTW9iLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iLFxuICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyTW9iLFxuICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMU1vYlxuXG5cbiAgICAgIH07XG5cblxuXG5cbiAgICAgIGlmIChjb21wbGV0ZTEgPT0gZmFsc2UpIHtcblxuICAgICAgICBpZiAoKCRzY29wZS5maXJzdE5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5taWRkbGVOYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubGFzdE5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5waG9uZU51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWwxTW9iID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWx2ZXJNb2IgPT0gbnVsbCkpIHtcbiAgICAgICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGluIGRhdGE6XCIgKyBcIlxcblwiICsgXCJQYXNzcG9ydCBOdW1iZXIgbXVzdCBiZSA4IG51bWJlcnNcIiArIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCJQaG9uZSBOdW1iZXIgbXVzdCBiZSAxMCBudW1iZXJzXCIgKyBcIlxcblwiICsgXCJFbWFpbHMgbXVzdCBiZSBpbiBhQHh5ei5jb20gZm9ybWF0XCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMU1vYiAhPSAkc2NvcGUuZW1haWx2ZXJNb2IpXG4gICAgICAgICAgICBhbGVydChcIlRoZSBlbnRlcmVkIGVtYWlscyBkbyBub3QgbWF0Y2hcIik7XG4gICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICgoJHNjb3BlLmNoZWNrTW9iID09IG51bGwpKVxuICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHlvdSBlbnRlcmVkXCIpXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY29tcGxldGUxID0gdHJ1ZTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgfVxuXG4gICAgICBpZiAoY29tcGxldGUxID09IHRydWUpIHtcbiAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcblxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3RhYi9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICB9XG5cbiAgICB9O1xuICB9XG5cblxuXG59KTtcbiIsIi8vIEBtaXJuYVxuQXBwLmNvbnRyb2xsZXIoJ3BheW1lbnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtcGF5bWVudCc7XG4gICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIHlvdXIgcGF5bWVudCBvcHRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiU3VibWl0XCI7XG4gICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAkc2NvcGUuZm9ybSA9IHtcbiAgICBudW1iZXI6IG51bGwsXG4gICAgY3ZjOiBudWxsLFxuICAgIGV4cF9tb250aDogbnVsbCxcbiAgICBleHBfeWVhcjogbnVsbFxuICB9O1xuICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHIgPSBjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHBheT9cIik7XG4gICAgaWYgKHIgPT0gdHJ1ZSkge1xuICAgICRzY29wZS5mb3JtLmV4cF95ZWFyID0gJHNjb3BlLnllYXJzQnRuVGV4dFxuICAgICRzY29wZS5mb3JtLmV4cF9tb250aCA9IHBhcnNlSW50KCRzY29wZS5tb250aHMuaW5kZXhPZigkc2NvcGUubW9udGhzQnRuVGV4dCkpICsgMVxuICAgIFN0cmlwZS5jYXJkLmNyZWF0ZVRva2VuKCRzY29wZS5mb3JtLCBmdW5jdGlvbihzdGF0dXMsIHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5pZClcbiAgICAgIGFwaS5zZXRTdHJpcGVUb2tlbihyZXNwb25zZS5pZClcbiAgICAgIGFwaS5zdWJtaXRCb29raW5nKGFwaS5Jc090aGVySG9zdHMoKSkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvY29uZmlybWF0aW9uJyk7XG4gICAgICAgIC8vIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcblxuICAgICAgfSlcbiAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBpZiAoIWFwaS5Jc090aGVySG9zdHMoKSlcbiAgfVxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nJyk7XG4gIH1cblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcblxuICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJpY2UgPSAwO1xuICAgIGlmIChhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgZWxzZVxuICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpIHtcblxuICAgICAgaWYgKGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgIGVsc2VcbiAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuXG4gICAgfVxuXG5cbiAgICAkc2NvcGUucHJpY2UgPSBwcmljZTtcbiAgICAkc2NvcGUueWVhcnMgPSBbJzIwMTYnLCAnMjAxNycsICcyMDE4JywgJzIwMTknLCAnMjAyMCcsICcyMDIxJywgJzIwMjInLCAnMjAyMycsICcyMDI0J107XG4gICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAkc2NvcGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICRzY29wZS55ZWFyc0J0blRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidXJhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9ICRzY29wZS5tb250aHNbMF07XG4gICAgJHNjb3BlLmNoYW5nZU1vbnRoID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSB0ZXh0O1xuICAgICAgJHNjb3BlLm1vbnRoc0J0bk5vID0gJHNjb3BlLm1vbnRocy5pbmRleE9mKHRleHQpO1xuICAgIH1cbiAgfVxuXG59KTtcbiIsIi8vIEBhaG1lZC1lc3NtYXRcbiAgdmFyIHNlYXRpbmdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpLCRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1zZWF0aW5nJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIldoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIHNpdD9cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvcmV0dXJpbmcnKTtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXBpLnNldFJldHJ1blNlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIH1cblxuXG5cbiAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VhdG1hcDtcblxuICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcblxuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH1cblxuXG5cbiAgICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICAgIHZhciBzY2hlbWEgPSBbMywgNSwgMywgMjBdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc2VhcmNoQ29sb3IgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgaWYgKCEkc2NvcGUuaXNFbXB0eSh0ZXh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0T2N1JztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdEVtcHR5JztcbiAgICAgIH1cbiAgICAgICRzY29wZS5pc0VtcHR5ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhdG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoc2VhdG1hcFtpXVsnbnVtYmVyJ10gPT0gdGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXRtYXBbaV1bJ2lzRW1wdHknXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnNlbGVjdFNlYXQgPSBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgJHNjb3BlLnNlYXQgPSBzZWF0O1xuICAgICAgfTtcbiAgICB9XG5cblxuXG4gICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgIHZhciBzY2hlbWEgPSBbMiwgNCwgMiwgOV07XG5cbiAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICB9XG5cblxufTtcblxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdzZWF0aW5nQ3RybCcsIHNlYXRpbmdDb250cm9sbGVyKTtcbiJdfQ==
