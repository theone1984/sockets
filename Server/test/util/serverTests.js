// Jasmine integration
var jasmine = require('jasmine-node');
var sys = require('sys');

// Jasmine global method integration
for(var key in jasmine) {
    global[key] = jasmine[key];
}

// JSMockito global method integration
var jsMockito = require('jsmockito').JsMockito;
jsMockito.Integration.Nodeunit();
global['upon'] = jsMockito.when;

// Hamcrest global method integrat  ion
var jsHamcrest = require('jshamcrest').JsHamcrest
jsHamcrest.Integration.copyMembers(global);

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