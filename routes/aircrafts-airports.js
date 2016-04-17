var db = require('../db.js');
var express = require('express');
var router = express.Router();
var airports = require('../mockdata/airports');


// this route should return all the airports from the database
router.get('/airports', function(req, res) {
  db.getAirports(function(err, airports){
    res.send(airports);
  });
})

// this should return one airport only specified in the id
router.get('/airports/:id', function(req, res) {
    // this the id that will be sent to you from the client
    var iata = req.params.id;
    db.getAirport(iata, function(err, airport){
      res.send(airport);
    });
})

// this should return all the aircrafts
router.get('/aircrafts', function(req, res) {
  db.getAircrafts(function(err, aircrafts){
    res.send(aircrafts);
  });
})

// this should return one aircraft only specified in the id
router.get('/aircrafts/:tailNumber', function(req, res) {
    // this the id that will be sent to you from the client
    var tailNumber = req.params.tailNumber;
    db.getAircraft(tailNumber, function(err, aircraft){
      res.send(aircraft);
    });
})


module.exports = router;
