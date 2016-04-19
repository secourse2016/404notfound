var db = require('../db.js');
var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
var endpointsUrls = require('../endpoints.json');
var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"



// this route should return all the flights that matches the given params
router.get('/flights/search/:origin/:destination/:departingDate/:class', function(req, res) {
    var origin = req.params.origin;
    var destination = req.params.destination;
    var departingDate = new Date(parseInt(req.params.departingDate, 10));
    var flightClass = req.params.class;
    var originalRes = res;
    var result = {
        outgoingFlights: [],
        returnFlights: []
    };
    db.getFlights(origin, destination, departingDate, null, true, function(err, flights) {
        if (err)
            console.log(err);
        if (req.headers['website'] == 'AirBerlin' && req.headers['otherHosts'] == 'false') {
            res.send(flights);
        } else if( req.headers['otherHosts'] == 'true'){
            function httpGet(url, callback) {
                const options = {
                    uri: url + '/api/flights/search/' + origin + "/" + destination + "/" + req.params.departingDate + "/" + flightClass,

                    headers: {
                        'x-access-token': accessToken,
                    },
                    json: true
                };
                request(options,
                    function(err, res, body) {
                      console.log(err + options.uri)

                        callback(err, res);
                    }

                );
            }

            async.map(endpointsUrls, httpGet, function(err, res) {
                if (err) {
                    originalRes.send(err)
                    return console.log(err);
                }
                parseResutl(res);

            })

            function parseResutl(res) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].body.outgoingFlights)
                        result.outgoingFlights.push(res[i].body.outgoingFlights)
                    if (res[i].body.returnFlights)
                        result.returnFlights.push(res[i].body.returnFlights)
                }
                result.outgoingFlights = [].concat.apply([], result.outgoingFlights);
                result.returnFlights = [].concat.apply([], result.returnFlights);

                originalRes.send(result)
            }

            // async.parallel(result,function(){
            //     res.send(result);
            //   })
        }else{
          res.send(flights)
        }

    });

});


// not so sure about this one, but it's included in the sprint description
router.get('/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
    var origin = req.params.origin;
    var destination = req.params.destination;
    var departingDate = new Date(parseInt(req.params.departingDate, 10));
    var returningDate = new Date(parseInt(req.params.returningDate, 10));

    var flightClass = req.params.class;

    db.getFlights(origin, destination, departingDate, returningDate, false, function(err, flights) {
        if (err)
            console.log(err);

        if (req.headers['website'] == 'AirBerlin') {
            res.send(flights);
        } else {

        }

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
