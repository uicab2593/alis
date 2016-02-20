var net = require('net');

function onConect(socket) {
    socket.on('data', function (data) {
        socket.write('echo: ' + data);
    });
}

module.export = {
	runTcpServer: function(){
		net.createServer(onConect).listen(1337,'0.0.0.0')
	}
}
