var db = require('../db.js');
var express = require('express');
var router = express.Router();


// this route should return all the flights that matches the given params
router.get('/flights/search/:origin/:destination/:departingDate', function(req, res) {
    var origin = req.params.origin;
    var destination = req.params.destination;
    var departingDate = req.params.departingDate;

    db.getFlights(origin, destination, departingDate, null, true, function(err, flights) {
        if (err)
            console.log(err);
        res.send(flights);

    });

});


// not so sure about this one, but it's included in the sprint description
router.get('/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
    var origin = req.params.origin;
    var destination = req.params.destination;
    var departingDate = req.params.departingDate;
    var returningDate = req.params.returningDate;
    var flightClass = req.params.class;

    db.getFlights(origin, destination, departingDate, returningDate, false, function(err, flights) {
        if (err)
            console.log(err);
        
        res.send(flights);

    });
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/oneway', function(req, res) {
    var origin = req.body.origin;
    var destination = req.body.destination;
    var departingDate = req.body.departingDate;

    db.getFlights(origin, destination, departingDate, null, true, function(err, flights) {
        if (err) console.log(err);
        res.send(flights);

    });
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/roundtrip', function(req, res) {
    var origin = req.body.origin;
    var destination = req.body.destination;
    var departingDate = req.body.departingDate;
    var returningDate = req.body.returningDate;
    var flightClass = req.body.class;
    db.getFlights(origin, destination, departingDate, returningDate, false, function(err, flights) {
        if (err) console.log(err);
        res.send(flights);


    });


})

module.exports = router;
