var transform = require('parallel-transform');
var request = require('request');

request.defaults({
    maxSockets: Infinity
});

module.exports = function(url) {
    return transform(100, collector);

    function collector(data, callback) {
        var stream = this; 
        
        var options = {};
        options.headers = {};
        options.path = ('/' + data.toString('utf8')).trim();
        options.url = url + options.path;
        options.followRedirect = false;
        options.pool = false; 

        get(options, push);

        function push(error, res, body) {
            if (error) {
                // console.log('ERROR: ', error);
                return callback();
            }
            
            callback(null, JSON.stringify({
                type: 'file',
                method: options.method,
                statusCode: res.statusCode,
                path: options.path,
                size: res.headers['content-length']
            }));
        }
    }
};

function get(options, push) {
    options.method = 'GET'; 
    request(options, push);
}
