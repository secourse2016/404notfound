var confirmationController = function ($scope, $location, api) {
  $scope.pageClass = 'page-confirmation';

  $scope.title = "Confirmation";
  $scope.flight = api.getFlight();
  $scope.referenceNumber = api.getBookingReference();

  if (!$scope.flight) {
    $location.path('/');
  }

  $scope.goBack = function () {
    $location.path('/payment');
  }

  $scope.goNext = function () {
    $location.path('/');
  }
}

confirmationController.$inject = ['$scope', '$location', 'api'];
App.controller('confirmationController', confirmationController);
