
#Server = require './webServer'
#
#server = new Server 8080
#server.start()

BroadcastSender = require './broadcastSender'
broadcastSender = new BroadcastSender '192.168.0.104', 9090, '225.2.2.114', 8283

broadcastSender.on 'bound', ->
  console.log 'Broadcast sender bound'
  broadcastSender.start()

