var broadcaster = require('./broadcaster.js');

var socket = broadcaster.createBroadcaster('192.168.0.103', '225.2.2.114', 8283);

socket.on('bound', function(data) {
    socket.start();
});



//var dgram = require('dgram');
//
//var ip = "192.168.0.104";
//var group = "225.2.2.114";
//var port = 8283;
//
//var sendSocket = dgram.createSocket('udp4');
//sendSocket.bind(ip, port);
//
//sendSocket.on('listening', function () {
//    console.log('listening');
//
//    sendSocket.setTTL(128);
//    sendSocket.setBroadcast(true);
//    sendSocket.setMulticastTTL(128);
//    sendSocket.setMulticastLoopback(true);
//    sendSocket.addMembership(group);
//
//    sendContinuously();
//});
//
//sendSocket.on('close', function () {
//    console.error('[PARENT] sendSocket closed');
//});
//
//sendSocket.on('error', function (err) {
//    if (err) throw err;
//});
//
//function sendContinuously() {
//    console.log("Sending");
//    var buffer = new Buffer('bladiblubb');
//    sendSocket.send(buffer, 0, buffer.length, port, group, function (err) {
//        if (err) throw err;
//    });
//    setTimeout(sendContinuously, 1000);
//}