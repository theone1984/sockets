var http = require('http');
var express = require('express');
var ejs = require('ejs');
var sockets = require('./sockets.js');
var socketServer = require('./socket-server.js');

var app = express();
var server = http.createServer(app);
var socketToClient = sockets.createSocket();

app.use(express.bodyParser());
app.use("/static", express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');

app.engine('.html', ejs.__express);

app.get('/', function (req, res) {
    res.render('sockets.html');
});

var dataCallback = function(data) {
    socketToClient.writeImage(data);
};

socketToClient.initialize(server);
server.listen(80);
socketServer.listen(9090, dataCallback);