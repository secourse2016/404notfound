var assert = require('chai').assert;
var request = require('supertest');
var db = require('../db.js');
var app = require('../app.js');

// this function is used to connect the db to the mongo server
before(function(done) {
  db.init(function(err) {
    if (err) return done(err);
    else done();
  });
});

// @ahmedlhanafy
// this should test that all the collections have been inserted successfully
describe("seed", function() {



  before(db.clearDB);
     it('should populate the db if db is empty returning true', function(done) {

         db.seed(function(err,seeded){
           assert(seeded, "database is not filled");
           done();
         });

     });


     it('should not seed db again if db is not empty returning false in the callback', function(done) {

        db.seed(function(error, seeded){
             assert(!seeded, "Shouldn't seed a database already filled.");
             done();
         });
     });



});

// @ahmedlhanafy
// this function should test that the object returned match the same arguments given to it
// we should test one way and round trip
describe("getFlights", function() {
var flight1 = {
    origin : "CAI",
    destination : "JED",
    exitDate : "2016-04-12",
    reEntryDate : null,
    isOneway :true
}
var flight2 = {
    origin : "CAI",
    destination : "JED",
    exitDate : "2016-04-12",
    reEntryDate : "2016-05-01",
    isOneway :false
}
it("should make sure that the returned flight matches a one way flight from CAI to JED on 12/4", function(){

  db.getFlights(flight1.origin, flight1.destination, flight1.exitDate, flight1.reEntryDate, flight1.isOneway, function (err,flight){


assert(flight1==flight, "The returned flight doesn't match the given flight");

  });
});


it("should make sure that the returned flight matches a ROUND TRIP  from CAI to JED on 12/4 and back on 1/5", function(){

  db.getFlights(flight2.origin, flight2.destination, flight2.exitDate, flight2.reEntryDate, flight2.isOneway, function (err,flight){


assert(flight2==flight, "The returned flight doesn't match the given flight");


});
});

});

// @yassmine
//this one we should make sure that the returned airport matches the iata given to the function
describe("getAirport", function() {

var iata = "CAI";
    it("should make sure that the returned airport matches the iata given to the function ", function() {

        db.getAirport(iata, function(err, airport){
          assert( iata == airport.iata, "Returned airport doesn't match with the given iata");
        });

    });

});
// @yassmine
//this one we should make sure that the returned aircraft matches the tailNumber given to the function
describe("getAircraft", function() {

  var tailNumber = "D-AAAA";
      it("should make sure that the returned tail number matches the tail number given to the function ", function() {

         db.getAircraft(tailNumber, function(err, aircraft){
           assert( tailNumber == aircraft.tailNumber, "Returned tail number doesn't match with the given tail number");

         });
      })


});

// @yassmine
// Here we should test for the number of aircrafts which we know
describe("getAircrafts", function() {


 var aircrafts1 = ["D-AAAA", "D-BBBB", "D-CCCC","D-DDDD", "D-EEEE"];

 it ("should make sure that the returned aircrafts match the aircrafts given to the function", function(){

  db.getAircrafts(aircrafts1, function(err, aircrafts){

//add some cases

    assert (aircrafts1.length == aircrafts.length, "Returned number of aircrafts is not equal to the given number of aircrafts");

      var found=false;
    for (var i = 0; i<aircrafts1.length; i++)
    {
       found = false;
        for(var j = 0; j<aircrafts.length; j++)
        {
          if(aircrafts1[i]==aircrafts[j])
          {
            found = true;
            break;
          }
        }
    }
    assert(found,"Returned array of aircrafts doesn't match with the given array of aircrafts, the database is incomplete");


  });



 })
});

// @yassmine
//here we can check if the returning object is array
describe("getCountries", function() {

it("should make sure the returning object is an array", function(){

   db.getCountries(function(err, countries){
//     check is array
     assert(countries.isArray([]), "The returned object is not an array");
   });



})
});

// we will leave this one for now
describe("postPassenger",function(){

});

// we will leave this one for now
describe("postBooking",function(){

});

// we will leave this one for now
describe("updateFlight",function(){

});

// @ahmedlhanafy
// we should check some how if the db still contains collections or not
describe("clear",function(){

it("should make sure that the database is empty", function(){

  db.clear(function(err){
    //not sure what to do here
  })
})
});
