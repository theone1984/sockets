$ ->
  socket = io.connect '/'
  socket.on 'image', (data) ->
    $('#main-image').attr 'src', data.data

  $('#button-switch-camera').bind 'click', ->
    socket.emit 'data', type: 'switch-camera'