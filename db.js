// Dependancies
var MongoClient = require('mongodb').MongoClient;
var airports = require('./mockdata/airports.json');
var aircrafts = require('./mockdata/aircrafts.json');
var flights = require('./mockdata/flights.json');
var countries = require('./mockdata/countries.json');

// Declarations
var DB = null;

// Connection URL
var url = 'mongodb://localhost:27017/air-berlin';

// Connects to database
exports.init = function(cb) {
    MongoClient.connect(url, function(err, db) {
        DB = db;
        cb(err);
    });
};

// DB getter
exports.db = function() {
    if (DB === null)
        throw Error('DB Object has not yet been initialized.');
    return DB;
};

exports.seed = function(cb) {

    /*seeds the database collections with the json files (airports/aircrafts/flights/countries)
      & creates collections for passengers & booking to insert in later on */

    // Populate airports
    DB.collection('airports', {
        strict: true
    }, function(err, collection) {
        if (err) {
            dropDB(function() {});
            DB.collection('airports', function(err, collection) {
                collection.insert(airports, {
                    safe: true
                }, function(err, result) {});
            });
            cb(true);
        } else
            cb(false);
    });

    // Populate aircrafts
    DB.collection('aircrafts', {
        strict: true
    }, function(err, collection) {
        if (err) {
            DB.collection('aircrafts', function(err, collection) {
                collection.insert(aircrafts, {
                    safe: true
                }, function(err, result) {});
            });
            // Feed seatmap from aircraft to flight
            flights.forEach(function(flight) {

              aircrafts.forEach(function(aircraft) {
                if (aircraft.tailNumber === flight.refAircraftTailNumber){
                  flight.seatmap = aircraft.seatmap;
                  flight.refAircraftModel = aircraft.model;
                  flight.emptyEconomySeatsCount = aircraft.economySeatCount;
                  flight.emptyBusinessSeatsCount = aircraft.businessSeatCount;
                  flight.economySeatSchema = aircraft.economySeatSchema;
                  flight.buisnessSeatSchema =aircraft.businessSeatSchema;
                }
              });
            });
        }
    });

    // Populate flights
    DB.collection('flights', {
        strict: true
    }, function(err, collection) {
        if (err) {
            DB.collection('flights', function(err, collection) {
                collection.insert(flights, {
                    safe: true
                }, function(err, result) {});
            });
        }
    });

    // Populate countries
    DB.collection('countries', {
        strict: true
    }, function(err, collection) {
        if (err) {
            DB.collection('countries', function(err, collection) {
                collection.insert(countries, {
                    safe: true
                }, function(err, result) {});
            });
        }
    });
};

exports.getFlights = function(origin, destination, exitDate, reEntryDate, isOneway, cb) {
    // view #2 will have to aquire flights from db with input params
    //from view #1 (date, arrival, depAirport, round/oneway)

    var result = {};
    result = {
        outgoingFlights: [],
        returnFlights: []
    }
    DB.collection('flights').find({
        $and: [{
            "refOriginAirport": origin
        }, {
            "refDestinationAirport": destination
        }]
    }).toArray(function(err, flights) {

        if (err) return cb(err);

        flights = flights.filter(function(flight) {
            var flightDate = new Date(flight.departureUTC);
            var constraintDate = new Date(exitDate);
            return flightDate.getDate() === constraintDate.getDate() && flightDate.getMonth() === constraintDate.getMonth() && flightDate.getFullYear() === constraintDate.getFullYear();
        });

        result.outgoingFlights = flights;


        if (isOneway){
            cb(null, result);
            return;
        }
        else {
          DB.collection('flights').find({
              $and: [{
                  "refOriginAirport": destination
              }, {
                  "refDestinationAirport": origin
              }]
          }).toArray(function(err, flights) {

              if (err) return cb(err);

              flights = flights.filter(function(flight) {
                  var flightDate = new Date(flight.departureUTC);
                  var constraintDate = new Date(reEntryDate);
                  return flightDate.getDate() === constraintDate.getDate() && flightDate.getMonth() === constraintDate.getMonth() && flightDate.getFullYear() === constraintDate.getFullYear();
              });

              result.returnFlights = flights;
              cb(null, result);
              return;
          });
        }

    });
    // console.log(result.outgoingFlights);

};

