events = require 'events'
datagram = require 'dgram'

#TODO extend EventEmitter

class BroadcastSender extends events.EventEmitter
  BROADCAST_TIMEOUT = 2000

  bound = false
  socket = null

  realIpAddress = null
  tcpPort = 0

  multicastIpAddress = null
  multicastPort =  0

  messageToBroadcast = null

  constructor: (_realIpAddress, _tcpPort, _multicastIpAddress, _multicastPort) ->
    realIpAddress = _realIpAddress
    tcpPort = _tcpPort
    multicastIpAddress = _multicastIpAddress
    multicastPort = _multicastPort

    messageToBroadcast = new Buffer "http://#{_realIpAddress}:#{_tcpPort}"

    createClient()

  createClient = ->
    console.log "Creating socket #{multicastIpAddress}:#{multicastPort} -> #{realIpAddress}:#{tcpPort}"

    socket = datagram.createSocket 'udp4'
    socket.bind realIpAddress, multicastPort

    socket.on 'listening', listeningEventHandler
    socket.on 'error', errorEventHandler

  listeningEventHandler = ->
    console.log 'Listening on multicast port'

    socket.setTTL 128
    socket.setBroadcast true
    socket.setMulticastTTL 128
    socket.setMulticastLoopback true
    socket.addMembership multicastIpAddress
    bound = true

  errorEventHandler = (err) ->
    throw new Error(err) if err?

  start : =>
    throw new Error('The socket has not been bound yet') unless bound

    broadcastContinuously()

  broadcastContinuously = ->
    return unless bound

    socket.send messageToBroadcast, 0, messageToBroadcast.length, multicastPort, multicastIpAddress, errorEventHandler
    console.log 'Broadcast sent'

    setTimeout broadcastContinuously, BROADCAST_TIMEOUT

  stop : =>
    throw new Error('The socket has already been released') if bound

    bound = false
    socket.close()

module.exports = BroadcastSender