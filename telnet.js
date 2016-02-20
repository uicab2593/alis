var net = require('net');

function onConect(socket) {
    socket.on('data', function (data) {
        socket.write('echo: ' + data);
    });
}
//forma abreviada.
net.createServer(onConect).listen(1337, '0.0.0.0')
