App.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
      })
      .when('/flights', {
        templateUrl: 'templates/flights.html',
        controller: 'flightsCtrl'
      })
      .when('/exit-flight', {
        templateUrl: 'templates/flight.html',
        controller: 'exitFlightCtrl'
      })
    
      .when('/passenger-details', {
        templateUrl: 'templates/passenger-details.html',
        controller: 'passengerDetailsCtrl'
      })
      .when('/seating', {
        templateUrl: 'templates/seating.html',
        controller: 'seatingCtrl'
      })
      .when('/payment', {
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl'
      })
      .when('/confirmation', {
        templateUrl: 'templates/confirmation.html',
        controller: 'confirmationCtrl'
      });

      // $locationProvider.html5Mode(true);

  }
]);


//
// when('/phones/:phoneId', {
//   templateUrl: 'partials/phone-detail.html',
//   controller: 'PhoneDetailCtrl'
// }).
// otherwise({
//   redirectTo: '/phones'
// });
