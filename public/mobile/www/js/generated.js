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

var fields = [true, true, true, true, true,true, true, true, true];

$scope.alertFName = false;
$scope.alertMName = false;
$scope.alertLName = false;
$scope.alertPhNumber = false;
$scope.alertPNumber= false;
$scope.alertEmail = false;
$scope.alertConfirm = false;
$scope.alertCheck = false;


if($scope.firstName==null){
fields[0]=false;
$scope.alertFName = true;
}
if($scope.middleName==null){
fields[1]=false;
$scope.alertMName = true;
}
if($scope.lastName==null){
fields[2]=false;
$scope.alertLName = true;
}
if($scope.phoneNumber==null){
fields[3]=false;
$scope.alertPhNumber = true;
}
if($scope.passportNumber==null){
fields[4]=false;
$scope.alertPNumber= true;
}
if($scope.email1==null){
fields[5]=false;
$scope.alertEmail = true;
}
if($scope.emailver==null){
fields[6]=false;
$scope.alertEmail = true;
}
if($scope.email1!=$scope.emailver){
fields[7]=false;
$scope.alertConfirm = true;
}
if($scope.check==null){
fields[8]=false;
$scope.alertCheck = true;
}

var allpassing = true;

for(var i = 0; i<fields.length;i++)
{
  if(fields[i]==false)
  {
    allpassing=false;
    break;
  }
}

