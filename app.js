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
var cors = require('cors');
// body parser used to get data from request's body
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use('/', express.static('public/desktop'));

app.use(cors());

app.use(jwtAuth);



app.use('/api/', aircraftsAndAirports);
app.use('/api/', flights);
app.use('/api/', booking);

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
