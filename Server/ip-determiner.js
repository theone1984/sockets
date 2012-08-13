exports.getIpAddresses = (function () {
    var ignoredAddresses = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

    var exec = require('child_process').exec;
    var cached;
    var command;
    var ipFilter;

    switch (process.platform) {
        case 'win32':
            command = 'ipconfig';
            ipFilter = /   IP(?:v[46])?-?[^:\r\n]+:\s*([^\s]+)/g;
            break;
        case 'darwin':
            command = 'ifconfig';
            ipFilter = /\binet\s+([^\s]+)/g;
            break;
        default:
            command = 'ifconfig';
            ipFilter = /\binet\b[^:]+:\s*([^\s]+)/g;
            break;
    }

    return function (callback) {
        exec(command, function (error, stdout, sterr) {
            var foundAddresses = [];

            var ip;
            var matches = stdout.match(ipFilter) || [];
            //if (!error) {
            for (var i = 0; i < matches.length; i++) {
                ip = matches[i].replace(ipFilter, '$1')
                if (!ignoredAddresses.test(ip)) {
                    foundAddresses.push(ip);
                }
            }

            callback(error, foundAddresses);
        });
    };
})();