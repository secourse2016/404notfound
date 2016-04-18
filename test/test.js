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


assert(flight1.origin==flight.origin, "The returned flight doesn't match the given flight");
assert(flight1.destination==flight.destination, "The returned flight doesn't match the given flight");
assert(flight1.exitDate==flight.exitDate, "The returned flight doesn't match the given flight");
assert(flight1.reEntryDate==flight.reEntryDate, "The returned flight doesn't match the given flight");
assert(flight1.isOneway==flight.isOneway, "The returned flight doesn't match the given flight");
  });
});


it("should make sure that the returned flight matches a ROUND TRIP  from CAI to JED on 12/4 and back on 1/5", function(){

  db.getFlights(flight2.origin, flight2.destination, flight2.exitDate, flight2.reEntryDate, flight2.isOneway, function (err,flight){


assert(flight2.origin==flight.origin, "The returned flight doesn't match the given flight");
assert(flight2.destination==flight.destination, "The returned flight doesn't match the given flight");
assert(flight2.exitDate==flight.exitDate, "The returned flight doesn't match the given flight");
assert(flight2.reEntryDate==flight.reEntryDate, "The returned flight doesn't match the given flight");
assert(flight2.isOneway==flight.isOneway, "The returned flight doesn't match the given flight");

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

  var passenger = {
    type: null,
    countryCode: null, //according to country
    nationality:"Egypt",
    sex: null,
    birthDate: null,
    birthPlace: null,
    nationalID: null,
    authority: null,
    issueDate: null,
    expiryDate: null,
    points: null,
    membership: null,
    title: "Mr",
    firstName : "Jack",
    middleName: "Hamada",
    lastName: "Dawson",
    passportNumber: "A30100000",
    phoneNumber: "0010000000",
    email: "jackdawson@gmail.com"

  }

  it("should make sure that the posted object matches the object we're passing to the function", function(){

    db.postPassenger(passenger, function(err, postedPassenger){

    var nationalityMatches=false;
    if((passenger.nationality == postedPassenger.nationality))
    {
      nationalityMatches = true;
    }
    assert(nationalityMatches,"The posted object's nationality doesn't match with the object passed to the function")

    var titleMatches=false;
    if((passenger.title == postedPassenger.title))
    {
      titleMatches = true;
    }
    assert(titleMatches,"The posted object's title doesn't match with the object passed to the function")


    var firstNameMatches=false;
    if((passenger.firstName == postedPassenger.firstName))
    {
      firstNameMatches = true;
    }
    assert(firstNameMatches,"The posted object's first Name doesn't match with the object passed to the function")


    var middleNameMatches=false;
    if((passenger.middleName == postedPassenger.middleName))
    {
      middleNameMatches = true;
    }
    assert(middleNameMatches,"The posted object's middle Name doesn't match with the object passed to the function")

    var lastNameMatches=false;
    if((passenger.lastName == postedPassenger.lastName))
    {
      lastNameMatches = true;
    }
    assert(lastNameMatches,"The posted object's last Name doesn't match with the object passed to the function")


    var passportNumberMatches=false;
    if((passenger.passportNumber == postedPassenger.passportNumber))
    {
      passportNumberMatches = true;
    }
    assert(passportNumberMatches,"The posted object's passport Number doesn't match with the object passed to the function")


    var phoneNumberMatches=false;
    if((passenger.phoneNumber == postedPassenger.phoneNumber))
    {
    phoneNumberMatches = true;
    }
    assert(phoneNumberMatches,"The posted object's phone Number doesn't match with the object passed to the function")


    var emailMatches=false;
    if((passenger.email == postedPassenger.email))
    {
    emailMatches = true;
    }
    assert(emailMatches,"The posted object's email doesn't match with the object passed to the function")


    })
  })

});

// we will leave this one for now
describe("postBooking",function(){
  var booking =
  {
    refPassengerID: ["C673482992G"],
    exitDepartureUTC: "2016-04-12T07:00:00Z",
    reEntryDepartureUTC: null,
    issueDate: "2016-03-30T06:00:00Z",
    exitIsEconomy: true,
    reEntryIsEconomy: null,
    isOneWay: true,
    refExitFlightNumber: "1000",
    refReEntryFlightNumber: null,
    receiptNumber: "054"
  }
  it("should make sure that the booking object passed to the function matches the object posted to the database", function(){

db.postBooking(booking,function(err, postedBooking){

  var refPassengerIDmatches= false;
  if(booking.refPassengerID==postedBooking.refPassengerID)
  {
    refPassengerIDmatches=true;
  }
  assert(refPassengerIDmatches, "the booking object passed to the function doesn't match with the object posted to the database")


  var exitDepartureUTCmatches= false;
  if(booking.exitDepartureUTC==postedBooking.exitDepartureUTC)
  {
    exitDepartureUTCmatches=true;
  }
  assert(exitDepartureUTCmatches, "the booking object passed to the function doesn't match with the object posted to the database")


  var reEntryDepartureUTCMatches= false;
  if(booking.reEntryDepartureUTC==postedBooking.reEntryDepartureUTC)
  {
    reEntryDepartureUTCMatches=true;
  }
  assert(reEntryDepartureUTCMatches, "the booking object passed to the function doesn't match with the object posted to the database")


  var issueDatematches= false;
  if(booking.issueDate==postedBooking.issueDate)
  {
    issueDatematches=true;
  }
  assert(issueDatematches, "the booking object passed to the function doesn't match with the object posted to the database")

  var exitIsEconomymatches= false;
  if(booking.exitIsEconomy==postedBooking.exitIsEconomy)
  {
    exitIsEconomymatches=true;
  }
  assert(exitIsEconomymatches, "the booking object passed to the function doesn't match with the object posted to the database")


  var reEntryIsEconomymatches= false;
  if(booking.reEntryIsEconomy==postedBooking.reEntryIsEconomy)
  {
    reEntryIsEconomymatches=true;
  }
  assert(reEntryIsEconomymatches, "the booking object passed to the function doesn't match with the object posted to the database")



  var isOneWaymatches= false;
  if(booking.isOneWay==postedBooking.isOneWay)
  {
    isOneWaymatches=true;
  }
  assert(isOneWaymatches, "the booking object passed to the function doesn't match with the object posted to the database")



  var refExitFlightNumbermatches= false;
  if(booking.refExitFlightNumber==postedBooking.refExitFlightNumber)
  {
    refExitFlightNumbermatches=true;
  }
  assert(refExitFlightNumbermatches, "the booking object passed to the function doesn't match with the object posted to the database")




  var refReEntryFlightNumbermatches= false;
  if(booking.refReEntryFlightNumber==postedBooking.refReEntryFlightNumber)
  {
    refReEntryFlightNumbermatches=true;
  }
  assert(refReEntryFlightNumbermatches, "the booking object passed to the function doesn't match with the object posted to the database")



  var receiptNumberMatches= false;
  if(booking.receiptNumber==postedBooking.receiptNumber)
  {
    receiptNumberMatches=true;
  }
  assert(receiptNumberMatches, "the booking object passed to the function doesn't match with the object posted to the database")








})


  })

});

// we will leave this one for now
describe("updateFlight",function(){

});

// @ahmedlhanafy
// we should check some how if the db still contains collections or not
describe("clear",function(){

it("should make sure that the database is empty", function(){

})
});
