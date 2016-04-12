var db = require('../db.js');
var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();


// the body parser is used to get the data from the body of the request
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));




// this route should return all the flights that matches the given params
router.get('flights/search/:origin/:destination/:departingDate',function (req,res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
});


// not so sure about this one, but it's included in the sprint description
app.get('flights/search/:origin/:destination/:departingDate/returningDate/:class', function(req, res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
  var returningDate = req.params.returningDate;
  var flightClass = req.params.class;

})

// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('flights/search/oneway',function (req,res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
app.post('flights/search/roundtrip', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var returningDate = req.body.returningDate;
  var flightClass = req.body.class;

})
