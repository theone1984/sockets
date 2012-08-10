var fs = require('fs');
var io = require('socket.io');

exports.createSocket = function() {
    var ioManager;
    var serverSocket;
    var started = false;

    var initialize = function(server) {
        ioManager = io.listen(server);
        setConnectionListener();
    };

    var setConnectionListener = function () {
        ioManager.sockets.on('connection', function(socket) {
            serverSocket = socket;
            started = true;
        });
    };

    var write = function(message) {
        if(started) {
            serverSocket.emit('data', { 'message': message });
        }
    };

    return {
        "initialize": initialize,
        "write": write
    };
};