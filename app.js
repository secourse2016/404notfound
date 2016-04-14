var express = require('express');
var util = require('util');
var app = express();
var fs = require('fs');
var aircraftsAndAirports = require('./routes/aircrafts-airports.js');
var flights = require('./routes/flights.js');
var booking = require('./routes/booking.js');
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var db = require('./db.js');



// the body parser is used to get the data from the body of the request
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.use('/', express.static('public'));


app.use('/api/v2/', aircraftsAndAirports);
app.use('/api/v2/', flights);
app.use('/api/v2/', booking);




app.get('/api/airports',function(req,res){
  fs.readFile('./mockdata/airports.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
});
app.get('/api/countries',function(req,res){
  fs.readFile('./mockdata/countries.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
});
app.get('/api/flights',function(req,res){
  fs.readFile('./mockdata/flights.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
})

app.get('/api/flight',function(req,res){
  fs.readFile('./mockdata/flights.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send([obj[0],obj[2],obj[3],obj[7]]);
  });
})

app.get('/api/aircrafts',function(req,res){
  fs.readFile('./mockdata/aircrafts.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
})


app.listen(port, '0.0.0.0', function(err) {
  //db.init(function(err, db) {
  //
  //   if (err)
  //     throw new Error('Cannot connect to database.');
  //
  //   else {
  //     // seed
  //   }
  //
  // });
  console.log("Started listening on %s",port);
});
