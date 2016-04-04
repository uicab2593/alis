var net = require('net');

module.exports = function(io){
		var onConect = 
		function (socket) {
			socket.on('data', function (data) {
				// console.log(data.toString());
				io.emit('signal',data.toString());
			});
		};
		net.createServer(onConect).listen(1337,'0.0.0.0');
		io.on('connection', function(socket){
		 socket.on('message', function(message){
		 	io.emit('message',message);
		    console.log(message);
		  });
		});
	};