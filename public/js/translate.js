  App.config(function($translateProvider) {
    $translateProvider.translations('en', {
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
    $translateProvider.translations('de', {

    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');

});
