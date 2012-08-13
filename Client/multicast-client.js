var dgram = require('dgram');

var LOCAL_BROADCAST_HOST = "224.0.0.114";
var LOCAL_BROADCAST_PORT = 8283;

var listenSocket = dgram.createSocket('udp4');
listenSocket.bind(LOCAL_BROADCAST_PORT);
listenSocket.addMembership(LOCAL_BROADCAST_HOST);

listenSocket.on('message', function(buf, info) {
    console.log(buf.toString() + ": " + info);
});




