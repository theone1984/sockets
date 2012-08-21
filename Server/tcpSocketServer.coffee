{EventEmitter} = require 'events'
Net = require 'net'

class TcpSocketServer extends EventEmitter
  @_server = null
  @_connection = null
  @_bufferedData = ''

  constructor: (@_port) ->

  start: =>
    console.log "Creating TCP socket server on port #{@_port}"
    @_server = Net.createServer @_connectEventHandler
    @_server.listen @_port, ->
      console.log 'TCP socket server bound'

  _connectEventHandler: (connection) =>
    console.log 'Client connected to TCP server'

    @_connection =  connection
    @_connection.on 'data', @_dataEventHandler
    @_connection.on 'end', @_disconnectEventHandler

  _dataEventHandler: (data) =>
    dataText = data.toString();

    unless dataText.charCodeAt(dataText.length - 1) == 0
      @_bufferedData += dataText
    else
      completeData = @_bufferedData + dataText.substr(0, dataText.length - 1)
      @_bufferedData = ''
      @emit 'data', completeData

  _disconnectEventHandler: =>
    console.log 'Client disconnected from TCP server'

    @_connection.removeAllListeners()
    @_connection = null

  write: (data) =>
    @_connection?.write data, 'utf8'

module.exports = TcpSocketServer