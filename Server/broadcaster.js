var util = require('util');
var net = require('net');
var datagram = require('dgram');

exports.createBroadcaster = function(ipAddress, port) {
    var broadcast_timeout = 2000;

    var socket = null;
    var messageToBroadcast = null;

    var broadcasting = false;

    (function __construct() {
        createClient();
        messageToBroadcast = ipAddress + ':' + port;
    })();

    function createClient() {
        socket = datagram.createSocket('udp4');

        socket.bind();
        socket.setTTL(1);
        socket.setBroadcast(true);
        socket.setMulticastTTL(1);
        socket.setMulticastLoopback(true);
    }

    function start() {
        if (socket === null) {
            throw new Error('The broadcaster cannot be restarted');
        }

        broadcasting = true;
        broadcastContinuously();
    }

    function broadcastContinuously() {
        if (!broadcasting) {
            return;
        }

        broadcastMessage();
        setTimeout(broadcastContinuously, broadcast_timeout);
    }

    function broadcastMessage() {
        var message = new Buffer(messageToBroadcast);
        socket.send(message, 0, message.length, port, ipAddress, function(err) {
            if (err) throw err;
        });

        console.log("Broadcast sent");
    }

    function stop() {
        broadcasting = false;
        stop();
        client.close();
        client = null;
    }

    return {
        start: start,
        stop: stop
    }
}