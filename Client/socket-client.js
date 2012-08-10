var net = require('net');
var fs = require('fs');
var base64Encoder = require('./base64-encoder.js');

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

    var writeImage = function(imagePath) {
        fs.readFile(imagePath, function(err, data) {
            var encodedData = base64Encoder.encode(data);
            write(encodedData);
        });
    };

    var isConnected = function() {
        return connected;
    };

    connect(port);

    return {
        write: write,
        writeImage: writeImage,
        isConnected: isConnected
    };
};