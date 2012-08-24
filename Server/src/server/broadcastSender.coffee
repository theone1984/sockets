{EventEmitter} = require 'events'
Datagram = require 'dgram'

class BroadcastSender extends EventEmitter
  BROADCAST_TIMEOUT = 2000

  @_socket = null
  @_bound = false

  constructor: (@_realIpAddress, @_tcpPort, @_multicastIpAddress, @_multicastPort) ->
    @_messageToBroadcast = new Buffer "http://#{_realIpAddress}:#{_tcpPort}"

    @_createClient()

  _createClient: =>
    console.log "Creating multicast socket #{@_multicastIpAddress}:#{@_multicastPort} routing to #{@_realIpAddress}:#{@_tcpPort}"

    @_socket = Datagram.createSocket 'udp4'
    @_socket.bind @_realIpAddress, @_multicastPort

    @_socket.on 'listening', @_listeningEventHandler
    @_socket.on 'error', @_errorEventHandler

  _listeningEventHandler: =>
    console.log 'Listening on multicast port'

    @_socket.setTTL 128
    @_socket.setBroadcast true
    @_socket.setMulticastTTL 128
    @_socket.setMulticastLoopback true
    @_socket.addMembership @_multicastIpAddress

    @_bound = true
    @emit 'bound'

  _errorEventHandler: (err) =>
    throw new Error(err) if err?

  start: =>
    throw new Error('The multicast socket has not been bound yet') unless @_bound
    console.log "Starting multicast, ping sent every #{BROADCAST_TIMEOUT} ms"

    @_broadcastContinuously()

  _broadcastContinuously: =>
    return unless @_bound

    messageLength = @_messageToBroadcast.length
    @_socket.send @_messageToBroadcast, 0, messageLength, @_multicastPort, @_multicastIpAddress, @_errorEventHandler


    setTimeout @_broadcastContinuously, BROADCAST_TIMEOUT

  stop: =>
    throw new Error('The multicast socket has already been released') if bound

    @_bound = false
    @_socket.close()

module.exports = BroadcastSender