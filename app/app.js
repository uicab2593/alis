var express = require('express');
var app = express();
var http = require('http').Server(app);
var telnet = require('./telnet');
var io = require('socket.io')(http);

app.use(express.static('web'));
app.get('/', function (req, res) {
	res.sendFile(__dirname+'/web/index.html');
});
app.get('/messages/get', function (req, res) {
});
app.get('/messages/save', function (req, res) {
});
// app.use(express.static('web'));
// io.on('connection', function(socket){
// });

// telnet(io);

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
