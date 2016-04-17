// @ahmed-essmat
App.controller('seatingCtrl', function($scope, $location, $routeParams, api) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.goNext = function() {
        if (api.getChosenReturningFlight())
            if ($routeParams.outgoing == "outgoing") {
                $location.path('/seating/returing');
                api.setOutgoingSeat($scope.seat);
            } else {
                api.setRetrunSeat($scope.seat);
                $location.path('/payment');
            }
        else {
            api.setOutgoingSeat($scope.seat);
            $location.path('/payment');
        }

    }
    $scope.goBack = function() {
        $location.path('/passenger-details');
    }



    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
        $location.path('/flights');
        return;
    }
    if (!api.getPassenger()) {
        $location.path('/passenger-details');
        return;
    }
    var seatmap;
    console.log($routeParams.outgoing)
    console.log(api.getCabinetOutgoingClass())

    if ($routeParams.outgoing == "outgoing") {

        $scope.isEconomyText = api.getCabinetOutgoingClass();
        seatmap = api.getChosenOutGoingFlight().seatmap;
    } else {
        $scope.isEconomyText = api.getCabinetReturningClass();
        seatmap = api.getChosenReturningFlight().seatmap;
    }



    var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
    var schema = [3, 5, 3, 20];

    $scope.array1 = [];

    $scope.array2 = [];

    $scope.array3 = [];

    $scope.bob = [];

    for (var i = 0; i < schema[0]; i++) {
        $scope.array1.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[1]; i++) {
        $scope.array2.push(alphabits[0]);
        alphabits.splice(0, 1);
    }
    for (var i = 0; i < schema[2]; i++) {
        $scope.array3.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[3]; i++) {
        $scope.bob.push(i);

    }



    $scope.searchColor = function(text) {
        if (!$scope.isEmpty(text))
            return 'seatOcu';
        else
            return 'seatEmpty';
    }
    $scope.isEmpty = function(text) {
        for (var i = 0; i < seatmap.length; i++) {
            if (seatmap[i]['number'] == text) {
                return seatmap[i]['isEmpty']
            }
        }
        return true;
    }
    $scope.selectSeat = function(seat) {
        $scope.seat = {

            "number": seat,
            "isEmpty": false,
            "isEconomy": false,
            "isAisle": false,
            "hasSmoking": false,
            "hasScreen": true,
            "refBookingID": null,
            "refPassengerID": null

        };
    };

});
