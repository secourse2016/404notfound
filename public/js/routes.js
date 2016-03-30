App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'templates/main.html',
      controller: 'mainCtrl'
    })
    .when('/flights',{
      templateUrl: 'templates/flights.html',
      controller: 'flightsCtrl'
    });
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
