var mainController = function ($scope, $location, $translate, api) {
  $scope.pageClass = 'page-main';
  $scope.airports = [];

  $scope.flightParams = {
    originAirport: null,
    destinationAirport: null,
    departureUTC: new Date(new Date()
      .setUTCHours(24, 0, 0, 0))
  };

  api.getAirports().then(function (response) {
    $scope.airports = response.data;
    $scope.flightParams.originAirport = $scope.airports[0];
    $scope.flightParams.destinationAirport = $scope.airports[1];
  }, function (err) {
    console.error(err);
  });

  $scope.areFlightParamsValid = function () {
    return $scope.flightParams.originAirport != $scope.flightParams.destinationAirport
      && $scope.airports.indexOf($scope.flightParams.originAirport) != -1
      && $scope.airports.indexOf($scope.flightParams.destinationAirport) != -1
      && $scope.flightParams.departureUTC;
  };

  $scope.dateFormat = "dd MMMM yyyy";

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1,
    showWeeks: false
  };

  $scope.open = function () {
    $scope.popup.opened = true;
  };

  $scope.popup = {
    opened: false
  };

  $scope.adultBtnText = '1 ' + $translate.instant('MAIN.ADULT');
  $scope.childrenBtnText = '0 ' + $translate.instant('MAIN.CHILDREN');
  $scope.infantBtnText = '0 ' + $translate.instant('MAIN.INFANT');

  $scope.searchForFlightsButtonClass = function () {
    return ($scope.areFlightParamsValid()) ?
      "btn btn-success btn-lg" : "btn btn-primary btn-lg";
  }

  $scope.goToFlights = function () {
    api.setFlight($scope.flightParams);
    $location.path('/search-results');
  }
};

mainController.$inject = ['$scope', '$location', '$translate', 'api'];
App.controller('mainController', mainController);
