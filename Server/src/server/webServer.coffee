module.exports = (express, http, ejs) ->

  Express = express ? require 'express'
  Http = http ? require 'http'
  Ejs = ejs ? require 'ejs'

  class Server
    constructor: (@_port) ->
      console.log "Creating webapp server for webapp on port #{@_port}"

      @_app = new Express()
      @_server = Http.createServer @_app

      @_configure()
      @_setHandlers()

    _configure: =>
      console.log 'Configuring webapp'

      @_app.use Express.bodyParser();
      @_app.use "/static", Express.static("#{__dirname}/../../res/static")
      @_app.set 'views', "#{__dirname}/../../res/views";
      @_app.engine '.html', Ejs.__express;

    _setHandlers: =>
      console.log 'Setting controller handlers for webapp'

      @_app.get '/', (req, res) ->
        res.render 'sockets.html'

    start: =>
      console.log 'Starting webapp'

      @_server.listen 8080

    getServer: =>
      @_server