var express               = require('express');
var util                  = require('util');
var app                   = express();
var fs                    = require('fs');
var aircraftsAndAirports  = require('./routes/aircrafts-airports.js');
var flights               = require('./routes/flights.js');
var booking               = require('./routes/booking.js');
var port                  = process.env.PORT || 8080;
var bodyParser            = require('body-parser');
var db                    = require('./db.js');
var jwtAuth               = require('./jwt-auth.js');

// body parser used to get data from request's body
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use('/', express.static('public/desktop'));

app.use(jwtAuth);


app.use('/api/', aircraftsAndAirports);
app.use('/api/', flights);
app.use('/api/', booking);

// app.get('/api/airports', function(req, res) {
//   fs.readFile('./mockdata/airports.json', 'utf8', function(err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//     res.send(obj);
//   });
// });
//
// app.get('/api/countries', function(req, res) {
//   fs.readFile('./mockdata/countries.json', 'utf8', function(err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//     res.send(obj);
//   });
// });
//
// app.get('/api/flights', function(req, res) {
//   fs.readFile('./mockdata/flights.json', 'utf8', function(err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//     res.send(obj);
//   });
// });
//
// app.get('/api/flight', function(req, res) {
//   fs.readFile('./mockdata/flights.json', 'utf8', function(err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//     res.send([obj[0], obj[2], obj[3], obj[7]]);
//   });
// })
//
// app.get('/api/aircrafts', function(req, res) {
//   fs.readFile('./mockdata/aircrafts.json', 'utf8', function(err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//     res.send(obj);
//   });
// });

db.init(function(err) {
  if (err)
    throw new Error('Error occurred. Cannot connect to Mongo.');
  else {
    db.seed(function(seeded) {
      if (seeded)
        console.log('Database not found. New database created & populated.');
      else
        console.log('Database found.');
    });
  }
});

app.listen(port, '0.0.0.0', function(err) {
  console.log("Started listening on %s", port);
});
