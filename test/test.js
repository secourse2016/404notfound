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

});

// @yassmine
//this one we should make sure that the returned airport matches the iata given to the function
describe("getAirport", function() {

});
// @yassmine
//this one we should make sure that the returned aircraft matches the tailNumber given to the function
describe("getAircraft", function() {

});

// @yassmine
// Here we should test for the number of aircrafts which we know
describe("getAircrafts", function() {

});

// @yassmine
//here we can check if the returning object is array
describe("getCountries", function() {

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

});
