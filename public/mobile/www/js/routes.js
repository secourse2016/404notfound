App.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-main.html',
        controller: 'mainCtrl'
      }
    }
  })

  .state('tab.flights', {
    url: '/flights?origin&destination&exitDate&returnDate',
    views: {
      'tab-home': {
        templateUrl: 'templates/flights.html',
        controller: 'flightsCtrl'
      }
    }
  })

  .state('tab.flights-new', {
    url: '/flights-new?origin&destination&exitDate&returnDate',
    views: {
      'tab-home': {
        templateUrl: 'templates/flights-new.html',
        controller: 'flightsNewCtrl'
      }
    }
  })


  .state('tab.flight-details', {
      url: '/flight-details',
      views: {
        'tab-home': {
          templateUrl: 'templates/flight-details.html',
          controller: 'flightDetailsCtrl'
        }
      }
    })
    // .state('reentry-flight', {
    //   templateUrl: 'templates/flight.html',
    //   controller: 'reEntryFlightCtrl'
    // })


  .state('tab.passenger-details', {
    url: '/passenger-details',
    views: {
      'tab-home': {
        templateUrl: 'templates/passenger-details.html',
        controller: 'passengerDetailsCtrl'
      }
    }
  })


  .state('tab.seating', {
    url: '/seating/:outgoing',
    views: {
      'tab-home': {
        templateUrl: 'templates/seating.html',
        controller: 'seatingCtrl'
      }
    }
  })


  .state('tab.payment', {
    url: '/payment',
    views: {
      'tab-home': {
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl'
      }
    }
  })

  .state('tab.confirmation', {
    url: '/confirmation',
    views: {
      'tab-home': {
        templateUrl: 'templates/confirmation.html',
        controller: 'confirmationCtrl'
      }
    }
  })


    .state('tab.other', {
      url: '/other',
      views: {
        'tab-other': {
          templateUrl: 'templates/other.html'
        }
      }
    })


  .state('tab.contact-us', {
    url: '/contact-us',
    views: {
      'tab-other': {
        templateUrl: 'templates/contact-us.html'
      }
    }
  })

  .state('tab.services', {
    url: '/services',
    views: {
      'tab-other': {
        templateUrl: 'templates/services.html'
      }
    }
  })

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-other': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('tab.team', {
    url: '/team',
    views: {
      'tab-other': {
        templateUrl: 'templates/team.html'
      }
    }
  })

  .state('tab.offers', {
    url: '/offers',
    views: {
      'tab-other': {
        templateUrl: 'templates/offers.html'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/home');

})
