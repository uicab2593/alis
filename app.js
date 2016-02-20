var express = require('express');
var app = express();
var telnet = require('./telnet');

app.get('/', function (req, res) {
  res.send('Hola Alis!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});