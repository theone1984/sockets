{EventEmitter} = require 'events'
ChildProcess = require 'child_process'

exec = ChildProcess.exec

class IpDeterminer extends EventEmitter
  IGNORED_ADDRESS = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

  @_command = null
  @_ipFilter = null

  constructor: ->
    @_determineVariables()

  _determineVariables: =>
    switch process.platform
      when 'win32'
        @_command = 'ipconfig'
        @_ipFilter = /IP(?:v[46])?-?[^:\r\n]+:\s*([^\s]+)/g
      when 'darwin'
        @_command = 'ifconfig'
        @_ipFilter = /\binet\s+([^\s]+)/g;
      else
        @_command = 'ifconfig'
        @_ipFilter = /\binet\b[^:]+:\s*([^\s]+)/g

  start: =>
    exec @_command, @_execEventHandler

  _execEventHandler: (error, stdout, sterr) =>
    matches = stdout.match(@_ipFilter) || []

    foundMatches = for match in matches
      ip = match.replace @_ipFilter, '$1'
      continue if IGNORED_ADDRESS.test ip
      ip

    @emit 'ip', foundMatches

module.exports = IpDeterminer