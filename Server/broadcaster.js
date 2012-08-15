var events = require('events');
var datagram = require('dgram');

exports.createBroadcaster = function(ipAddress, group, port) {
    var broadcast_timeout = 1000;

    var socket = null;
    var messageToBroadcast = null;

    var bound = false;

    var socketReturned;

    (function __construct() {
        createReturnObject();

        messageToBroadcast = ipAddress + ':' + port;
        createClient();
    })();

    function createReturnObject() {
        socketReturned = new events.EventEmitter();
        socketReturned.start = start;
        socketReturned.stop = stop;
    }

    function createClient() {
        socket = datagram.createSocket('udp4');
        socket.bind(ipAddress, port);

        socket.on('listening', function() {
            socket.setTTL(128);
            socket.setBroadcast(true);
            socket.setMulticastTTL(128);
            socket.setMulticastLoopback(true);
            socket.addMembership(group);

            bound = true;

            socketReturned.emit('bound');
        });
        socket.on('error', function(err) {
            if (err) throw err;
        });
    }

    function start() {
        if (!bound) {
            throw new Error('The broadcaster cannot be restarted');
        }

        broadcastContinuously();
    }

    function broadcastContinuously() {
        broadcastMessage();
        setTimeout(broadcastContinuously, broadcast_timeout);
    }

    function broadcastMessage() {
        var message = new Buffer(messageToBroadcast);
        socket.send(message, 0, message.length, port, group, function(err) {
            if (err) throw err;
        });

        console.log("Broadcast sent");
    }

    function stop() {
        bound = false;
        stop();
        client.close();
        client = null;
    }

    return socketReturned;
}