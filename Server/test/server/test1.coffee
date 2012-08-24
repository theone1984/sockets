describe "A simple test", ->
  result = null

  beforeEach ->

  it "should perform a simple addition correctly", ->
    result = 1 + 2
    expect(result).toEqual 3
