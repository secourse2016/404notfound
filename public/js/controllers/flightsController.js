// @abdelrahman-maged
App.controller('flightsCtrl', function($scope, $location, $routeParams, api) {

    $scope.pageClass = 'page-flights';
    $scope.title = "Choose a Flight";
    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.isCollapsed = true;
    $scope.isOutgoingFlightSelected = false;
    $scope.selectedBooking = {
        "refPassengerID": null,
        "exitDepartureUTC": null,
        "reEntryDepartureUTC": null,
        "issueDate": null,
        "isGoingEconomy": null,
        "isReturningEconomy": null,
        "isOneWay": true,
        "refExitFlightNumber": null,
        "refReEntryFlightNumber": null,
        "receiptNumber": null
    };

    $scope.goNext = function() {

        api.setOutGoingFlight($scope.selectedOutgoingFlight);
        api.setReturningFlight($scope.selectedReturningFlight);
        api.setBooking($scope.selectedBooking);
        $location.path('/exit-flight');

    }

    $scope.goBack = function() {
        // check if the user has selected a flight
        // and then call api.setFlight(chosenFlight)
        //if the user hasn't selected a flight return prevent him from proceeding
        $location.path('/');
    }

    var origin = $routeParams.origin;
    var destination = $routeParams.destination;
    var exitDate = new Date($routeParams.exitDate * 1000);
    exitDate.setHours(0, 0, 0, 0);
    $scope.roundTrip = false;
    if ($routeParams.returnDate) {
        var returnDate = new Date($routeParams.returnDate * 1000);
        returnDate.setHours(0, 0, 0, 0);
        $scope.roundTrip = true;
    }

    // var origin = "TXL";
    // var destination = "JFK";
    // var exitDate = new Date(1459555200 * 1000);

    if (!origin || !destination || !exitDate) {
        $location.path('/');
    }

    var flights;
    var returnDateISO;
    if (returnDate)
        returnDateISO = returnDate.toISOString();

    api.getFlights(origin, destination, exitDate.toISOString(), returnDateISO).then(function mySuccess(response) {

        console.log(response);
        flights = response.data

        // formatting data to be presentable
        for (i = 0; i < flights.outgoingFlights.length; i++) {

            var departureDate = new Date(flights.outgoingFlights[i].departureUTC);
            flights.outgoingFlights[i].departureUTC = departureDate.toUTCString();

            var arrivalDate = new Date(flights.outgoingFlights[i].arrivalUTC);
            flights.outgoingFlights[i].arrivalUTC = arrivalDate.toUTCString();

            var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
            var minutes = flights.outgoingFlights[i].duration % 60;

            flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

        }

        // throwing away flights.outgoingFlights not fitting constraints
        // function checkConstraints(flight) {
        //
        //     var flightDate = new Date(flight.departureUTC);
        //
        //     return flight.refOriginAirport === origin && flight.refDestinationAirport === destination && flightDate.getDay() === exitDate.getDay() && flightDate.getMonth() === exitDate.getMonth() && flightDate.getFullYear() === exitDate.getFullYear();
        //
        // }

        // $scope.flights = flights.filter(checkConstraints);
        if($scope.roundTrip )
        for (i = 0; i < flights.returnFlights.length; i++) {

            var departureDate = new Date(flights.returnFlights[i].departureUTC);
            flights.returnFlights[i].departureUTC = departureDate.toUTCString();

            var arrivalDate = new Date(flights.returnFlights[i].arrivalUTC);
            flights.returnFlights[i].arrivalUTC = arrivalDate.toUTCString();

            var hours = Math.floor(flights.returnFlights[i].duration / 60);
            var minutes = flights.returnFlights[i].duration % 60;

            flights.returnFlights[i].duration = hours + "h " + minutes + "m";

        }
        $scope.flights = flights;

    }, function myError(response) {
        console.log(response.statusText);
    });

    var airports = [];

    api.getAirports().then(function mySuccess(response) {

        airports = response.data;
        for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

            for (var j = 0; j < airports.length; j++) {

                if (airports[j].iata === $scope.flights.outgoingFlights[i].refOriginAirport)
                    $scope.flights.outgoingFlights[i].refOriginAirportName = airports[j].name;

                if (airports[j].iata === $scope.flights.outgoingFlights[i].refDestinationAirport)
                    $scope.flights.outgoingFlights[i].refDestinationAirportName = airports[j].name;

            }

        }
        if($scope.roundTrip)
        for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

            for (var j = 0; j < airports.length; j++) {

                if (airports[j].iata === $scope.flights.returnFlights[i].refOriginAirport)
                    $scope.flights.returnFlights[i].refOriginAirportName = airports[j].name;

                if (airports[j].iata === $scope.flights.returnFlights[i].refDestinationAirport)
                    $scope.flights.returnFlights[i].refDestinationAirportName = airports[j].name;

            }

        }

    }, function myError(response) {
        console.log(response.statusText);
    });

    var aircrafts = [];

    api.getAircrafts().then(function mySuccess(response) {

        aircrafts = response.data;
        for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

            for (var j = 0; j < aircrafts.length; j++) {

                if (aircrafts[j].tailNumber === $scope.flights.outgoingFlights[i].refAircraftTailNumber)
                    $scope.flights.outgoingFlights[i].refAircraftModel = aircrafts[j].model;

            }

        }

        if($scope.roundTrip)
        for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

            for (var j = 0; j < aircrafts.length; j++) {

                if (aircrafts[j].tailNumber === $scope.flights.returnFlights[i].refAircraftTailNumber)
                    $scope.flights.returnFlights[i].refAircraftModel = aircrafts[j].model;

            }

        }

    }, function myError(response) {
        console.log(response.statusText);
    });

    $scope.selectOutgoingFlight = function(flight, isEconomy) {

        $scope.isOutgoingFlightSelected = true;
        $scope.selectedOutgoingFlight = flight;

        $scope.selectedBooking.exitDepartureUTC = flight.departureUTC;
        $scope.selectedBooking.isGoingEconomy = isEconomy;
        $scope.selectedBooking.isOneWay = $scope.roundTrip;
        $scope.selectedBooking.refExitFlightNumber = flight.number;
    }

    $scope.selectReturningFlight = function(flight, isEconomy) {

        $scope.isReturningFlightSelected = true;
        $scope.selectedReturningFlight = flight;

        $scope.selectedBooking.reEntryDepartureUTC = flight.departureUTC;
        $scope.selectedBooking.isReturningEconomy = isEconomy;
        $scope.selectedBooking.isOneWay = $scope.roundTrip;
        $scope.selectedBooking.refReEntryFlightNumber = flight.number;
    }


    $scope.checkNextBtnState = function() {
        if ($scope.roundTrip) {
            return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
        } else {
            return $scope.isOutgoingFlightSelected;
        }
    }




});
