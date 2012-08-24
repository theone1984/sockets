
require('../../src/server/webServer')

describe "A webserver test 1", ->

  beforeEach ->

  it "is a simple mock test", ->
    mockedObject = mock Array
    mockedObject.push "one"
    verify(mockedObject).push "one"