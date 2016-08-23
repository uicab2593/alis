var net = require('net');

var tcpCon = {};
tcpCon.run = function(io){
		var onConect = function (socket) {
			tcpCon.socket = socket;
			socket.on('data', function (data) {
				console.log(data.toString());
				io.emit('signal',data.toString());
			});
		};

		net.createServer(onConect).listen(1337,'0.0.0.0');

		io.on('connection', function(socket){
		 socket.on('pushmessage', function(message){
		 	io.emit('pushmessage',message);
		  });
		});
	};

module.exports = tcpCon;