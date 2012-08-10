var socketClient = require('./socket-client.js');
var readLine = require('readline');

var client = socketClient.connect(9090);

var rl = readLine.createInterface({
    input:process.stdin,
    output:process.stdout
});

var askForNexToken = function() {
    rl.question("Whicht file to send?", function(filePath) {
        console.log("Sending image from path: '", filePath, "'");
        client.writeImage(filePath);
        askForNexToken();
    });
};

askForNexToken();







