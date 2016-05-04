App.config(function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat, refNum;
    var isOtherHosts; // set to false in flightsctrl ,set to true flightsNewCtrl
    var stripeToken;
    var passengerData = [];
    return {
        getStripeKey: function(url) {
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'x-access-token': accessToken,
                    'Content-Type':undefined
                  }
            });
        },
        getAirports: function() {
            return $http({
                method: 'GET',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/airports',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getFlights: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'


                    }
                })
        },
        getOtherFlightsEco: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getOtherFlightsBusi: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/aircrafts',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/countries',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        setOutGoingFlight: function(flight) {
            chosenOutgoingFlight = flight;
        },
        setReturningFlight: function(flight) {
            chosenReturningFlight = flight;
        },
        setPassenger: function(passenger) {
            passengerData.push(passenger);
            if (isOtherHosts)
                bookingData.PassengerDetails = passengerData
        },
        getCabinetOutgoingClass: function() {
            return cabinetOutgoingClass;
        },
        getCabinetReturningClass: function() {
            return cabinetReturningClass;
        },
        setBooking: function(booking) {
            if (!isOtherHosts) {

                if (!booking.exitIsEconomy)
                    cabinetOutgoingClass = "Business"
                else
                    cabinetOutgoingClass = "Economy"

                if (!booking.reEntryIsEconomy)
                    cabinetReturningClass = "Business"

                else
                    cabinetReturningClass = "Economy"
            } else {
                if (!booking.class)
                    cabinetOutgoingClass = "Business"
                else
                    cabinetOutgoingClass = "Economy"

                if (!booking.class)
                    cabinetReturningClass = "Business"

                else
                    cabinetReturningClass = "Economy"
            }



            bookingData = booking;
        },

        getPassenger: function() {
            return passengerData;
        },
        getBooking: function() {
            return bookingData;
        },
        getChosenOutGoingFlight: function() {
            return chosenOutgoingFlight;
        },
        getChosenReturningFlight: function() {
            return chosenReturningFlight;
        },
        getOutgoingSeat: function() {
            return outgoingSeat;
        },

        getReturnSeat: function() {
            return returnSeat;
        },
        setOutgoingSeat: function(seat) {
            outgoingSeat = seat;
        },
        setRetrunSeat: function(seat) {
            returnSeat = seat;
        },
        setIsOtherHosts: function(otherHosts) {
            isOtherHosts = otherHosts;
        },
        IsOtherHosts: function() {
            return isOtherHosts;
        },
        clearLocal: function() {
            chosenReturningFlight = {}
            chosenOutgoingFlight = {}
            passengerData = []
            bookingData = {}
            cabinetOutgoingClass = {}
            cabinetReturningClass = {}
            outgoingSeat = {}
            returnSeat = {}
            isisOtherHosts = false

        },
        submitBooking: function(otherHosts,url) {
            var price = 0;
            if (this.getCabinetOutgoingClass() == 'Economy')
                price = this.getChosenOutGoingFlight().economyFare
            else
                price = this.getChosenOutGoingFlight().businessFare

            if (this.getChosenReturningFlight())
                if (this.getCabinetReturningClass() == 'Economy')
                    price = price + this.getChosenReturningFlight().economyFare
                else
                    price = price + this.getChosenReturningFlight().businessFare

            if (!otherHosts) {
                return $http({
                    method: 'POST',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/booking',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': accessToken,
                        'other-hosts': otherHosts
                    },
                    data: $.param({
                        passenger: passengerData,
                        booking: bookingData,
                        price: price,
                        outgoingSeatNumber: outgoingSeat,
                        returnSeatNumber: returnSeat,
                        token: stripeToken
                    })
                });
            } else {
                return $http({
                    method: 'POST',
                    url: url + '/booking',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': accessToken
                    },
                    data: $.param(bookingData)
                });
            }

        },
        getStripeToken: function() {
            return stripeToken;
        },
        setStripeToken: function(token) {
            stripeToken = token;
        }
    };
});
