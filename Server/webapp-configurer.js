var express = require('express');
var ejs = require('ejs');

exports.configure = function(app) {
    app.use(express.bodyParser());
    app.use("/static", express.static(__dirname + '/static'));
    app.set('views', __dirname + '/views');

    app.engine('.html', ejs.__express);

    app.get('/', function (req, res) {
        res.render('webSocketServerModule.html');
    });
}