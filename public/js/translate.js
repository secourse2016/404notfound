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

    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');

});
