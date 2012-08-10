var net = require('net');

exports.listen = function(port, dataCallback) {
    var server = net.createServer(function(connection) {
        console.log('client connected');

        connection.on('data', function(data) {
            console.log('data received: ' + data.toString());
            dataCallback.call(this, data.toString());
        });

        connection.on('end', function() {
            console.log('client disconnected');
        });
    });
    server.listen(port, function() {
        console.log('server bound');
    });
};