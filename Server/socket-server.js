var net = require('net');

exports.listen = function(port, dataCallback) {
    var socket = null;

    var server = net.createServer(function(connection) {
        var bufferedData = "";
        console.log('client connected');

        connection.on('data', function(data) {
            var dataText = data.toString();

            if (dataText.charCodeAt(dataText.length - 1) !== 0) {
                bufferedData += dataText;
                return;
            } else {
                bufferedData += dataText.substr(0, dataText.length - 1);
            }

            var completeData = bufferedData;
            bufferedData = "";

            console.log('data received!');
            dataCallback.call(this, completeData);
        });

        connection.on('end', function() {
            console.log('client disconnected');
        });

        socket = connection;
    });

    var write = function(data) {
        if (socket !== null) {
            socket.write(data, 'utf8');
        }
    };

    server.listen(port, function() {
        console.log('server bound');
    });

    return {
        write: write
    };
};