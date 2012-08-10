
exports.encode = function(data) {
    return 'data:image/png;base64,' + data.toString('base64') + "\u0000";
}