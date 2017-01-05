var flightDetailsController = function ($scope, $location, api) {
  $scope.pageClass = 'page-flight';

  $scope.flight = api.getFlight();
  $scope.isEconomy = api.isEconomy();
  $scope.constructDate = api.constructDate;

  if (!$scope.flight) {
    $location.path('/');
  }

  $scope.goBack = function () {
    $location.path('/search-results');
  }

  $scope.goNext = function () {
    $location.path('/passenger-details');
  }

  if ($scope.isEconomy) {
    $scope.flight.class = 'Economy';
    $scope.flight.fare = $scope.flight.economyFare;
  } else {
    $scope.flight.class = 'Business';
    $scope.flight.fare = $scope.flight.businessFare;
  }
}

flightDetailsController.$inject = ['$scope', '$location', 'api'];
App.controller('flightDetailsController', flightDetailsController);
