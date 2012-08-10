var net = require('net');

exports.connect = function(port) {
    var connected = false;
    var client;

    var connect = function(port) {
        client = net.connect({port: port},
            function() {
                console.log('Connected to server');
                connected = true;
            }
        );

        client.on('data', function(data) {
            console.log('Data: ' + data.toString());
        });

        client.on('end', function() {
            console.log('Disconnected from server');
            connected = false;
        });
    };

    var write = function(data) {
        if (connected) {
            client.write(data);
        }
    };

    var isConnected = function() {
        return connected;
    };

    connect(port);

    return {
        write: write,
        isConnected: isConnected
    };
};