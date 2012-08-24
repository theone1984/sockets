IpDeterminer = require './ipDeterminer'
BroadcastSender = require './broadcastSender'
WebServer = require './webServer'
TcpSocketServer = require './tcpSocketServer'
WebSocketServer = require './webSocketServer'

class Starter
  TCP_PORT = 9090
  HTTP_PORT = 8080
  MULTICAST_PORT = 8283

  MULTICAST_ADDRESS = '225.2.2.114'

  @_ipDeterminer = null
  @_broadcastSender = null
  @_tcpSocketServer = null
  @_webSocketServer = null
  @_webServer = null

  constructor: ->
    @_determineIp()

  _determineIp: =>
    @_ipDeterminer = new IpDeterminer()
    @_ipDeterminer.on 'ip', @_ipEventHandler
    @_ipDeterminer.start()

  _ipEventHandler: (foundAddresses) =>
    console.log "Found #{foundAddresses.length} ip address/es"
    return if foundAddresses.length is 0
    usedIp = foundAddresses[0]
    console.log "Using IP address '#{usedIp}'"

    @_startBroadcast(usedIp)

  _startBroadcast: (realIp) =>
    @_broadcastSender = new BroadcastSender realIp, TCP_PORT, MULTICAST_ADDRESS, MULTICAST_PORT
    @_broadcastSender.on 'bound', @_broadcastBoundEventHandler

  _broadcastBoundEventHandler: =>
    console.log 'Broadcast sender bound'
    @_broadcastSender.start()

    @_startServer()
    @_startWebSocketServer()
    @_startTcpSocketServer()

  _startServer: =>
    @_webServer = new WebServer HTTP_PORT
    @_webServer.start()

  _startWebSocketServer: =>
    @_webSocketServer = new WebSocketServer()
    @_webSocketServer.on 'switch-camera', @_webSocketSwitchCameraEventHandler

    @_webSocketServer.start @_webServer.getServer()

  _startTcpSocketServer: =>
    @_tcpSocketServer = new TcpSocketServer TCP_PORT
    @_tcpSocketServer.on 'data', @_tcpSocketDataEventHandler

    @_tcpSocketServer.start()

  _webSocketSwitchCameraEventHandler: (data) =>
    console.log 'Registered a switch camera event'
    @_tcpSocketServer.write 'switch-camera'

  _tcpSocketDataEventHandler: (data) =>
    @_webSocketServer.writeImage data

new Starter()