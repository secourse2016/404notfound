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
exports.init = function (cb) {

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

exports.getFlights = function(cb,origin, destination, exitDate,reEntryDate, isOneway) {
  // view #2 will have to aquire flights from db with input params
  //from view #1 (date, arrival, depAirport, round/oneway)
  if (isOneway){
    DB.collection('flights').find({$and:[{
      "refOriginAirport":origin},
      {"refDestinationAirport":destination},
      {"departureUTC":exitDate}]
    }).toArray(function (err, flights) {
      if(err) return cb(err);
      cb(null,flights);
    });
  }
  else{
    DB.collection('flights').find({$or:[{$and:[{"refOriginAirport":origin},
      {"refDestinationAirport":destination},
      {"departureUTC":exitDate}]},
      {$and:[{"refOriginAirport":destination},
      {"refDestinationAirport":origin},
      {"departureUTC":reEntryDate}]}]}).toArray(function (err, flights) {
      if(err) return cb(err);
      cb(null,flights);
    });
  }

};



exports.getAirport = function(cb,iata) {
  // get airport (name) from db with the given iata
};

exports.getAircraft = function(cb,tailNumber) {
  // get aircraft from db with the given tailNumber
};

exports.getAircrafts = function() {
  // get all aircrafts from db
};

exports.getCountries = function (cb) {
  //gets all countries
}

// On Confirmation

exports.postPassenger = function(cb) {
  //post created passenger to db
};

exports.postBooking = function(cb) {
  //post created booking to db
};

exports.updateFlight = function(cb) {
  //update the flight with the allocated seats
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

exports.close = function () {
  DB.close();
}

//Drops database
exports.dropDB = function (done) {
  DB.dropDatabase();
  done();

};


exports.DB = DB;
