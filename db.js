// Dependancies
var MongoClient   = require('mongodb').MongoClient;
var airports      = require('./mockdata/airports.json');
var aircrafts     = require('./mockdata/aircrafts.json');
var flights       = require('./mockdata/flights.json');
var countries     = require('./mockdata/countries.json');

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
function db() {
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
  if (isOneway) {
    DB.collection('flights').find({
      $and: [{
        "refOriginAirport": origin
      }, {
        "refDestinationAirport": destination
      }, {
        "departureUTC": exitDate
      }]
    }).toArray(function(err, flights) {
      if (err) return cb(err);
      cb(null, flights);
    });
  } else {
    DB.collection('flights').find({
      $or: [{
        $and: [{
          "refOriginAirport": origin
        }, {
          "refDestinationAirport": destination
        }, {
          "departureUTC": exitDate
        }]
      }, {
        $and: [{
          "refOriginAirport": destination
        }, {
          "refDestinationAirport": origin
        }, {
          "departureUTC": reEntryDate
        }]
      }]
    }).toArray(function(err, flights) {
      if (err) return cb(err);
      cb(null, flights);
    });
  }
};

exports.getAirport = function(iata, cb) {
  // get airport (name) from db with the given iata
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

exports.postPassenger = function(passenger, cb) {
  //post created passenger to db
  DB.collection('passengers', function(err, collection) {
    collection.insert(passenger, {
      safe: true
    }, cb(err, result));
  });
};

exports.postBooking = function(booking, cb) {
  //post created booking to db
  DB.collection('bookings', function(err, collection) {
    collection.insert(booking, {
      safe: true
    }, cb(err, result));
  });
};

exports.updateFlight = function(flightNumber, seat, cb) {

  //update the flight with the allocated seats
  // DB.collection('flights').find({"number":flightNumber}).toArray(function (err,flight) {
  //   if(err) return cb(err);
  //   for (var i = 0; i < flight.length; i++) {
  //       if(flight.seatmap[i].number === seat.number){
  //         flight.seatmap[i] = seat;
  //         break;
  //       }
  //   }
  //   DB.collection('flights').update({"number":flightNumber},{$set:{"seatmap":flight.seatmap}});
  //  });

  DB.collection('flights').findAndModify(
    {"number":flightNumber}, // query
    {$set: {"seatmap":flight.seatmap}}, // replacement
    function (err,flight) {
      if(err) return cb(err);
      else{
          for (var i = 0; i < flight.length; i++) {
            if(flight.seatmap[i].number === seat.number){
              flight.seatmap[i] = seat;
              break;
            }
          }
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
exports.dropDB = function(done) {
  DB.dropDatabase();
  done();
};

exports.close = function() {
  DB.close();
};

exports.DB = DB;
