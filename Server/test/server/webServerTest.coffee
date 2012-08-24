
require('../../src/server/webServer')

describe "A webserver test 1", ->

  beforeEach ->

  it "should perform a simple addition correctly", ->
    result = 1 + 2
    expect(result).toEqual 3

    console.log module.exports