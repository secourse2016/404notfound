App.factory('api', function($http) {
  var chosenFlight,passengerData,bookingData;
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
    setFlight: function(flight){
      chosenFlight = flight;
    },
    setPassenger: function(passenger){
      passengerData = passenger;
    },
    setBooking: function(booking){
      bookingData = booking;
    },
    getPassenger: function(){
      return passengerData;
    },
    getBooking: function(){
      return bookingData;
    },
    getChosenFlight: function(){
      return chosenFlight;
    },
    submitBooking: function(){
      // this is the most important function here this is the one which will send data to the server
    }
  };
});
