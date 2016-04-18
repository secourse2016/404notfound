App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4NDIxNTQsImV4cCI6MTQ5MjM3ODE1NCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.MxnOzWblV8rJyhAQexGJaYwCOYqr2yInGeY1A3JLJ1Q"
    var chosenOutgoingFlight, chosenReturningFlight, passengerData, bookingData, cabinetOutgoingClass, cabinetReturningClass,outgoingSeat,returnSeat;
    return {
        getAirports: function() {
            return $http({
                method: 'GET',
                url: '/api/airports',
                headers: {
                    'x-access-token': accessToken
                }
            })
        },
        getFlights: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate,
                    headers: {
                        'x-access-token': accessToken
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: '/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/class",
                    headers: {
                        'x-access-token': accessToken
                    }
                })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: '/api/aircrafts',
                headers: {
                    'x-access-token': accessToken
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/countries',
                headers: {
                    'x-access-token': accessToken
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
            passengerData = passenger;
        },
        getCabinetOutgoingClass: function() {
            return cabinetOutgoingClass;
        },
        getCabinetReturningClass: function() {
            return cabinetReturningClass;
        },
        setBooking: function(booking) {
             if (!booking.reEntryIsEconomy)
                 cabinetOutgoingClass = "Business"
             else
                 cabinetOutgoingClass = "Economy"

             if (!booking.exitIsEconomy)
                 cabinetReturningClass = "Business"

             else
                 cabinetReturningClass = "Economy"


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
        getOutgoingSeat: function () {
          return outgoingSeat;
        },

        getReturnSeat: function () {
          return returnSeat;
        },
        setOutgoingSeat: function(seat){
          outgoingSeat = seat;
        },
        setRetrunSeat: function(seat){
          returnSeat = seat;
        },
        clearLocal:function(){
          chosenReturningFlight = {}
          chosenOutgoingFlight = {}
          passengerData = {}
          bookingData = {}
          cabinetOutgoingClass = {}
          cabinetReturningClass = {}
          outgoingSeat = {}
          returnSeat= {}
        },
        submitBooking: function() {
          return $http({
            method: 'POST',
            url: '/api/booking',
            headers: {
                'x-access-token': accessToken
            },
            data:{
              passenger: passengerData,
              booking: bookingData,
              outgoingSeatNumber: outgoingSeat,
              returnSeatNumber: returnSeat
            }
          });
        }
    };
});
