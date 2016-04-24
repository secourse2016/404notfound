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
          1: "Simple, convenient, instant confirmation.",
          2: "Destinations all around the globe.",
          3: "Experience authentic hospitality.",
          4: "Time to get enchanted."
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

        THANK_YOU: 'Thank you'
        NAME: 'Name'
        PHONE: 'Phone'
        E-MAIL: 'E-mail'
        FLIGHTNO: 'Flight number'
        DEPARTURE: 'Departure'
        ARRAIVAL: 'Arrival'
        PRINT: 'Print ticket'

      },
      CONTACT_US: {

        CONTACT_US: 'Contact Us'
        PHONE: 'Phone'
        E-MAIL: 'E-mail'
        LEAVE_MSG: 'Leave us a message'
        SEND: 'Send'
      },
      four_o_for: {
//Do you mean 404notfound team ?  in 404.html
        QUESTION:'Do you mean 404NotFound Team?'

      },

      ABOUT_US: {

        ABOUT: 'About AirBerlin'
        HISTORY: 'History'
        HISTORY_PARA: 'The first airberlin plane took off on 28th April 1979. Experience the highlights and milestones in airberlins history '
OUR_GOAL: 'Our goal'
OUR_GOAL_PARA: 'First Europe, and then the globe, will be linked by flight, and nations so knit together that they will grow to be next-door neighbors… . What railways have done for nations, airways will do for the world.'
A_P:'Alliance/partners'
A_P_PARA:'airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.'


  },

  OFFERS: {
SPECIAL_OFFERS: 'Special Offers'
FLIGHT_OFFERS:'Flight Offers'
FLIGHT_OFFERS_PARA:'Find the most attractive fare for your flight'
LIKE_FACEBOOK:'Like us on Facebook'
LIKE_FACEBOOK_PARA:'Dont miss our special offers on: with our newsletter and on Facebook'
HOTEL:'Hotel'
HOTEL_PARA:'Special offers for your hotel stay away from our partners .'

},


    });
    $translateProvider.translations('de', {
      MAIN: {
        BOOK_NOW: 'Jetzt buchen'
        FROM: 'von'
        DEPARTURE_DATE: 'Hinflug'
        TO: 'nach'
        UNDER_2_YEARS: 'Jünger als 2 Jahren'
        ROUND_TRIP: 'Hin-und Rückfahrt'
        ONE_WAY: 'Nur Hinflug'
        SEARCH_FOR_FLIGHTS: 'Flüge suchen'
        YEARS: "Jahre"
        CHILDREN: 'Kinder'
        CHILD: 'Kind'
        ADULT: 'Erwachsener'
        ADULTS: 'Erwachsenen'
        INFANTS: 'Babys'
        INFANT: 'Baby'
      },
      FLIGHTS: {
        TITLE: 'Einen Flug aussuchen'
        ECONOMY: 'Economy'
        BUSINESS: 'Business'
        SEATS_LEFT: 'freie Sitzplätze'
        MORE_DETAILS: 'Mehr Details'
        BOOK: 'buchen'
        FLIGHT: 'Flug'
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
      }


    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.useSanitizeValueStrategy('escape');

  });
