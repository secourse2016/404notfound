var paymentController = function ($scope, $location, api) {
    $scope.pageClass = 'page-payment';

    $scope.title = "Choose your payment option";
    $scope.flight = api.getFlight();
    $scope.isEconomy = api.isEconomy();

    if (!$scope.flight) {
        $location.path('/');
    }

    $scope.goBack = function () {
        $location.path('/passenger-details');
    }

    $scope.goNext = function () {
        api.reserveSeat().then(function (response) {
            api.setBookingReference(response.data._id);
            $location.path('/confirmation');
        }).catch(function () {
            alert('Something went wrong!')
        });
    }

    $scope.years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    $scope.yearsButtonText = $scope.years[0];

    $scope.changeYear = function (text) {
        $scope.yearsButtonText = text;
    }

    $scope.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.monthsButtonText = $scope.months[0];

    $scope.changeMonth = function (text) {
        $scope.monthsButtonText = text;
        $scope.monthsBtnNo = $scope.months.indexOf(text);
    }

    $scope.price = ($scope.isEconomy) ? $scope.flight.economyFare : $scope.flight.businessFare;
}

paymentController.$inject = ['$scope', '$location', 'api'];
App.controller('paymentController', paymentController);
