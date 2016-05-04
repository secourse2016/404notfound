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
var request = require('request');

// body parser used to get data from request's body

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', express.static('public/desktop'));

app.post('/stripe/internal/',function(req,res){
  var url = req.body.url;
  originalRes = res
  const options = {
    url : url,
    headers: {
      'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw',
    }
  };


  request.get(options,
    function(err, res, body) {
      console.log(err)
        console.log(res)
        originalRes.send(res.body)
    }

  );
})


app.use(cors());

// app.use(jwtAuth);



app.use('/api/', aircraftsAndAirports);
app.use('/api/', flights);
app.use('/', booking);

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
