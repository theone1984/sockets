var fs = require('fs');
var io = require('socket.io');

exports.createSocket = function(dataCallback) {
    var ioManager;
    var serverSocket;
    var started = false;

    var initialize = function(server) {
        ioManager = io.listen(server);
        setConnectionListener();
    };

    var setConnectionListener = function () {
        ioManager.sockets.on('connection', function(socket) {
            socket.on('data', getData);

            serverSocket = socket;
            started = true;
        });
    };

    var getData = function(data) {
        if (data === undefined || data === null ||
            data.type === undefined || data.type === null) {
            return;
        }
        if (typeof dataCallback !== 'function') {
            return;
        }

        console.log('Got data from client: ' + data.type);

        dataCallback.call(this, data.type);
    };

    var write = function(message) {
        if(started) {
            serverSocket.emit('data', { 'message': message });
        }
    };

    var writeImage = function(imageData) {
        if(started) {
            serverSocket.emit('image', { 'data': imageData });
        }
    };

    return {
        initialize: initialize,
        write: write,
        writeImage: writeImage
    };
};