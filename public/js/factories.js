App.factory('api', function($http) {

  var chosenFlight, passengerData, bookingData, cabinetClass;

  return {

    getAirports: function() {
      return $http({
        method: 'GET',
        url: '/api/airports'
      })
    },
    getAll: function() {
      return $http({
        method: 'GET',
        url: '/api/flights'
      })
    },
    getFlights: function(origin, destination, exitDate) {
      return $http({
        method: 'GET',
        url: '/api/flight'
      })
    },
    getAircrafts: function() {
      return $http({
        method: 'GET',
        url: '/api/aircrafts'
      })
    },
    setFlight: function(flight) {
      chosenFlight = flight;
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
    getChosenFlight: function() {
      return chosenFlight;
    },
    getCountries: function() {
      return $http({
        method: 'GET',
        url: '/api/countries'
      })
    },
    submitBooking: function() {
      // this is the most important function here this is the one which will send data to the server
    }
    
  };

});
