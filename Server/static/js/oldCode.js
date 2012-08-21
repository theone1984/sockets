$(function() {
    var socket = io.connect('/');
    socket.on('image', function (data) {
        $('#main-image').attr('src', data.data);
    });

    $('#button-switch-camera').bind('click', function() {
        socket.emit('data', { type: 'switch-camera' });
    });
})
