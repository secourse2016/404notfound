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
          PASSENGER : 'passenger',
          PASSENGERS : 'passengers'
        },
        NAV: {
          NEXT: 'Next',
          BACK: 'Back',
          SPECIAL_OFFERS: 'Special Offers',
          SERVICES: 'Services',
          OUR_TEAM: 'Our Team',
          ABOUT: 'About',
          CONTACT_US: 'Contact Us'
        }

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
                1: "Einfach, praktisch, sofortige Bestätigung.",
                2: "Reiseziehle überall auf der Welt.",
                3: "Erlebe unsere Gastfreundschaft.",
                4: "Es ist jetzt Zeit dir zu verzaubern."
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
          PASSENGER : 'Passagier',
          PASSENGERS : 'Passagiere'
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
  
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');

});
