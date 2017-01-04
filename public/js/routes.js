App.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider.
    when('/', {
      templateUrl: 'templates/main.html',
      controller: 'mainController'
    })
    .when('/search-results', {
      templateUrl: 'templates/search-results.html',
      controller: 'searchResultsController'
    })
    .when('/flight-details', {
      templateUrl: 'templates/flight-details.html',
      controller: 'flightDetailsController'
    })
    .when('/passenger-details', {
      templateUrl: 'templates/passenger-details.html',
      controller: 'passengerDetailsController'
    })
    .when('/payment', {
      templateUrl: 'templates/payment.html',
      controller: 'paymentController'
    })
    .when('/confirmation', {
      templateUrl: 'templates/confirmation.html',
      controller: 'confirmationController'
    })
    .when('/contact-us', {
      templateUrl: 'templates/contact-us.html',
    })
    .when('/about', {
      templateUrl: 'templates/about.html',
    })
    .when('/team', {
      templateUrl: 'templates/team.html',
    })
    .when('/offers', {
      templateUrl: 'templates/offers.html',
    })
    .when('/services', {
      templateUrl: 'templates/services.html',
    })
    .otherwise({
      templateUrl: 'templates/404.html',
      controller: '404Ctrl'
    });
}]);
