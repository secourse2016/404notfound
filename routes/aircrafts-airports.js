var db = require('../db.js');
var express = require('express');
var router = express.Router();
var airports = require('../mockdata/airports');


// this route should return all the airports from json file
router.get('/airports', function(req, res) {
  res.send(airports);
})

// this should return all the aircrafts
router.get('/aircrafts', function(req, res) {
})

// this should return one aircraft only specified in the id
router.get('/aircrafts/:id', function(req, res) {
    // this the id that will be sent to you from the client
    var flightId = req.params.id;
})

module.exports = router;
