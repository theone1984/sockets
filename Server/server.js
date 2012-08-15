var httpModule = require('http');
var expressModule = require('express');

var ipDeterminerModule = require('./ip-determiner.js');
var broadcasterModule = require('./broadcaster.js');

var webSocketServerModule = require('./websocket-server.js');
var socketServerModule = require('./socket-server.js');
var webappConfigurerModule = require('./webapp-configurer.js');

(function program() {
    var broadcaster;

    (function __construct() {
        ipDeterminerModule.getIpAddresses(onIpAddressAvailable);
    })();

    function onIpAddressAvailable(error, ipAddresses) {
        console.log('Using IP address ' + ipAddresses[0] + ' for broadcast');
        startBroadcast();
        //startServer();
    }

    function startBroadcast() {
        broadcaster = broadcasterModule.createBroadcaster("225.2.2.114", 8283);
        broadcaster.start();
    }

    function startServer() {
        var serverSocket = socketServerModule.listen(9090, dataCallbackFromSocket);
        var browserSocket = webSocketServerModule.createSocket(dataCallbackFromWebSocket);

        var app = expressModule();
        var server = httpModule.createServer(app);
        browserSocket.initialize(server);

        webappConfigurerModule.configure(app);

        server.listen(80);
    }

    function dataCallbackFromSocket(data) {
        socketToClient.writeImage(data);
    }

    function dataCallbackFromWebSocket(event) {
        console.log('Registered event ' + event);
        serverSocket.write(event);
    }


})();