var db = require('../db.js');
var express = require('express');
var router = express.Router();


// this route should return all the flights that matches the given params
router.get('/flights/search/:origin/:destination/:departingDate',function (req,res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
  var approvedFlights=[];
//  var originAirport = db.get().getAirport(origin);
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate) {
      approvedFlights.push(flights[i])
    }
      }
      res.send(approvedFlights)
    //  res.send(req.params)
});


// not so sure about this one, but it's included in the sprint description
router.get('/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
  var origin = req.params.origin;
  var destination = req.params.destination;
  var departingDate = req.params.departingDate;
  var returningDate = req.params.returningDate;
  var flightClass = req.params.class;
  var flights=db.getFlights (origin,destination);
//  var length= flights.length;
  var approvedFlights = [];
  var approvedFlights2=[];
  res.send('outgoing Flights: ')
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate)  {
      if(flightClass == 'Economy'){
        if(flights[i].emptyEconomySeatsCount>1)
          approvedFlights.push(flights[i])
      }
      else{
        if(flights[i].emptyBusinessSeatsCount>1)
        approvedFlights.push(flights[i])
      }

      }
        }
        res.send(approvedFlights)
        res.send('returning Flights: ')
        for(var i = 0;i<flights.length;i++){
          if (flights[i].arrivalUTC == returningDate)  {
            if(flightClass == 'Economy'){
              if(flights[i].emptyEconomySeatsCount>1)
                approvedFlights2.push(flights[i])
            }
            else{
              if(flights[i].emptyBusinessSeatsCount>1)
              approvedFlights2.push(flights[i])
            }

            }
              }
              res.send(approvedFlights2)
              // res.send(req.params)

});

// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/oneway',function (req,res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var appFlights=[];
  var flights=db.getFlights (origin,destination);
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate) {
      appFlights.push(flights[i])
    }
      }
      res.send(appFlights)
    //  res.send(req.body)
});


// this is essentially the same function as the one above but this time it's a post request and the parameters are attached
// to the body instead of the url
router.post('/flights/search/roundtrip', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var departingDate = req.body.departingDate;
  var returningDate = req.body.returningDate;
  var flightClass = req.body.class;
  var approvedFlights=[];
  var approvedFlights2=[];
  var flights=db.getFlights (origin,destination);
  res.send('outgoing Flights: ')
  for(var i = 0;i<flights.length;i++){
    if (flights[i].departureUTC == departingDate) {
      if(flightClass == 'Economy'){
        if(flights[i].emptyEconomySeatsCount>1)
        approvedFlights.push(flights[i])
      }else{
        if(flights[i].emptyBusinessSeatsCount>1)
        approvedFlights.push(flights[i])
      }

      }
        }
        res.send(approvedFlights)
        res.send('returning Flights: ')
        for(var i = 0;i<flights.length;i++){
          if (flights[i].arrivalUTC == returningDate) {
            if(flightClass == 'Economy'){
              if(flights[i].emptyEconomySeatsCount>1)
              approvedFlights2.push(flights[i])

            }else{
              if(flights[i].emptyBusinessSeatsCount>1)
              approvedFlights2.push(flights[i])

            }

            }
              }
              res.send(approvedFlights2)
        //      res.send(req.body)

})

module.exports = router;
