var http = require('http');
var express = require('express');
var ejs = require('ejs');
var sockets = require('./sockets.js');
var socketServer = require('./socket-server.js');

var dataCallbackFromSocket = function(data) {
    socketToClient.writeImage(data);
};

var serverSocket = socketServer.listen(9090, dataCallbackFromSocket);

var dataCallbackFromWebSocket = function(event) {
    console.log('Registered event ' + event);
    serverSocket.write(event);
};

var socketToClient = sockets.createSocket(dataCallbackFromWebSocket);

var app = express();
var server = http.createServer(app);
socketToClient.initialize(server);

app.use(express.bodyParser());
app.use("/static", express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');

app.engine('.html', ejs.__express);

app.get('/', function (req, res) {
    res.render('sockets.html');
});

server.listen(80);