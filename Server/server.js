var httpModule = require('http');
var expressModule = require('express');

var ipDeterminerModule = require('./ip-determiner.js');
var broadcasterModule = require('./broadcaster.js');

var webSocketServerModule = require('./websocket-server.js');
var socketServerModule = require('./socket-server.js');
var webappConfigurerModule = require('./webapp-configurer.js');

(function program() {
    var broadcaster;
    var serverSocket;
    var browserSocket;

    var app;
    var server;

    (function __construct() {
        ipDeterminerModule.getIpAddresses(onIpAddressAvailable);
    })();

    function onIpAddressAvailable(error, ipAddresses) {
        var foundIp = ipAddresses[0];
        console.log('Using IP address ' + foundIp + ' for broadcast');

        startServer();
        startBroadcast(foundIp);
    }

    function startBroadcast(foundIp) {
        broadcaster = broadcasterModule.createBroadcaster(foundIp, 9090, '225.2.2.114', 8283);
        broadcaster.on('bound', function() {
            broadcaster.start();
        });
    }

    function startServer() {
        serverSocket = socketServerModule.listen(9090, dataCallbackFromSocket);
        browserSocket = webSocketServerModule.createSocket(dataCallbackFromWebSocket);

        app = expressModule();
        server = httpModule.createServer(app);
        browserSocket.initialize(server);

        webappConfigurerModule.configure(app);

        server.listen(8080);
    }

    function dataCallbackFromSocket(data) {
        browserSocket.writeImage(data);
    }

    function dataCallbackFromWebSocket(event) {
        console.log('Registered event ' + event);
        serverSocket.write(event);
    }
})();