class Animal
  constructor: (@name) ->
    @move()

  move: (meters) ->
    console.log @name + " moved #{meters}m."

class Snake extends Animal
  move: ->
    console.log "Slithering..."
    super 5

sam = new Snake "Sammy the Python"