var db = require('../db.js');
var express = require('express');
var router = express.Router();


// this route should return all the flights that matches the given params
router.get('/flights/search/:origin/:destination/:departingDate',function (req,res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;

//  var originAirport = db.get().getAirport(origin);
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate) {
      res.send(flights[i])
    }
      }
  res.send(req.params)
});


// not so sure about this one, but it's included in the sprint description
router.get('/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
  var returningDate = req.params.returningDate;
  var flightClass = req.params.class;
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate || flights[i].arrivalUTC == returningDate) {
      res.send(flights[i])
      }
        }
  res.send(req.params)

});

// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/oneway',function (req,res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate) {
      res.send(flights[i])
    }
      }
  res.send(req.body)
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/roundtrip', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var returningDate = req.body.returningDate;
  var flightClass = req.body.class;
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate || flights[i].arrivalUTC == returningDate) {
      res.send(flights[i])
      }
        }
  res.send(req.body)

})

module.exports = router;
