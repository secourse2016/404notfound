var passengerDetailsController = function ($scope, $location, api) {
    $scope.pageClass = 'page-passenger';

    $scope.title = "Fill in your details";
    $scope.flight = api.getFlight();
    $scope.countries = [];

    if (!$scope.flight) {
        $location.path('/');
    }

    $scope.goBack = function () {
        $location.path('/flight-details');
    }

    $scope.goNext = function () {
        api.setPassenger($scope.passenger);
        $location.path('/payment');
    }

    api.getCountries().then(function (response) {
        $scope.countries = response.data;
    }, function (err) {
        console.error(err);
    });

    $scope.titles = ['Mr', 'Ms'];
    $scope.titlesButtonText = $scope.titles[0];

    $scope.changeTitle = function (text) {
        $scope.titlesButtonText = text;
    }

    $scope.passenger = {
        nationality: $scope.nationality,
        title: $scope.titlesButtonText,
        firstName: $scope.firstName,
        middleName: $scope.middleName,
        lastName: $scope.lastName,
        passportNumber: $scope.passportNumber,
        phoneNumber: $scope.phoneNumber,
        email: $scope.email
    };
}

passengerDetailsController.$inject = ['$scope', '$location', 'api'];
App.controller('passengerDetailsController', passengerDetailsController);
