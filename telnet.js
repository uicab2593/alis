var net = require('net');
 
var server = net.createServer(function (socket) {
	socket.write('Welcome to the Telnet server!');
	socket.on('data',function(data){
		console.log(data);
	});
}).listen(8888);