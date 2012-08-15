var broadcaster = require('./broadcaster.js');

var socket = broadcaster.createBroadcaster('192.168.0.104', 9090, '225.2.2.114', 8283);

socket.on('bound', function() {
    socket.start();
});