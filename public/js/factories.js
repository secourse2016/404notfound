App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4NDIxNTQsImV4cCI6MTQ5MjM3ODE1NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.MxnOzWblV8rJyhAQexGJaYwCOYqr2yInGeY1A3JLJ1Q"
    var chosenOutgoingFlight,chosenReturningFlight, passengerData, bookingData, cabinetClass;
    return {
        getAirports: function() {
            return $http({
                method: 'GET',
                url: '/api/v2/airports',
                headers: {
                  'x-access-token': accessToken
                }
            })
        },
        getFlights: function(origin, destination, exitDate,returnDate) {
          if(!returnDate)
            return $http({
                method: 'GET',
                url: '/api/v2/flights/search/' + origin + "/" + destination + "/" + exitDate,
                headers: {
                  'x-access-token': accessToken
                }
            })
            else
            return $http({
                method: 'GET',
                url: '/api/v2/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate,
                headers: {
                  'x-access-token': accessToken
                }
            })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: '/api/v2/aircrafts',
                headers: {
                  'x-access-token': accessToken
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/v2/countries',
                headers: {
                  'x-access-token': accessToken
                }
            })
        },
        setOutGoingFlight: function(flight) {
            chosenOutGoingFlight = flight;
        },
        setReturningFlight: function(flight) {
            chosenReturningFlight = flight;
        },
        setPassenger: function(passenger) {
            passengerData = passenger;
        },
        getCabinetClass: function() {
            return cabinetClass;
        },
        setBooking: function(booking) {
            if (booking.isEconomy)
                cabinetClass = "Economy"
            else
                cabinetClass = "Business"
            bookingData = booking;
        },
        getPassenger: function() {
            return passengerData;
        },
        getBooking: function() {
            return bookingData;
        },
        getChosenOutGoingFlight: function() {
            return chosenOutGoingFlight;
        },
        getChosenReturningFlight: function() {
            return chosenReturningFlight;
        },
        submitBooking: function() {
            // this is the most important function here this is the one which will send data to the server
        }
    };
});
