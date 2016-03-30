var express = require('express');
var util = require('util');
var app = express();


app.use('', express.static('public'));

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
