App.factory('api', function ($http) {
    const api = 'http://localhost:8080/api/';

    var booking = {
        flight: null,
        isEconomy: null,
        passenger: null,
        reference: null
    };

    return {
        getAirports: function () {
            return $http({
                method: 'GET',
                url: api.concat('airports')
            })
        },
        getCountries: function () {
            return $http({
                method: 'GET',
                url: api.concat('countries')
            })
        },
        searchFlights: function () {
            return $http({
                method: 'GET',
                url: api.concat('flights/:originAirportIata/:destinationAirportIata/:departureDate'
                    .replace(':originAirportIata', booking.flight.originAirport.iata)
                    .replace(':destinationAirportIata', booking.flight.destinationAirport.iata)
                    .replace(':departureDate', booking.flight.departureUTC))
            })
        },
        reserveSeat: function () {
            return $http({
                method: 'POST',
                url: api.concat('flights/book'),
                data: JSON.stringify(booking)
            });
        },
        getFlight: function () {
            return booking.flight;
        },
        setFlight: function (flight) {
            booking.flight = flight;
        },
        isEconomy() {
            return booking.isEconomy;
        },
        setEconomy() {
            booking.isEconomy = true;
        },
        setBusiness() {
            booking.isEconomy = false;
        },
        setPassenger(passenger) {
            booking.passenger = passenger;
        },
        getBookingReference() {
            return booking.reference;
        },
        setBookingReference(reference) {
            booking.reference = reference;
        },
        constructDate: function (date) {
            var dateOut = new Date(date);
            return new Date(dateOut.getUTCFullYear(), dateOut.getUTCMonth(),
                dateOut.getUTCDate(), dateOut.getUTCHours(),
                dateOut.getUTCMinutes(), dateOut.getUTCSeconds());
        }
    };
});
