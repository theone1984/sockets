describe 'Webserver tests', ->

  # Express is a function/object hybrid which isn't supported by CoffeeScript natively
  express = mockFunction()
  express.bodyParser = mockFunction()
  express.static = mockFunction()

  expressApp =
    use: mockFunction()
    set: mockFunction()
    engine: mockFunction()
    get: mockFunction()

  ejs =
    __express: 'express'

  http =
    createServer: mockFunction()

  httpServer =
    listen: mockFunction()

  webServer = require('../../src/server/webServer')(express, http, ejs)

  server = null

  beforeEach ->
    upon(express)().thenReturn expressApp
    upon(http.createServer)().thenReturn httpServer

    upon(express.bodyParser)().thenReturn 'bodyParser'
    upon(express.static)().thenReturn 'static'

    server = new webServer 80

  it 'tests the initial configuration', ->
    verify(express)()
    verify(http.createServer) expressApp

    verify(expressApp.use) 'bodyParser'
    verify(expressApp.use) '/static', 'static'

    #TODO why does anything() not work?
    #verify(expressApp.set) anything(), anything()

  it "is a simple mock test", ->
    mockedObject = mock Array
    mockedObject.push "one"
    verify(mockedObject).push "one"