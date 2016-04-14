// Dependancies
var MongoClient = require('mongodb').MongoClient;
// var mongoose = require('mongoose');

// Declarations
var DB = null;

// Connection URL
var url = 'mongodb://localhost:27017/air-berlin';

// Execute
connect(function(err, db) {

  if (err)
    throw new Error('Cannot connect to database.');

  else {
    // seed
  }

});

// Connects to database
function connect(cb) {

  MongoClient.connect(url, function(err, db) {
    DB = db;
    cb(err, db);
  });

};

// DB getter
function db() {

  if (DB === null)
    throw Error('DB Object has not yet been initialized.');

  return DB;

};

var seed = function(cb) {
  //seeds the database collections with the json files
};

exports.getFlights = function(origin, destination) {
  // view #2 will have to aquire flights from db with input params
  //from view #1 (date, arrival, depAirport, round/oneway)
};

exports.getAirport = function(iata) {
  // get aivar originAirport=db.getAirport(origin);rport (name) from db with the given iata
};

exports.getAircraft = function(tailNumber) {
  // get aircraft from db with the given tailNumber
};

// On Confirmation

exports.postPassenger = function() {
  //post created passenger to db
};

exports.postBooking = function() {
  //post created booking to db
};

exports.updateFlight = function() {
  //update the flight with the allocated seats
};

// Drops collections
function clear(done) {

  DB.listCollections().toArray().then(function(collections) {

    collections.forEach(function(c) {
      DB.collection(c.name).removeMany();
    });

    done();

  }).catch(done);

};

// Drops database
// function deleteA(done) {
//
//   mongoose.connect(url, function() {
//     mongoose.connection.db.dropDatabase();
//   });
//
//   done();
//
// };