if (allpassing == true) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uID0ge307XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0ID0ge307XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wdXQgPSB7fTtcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnBhdGNoID0ge307XG59KTtcblxuQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gIHZhciBhY2Nlc3NUb2tlbiA9IFwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBjM01pT2lKUGJteHBibVVnU2xkVUlFSjFhV3hrWlhJaUxDSnBZWFFpT2pFME5qRXdORE15Tnpnc0ltVjRjQ0k2TVRRNU1qVTNPVEkzT0N3aVlYVmtJam9pZDNkM0xtVjRZVzF3YkdVdVkyOXRJaXdpYzNWaUlqb2lhbkp2WTJ0bGRFQmxlR0Z0Y0d4bExtTnZiU0o5LmRYWlZDLS11dnRpZ3JGQjdUM2ZHVEc4NE5JWWxTblJxYmdiVDQzeHpGQXdcIlxuICB2YXIgY2hvc2VuT3V0Z29pbmdGbGlnaHQsIGNob3NlblJldHVybmluZ0ZsaWdodCwgYm9va2luZ0RhdGEsIGNhYmluZXRPdXRnb2luZ0NsYXNzLCBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MsIG91dGdvaW5nU2VhdCwgcmV0dXJuU2VhdCwgcmVmTnVtO1xuICB2YXIgaXNPdGhlckhvc3RzOyAvLyBzZXQgdG8gZmFsc2UgaW4gZmxpZ2h0c2N0cmwgLHNldCB0byB0cnVlIGZsaWdodHNOZXdDdHJsXG4gIHZhciBzdHJpcGVUb2tlbjtcbiAgdmFyIHBhc3NlbmdlckRhdGEgPSBbXTtcbiAgcmV0dXJuIHtcbiAgICBnZXRBaXJwb3J0czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL2FpcnBvcnRzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIGdldEZsaWdodHM6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiLzAvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi8wLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgZ2V0T3RoZXJGbGlnaHRzRWNvOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2Vjb25vbXkvMVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGdldE90aGVyRmxpZ2h0c0J1c2k6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICcvYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbicsXG4gICAgICAgICAgICAnb3RoZXItaG9zdHMnOiAndHJ1ZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBnZXRBaXJjcmFmdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsOiAnL2FwaS9haXJjcmFmdHMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0Q291bnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJy9hcGkvY291bnRyaWVzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIHNldE91dEdvaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgIH0sXG4gICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICB9LFxuICAgIHNldFBhc3NlbmdlcjogZnVuY3Rpb24ocGFzc2VuZ2VyKSB7XG4gICAgICBwYXNzZW5nZXJEYXRhLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgIGlmIChpc090aGVySG9zdHMpXG4gICAgICAgIGJvb2tpbmdEYXRhLlBhc3NlbmdlckRldGFpbHMgPSBwYXNzZW5nZXJEYXRhXG4gICAgfSxcbiAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgfSxcbiAgICBnZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNhYmluZXRSZXR1cm5pbmdDbGFzcztcbiAgICB9LFxuICAgIHNldEJvb2tpbmc6IGZ1bmN0aW9uKGJvb2tpbmcpIHtcbiAgICAgIGlmICghaXNPdGhlckhvc3RzKSB7XG5cbiAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiQnVzaW5lc3NcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkVjb25vbXlcIlxuXG4gICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJFY29ub215XCJcbiAgICAgIH1cblxuXG5cbiAgICAgIGJvb2tpbmdEYXRhID0gYm9va2luZztcbiAgICB9LFxuXG4gICAgZ2V0UGFzc2VuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXNzZW5nZXJEYXRhO1xuICAgIH0sXG4gICAgZ2V0Qm9va2luZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYm9va2luZ0RhdGE7XG4gICAgfSxcbiAgICBnZXRDaG9zZW5PdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hvc2VuT3V0Z29pbmdGbGlnaHQ7XG4gICAgfSxcbiAgICBnZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNob3NlblJldHVybmluZ0ZsaWdodDtcbiAgICB9LFxuICAgIGdldE91dGdvaW5nU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gb3V0Z29pbmdTZWF0O1xuICAgIH0sXG5cbiAgICBnZXRSZXR1cm5TZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXR1cm5TZWF0O1xuICAgIH0sXG4gICAgc2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICBvdXRnb2luZ1NlYXQgPSBzZWF0O1xuICAgIH0sXG4gICAgc2V0UmV0cnVuU2VhdDogZnVuY3Rpb24oc2VhdCkge1xuICAgICAgcmV0dXJuU2VhdCA9IHNlYXQ7XG4gICAgfSxcbiAgICBzZXRJc090aGVySG9zdHM6IGZ1bmN0aW9uKG90aGVySG9zdHMpIHtcbiAgICAgIGlzT3RoZXJIb3N0cyA9IG90aGVySG9zdHM7XG4gICAgfSxcbiAgICBJc090aGVySG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGlzT3RoZXJIb3N0cztcbiAgICB9LFxuICAgIGNsZWFyTG9jYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgY2hvc2VuUmV0dXJuaW5nRmxpZ2h0ID0ge31cbiAgICAgIGNob3Nlbk91dGdvaW5nRmxpZ2h0ID0ge31cbiAgICAgIHBhc3NlbmdlckRhdGEgPSBbXVxuICAgICAgYm9va2luZ0RhdGEgPSB7fVxuICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSB7fVxuICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0ge31cbiAgICAgIG91dGdvaW5nU2VhdCA9IHt9XG4gICAgICByZXR1cm5TZWF0ID0ge31cbiAgICAgIGlzaXNPdGhlckhvc3RzID0gZmFsc2VcblxuICAgIH0sXG4gICAgc3VibWl0Qm9va2luZzogZnVuY3Rpb24ob3RoZXJIb3N0cykge1xuICAgICAgdmFyIHByaWNlID0gMDtcbiAgICAgIGlmICh0aGlzLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgZWxzZVxuICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgaWYgKHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgIGlmICh0aGlzLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgIGlmICghb3RoZXJIb3N0cykge1xuICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIHVybDogJy9ib29raW5nJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdvdGhlci1ob3N0cyc6IG90aGVySG9zdHNcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuICAgICAgICAgICAgcGFzc2VuZ2VyOiBwYXNzZW5nZXJEYXRhLFxuICAgICAgICAgICAgYm9va2luZzogYm9va2luZ0RhdGEsXG4gICAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgICBvdXRnb2luZ1NlYXROdW1iZXI6IG91dGdvaW5nU2VhdCxcbiAgICAgICAgICAgIHJldHVyblNlYXROdW1iZXI6IHJldHVyblNlYXQsXG4gICAgICAgICAgICB0b2tlbjogc3RyaXBlVG9rZW5cbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgdXJsOiAnL2Jvb2tpbmcnLCAvLyBoYXMgdG8gYmUgY2hhbmdlZCAhIVxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogb3RoZXJIb3N0c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTogYm9va2luZ0RhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9LFxuICAgIGdldFN0cmlwZVRva2VuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzdHJpcGVUb2tlbjtcbiAgICB9LFxuICAgIHNldFN0cmlwZVRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgc3RyaXBlVG9rZW4gPSB0b2tlbjtcbiAgICB9XG4gIH07XG59KTtcbiIsIiAgQXBwLmNvbmZpZyhmdW5jdGlvbigkdHJhbnNsYXRlUHJvdmlkZXIpIHtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdlbicsIHtcbiAgICAgIE1BSU46IHtcbiAgICAgICAgQk9PS19OT1c6ICdCb29rIE5vdycsXG4gICAgICAgIEZST006ICdGcm9tJyxcbiAgICAgICAgREVQQVJUVVJFX0RBVEU6ICdEZXBhcnR1cmUgRGF0ZScsXG4gICAgICAgIFRPOiAnVG8nLFxuICAgICAgICBVTkRFUl8yX1lFQVJTOiAnVW5kZXIgMiB5ZWFycycsXG4gICAgICAgIFJPVU5EX1RSSVA6ICdSb3VuZCBUcmlwJyxcbiAgICAgICAgT05FX1dBWTogJ09uZSBXYXknLFxuICAgICAgICBTRUFSQ0hfRk9SX0ZMSUdIVFM6ICdTZWFyY2ggZm9yIGZsaWdodHMnLFxuICAgICAgICBZRUFSUzogXCJ5ZWFyc1wiLFxuICAgICAgICBDSElMRFJFTjogJ2NoaWxkcmVuJyxcbiAgICAgICAgQ0hJTEQ6ICdjaGlsZCcsXG4gICAgICAgIEFEVUxUOiAnYWR1bHQnLFxuICAgICAgICBBRFVMVFM6ICdhZHVsdHMnLFxuICAgICAgICBJTkZBTlRTOiAnaW5mYW50cycsXG4gICAgICAgIElORkFOVDogJ2luZmFudCcsXG4gICAgICAgIFFVT1RFU19IT01FOiB7XG4gICAgICAgICAgT05FOiBcIlNpbXBsZSwgY29udmVuaWVudCwgaW5zdGFudCBjb25maXJtYXRpb24uXCIsXG4gICAgICAgICAgVFdPOiBcIkRlc3RpbmF0aW9ucyBhbGwgYXJvdW5kIHRoZSBnbG9iZS5cIixcbiAgICAgICAgICBUSFJFRTogXCJFeHBlcmllbmNlIGF1dGhlbnRpYyBob3NwaXRhbGl0eS5cIixcbiAgICAgICAgICBGT1VSOiBcIlRpbWUgdG8gZ2V0IGVuY2hhbnRlZC5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRkxJR0hUUzoge1xuICAgICAgICBUSVRMRTogJ0Nob29zZSBhIEZsaWdodCcsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFNFQVRTX0xFRlQ6ICdzZWF0cyBsZWZ0JyxcbiAgICAgICAgTU9SRV9ERVRBSUxTOiAnTW9yZSBkZXRhaWxzJyxcbiAgICAgICAgQk9PSzogJ0Jvb2snLFxuICAgICAgICBGTElHSFQ6ICdGbGlnaHQnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ09wZXJhdGVkIGJ5J1xuICAgICAgfSxcbiAgICAgIEZMSUdIVDoge1xuICAgICAgICBGTElHSFQ6IFwiRmxpZ2h0XCIsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFRJVExFOiAnRmxpZ2h0IERldGFpbHMnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ09wZXJhdGVkIGJ5JyxcbiAgICAgICAgTlVNQkVSX09GX1BBU1NFTkdFUlM6ICdOdW1iZXIgb2YgcGFzc2VuZ2VycycsXG4gICAgICAgIEZMWUlOR19DQUxTUzogJ0ZseWluZyBjbGFzcycsXG4gICAgICAgIEZMSUdIVF9GQVJFOiAnRmxpZ2h0IGZhcmUnLFxuICAgICAgICBGTElHSFRfRkFDOiAnRmxpZ2h0IGZhY2lsaXRpZXMnLFxuICAgICAgICBQQVNTRU5HRVI6ICdwYXNzZW5nZXInLFxuICAgICAgICBQQVNTRU5HRVJTOiAncGFzc2VuZ2VycydcbiAgICAgIH0sXG4gICAgICBOQVY6IHtcbiAgICAgICAgTkVYVDogJ05leHQnLFxuICAgICAgICBCQUNLOiAnQmFjaycsXG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlY2lhbCBPZmZlcnMnLFxuICAgICAgICBTRVJWSUNFUzogJ1NlcnZpY2VzJyxcbiAgICAgICAgT1VSX1RFQU06ICdPdXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnQWJvdXQnLFxuICAgICAgICBDT05UQUNUX1VTOiAnQ29udGFjdCBVcydcbiAgICAgIH0sXG5cbiAgICAgIENPTkZJUk1BVElPTjoge1xuICAgICAgICBUSEFOS19ZT1U6ICdUaGFuayB5b3UnLFxuICAgICAgICBOQU1FOiAnTmFtZScsXG4gICAgICAgIFBIT05FOiAnUGhvbmUnLFxuICAgICAgICBNQUlMOiAnRS1tYWlsJyxcbiAgICAgICAgRkxJR0hUTk86ICdGbGlnaHQgbnVtYmVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnRGVwYXJ0dXJlJyxcbiAgICAgICAgQVJSQUlWQUw6ICdBcnJpdmFsJyxcbiAgICAgICAgUFJJTlQ6ICdQcmludCB0aWNrZXQnXG4gICAgICB9LFxuICAgICAgQ09OVEFDVF9VUzoge1xuXG4gICAgICAgIENPTlRBQ1RfVVM6ICdDb250YWN0IFVzJyxcbiAgICAgICAgUEhPTkU6ICdQaG9uZScsXG4gICAgICAgIE1BSUw6ICdFLW1haWwnLFxuICAgICAgICBMRUFWRV9NU0c6ICdMZWF2ZSB1cyBhIG1lc3NhZ2UnLFxuICAgICAgICBTRU5EOiAnU2VuZCdcbiAgICAgIH0sXG4gICAgICBmb3VyX29fZm9yOiB7XG4gICAgICAgIC8vRG8geW91IG1lYW4gNDA0bm90Zm91bmQgdGVhbSA/ICBpbiA0MDQuaHRtbFxuICAgICAgICBRVUVTVElPTjogJ0RvIHlvdSBtZWFuIDQwNE5vdEZvdW5kIFRlYW0/J1xuXG4gICAgICB9LFxuXG4gICAgICBBQk9VVF9VUzoge1xuXG4gICAgICAgIEFCT1VUOiAnQWJvdXQgQWlyQmVybGluJyxcbiAgICAgICAgSElTVE9SWTogJ0hpc3RvcnknLFxuICAgICAgICBISVNUT1JZX1BBUkE6ICdUaGUgZmlyc3QgYWlyYmVybGluIHBsYW5lIHRvb2sgb2ZmIG9uIDI4dGggQXByaWwgMTk3OS4gRXhwZXJpZW5jZSB0aGUgaGlnaGxpZ2h0cyBhbmQgbWlsZXN0b25lcyBpbiBhaXJiZXJsaW5zIGhpc3RvcnkgJyxcbiAgICAgICAgT1VSX0dPQUw6ICdPdXIgZ29hbCcsXG4gICAgICAgIE9VUl9HT0FMX1BBUkE6ICdGaXJzdCBFdXJvcGUsIGFuZCB0aGVuIHRoZSBnbG9iZSwgd2lsbCBiZSBsaW5rZWQgYnkgZmxpZ2h0LCBhbmQgbmF0aW9ucyBzbyBrbml0IHRvZ2V0aGVyIHRoYXQgdGhleSB3aWxsIGdyb3cgdG8gYmUgbmV4dC1kb29yIG5laWdoYm9yc+KApiAuIFdoYXQgcmFpbHdheXMgaGF2ZSBkb25lIGZvciBuYXRpb25zLCBhaXJ3YXlzIHdpbGwgZG8gZm9yIHRoZSB3b3JsZC4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGd1YXJhbnRlZXMgYSBkZW5zZSBjb25uZWN0aW9uIG5ldHdvcmsgYW5kIGNvbnN0YW50IGdyb3d0aCB0aGFua3MgdG8gdGhlIGNvLW9wZXJhdGlvbiB3aXRoIG90aGVyIGFpcmxpbmVzLmFpcmJlcmxpbiBndWFyYW50ZWVzIGEgZGVuc2UgY29ubmVjdGlvbiBuZXR3b3JrIGFuZCBjb25zdGFudCBncm93dGggdGhhbmtzIHRvIHRoZSBjby1vcGVyYXRpb24gd2l0aCBvdGhlciBhaXJsaW5lcy4nXG4gICAgICB9LFxuXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGVjaWFsIE9mZmVycycsXG4gICAgICAgIEZMSUdIVF9PRkZFUlM6ICdGbGlnaHQgT2ZmZXJzJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZCB0aGUgbW9zdCBhdHRyYWN0aXZlIGZhcmUgZm9yIHlvdXIgZmxpZ2h0JyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0xpa2UgdXMgb24gRmFjZWJvb2snLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LX1BBUkE6ICdEb250IG1pc3Mgb3VyIHNwZWNpYWwgb2ZmZXJzIG9uOiB3aXRoIG91ciBuZXdzbGV0dGVyIGFuZCBvbiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU3BlY2lhbCBvZmZlcnMgZm9yIHlvdXIgaG90ZWwgc3RheSBhd2F5IGZyb20gb3VyIHBhcnRuZXJzIC4nXG4gICAgICB9LFxuXG5cbiAgICAgIFBBU1NfREVUQUlMUzoge1xuICAgICAgICBGSVJTVF9OQU1FOiAnRmlyc3QgTmFtZScsXG4gICAgICAgIE1JRERMRV9OQU1FOiAnTWlkZGxlIE5hbWUnLFxuICAgICAgICBMQVNUX05BTUU6ICdMYXN0IE5hbWUnLFxuICAgICAgICBQQVNTX05POiAnUGFzc3BvcnQgTnVtYmVyJyxcbiAgICAgICAgUExBQ0VfT0ZCSVJUSDogJ1BsYWNlIE9mIEJpcnRoJyxcbiAgICAgICAgUEhPTkVfTk86ICdQaG9uZSBOdW1iZXInLFxuICAgICAgICBFX01BSUw6ICdFbWFpbCcsXG4gICAgICAgIFJFUEVBVF9FX01BSUw6ICdSZXBlYXQgRW1haWwnLFxuICAgICAgICBWRVJJRllfUEFSQTogJ0kgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiBwcm92aWRlZCBtYXRjaGVzIHRoZSBwYXNzcG9ydCBpbmZvcm1hdGlvbi4nXG5cbiAgICAgIH0sXG4gICAgICBQQVlNRU5UOiB7XG5cbiAgICAgICAgV0VfQUNDRVBUOiAnV2UgYWNjZXB0JyxcbiAgICAgICAgQ0FSRF9JTkZPOiAnQ2FyZCBpbmZvcm1hdGlvbjonLFxuICAgICAgICBFWFBfREFURTogJ0V4cGlyZSBEYXRlOicsXG4gICAgICAgIENPU1Q6ICdZb3VyIGJvb2tpbmcgdG90YWwgY29zdCdcblxuICAgICAgfSxcblxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2VhdG1hcCcsXG4gICAgICAgIFNFTEVDVEVEOiAnWW91IHNlbGVjdGVkIHNlYXQnXG5cbiAgICAgIH0sXG5cbiAgICAgIFNFUlZJQ0VTOiB7XG5cbiAgICAgICAgU0VSVklDRTogJ1NlcnZpY2VzJyxcbiAgICAgICAgSU5GTElHSFRfU0VSVklDRVM6ICdJbmZsaWdodCBTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1BBUkE6ICcgIEFpcmJlcmxpbiBwcmVzZW50cyB0aGUgZWNvbm9teSBhbmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXQgTWVhbHMnLFxuICAgICAgICBHX01FQUxTX1BBUkE6ICdBaXJiZXJsaW4gaXMgdGhlIHJpZ2h0IGFpcmxpbmUgZm9yIGNvbm5vaXNzZXVyczogdHJlYXQgeW91cnNlbGYgdG8gb25lIG9mIHRoZSBkZWxpY2lvdXMgZ291cm1ldCBtZWFscyBmcm9tIFwiU2Fuc2liYXJcIiBvbiBib2FyZCcsXG4gICAgICAgIEJBR0dBR0U6ICdCYWdnYWdlJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnRXZlcnl0aGluZyB5b3UgbmVlZCB0byBrbm93IGFib3V0IGZyZWUgYmFnZ2FnZSBhbGxvd2FuY2VzLCBjYWJpbiBiYWdnYWdlIHJlZ3VsYXRpb25zIGFuZCBzcGVjaWFsIGJhZ2dhZ2UuJ1xuXG4gICAgICB9LFxuXG4gICAgfSk7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZGUnLCB7XG4gICAgICBNQUlOOiB7XG4gICAgICAgIEJPT0tfTk9XOiAnSmV0enQgYnVjaGVuJyxcbiAgICAgICAgRlJPTTogJ3ZvbicsXG4gICAgICAgIERFUEFSVFVSRV9EQVRFOiAnSGluZmx1ZycsXG4gICAgICAgIFRPOiAnbmFjaCcsXG4gICAgICAgIFVOREVSXzJfWUVBUlM6ICdKw7xuZ2VyIGFscyAyIEphaHJlbicsXG4gICAgICAgIFJPVU5EX1RSSVA6ICdIaW4tdW5kIFLDvGNrZmFocnQnLFxuICAgICAgICBPTkVfV0FZOiAnTnVyIEhpbmZsdWcnLFxuICAgICAgICBTRUFSQ0hfRk9SX0ZMSUdIVFM6ICdGbMO8Z2Ugc3VjaGVuJyxcbiAgICAgICAgWUVBUlM6IFwiSmFocmVcIixcbiAgICAgICAgQ0hJTERSRU46ICdLaW5kZXInLFxuICAgICAgICBDSElMRDogJ0tpbmQnLFxuICAgICAgICBBRFVMVDogJ0Vyd2FjaHNlbmVyJyxcbiAgICAgICAgQURVTFRTOiAnRXJ3YWNoc2VuZW4nLFxuICAgICAgICBJTkZBTlRTOiAnQmFieXMnLFxuICAgICAgICBJTkZBTlQ6ICdCYWJ5JyxcbiAgICAgICAgUVVPVEVTX0hPTUU6IHtcbiAgICAgICAgICBPTkU6IFwiU2ltcGxlLCBjb252ZW5pZW50LCBpbnN0YW50IGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICBUV086IFwiRGVzdGluYXRpb25zIGFsbCBhcm91bmQgdGhlIGdsb2JlLlwiLFxuICAgICAgICAgIFRIUkVFOiBcIkV4cGVyaWVuY2UgYXV0aGVudGljIGhvc3BpdGFsaXR5LlwiLFxuICAgICAgICAgIEZPVVI6IFwiVGltZSB0byBnZXQgZW5jaGFudGVkLlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGTElHSFRTOiB7XG4gICAgICAgIFRJVExFOiAnRWluZW4gRmx1ZyBhdXNzdWNoZW4nLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBTRUFUU19MRUZUOiAnZnJlaWUgU2l0enBsw6R0emUnLFxuICAgICAgICBNT1JFX0RFVEFJTFM6ICdNZWhyIERldGFpbHMnLFxuICAgICAgICBCT09LOiAnYnVjaGVuJyxcbiAgICAgICAgRkxJR0hUOiAnRmx1ZycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnYmV0cmllYmVuIHZvbidcbiAgICAgIH0sXG4gICAgICBGTElHSFQ6IHtcbiAgICAgICAgRkxJR0hUOiBcIkZsdWdcIixcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgVElUTEU6ICdEZXRhaWxzIGRlcyBGbHVncycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnYmV0cmllYmVuIHZvbicsXG4gICAgICAgIE5VTUJFUl9PRl9QQVNTRU5HRVJTOiAnQW56YWhsIGRlciBQYXNzYWdpZXJlJyxcbiAgICAgICAgRkxZSU5HX0NBTFNTOiAnQmVmw7ZyZGVydW5nc2tsYXNzZW4nLFxuICAgICAgICBGTElHSFRfRkFSRTogJ0ZsdWdwcmVpcycsXG4gICAgICAgIEZMSUdIVF9GQUM6ICdEaWVuc3RsZWlzdHVuZ2VuIGRlcyBGbHVncycsXG4gICAgICAgIFBBU1NFTkdFUjogJ1Bhc3NhZ2llcicsXG4gICAgICAgIFBBU1NFTkdFUlM6ICdQYXNzYWdpZXJlJ1xuICAgICAgfSxcbiAgICAgIE5BVjoge1xuICAgICAgICBORVhUOiAnd2VpdGVyJyxcbiAgICAgICAgQkFDSzogJ3p1csO8Y2snLFxuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZXppZWxsZSBBbmdlYm90ZScsXG4gICAgICAgIFNFUlZJQ0VTOiAnRGllbnN0bGVpc3R1bmdlbicsXG4gICAgICAgIE9VUl9URUFNOiAnVW5zZXIgVGVhbScsXG4gICAgICAgIEFCT1VUOiAnw5xiZXIgdW5zJyxcbiAgICAgICAgQ09OVEFDVF9VUzogJ1Vuc2VyIEtvbnRha3QnXG4gICAgICB9LFxuICAgICAgQ09ORklSTUFUSU9OOiB7XG5cbiAgICAgICAgVEhBTktfWU9VOiAnRGFua2Ugc2Now7ZuJyxcbiAgICAgICAgTkFNRTogJ05hbWUnLFxuICAgICAgICBQSE9ORTogJ1RlbGVmb24nLFxuICAgICAgICBNQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBGTElHSFROTzogJ0ZsdWcgTnVtbWVyJyxcbiAgICAgICAgREVQQVJUVVJFOiAnQWJmYWhydCcsXG4gICAgICAgIEFSUkFJVkFMOiAnQW5rdW5mdCcsXG4gICAgICAgIFBSSU5UOiAnRmx1Z2thcnRlIGFiZHJ1Y2tlbidcblxuICAgICAgfSxcbiAgICAgIENPTlRBQ1RfVVM6IHtcblxuICAgICAgICBDT05UQUNUX1VTOiAnVW5zZXIgS29udGFrdCcsXG4gICAgICAgIFBIT05FOiAnVGVsZWZvbicsXG4gICAgICAgIE1BSUw6ICdFLW1haWwgYWRyZXNzZScsXG4gICAgICAgIExFQVZFX01TRzogJ0lociBBbmxpZWdlbicsXG4gICAgICAgIFNFTkQ6ICdhYnNjaGlja2VuJ1xuICAgICAgfSxcbiAgICAgIGZvdXJfb19mb3I6IHtcbiAgICAgICAgLy9EbyB5b3UgbWVhbiA0MDRub3Rmb3VuZCB0ZWFtID8gIGluIDQwNC5odG1sXG4gICAgICAgIFFVRVNUSU9OOiAnTWVpbnRlbiBTaWUgZGllIEdydXBwZSB2b24gNDA0Tm90Rm91bmQgPydcblxuICAgICAgfSxcbiAgICAgIEFCT1VUX1VTOiB7XG5cbiAgICAgICAgQUJPVVQ6ICfDnGJlciBBaXJCZXJsaW4nLFxuICAgICAgICBISVNUT1JZOiAnR2VzY2hpY2h0ZScsXG4gICAgICAgIEhJU1RPUllfUEFSQTogJ0FtIDI4LiBBcHJpbCAxOTc5IHN0YXJ0ZXQgZWluZSBCb2VpbmcgNzA3IHZvbiBCZXJsaW4tVGVnZWwgbmFjaCBQYWxtYSBkZSBNYWxsb3JjYS4gRGVyIEVyc3RmbHVnIGlzdCBkZXIgQW5mYW5nIGRlciBFcmZvbGdzZ2VzY2hpY2h0ZSB2b24gYWlyYmVybGluLiAnLFxuICAgICAgICBPVVJfR09BTDogJ1Vuc2VyIFppZWwnLFxuICAgICAgICBPVVJfR09BTF9QQVJBOiAnWnVlcnQgRXVyb3BhLCB6dW7DpGNoc3QgZGllIGdhbnplIFdlbHQsIHdlcmRlbiBkdXJjaCBkZW4gRmx1ZyB6dXNhbW1lbiB2ZXJidW5kZW4sIHVuZCBOYXRpb25lbiBlbmcgenVzYW1tZW4gZGFtaXQgc2llIE5hY2hiYXJuIGF1ZndhY2hzZW7igKYgLiBXYXMgZGllIEVpc2JhaG5lbiBmw7xyIGRpZSBOYXRpb25lbiBnZXRhbiBoYXQsIHdpcmQgZGllIEZsw7xnZSBmw7xyIGRhcyBnYW56ZSBXZWx0IHR1bi4nLFxuICAgICAgICBBX1A6ICdBbGxpYW5jZS9wYXJ0bmVycycsXG4gICAgICAgIEFfUF9QQVJBOiAnYWlyYmVybGluIGVyd2VpdGVydCBpaHIgaW50ZXJuYXRpb25hbGVzIFN0cmVja2VubmV0eiwgaW5kZW0gc2llIG1pdCBtZWhyZXJlbiBBaXJsaW5lcyBhbHMgQ29kZXNoYXJlLVBhcnRuZXJuIGtvb3BlcmllcnQuJ1xuXG5cbiAgICAgIH0sXG4gICAgICBPRkZFUlM6IHtcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGV6aWVsbGUgQW5nZWJvdGUnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTOiAnRmx1Z2FuZ2Vib3RlJyxcbiAgICAgICAgRkxJR0hUX09GRkVSU19QQVJBOiAnRmluZGVuIFNpZSBkaWUgYXR0cmFrdGl2c3RlbiBUYXJpZmUgZsO8ciBJaHJlbiBGbHVnJyxcbiAgICAgICAgTElLRV9GQUNFQk9PSzogJ0ZvbGdlbiBTaWUgdW5zIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIExJS0VfRkFDRUJPT0tfUEFSQTogJ1Zlcm1pc3NlbiBTaWUgbmljaHQgdW5zZXJlIHNwZXppZWxsZSBBbmdlYm90ZTogbWl0IHVuc2VyIG5ld3NsZXR0ZXIgdW5kIGF1ZiBGYWNlYm9vaycsXG4gICAgICAgIEhPVEVMOiAnSG90ZWwnLFxuICAgICAgICBIT1RFTF9QQVJBOiAnU29uZGVyYW5nZWJvdGUgZsO8ciBJaHIgSG90ZWwgd2VnIHZvbiB1bnNlcmUgUGFydG5lcm4gLidcblxuICAgICAgfSxcblxuICAgICAgUEFTU19ERVRBSUxTOiB7XG5cbiAgICAgICAgRklSU1RfTkFNRTogJ1Zvcm5hbWUnLFxuICAgICAgICBNSURETEVfTkFNRTogJ1p3ZWl0bmFtZScsXG4gICAgICAgIExBU1RfTkFNRTogJ05hY2huYW1lJyxcbiAgICAgICAgUEFTU19OTzogJ1JlaXNlcGFzcyBOdW1tZXInLFxuICAgICAgICBQTEFDRV9PRkJJUlRIOiAnT3J0IGRlcyBHZWJ1cnRzJyxcbiAgICAgICAgUEhPTkVfTk86ICdUZWxlZm9uIE51bW1lcicsXG4gICAgICAgIEVfTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgUkVQRUFUX0VfTUFJTDogJ0UtbWFpbCB3aWVkZXJob2xlbicsXG4gICAgICAgIFZFUklGWV9QQVJBOiAnSGllcm1pdCwgYmVzdMOkdGlnZSBpY2gsIGRhc3MgZGllIEluZm9ybWF0aW9uZW4sIGRpZSB2b3JoaW4gZ2VnZWJlbiBzaW5kLCBtZWluZSBQYXNzZGF0ZW4gZW50c3ByaWNoZW4uJ1xuXG4gICAgICB9LFxuICAgICAgUEFZTUVOVDoge1xuXG4gICAgICAgIFdFX0FDQ0VQVDogJ1phaGx1bmdzbWV0aG9kZW4nLFxuICAgICAgICBDQVJEX0lORk86ICdLcmVkaXRrYXJ0ZSBpbmZvcm1hdGlvbmVuOicsXG4gICAgICAgIEVYUF9EQVRFOiAnQWJsYXVmZGF0dW0gSWhyZXIgS2FydGU6JyxcbiAgICAgICAgQ09TVDogJ0dlc2FtdHByZWlzJ1xuXG4gICAgICB9LFxuICAgICAgU0VBVElORzoge1xuXG4gICAgICAgIFNFQVRfTUFQOiAnU2l0enBsYXR6cmVzZXJ2aWVydW5nJyxcbiAgICAgICAgU0VMRUNURUQ6ICdTaWUgaGFiZW4gZWluZW4gU2l0enBsYXR6IHJlc2VydmllcnQuJ1xuXG4gICAgICB9LFxuICAgICAgU0VSVklDRVM6IHtcblxuICAgICAgICBTRVJWSUNFOiAnU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9TRVJWSUNFUzogJ1NlcnZpY2VzIGFuIGJvYXJkJyxcbiAgICAgICAgSU5GTElHSFRfUEFSQTogJyAgQWlyYmVybGluIGhlacOfZW4gU2llIGhlcnpsaWNoIHdpbGxrb21tZW4gYW4gQm9yZDogZWNvbm9teSB1bmQgYnVzaW5lc3MgY2xhc3MuJyxcbiAgICAgICAgR19NRUFMUzogJ0dvdXJtZXRlc3NlbicsXG4gICAgICAgIEdfTUVBTFNfUEFSQTogJ0ZyZXVlbiBTaWUgc2ljaCBhdWYgQWlyYmVybGlucyBhIGxhIGNhcnRlLVNwZWlzZSA6IFdpciBzZXJ2aWVyZW4gSWhuZW4gdW5zZXJlIHdhcm1lbiBPbi1Ub3AtU3BlaXNlbiwgZGllIGV4dHJhIHZvbSBTYW5zaWJhci1XaXJ0IEhlcmJlcnQgU2Vja2xlciBrcmVpZXJ0IHd1cmRlbi4nLFxuICAgICAgICBCQUdHQUdFOiAnUmVpc2VnZXDDpGNrJyxcbiAgICAgICAgQkFHR0FHRV9QQVJBOiAnVW5zZXJlIFJlZ2x1bmdlbiDDvGJlciBBdWZ6dWdlYmVuZGVzIEdlcMOkY2ttZW5nZW4sIMO8YmVyIEhhbmRnZXDDpGNrIHVuZCBTb25kZXJnZXDDpGNrLidcblxuICAgICAgfSxcblxuICAgIH0pO1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdkZScpO1xuICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZScpO1xuXG4gIH0pO1xuIiwiLy8gQGFiZGVscmhtYW4tZXNzYW1cbkFwcC5jb250cm9sbGVyKCdjb25maXJtYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpKSB7XG4gICAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtY29uZmlybWF0aW9uJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDb25maXJtYXRpb25cIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiR28gSG9tZVwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGFwaS5zdWJtaXRCb29raW5nKCdmYWxzZScpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgLy8gICBhbGVydChkYXRhLmRhdGEpXG4gICAgICAvLyAgIGFwaS5jbGVhckxvY2FsKCk7XG4gICAgICAvLyB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAvL1xuICAgICAgLy8gfSlcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgIH1cblxuICAgIGlmKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWFwaS5nZXRQYXNzZW5nZXIoKSl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJHNjb3BlLmdvU29jaWFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zb2NpYWwnKTtcblxuICAgIH1cbiAgICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cbiAgICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuICAgICQoJyNxdW90ZXMtdGV4dCcpLnR5cGVJdCh7XG4gICAgICBzdHJpbmdzOiBbXG4gICAgICAgICdcIlRyYXZlbCBhbmQgY2hhbmdlIG9mIHBsYWNlIGltcGFydCBuZXcgdmlnb3IgdG8gdGhlIG1pbmQuXCItU2VuZWNhJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcgdGVuZHMgdG8gbWFnbmlmeSBhbGwgaHVtYW4gZW1vdGlvbnMu4oCdIOKAlCBQZXRlciBIb2VnJyxcbiAgICAgICAgICfigJxUcmF2ZWxpbmcg4oCTIGl0IGxlYXZlcyB5b3Ugc3BlZWNobGVzcywgdGhlbiB0dXJucyB5b3UgaW50byBhIHN0b3J5dGVsbGVyLuKAnSAtIElibiBCYXR0dXRhJyxcbiAgICAgICAgJyDigJxXZSB0cmF2ZWwsIHNvbWUgb2YgdXMgZm9yZXZlciwgdG8gc2VlayBvdGhlciBwbGFjZXMsIG90aGVyIGxpdmVzLCBvdGhlciBzb3Vscy7igJ0g4oCTIEFuYWlzIE5pbidcbiAgICAgIF0sXG4gICAgICBzcGVlZDogODAsXG4gICAgICBicmVha0xpbmVzOiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9KTtcblxuICB9XG5cbi8vXG4vLyBjb25zb2xlLmxvZyhcImNob3Nlbk91dGdvaW5nRmxpZ2h0XCIpO1xuLy8gICBjb25zb2xlLmxvZyhhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSk7XG4vLyBjb25zb2xlLmxvZyhcImNob3NlblJldHVybmluZ0ZsaWdodFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKTtcbi8vIGNvbnNvbGUubG9nKFwicGFzc2VuZ2VyXCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UGFzc2VuZ2VyKCkpXG4vLyBjb25zb2xlLmxvZyhcImJvb2tpbmdcIilcbi8vIGNvbnNvbGUubG9nKGFwaS5nZXRCb29raW5nKCkpXG4vLyBjb25zb2xlLmxvZyhcImdvaW5nU2VhdFwiKVxuLy8gY29uc29sZS5sb2coYXBpLmdldE91dGdvaW5nU2VhdCgpKVxuLy8gY29uc29sZS5sb2coXCJyZXRydW5TZWF0XCIpXG4vLyBjb25zb2xlLmxvZyhhcGkuZ2V0UmV0dXJuU2VhdCgpKVxuXG5cbn0pO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNXaWZpO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5cbiAgaWYgKGJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuZWNvbm9teUZhcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gIGlmIChvdXRBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICBpZiAob3V0QWlyY3JhZnRoYXNXaWZpKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICB9XG4gb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcblxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcblxuICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgJHNjb3BlLnJlYnVzaW5lc3NPckVjb24gPSByZWJ1c2luZXNzT3JFY29uO1xuICAgICRzY29wZS5yZWZhcmUgPSByZWZhcmU7XG4gICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgfVxuICAkc2NvcGUub3V0Z29pbmdGbGlnaHQgPSBvdXRnb2luZ0ZsaWdodDtcbiAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICRzY29wZS5vdXRmYXJlID0gb3V0ZmFyZTtcbiAgJHNjb3BlLm91dGZhY2lsaXRpZXNSZXN1bHQgPSBvdXRmYWNpbGl0aWVzUmVzdWx0O1xuXG59XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGksJHJvdXRlUGFyYW1zKSB7XG5cbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodHMnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gIGFwaS5zZXRJc090aGVySG9zdHMoZmFsc2UpO1xuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcblxuICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICAgIGFwaS5zZXRSZXR1cm5pbmdGbGlnaHQoJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0KTtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQuX2lkXG4gICAgICBpZigkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9ICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodC5faWRcbiAgICAgIGFwaS5zZXRCb29raW5nKCRzY29wZS5zZWxlY3RlZEJvb2tpbmcpO1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cblxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbiA9ICRyb3V0ZVBhcmFtcy5vcmlnaW47XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICAgIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgICB2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlICogMTAwMCk7XG4gICAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nID0ge1xuICAgICAgXCJyZWZQYXNzZW5nZXJJRFwiOiBbXSxcbiAgICAgIFwiaXNzdWVEYXRlXCI6IG51bGwsXG4gICAgICBcImlzT25lV2F5XCI6ICEkc2NvcGUucm91bmRUcmlwLFxuICAgICAgXCJyZWZFeGl0RmxpZ2h0SURcIjogbnVsbCxcbiAgICAgIFwicmVmUmVFbnRyeUZsaWdodElEXCI6IG51bGwsXG4gICAgICBcInJlY2VpcHROdW1iZXJcIjogbnVsbFxuICAgIH07XG5cbiAgICBpZiAoIW9yaWdpbiB8fCAhZGVzdGluYXRpb24gfHwgIWV4aXREYXRlKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgIHZhciBmbGlnaHRzO1xuICAgIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICAgIGlmIChyZXR1cm5EYXRlKVxuICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgIGZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgLy8gZm9ybWF0dGluZyBkYXRhIHRvIGJlIHByZXNlbnRhYmxlXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgfVxuXG4gICAgICAvLyAkc2NvcGUuZmxpZ2h0cyA9IGZsaWdodHMuZmlsdGVyKGNoZWNrQ29uc3RyYWludHMpO1xuXG4gICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciBob3VycyA9IE1hdGguZmxvb3IoZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uIC8gNjApO1xuICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICBmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gPSBob3VycyArIFwiaCBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcblxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuXG4gICAgICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJwb3J0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnQpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0KVxuICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZk9yaWdpbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbal0ubmFtZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH0pO1xuXG4gICAgICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICBhaXJjcmFmdHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICBpZiAoYWlyY3JhZnRzW2pdLnRhaWxOdW1iZXIgPT09ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpXG4gICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tqXS50YWlsTnVtYmVyID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbal0ubW9kZWw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmV4aXRJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgICAvLyAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLmlzT25lV2F5ID0gJHNjb3BlLnJvdW5kVHJpcDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gZmxpZ2h0Ll9pZDtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0LCBpc0Vjb25vbXkpIHtcbiAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSA9IGlzRWNvbm9teTtcbiAgICAgIC8vICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuaXNPbmVXYXkgPSAkc2NvcGUucm91bmRUcmlwO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZWZSZUVudHJ5RmxpZ2h0SUQgPSBmbGlnaHQuX2lkO1xuICAgIH1cblxuICAgICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApXG4gICAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICB9XG5cbiAgfSBlbHNlIHtcblxuICAgIGNvbnNvbGUubG9nKCRyb3V0ZVBhcmFtcylcblxuXG4gICAgJHNjb3BlLmZsaWdodHMgPSB7XG4gICAgXCJvdXRnb2luZ0ZsaWdodHNcIjogW3tcbiAgICAgIFwiX2lkXCI6IFwiMVwiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAwXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTBUMDE6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEwVDAzOjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiQWlyIEJlcmxpblwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCIyXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDFcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQwNjowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMDg6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjNcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMlwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEwVDEyOjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMFQxNDowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfSwge1xuICAgICAgXCJfaWRcIjogXCI0XCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDNcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMFQxNzowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTBUMTk6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJTd2lzcyBBaXJcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH1dLFxuICAgIFwicmV0dXJuRmxpZ2h0c1wiOiBbe1xuICAgICAgXCJfaWRcIjogXCIxXCIsXG4gICAgICBcIm51bWJlclwiOiBcIjEwMDBcIixcbiAgICAgIFwiZGVwYXJ0dXJlVVRDXCI6IFwiMjAxNi0wNS0xMlQwMTowMDowMFpcIixcbiAgICAgIFwiYXJyaXZhbFVUQ1wiOiBcIjIwMTYtMDUtMTJUMDM6MDA6MDBaXCIsXG4gICAgICBcImR1cmF0aW9uXCI6IDEyMCxcbiAgICAgIFwic3RhdHVzXCI6IFwiT24gVGltZVwiLFxuICAgICAgXCJyZWZBaXJjcmFmdFRhaWxOdW1iZXJcIjogXCJELUNDQ0NcIixcbiAgICAgIFwicmVmQWlyY3JhZnRNb2RlbFwiOiBudWxsLFxuICAgICAgXCJvcGVyYXRvckFpcmxpbmVcIjogXCJBaXIgQmVybGluXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjJcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwMVwiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDA2OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQwODowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIkFpciBCZXJsaW5cIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydFwiOiBcIkpFRFwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnRcIjogXCJDQUlcIixcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZVwiOiBudWxsLFxuICAgICAgXCJib2FyZGluZ0dhdGVcIjogXCI0MFwiLFxuICAgICAgXCJib2FyZGluZ1BlcmlvZFwiOiA0NS4wLFxuICAgICAgXCJib2FyZGluZ1Rlcm1pbmFsXCI6IFwiM1wiLFxuICAgICAgXCJhcnJpdmFsVGVybWluYWxcIjogXCIxXCIsXG4gICAgICBcImVjb25vbXlGYXJlXCI6IDIwMC4wLFxuICAgICAgXCJidXNpbmVzc0ZhcmVcIjogMzAwLjAsXG4gICAgICBcImVtcHR5RWNvbm9teVNlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZW1wdHlCdXNpbmVzc1NlYXRzQ291bnRcIjogbnVsbCxcbiAgICAgIFwiZWNvbm9teVNlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwiYnVpc25lc3NTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcInNlYXRtYXBcIjogbnVsbFxuICAgIH0sIHtcbiAgICAgIFwiX2lkXCI6IFwiM1wiLFxuICAgICAgXCJudW1iZXJcIjogXCIxMDAyXCIsXG4gICAgICBcImRlcGFydHVyZVVUQ1wiOiBcIjIwMTYtMDUtMTJUMTI6MDA6MDBaXCIsXG4gICAgICBcImFycml2YWxVVENcIjogXCIyMDE2LTA1LTEyVDE0OjAwOjAwWlwiLFxuICAgICAgXCJkdXJhdGlvblwiOiAxMjAsXG4gICAgICBcInN0YXR1c1wiOiBcIk9uIFRpbWVcIixcbiAgICAgIFwicmVmQWlyY3JhZnRUYWlsTnVtYmVyXCI6IFwiRC1DQ0NDXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0TW9kZWxcIjogbnVsbCxcbiAgICAgIFwib3BlcmF0b3JBaXJsaW5lXCI6IFwiU3dpc3MgQWlyXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnRcIjogXCJKRURcIixcbiAgICAgIFwicmVmT3JpZ2luQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwicmVmRGVzdGluYXRpb25BaXJwb3J0XCI6IFwiQ0FJXCIsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydE5hbWVcIjogbnVsbCxcbiAgICAgIFwiYm9hcmRpbmdHYXRlXCI6IFwiNDBcIixcbiAgICAgIFwiYm9hcmRpbmdQZXJpb2RcIjogNDUuMCxcbiAgICAgIFwiYm9hcmRpbmdUZXJtaW5hbFwiOiBcIjNcIixcbiAgICAgIFwiYXJyaXZhbFRlcm1pbmFsXCI6IFwiMVwiLFxuICAgICAgXCJlY29ub215RmFyZVwiOiAyMDAuMCxcbiAgICAgIFwiYnVzaW5lc3NGYXJlXCI6IDMwMC4wLFxuICAgICAgXCJlbXB0eUVjb25vbXlTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVtcHR5QnVzaW5lc3NTZWF0c0NvdW50XCI6IG51bGwsXG4gICAgICBcImVjb25vbXlTZWF0U2NoZW1hXCI6IG51bGwsXG4gICAgICBcImJ1aXNuZXNzU2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJzZWF0bWFwXCI6IG51bGxcbiAgICB9LCB7XG4gICAgICBcIl9pZFwiOiBcIjRcIixcbiAgICAgIFwibnVtYmVyXCI6IFwiMTAwM1wiLFxuICAgICAgXCJkZXBhcnR1cmVVVENcIjogXCIyMDE2LTA1LTEyVDE3OjAwOjAwWlwiLFxuICAgICAgXCJhcnJpdmFsVVRDXCI6IFwiMjAxNi0wNS0xMlQxOTowMDowMFpcIixcbiAgICAgIFwiZHVyYXRpb25cIjogMTIwLFxuICAgICAgXCJzdGF0dXNcIjogXCJPbiBUaW1lXCIsXG4gICAgICBcInJlZkFpcmNyYWZ0VGFpbE51bWJlclwiOiBcIkQtQ0NDQ1wiLFxuICAgICAgXCJyZWZBaXJjcmFmdE1vZGVsXCI6IG51bGwsXG4gICAgICBcIm9wZXJhdG9yQWlybGluZVwiOiBcIlN3aXNzIEFpclwiLFxuICAgICAgXCJyZWZPcmlnaW5BaXJwb3J0XCI6IFwiSkVEXCIsXG4gICAgICBcInJlZk9yaWdpbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcInJlZkRlc3RpbmF0aW9uQWlycG9ydFwiOiBcIkNBSVwiLFxuICAgICAgXCJyZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lXCI6IG51bGwsXG4gICAgICBcImJvYXJkaW5nR2F0ZVwiOiBcIjQwXCIsXG4gICAgICBcImJvYXJkaW5nUGVyaW9kXCI6IDQ1LjAsXG4gICAgICBcImJvYXJkaW5nVGVybWluYWxcIjogXCIzXCIsXG4gICAgICBcImFycml2YWxUZXJtaW5hbFwiOiBcIjFcIixcbiAgICAgIFwiZWNvbm9teUZhcmVcIjogMjAwLjAsXG4gICAgICBcImJ1c2luZXNzRmFyZVwiOiAzMDAuMCxcbiAgICAgIFwiZW1wdHlFY29ub215U2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlbXB0eUJ1c2luZXNzU2VhdHNDb3VudFwiOiBudWxsLFxuICAgICAgXCJlY29ub215U2VhdFNjaGVtYVwiOiBudWxsLFxuICAgICAgXCJidWlzbmVzc1NlYXRTY2hlbWFcIjogbnVsbCxcbiAgICAgIFwic2VhdG1hcFwiOiBudWxsXG4gICAgfV1cbiAgfTtcblxuICAgICRzY29wZS5vcmlnaW4gPSBcIkNBSVwiO1xuICAgICRzY29wZS5kZXN0aW5hdGlvbiA9IFwiSkVEXCI7XG4gICAgJHNjb3BlLmV4aXREYXRlID0gXCIyMDE2LTA1LTEwVDAxOjAwOjAwWlwiO1xuXG4gICAgJHNjb3BlLm1pbmlMb2dvUGF0aCA9IGZ1bmN0aW9uKG9wZXJhdG9yQWlybGluZSl7XG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lID09PSBcIkFpciBCZXJsaW5cIilcbiAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1iZXJsaW4tbWluaS1sb2dvLnBuZ1wiXG4gICAgICByZXR1cm4gXCJpbWcvb3RoZXItYWlybGluZS1taW5pLWxvZ28ucG5nXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjb25zb2xlLmxvZyhmbGlnaHQuX2lkKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0UmV0dXJuaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICBjb25zb2xlLmxvZyhmbGlnaHQuX2lkKTtcbiAgICB9XG5cbiAgfVxuXG4gICRzY29wZS5jb25zdHJ1Y3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXRlT3V0ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgcmV0dXJuIGRhdGVPdXQ7XG4gIH07XG5cbn1cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRzdGF0ZVBhcmFtcyddO1xufSBlbHNlIHtcbiAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5BcHAuY29udHJvbGxlcignZmxpZ2h0c0N0cmwnLCBmbGlnaHRDb250cm9sbGVyKTtcbiIsInZhciBmbGlnaHROZXdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwkcm91dGVQYXJhbXMpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWZsaWdodHMnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgYXBpLnNldElzT3RoZXJIb3N0cyh0cnVlKTtcblxuICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICB9XG5cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gIH1cblxuICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nID0ge1xuICAgIFwicGFzc2VuZ2VyRGV0YWlsc1wiOiBbe1xuICAgICAgXCJmaXJzdE5hbWVcIjogbnVsbCxcbiAgICAgIFwibGFzdE5hbWVcIjogbnVsbCxcbiAgICAgIFwicGFzc3BvcnROdW1cIjogbnVsbCxcbiAgICAgIFwicGFzc3BvcnRFeHBpcnlEYXRlXCI6IG51bGwsXG4gICAgICBcImRhdGVPZkJpcnRoXCI6IG51bGwsXG4gICAgICBcIm5hdGlvbmFsaXR5XCI6IG51bGwsXG4gICAgICBcImVtYWlsXCI6IG51bGwsXG4gICAgfV0sXG4gICAgXCJjbGFzc1wiOiBudWxsLFxuICAgIFwib3V0Z29pbmdGbGlnaHRJZFwiOiBudWxsLFxuICAgIFwicmV0dXJuRmxpZ2h0SWRcIjogbnVsbCxcbiAgICBcInBheW1lbnRUb2tlblwiOiBudWxsXG4gIH1cblxuICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgdmFyIGRlc3RpbmF0aW9uID0gJHJvdXRlUGFyYW1zLmRlc3RpbmF0aW9uO1xuICB2YXIgZXhpdERhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMuZXhpdERhdGUgKiAxMDAwKTtcblxuICAvLyBUT0RPOiB2YXIgaXNFY29ub215ID0gJHJvdXRlUGFyYW1zLmNsYXNzID09PSBcImVjb25vbXlcIj8gdHJ1ZSA6IGZhbHNlO1xuICB2YXIgaXNFY29ub215ID0gdHJ1ZTtcblxuICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgdmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSAqIDEwMDApO1xuICAgICRzY29wZS5yb3VuZFRyaXAgPSB0cnVlO1xuICB9XG5cbiAgdmFyIHJldHVybkRhdGVNaWxsO1xuXG4gIGlmIChyZXR1cm5EYXRlKVxuICAgIHJldHVybkRhdGVNaWxsID0gcmV0dXJuRGF0ZS5nZXRUaW1lKCk7XG5cbiAgaWYgKGlzRWNvbm9teSkge1xuICAgIGFwaS5nZXRPdGhlckZsaWdodHNFY28ob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpXG4gICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXBpLmdldE90aGVyRmxpZ2h0c0J1c2kob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5mbGlnaHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcuY2xhc3MgPSBpc0Vjb25vbXkgPT09IHRydWUgPyBcImVjb25vbXlcIiA6IFwiYnVzaW5lc3NcIjtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nRmxpZ2h0SWQgPSBmbGlnaHQuX2lkO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5GbGlnaHRJZCA9IGZsaWdodC5faWQ7XG4gIH1cblxuICAkc2NvcGUuY2hlY2tOZXh0QnRuU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICB9XG5cbn1cblxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59IGVsc2Uge1xuICBmbGlnaHROZXdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywnJHJvdXRlUGFyYW1zJyxdO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdmbGlnaHRzTmV3Q3RybCcsIGZsaWdodE5ld0NvbnRyb2xsZXIpO1xuIiwiIHZhciBtYWluQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksJHRyYW5zbGF0ZSkge1xuICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLW1haW4nO1xuXG4gICAkc2NvcGUuZ28gPSBmdW5jdGlvbigpIHtcbiAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlbGVjdGVkT3JpZ2luKTtcbiAgIH1cblxuICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAkc2NvcGUuYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgIH0pO1xuXG5cbiAgICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICRzY29wZS5zZWxlY3RlZERlc3QgPSB1bmRlZmluZWQ7XG5cbiAgIGZ1bmN0aW9uIGFpcnBvcnNDb250YWlucyhpYXRhKSB7XG4gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgaWYgKGlhdGEgPT0gJHNjb3BlLmFpcnBvcnRzW2ldWydpYXRhJ10pXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgfVxuICAgICByZXR1cm4gZmFsc2U7XG4gICB9XG5cbiAgICRzY29wZS5idXR0b25TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICByZXR1cm4gISRzY29wZS5zZWxlY3RlZE9yaWdpbiB8fCAhJHNjb3BlLnNlbGVjdGVkRGVzdCB8fCAhJHNjb3BlLmV4aXREYXRlIHx8ICRzY29wZS5zZWxlY3RlZERlc3QgPT0gJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkT3JpZ2luKSB8fCAhYWlycG9yc0NvbnRhaW5zKCRzY29wZS5zZWxlY3RlZERlc3QpO1xuICAgfVxuXG4gICAkc2NvcGUuZmxpZ2h0ID0ge1xuICAgICB0eXBlOiBcIm9uZVwiXG4gICB9XG4gICAkc2NvcGUub3RoZXJBaXJsaW5lID0ge1xuICAgICB2YWx1ZTogZmFsc2VcbiAgIH1cblxuXG5cbiAgICRzY29wZS5nb1RvRmxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgICB2YXIgZXhpdERhdGUsIHJldHVybkRhdGU7XG5cbiAgICAgZXhpdERhdGUgPSAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG4gICAgIGlmICgkc2NvcGUucmV0dXJuRGF0ZSlcbiAgICAgICByZXR1cm5EYXRlID0gKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCk7XG5cbiAgICAgaWYgKCRzY29wZS5vdGhlckFpcmxpbmUudmFsdWUpIHtcbiAgICAgICBpZiAoJHNjb3BlLmZsaWdodC50eXBlID09IFwib25lXCIpXG4gICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cy1uZXcnKVxuICAgICAgICAgICAuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pXG4gICAgICAgICAgIC5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdClcbiAgICAgICAgICAgLnNlYXJjaCgnZXhpdERhdGUnLCBleGl0RGF0ZSk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZVxuICAgICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCByZXR1cm5EYXRlKTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuZmxpZ2h0cy1uZXcnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6IGV4aXREYXRlLFxuICAgICAgICAgICAgIHJldHVybkRhdGU6IHJldHVybkRhdGVcbiAgICAgICAgICAgfSlcbiAgICAgICB9XG4gICAgIH0gZWxzZSB7XG4gICAgICAgaWYgKCRzY29wZS5mbGlnaHQudHlwZSA9PSBcIm9uZVwiKVxuICAgICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJykuc2VhcmNoKCdvcmlnaW4nLCAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KS5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgIGVsc2VcbiAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMnLCB7XG4gICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgZXhpdERhdGU6ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKVxuICAgICAgICAgfSlcbiAgICAgICBlbHNlIHtcbiAgICAgICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgKCRzY29wZS5leGl0RGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKVxuICAgICAgICAgICAuc2VhcmNoKCdyZXR1cm5EYXRlJywgKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCkpO1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMnLCB7XG4gICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4sXG4gICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgICAgZXhpdERhdGU6ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICByZXR1cm5EYXRlOiAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKVxuICAgICAgICAgICB9KVxuICAgICAgIH1cblxuICAgICB9XG5cbiAgIH07XG5cblxuXG5cbiAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAkKCcjbWFpbi10ZXh0JykudHlwZUl0KHtcbiAgICAgICBzdHJpbmdzOiBbJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLk9ORScpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5UV08nKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuVEhSRUUnKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuRk9VUicpXSxcbiAgICAgICBzcGVlZDogMTIwLFxuICAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgIGxvb3A6IHRydWVcbiAgICAgfSk7XG5cblxuICAgICAkbG9jYXRpb24udXJsKCRsb2NhdGlvbi5wYXRoKCkpO1xuICAgICBzZXRVcERhdGUoJHNjb3BlKTtcblxuICAgICAkc2NvcGUuY2hpbGRyZW4gPSBbJzAgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnMSAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEJyksICcyICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzMgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnNCAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyldO1xuICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gJHNjb3BlLmNoaWxkcmVuWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQ2hpbGRyZW4gPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuXG5cbiAgICAgJHNjb3BlLmFkdWx0cyA9IFsnMSAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVCcpICwgJzIgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRTJyksICczICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRTJyksICc0ICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUcycpXTtcbiAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9ICRzY29wZS5hZHVsdHNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VBZHVsdCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG4gICAgICRzY29wZS5pbmZhbnRzID0gWycwICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLklORkFOVCcpLCAnMSAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5JTkZBTlRTJyldO1xuICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9ICRzY29wZS5pbmZhbnRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlSW5mYW50ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuICAgfVxuXG5cbiB9O1xuXG4gZnVuY3Rpb24gc2V0VXBEYXRlKCRzY29wZSkge1xuICAgJHNjb3BlLnRvZGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5leGl0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcbiAgIH07XG4gICAkc2NvcGUudG9kYXkoKTtcblxuICAgJHNjb3BlLm9wZW4yID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG4gICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAkc2NvcGUucG9wdXAub3BlbmVkID0gdHJ1ZTtcbiAgIH07XG5cblxuICAgZnVuY3Rpb24gZGlzYWJsZWQoZGF0YSkge1xuICAgICB2YXIgZGF0ZSA9IGRhdGEuZGF0ZSxcbiAgICAgICBtb2RlID0gZGF0YS5tb2RlO1xuICAgICByZXR1cm4gbW9kZSA9PT0gJ2RheScgJiYgKGRhdGUuZ2V0RGF5KCkgPT09IDAgfHwgZGF0ZS5nZXREYXkoKSA9PT0gNik7XG4gICB9XG4gICAkc2NvcGUuZGF0ZU9wdGlvbnMgPSB7XG4gICAgIGZvcm1hdFllYXI6ICd5eScsXG4gICAgIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDUsIDIyKSxcbiAgICAgbWluRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgc3RhcnRpbmdEYXk6IDFcbiAgIH07XG4gICAkc2NvcGUucG9wdXAyID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuICAgJHNjb3BlLnBvcHVwID0ge1xuICAgICBvcGVuZWQ6IGZhbHNlXG4gICB9O1xuIH1cblxuIGlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9IGVsc2Uge1xuICAgbWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckdHJhbnNsYXRlJ107XG4gfVxuXG4gQXBwLmNvbnRyb2xsZXIoJ21haW5DdHJsJywgbWFpbkNvbnRyb2xsZXIpO1xuIiwiLy8gQHlhc3NtaW5lXG5BcHAuY29udHJvbGxlcigncGFzc2VuZ2VyRGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpKSB7XG4gICRzY29wZS50aXRsZSA9IFwiRmlsbCBpbiB5b3VyIGRldGFpbHNcIjtcblxuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICB0eXBlOiBudWxsLFxuICAgIGNvdW50cnlDb2RlOiBudWxsLFxuICAgIG5hdGlvbmFsaXR5OiBudWxsLFxuICAgIHNleDogbnVsbCxcbiAgICBiaXJ0aERhdGU6IG51bGwsXG4gICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICBuYXRpb25hbElEOiBudWxsLFxuICAgIGF1dGhvcml0eTogbnVsbCxcbiAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgZXhwaXJ5RGF0ZTogbnVsbCxcbiAgICBwb2ludHM6IG51bGwsXG4gICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICBmaXJzdE5hbWU6IG51bGwsXG4gICAgbWlkZGxlTmFtZTogbnVsbCxcbiAgICBsYXN0TmFtZTogbnVsbCxcbiAgICBwYXNzcG9ydE51bWJlcjogbnVsbCxcbiAgICBwaG9uZU51bWJlcjogbnVsbCxcbiAgICBlbWFpbDogbnVsbFxuXG4gIH07XG5cblxuICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUudGl0bGVzID0gWydNcicsICdNcnMnLCAnTXMnLCAnRHInXTtcbiAgICAkc2NvcGUudGl0bGVzQnRuVGV4dCA9ICRzY29wZS50aXRsZXNbMF07XG4gICAgJHNjb3BlLmNoYW5nZVRpdGxlID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIGFwaS5nZXRDb3VudHJpZXMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY291bnRyaWVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcblxuXG5cblxuXG5cbiAgICB2YXIgY29tcGxldGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cblxuXG4gICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb3VudHJ5Q29kZTogbnVsbCwgLy9hY2NvcmRpbmcgdG8gY291bnRyeVxuICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLm5hdGlvbmFsaXR5LFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS50aXRsZXNCdG5UZXh0LFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgIG1pZGRsZU5hbWU6ICRzY29wZS5taWRkbGVOYW1lLFxuICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyLFxuICAgICAgICBwaG9uZU51bWJlcjogJHNjb3BlLnBob25lTnVtYmVyLFxuICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMVxuXG5cbiAgICAgIH07XG4gICAgICAvLy9iZWZvcmUgeW91IGxlYXZlIHRoZSBwYWdlIG1ha2Ugc3VyZSB0aGF0IHRoZSBwYXNzZW5nZXIgb2JqZWN0IGlzIGNvbXBsZXRlIG90aGVyd2lzZSBzaG93IGFsZXJ0KFwiRmlsbCBpbiBhbGwgZGF0YVwiKTtcblxuXG5cbiAgICAgIC8vIGlmIChjb21wbGV0ZSA9PSBmYWxzZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWxlcnREYXRhID0gZmFsc2U7XG4gICAgICAvLyAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSkge1xuICAgICAgLy8gICAgICRzY29wZS5hbGVydERhdGEgPSB0cnVlO1xuICAgICAgLy9cbiAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gZmFsc2U7XG4gICAgICAvLyAgICAgaWYgKCRzY29wZS5lbWFpbDEgIT0gJHNjb3BlLmVtYWlsdmVyKVxuICAgICAgLy8gICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG4gICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAvLyAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IGZhbHNlO1xuICAgICAgLy8gICAgICAgaWYgKCgkc2NvcGUuY2hlY2sgPT0gbnVsbCkpXG4gICAgICAvLyAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgIC8vICAgICAgIGVsc2Uge1xuICAgICAgLy8gICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAvLyAgICAgICB9XG4gICAgICAvLyAgICAgfVxuICAgICAgLy9cbiAgICAgIC8vICAgfVxuICAgICAgLy9cbiAgICAgIC8vXG4gICAgICAvLyB9XG4gICAgICAvLyBpZiAoY29tcGxldGUgPT0gdHJ1ZSkge1xuICAgICAgLy8gICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgLy8gICBpZiAoIWFwaS5pc090aGVySG9zdHMpXG4gICAgICAvLyAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAvLyAgIGVsc2UgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50JylcbiAgICAgIC8vIH1cblxudmFyIGZpZWxkcyA9IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLHRydWUsIHRydWUsIHRydWUsIHRydWVdO1xuXG4kc2NvcGUuYWxlcnRGTmFtZSA9IGZhbHNlO1xuJHNjb3BlLmFsZXJ0TU5hbWUgPSBmYWxzZTtcbiRzY29wZS5hbGVydExOYW1lID0gZmFsc2U7XG4kc2NvcGUuYWxlcnRQaE51bWJlciA9IGZhbHNlO1xuJHNjb3BlLmFsZXJ0UE51bWJlcj0gZmFsc2U7XG4kc2NvcGUuYWxlcnRFbWFpbCA9IGZhbHNlO1xuJHNjb3BlLmFsZXJ0Q29uZmlybSA9IGZhbHNlO1xuJHNjb3BlLmFsZXJ0Q2hlY2sgPSBmYWxzZTtcblxuXG5pZigkc2NvcGUuZmlyc3ROYW1lPT1udWxsKXtcbmZpZWxkc1swXT1mYWxzZTtcbiRzY29wZS5hbGVydEZOYW1lID0gdHJ1ZTtcbn1cbmlmKCRzY29wZS5taWRkbGVOYW1lPT1udWxsKXtcbmZpZWxkc1sxXT1mYWxzZTtcbiRzY29wZS5hbGVydE1OYW1lID0gdHJ1ZTtcbn1cbmlmKCRzY29wZS5sYXN0TmFtZT09bnVsbCl7XG5maWVsZHNbMl09ZmFsc2U7XG4kc2NvcGUuYWxlcnRMTmFtZSA9IHRydWU7XG59XG5pZigkc2NvcGUucGhvbmVOdW1iZXI9PW51bGwpe1xuZmllbGRzWzNdPWZhbHNlO1xuJHNjb3BlLmFsZXJ0UGhOdW1iZXIgPSB0cnVlO1xufVxuaWYoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyPT1udWxsKXtcbmZpZWxkc1s0XT1mYWxzZTtcbiRzY29wZS5hbGVydFBOdW1iZXI9IHRydWU7XG59XG5pZigkc2NvcGUuZW1haWwxPT1udWxsKXtcbmZpZWxkc1s1XT1mYWxzZTtcbiRzY29wZS5hbGVydEVtYWlsID0gdHJ1ZTtcbn1cbmlmKCRzY29wZS5lbWFpbHZlcj09bnVsbCl7XG5maWVsZHNbNl09ZmFsc2U7XG4kc2NvcGUuYWxlcnRFbWFpbCA9IHRydWU7XG59XG5pZigkc2NvcGUuZW1haWwxIT0kc2NvcGUuZW1haWx2ZXIpe1xuZmllbGRzWzddPWZhbHNlO1xuJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG59XG5pZigkc2NvcGUuY2hlY2s9PW51bGwpe1xuZmllbGRzWzhdPWZhbHNlO1xuJHNjb3BlLmFsZXJ0Q2hlY2sgPSB0cnVlO1xufVxuXG52YXIgYWxscGFzc2luZyA9IHRydWU7XG5cbmZvcih2YXIgaSA9IDA7IGk8ZmllbGRzLmxlbmd0aDtpKyspXG57XG4gIGlmKGZpZWxkc1tpXT09ZmFsc2UpXG4gIHtcbiAgICBhbGxwYXNzaW5nPWZhbHNlO1xuICAgIGJyZWFrO1xuICB9XG59XG5cbmlmIChhbGxwYXNzaW5nID09IHRydWUpIHtcbiAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG4gICBpZiAoIWFwaS5pc090aGVySG9zdHMpXG4gICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZy9vdXRnb2luZycpO1xuICAgZWxzZSAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKVxuIH1cblxuXG5cbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9leGl0LWZsaWdodCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcblxuXG5cbiAgICB2YXIgY29tcGxldGUxID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAgICRzY29wZS5wYXNzZW5nZXIgPSB7XG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgIG5hdGlvbmFsaXR5OiAkc2NvcGUuY291bnRyaWVzTW9iLFxuICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgIGJpcnRoRGF0ZTogbnVsbCxcbiAgICAgICAgYmlydGhQbGFjZTogbnVsbCxcbiAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgYXV0aG9yaXR5OiBudWxsLFxuICAgICAgICBpc3N1ZURhdGU6IG51bGwsXG4gICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgIHBvaW50czogbnVsbCxcbiAgICAgICAgbWVtYmVyc2hpcDogbnVsbCxcbiAgICAgICAgdGl0bGU6ICRzY29wZS5UaXRsZU1vYixcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZmlyc3ROYW1lTW9iLFxuICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZU1vYixcbiAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZU1vYixcbiAgICAgICAgcGFzc3BvcnROdW1iZXI6ICRzY29wZS5wYXNzcG9ydE51bWJlck1vYixcbiAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlck1vYixcbiAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFNb2JcblxuXG4gICAgICB9O1xuXG5cblxuXG4gICAgICBpZiAoY29tcGxldGUxID09IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCgkc2NvcGUuZmlyc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubWlkZGxlTmFtZU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmxhc3ROYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUucGhvbmVOdW1iZXJNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsMU1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLmVtYWlsdmVyTW9iID09IG51bGwpKSB7XG4gICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBkYXRhOlwiICsgXCJcXG5cIiArIFwiUGFzc3BvcnQgTnVtYmVyIG11c3QgYmUgOCBudW1iZXJzXCIgKyBcIlxcblwiICtcbiAgICAgICAgICAgIFwiUGhvbmUgTnVtYmVyIG11c3QgYmUgMTAgbnVtYmVyc1wiICsgXCJcXG5cIiArIFwiRW1haWxzIG11c3QgYmUgaW4gYUB4eXouY29tIGZvcm1hdFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgIT0gJHNjb3BlLmVtYWlsdmVyTW9iKVxuICAgICAgICAgICAgYWxlcnQoXCJUaGUgZW50ZXJlZCBlbWFpbHMgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSlcbiAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UgZW50ZXJlZFwiKVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGNvbXBsZXRlMSA9IHRydWU7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbXBsZXRlMSA9PSB0cnVlKSB7XG4gICAgICAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvc2VhdGluZy9vdXRnb2luZycpO1xuICAgICAgfVxuXG4gICAgfTtcbiAgfVxuXG5cblxufSk7XG4iLCIvLyBAbWlybmFcbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXBheW1lbnQnO1xuICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSB5b3VyIHBheW1lbnQgb3B0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIlN1Ym1pdFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgJHNjb3BlLmZvcm0gPSB7XG4gICAgbnVtYmVyOiBudWxsLFxuICAgIGN2YzogbnVsbCxcbiAgICBleHBfbW9udGg6IG51bGwsXG4gICAgZXhwX3llYXI6IG51bGxcbiAgfTtcbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByID0gY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCBwYXk/XCIpO1xuICAgIGlmIChyID09IHRydWUpIHtcbiAgICAkc2NvcGUuZm9ybS5leHBfeWVhciA9ICRzY29wZS55ZWFyc0J0blRleHRcbiAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcbiAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkpO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuaWQpXG4gICAgICBhcGkuc2V0U3RyaXBlVG9rZW4ocmVzcG9uc2UuaWQpXG4gICAgICBhcGkuc3VibWl0Qm9va2luZyhhcGkuSXNPdGhlckhvc3RzKCkpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2NvbmZpcm1hdGlvbicpO1xuICAgICAgICAvLyBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgIH0pXG4gICAgfSk7XG4gICAgfVxuXG4gICAgLy8gaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gIH1cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICRsb2NhdGlvbi5wYXRoKCcvc2VhdGluZycpO1xuICB9XG5cbiAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHByaWNlID0gMDtcbiAgICBpZiAoYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgcHJpY2UgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgIGVsc2VcbiAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKSB7XG5cbiAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICBlbHNlXG4gICAgICAgIHByaWNlID0gcHJpY2UgKyBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnByaWNlID0gcHJpY2U7XG4gICAgJHNjb3BlLnllYXJzID0gWycyMDE2JywgJzIwMTcnLCAnMjAxOCcsICcyMDE5JywgJzIwMjAnLCAnMjAyMScsICcyMDIyJywgJzIwMjMnLCAnMjAyNCddO1xuICAgICRzY29wZS55ZWFyc0J0blRleHQgPSAkc2NvcGUueWVhcnNbMF07XG4gICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICAkc2NvcGUubW9udGhzID0gWydKYW51YXJ5JywgJ0ZlYnVyYXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ107XG4gICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICRzY29wZS5jaGFuZ2VNb250aCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICRzY29wZS5tb250aHNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICRzY29wZS5tb250aHNCdG5ObyA9ICRzY29wZS5tb250aHMuaW5kZXhPZih0ZXh0KTtcbiAgICB9XG4gIH1cblxufSk7XG4iLCIvLyBAYWhtZWQtZXNzbWF0XG4gIHZhciBzZWF0aW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLGFwaSwkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2Utc2VhdGluZyc7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBzaXQ/XCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuICAgIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpKVxuICAgICAgICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLm91dGdvaW5nID09IFwib3V0Z29pbmdcIikge1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL3JldHVyaW5nJyk7XG4gICAgICAgICAgICAgICAgICBhcGkuc2V0T3V0Z29pbmdTZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRSZXRydW5TZWF0KCRzY29wZS5zZWF0KTtcbiAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICB9XG5cblxuXG4gICAgICBpZiAoIWFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpIHx8ICFhcGkuZ2V0Qm9va2luZygpKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3Bhc3Nlbmdlci1kZXRhaWxzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHNlYXRtYXA7XG5cbiAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG5cbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0T3V0Z29pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5zZWF0bWFwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNFY29ub215VGV4dCA9IGFwaS5nZXRDYWJpbmV0UmV0dXJuaW5nQ2xhc3MoKTtcbiAgICAgICAgICBzZWF0bWFwID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9XG5cblxuXG4gICAgICB2YXIgYWxwaGFiaXRzID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdKJywgJ0snLCAnTCcsIFwiTVwiLCBcIk5cIl07XG4gICAgICB2YXIgc2NoZW1hID0gWzMsIDUsIDMsIDIwXTtcblxuICAgICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTMgPSBbXTtcblxuICAgICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5MS5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMV07IGkrKykge1xuICAgICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAgICRzY29wZS5ib2IucHVzaChpKTtcblxuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnNlYXJjaENvbG9yID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGlmICghJHNjb3BlLmlzRW1wdHkodGV4dCkpXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdE9jdSc7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXR1cm4gJ3NlYXRFbXB0eSc7XG4gICAgICB9XG4gICAgICAkc2NvcGUuaXNFbXB0eSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXRtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXRtYXBbaV1bJ251bWJlciddID09IHRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBzZWF0bWFwW2ldWydpc0VtcHR5J11cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3RTZWF0ID0gZnVuY3Rpb24oc2VhdCkge1xuICAgICAgICAgICRzY29wZS5zZWF0ID0gc2VhdDtcbiAgICAgIH07XG4gICAgfVxuXG5cblxuICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICB2YXIgc2NoZW1hID0gWzIsIDQsIDIsIDldO1xuXG4gICAgJHNjb3BlLmFycmF5MSA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MiA9IFtdO1xuXG4gICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgJHNjb3BlLmJvYiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbMF07IGkrKykge1xuICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTIucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsyXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTMucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzNdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgfVxuXG5cbn07XG5cblxuaWYoVHlwZSA9PSAnbW9iaWxlJyl7XG4gIHNlYXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJ107XG59ZWxzZXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCckcm91dGVQYXJhbXMnXTtcbn1cblxuXG5BcHAuY29udHJvbGxlcignc2VhdGluZ0N0cmwnLCBzZWF0aW5nQ29udHJvbGxlcik7XG4iXX0=
