var express = require('express');
var app = express();
var http = require('http').Server(app);
var telnet = require('./telnet');
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/views/index.html');
});

// io.on('connection', function(socket){
// });

telnet.runTcpServer(io);

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
