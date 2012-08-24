// Jasmine integration
var jasmine = require('jasmine-node');
var sys = require('sys');

// JSMockito integration
var jsMockito = require('jsmockito').JsMockito;
jsMockito.Integration.Nodeunit();

for(var key in jasmine) {
    global[key] = jasmine[key];
}

var isVerbose = true;
var showColors = true;

process.argv.forEach(function(arg){
    switch(arg) {
        case '--color': showColors = true; break;
        case '--noColor': showColors = false; break;
        case '--verbose': isVerbose = true; break;
    }
});

jasmine.executeSpecsInFolder(__dirname + '/../../bin/test/server', function(runner, log){
    if (runner.results().failedCount == 0) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
}, isVerbose, showColors);