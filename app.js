var express = require('express');
var util = require('util');
var app = express();
var fs = require('fs');




app.get('/api/airports',function(req,res){
  fs.readFile('./mockdata/airports.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
})

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
    res.send(obj[0]);
  });
})

app.use('/', express.static('public'));

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});
