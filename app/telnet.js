var net = require('net');

module.exports = function(io){
		var onConect = 
		function onConect(socket) {
			socket.on('data', function (data) {
				io.emit('signal',data.toString());
				// socket.write('echo: ' + data);
			});
		}
		net.createServer(onConect).listen(1337,'0.0.0.0')
	};