
class Server
  express = require 'express'
  http = require 'http'
  ejs = require 'ejs'

  constructor: (@port) ->
    console.log 'Creating server for webapp'

    @app = express()
    @server = http.createServer @app

    @configure()
    @setHandlers()

  start: =>
    console.log 'Starting webapp'
    @server.listen 8080

  configure: =>
    console.log 'Configuring webapp'
    @app.use express.bodyParser();
    @app.use "/static", express.static("#{__dirname}/static")
    @app.set 'views', "#{__dirname}/views";
    @app.engine '.html', ejs.__express;

  setHandlers: =>
    console.log 'Setting controller handlers for webapp'
    @app.get '/', (req, res) ->
      res.render 'sockets.html'

module.exports = Server