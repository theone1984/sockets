var socketClient = require('./socket-client.js');
var readLine = require('readline');

var client = socketClient.connect(9090);

var rl = readLine.createInterface({
    input:process.stdin,
    output:process.stdout
});

var askForNexToken = function() {
    rl.question("Whicht token to send?", function(answer) {
        console.log("Sending token: '", answer, "'");
        client.write(answer);
        askForNexToken();
    });
};

askForNexToken();









