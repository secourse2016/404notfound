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
        templateUrl: 'templates/tab-home.html',
        controller: 'mainCtrl'
      }
    }
  })

  .state('tab.flights', {
    url: '/flights',
    views: {
      templateUrl: 'templates/flights.html',
      controller: 'flightsCtrl'
    }
  })

  .state('tab.flights-new', {
    url: '/flights-new',
    views: {
      templateUrl: 'templates/flights-new.html',
      controller: 'flightsNewCtrl'
    }
  })


  .state('tab.exit-flight', {
      url: '/exit-flight',
      views: {
        templateUrl: 'templates/flight.html',
        controller: 'exitFlightCtrl'
      }

    })
    // .state('reentry-flight', {
    //   templateUrl: 'templates/flight.html',
    //   controller: 'reEntryFlightCtrl'
    // })


  .state('tab.passenger-details', {
    url: '/passenger-details',
    views: {
      templateUrl: 'templates/passenger-details.html',
      controller: 'passengerDetailsCtrl'
    }
  })


  .state('tab.seating', {
    url: '/seating/:outgoing',
    views: {
      templateUrl: 'templates/seating.html',
      controller: 'seatingCtrl'
    }
  })


  .state('tab.payment', {
    url: '/payment',
    views: {
      templateUrl: 'templates/payment.html',
      controller: 'paymentCtrl'
    }
  })

  .state('tab.confirmation', {
    url: '/confirmation',
    views: {
      templateUrl: 'templates/confirmation.html',
      controller: 'confirmationCtrl'
    }
  })

  .state('tab.contact-us', {
    url: '/contact-us',
    views: {
      templateUrl: 'templates/contact-us.html'
    }
  })

  .state('tab.services', {
    url: '/services',
    views: {
      templateUrl: 'templates/services.html'
    }
  })

  .state('tab.about', {
    url: '/about',
    views: {
      templateUrl: 'templates/about.html'
    }
  })

  .state('tab.team', {
    url: '/team',
    views: {
      templateUrl: 'templates/team.html'
    }
  })

  .state('tab.offers', {
    url: '/offers',
    views: {
      templateUrl: 'templates/offers.html'
    }
  })

  $urlRouterProvider.otherwise('/tab/home');

})
