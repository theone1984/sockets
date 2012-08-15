var events = require('events');
var datagram = require('dgram');

exports.createBroadcaster = function(realIp, tcpPort, multicastIp, multicastPort) {
    var broadcast_timeout = 1000;

    var socket = null;
    var messageToBroadcast = null;

    var bound = false;

    var socketReturned = null;

    (function __construct() {
        createReturnObject();

        messageToBroadcast = 'http://' + realIp + ':' + tcpPort;
        createClient();
    })();

    function createReturnObject() {
        socketReturned = new events.EventEmitter();
        socketReturned.start = start;
        socketReturned.stop = stop;
    }

    function createClient() {
        socket = datagram.createSocket('udp4');
        socket.bind(realIp, multicastPort);

        socket.on('listening', function() {
            socket.setTTL(128);
            socket.setBroadcast(true);
            socket.setMulticastTTL(128);
            socket.setMulticastLoopback(true);
            socket.addMembership(multicastIp);

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
        socket.send(message, 0, message.length, multicastPort, multicastIp, function(err) {
            if (err) throw err;
        });

        console.log("Broadcast sent");
    }

    function stop() {
        bound = false;
        client.close();
        client = null;
    }

    return socketReturned;
};