exports.getAirport = function(iata, cb) {
    // get airport from db with the given iata
    DB.collection('airports').find({
        "iata": iata
    }).toArray(function(err, airport) {
        if (err) return cb(err);
        cb(null, airport);
    });
};

exports.getAirports = function(cb) {
    // get all airports from db
    DB.collection('airports').find({}).toArray(function(err, airports) {
        if (err) return cb(err);
        cb(null, airports);
    });
};

exports.getAircraft = function(tailNumber, cb) {
    // get aircraft from db with the given tailNumber
    DB.collection('aircrafts').find({
        "tailNumber": tailNumber
    }).toArray(function(err, aircraft) {
        if (err) return cb(err);
        cb(null, aircraft);
    });
};

exports.getAircrafts = function(cb) {
    // get all aircrafts from db
    DB.collection('aircrafts').find({}).toArray(function(err, aircrafts) {
        if (err) return cb(err);
        cb(null, aircrafts);
    });
};

exports.getCountries = function(cb) {
    //gets all countries
    DB.collection('countries').find({}).toArray(function(err, countries) {
        if (err) return cb(err);
        cb(null, countries);
    });
};

// On Confirmation
// exports.postPassenger = function(passenger, cb) {
//     //post created passenger to db
//     DB.collection('passengers', function(err, collection) {
//         collection.insert(passenger, {
//             safe: true
//         }, function(err, result) {
//             cb(err, result);
//         });
//     });
// };

exports.postPassengers = function(passengers, cb) {
    //post created passengers to db
    DB.collection('passengers', function(err, collection) {
        collection.insert(passengers, {
            safe: true
        }, function(err, result) {
            cb(err, result);
        });
    });
};

exports.postBooking = function(booking, cb) {
    //post created booking to db
    DB.collection('bookings', function(err, collection) {
        collection.insert(booking, {
            safe: true
        }, function(err, result) {
            cb(err, result);
        });
    });
};

exports.updateFlight = function(flightID, isEconomy, seatNumber, passengerID, bookingID, cb) {

    //update the flight with the allocated seats
    DB.collection('flights').findOne({
        "_id":flightID
    }).toArray(function(err, flight) {
        if (err) return cb(err);
        var i;
        var found = false;
      //  console.log(flight[0].seatmap);
        for (i = 0; i < flight.seatmap.length; i++) {
            var seat = flight.seatmap[i];
            if (seat.number === seatNumber && seat.isEconomy === isEconomy) {
                seat.refPassengerID = passengerID;
                seat.refBookingID = bookingID;
                seat.isEmpty = false;
                found = true;
                break;
            }
        }

        if (isEconomy) {

            if (found && flight.emptyEconomySeatsCount != 0 )
                DB.collection('flights').update({
                    "_id":flightID
                }, {
                    $set: {
                        "seatmap": flight.seatmap
                    },
                    $inc: {
                        "emptyEconomySeatsCount": -1
                    }
                }, function(err, result) {
                    cb(err, result);
                });


        } else {

            if (found && flight.emptyBusinessSeatsCount != 0)
                DB.collection('flights').update({
                      "_id":flightID
                }, {
                    $set: {
                        "seatmap": flight.seatmap
                    },
                    $inc: {
                        "emptyBusinessSeatsCount": -1
                    }
                }, function(err, result) {
                    cb(err, result);
                });

        }
    });

};

// Drops collections
exports.clear = function(done) {
    DB.listCollections().toArray().then(function(collections) {
        collections.forEach(function(c) {
            DB.collection(c.name).removeMany();
        });
        done();
    }).catch(done);
};

//Drops database
function dropDB(done) {
    DB.dropDatabase();
    done();
};

exports.close = function() {
    DB.close();
};

exports.DB = DB;
