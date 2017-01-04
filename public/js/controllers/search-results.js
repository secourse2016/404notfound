var searchResultsController = function ($scope, $location, api) {
    $scope.pageClass = 'page-flights';

    $scope.flight = api.getFlight();
    $scope.constructDate = api.constructDate;
    $scope.searchResults = [];

    if (!$scope.flight) {
        $location.path('/');
    }

    $scope.goBack = function () {
        $location.path('/');
    };

    api.searchFlights().then(function (response) {
        $scope.searchResults = response.data.outgoingFlights;

        $scope.searchResults = $scope.searchResults.map(function (result) {
            var enhancedResult = result;

            var hours = Math.floor(result.durationMins / 60);
            var minutes = result.durationMins % 60;

            enhancedResult.durationString = hours + 'h ' + minutes + 'm';
            return enhancedResult;
        });
    }, function (err) {
        console.error(err);
    });

    $scope.selectOutgoingFlight = function (flight, isEconomy) {
        api.setFlight(flight);

        if (isEconomy) {
            api.setEconomy();
        } else {
            api.setBusiness();
        }

        $location.path('/flight-details');
    };

    $scope.isCollapsed = true;
}

searchResultsController.$inject = ['$scope', '$location', 'api'];
App.controller('searchResultsController', searchResultsController);
