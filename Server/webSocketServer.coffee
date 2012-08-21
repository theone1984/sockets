{EventEmitter} = require 'events'
FileSystem = require 'fs'
SocketIO = require 'socket.io'

class WebSocketServer extends EventEmitter
  @_server = null
  @_connection = null

  constructor: ->

  start: (server) =>
    console.log 'Creating websocket for web server'

    @_server = SocketIO.listen server
    @_server.set 'log level', 1
    @_server.sockets.on 'connection', @_connectEventHandler

  _connectEventHandler: (connection) =>
    console.log 'Client connected to websocket'

    @_connection =  connection
    @_connection.on 'data', @_dataEventHandler
    @_connection.on 'end', @_disconnectEventHandler

  _dataEventHandler: (data) =>
    return unless data?.type?
    @emit data.type, data

  _disconnectEventHandler: =>
    console.log 'Client disconnected from websocket'

    @_connection.removeAllListeners() if connection?
    @_connection = null

  write: (message) =>
    @_connection?.emit 'data', 'message': message

  writeImage: (imageData) =>
    @_connection?.emit 'image', 'data': imageData

module.exports = WebSocketServer