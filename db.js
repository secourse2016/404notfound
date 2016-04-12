var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var assert = require('assert');

var server = new Server('localhost', 27017, {auto_reconnect: true});
var DB = new Db('air-berlin', server);

var connect = function(cb) {

     cb(null,DB)

    };

connect( function(err, db) {

    assert.equal(null, err);
        db = DB;

    });


var db = function() {

    if (DB === null) throw Error('DB Object has not yet been initialized');

        return DB;

};

db.open(function(err, db) {

//checks seeding of the database.. seed, if it wasn't.

});


var seed = function(cb){
//seeds the database collections with the json files
};

var getFlights = function (origin,destination) {
  // view #2 will have to aquire flights from db with input params
  //from view #1 (date, arrival, depAirport, round/oneway)
};

var getAirport = function (iata) {
// get airport (name) from db with the given iata
};

var getAircraft = function (tailNumber) {
// get aircraft from db with the given tailNumber
};


// On Confirmation

var postPassenger = function () {
//post created passenger to db
};

var postBooking = function () {
//post created booking to db
};

var updateFlight = function () {
//update the flight with the allocated seats
};


var delete = function(){
  //this function should drop/delete existent DB.
};


var clearDB = function(done) {

    DB.listCollections().toArray().then(function (collections) {

        collections.forEach(function (c) {

            DB.collection(c.name).removeMany();

        });

        done();

    }).catch(done);
};
