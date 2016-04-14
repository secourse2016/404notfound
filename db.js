// Dependancies
var MongoClient = require('mongodb').MongoClient;
var airports = require('./mockdata/airports.json');
var aircrafts = require('./mockdata/aircrafts.json');
var flights = require('./mockdata/flights.json');
var countries = require('./mockdata/countries.json');

// var mongoose = require('mongoose');

// Declarations
var DB = null;

// Connection URL
var url = 'mongodb://localhost:27017/air-berlin';



// Connects to database
exports.init = function (cb) {

  MongoClient.connect(url, function(err, db) {
    if (err){
       cb(err);
     }
    console.log('connected to db');
    DB = db;
    cb(null, db);

  });

};

// DB getter
function db() {

  if (DB === null)
    throw Error('DB Object has not yet been initialized.');

  return DB;

};

var seed = function(cb) {
  //seeds the database collections with the json files (airports/aircrafts/flights/countries)
  // create collections for passengers and booking to insert in later on
};

exports.getFlights = function(cb,origin, destination) {
  // view #2 will have to aquire flights from db with input params
  //from view #1 (date, arrival, depAirport, round/oneway)
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
