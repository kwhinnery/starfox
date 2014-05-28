var EventEmitter = require('events').EventEmitter,
    path = require('path'),
    browserify = require('browserify'),
    ws = require('ws'),
    _ = require('lodash');

// Base object, event emitter
var starfox = new EventEmitter();

// Mount client resources on HTTP server, start listening for events
starfox.mount = function(server, options) {
    var opts = _.defaults(options||{}, {
        url: '',
        port: 8080
    });

    // Our browserified client bundle
    var b = browserify();
    b.add(path.join(__dirname, 'client.js'));

    // Set up client JS URL on HTTP server
    var url = opts.url+'/starfox.js',
        requestListeners = server.listeners('request').slice(0);

    server.removeAllListeners('request');
    server.on('request', function(request, response) {
        if (0 == request.url.indexOf(url)) {
            response.setHeader('Content-Type', 'application/javascript');
            b.bundle().pipe(response);
        } else {
            // If it's not a request for the starfox js file, call other
            // response handlers
            for (var i = 0; i < requestListeners.length; i++) {
                requestListeners[i].call(server, request, response);
            }
        }
    });

    // Set up websocket server to receive gamepad events
    var wss = new ws.Server({port:opts.port});

    // Handle socket connections
    wss.on('connection', function(socket) {
        // Create a player event emitter for each connected socket
        var player = new EventEmitter();
        starfox.emit('connection', player);

        socket.on('message', function(message) {
            if (message.indexOf('[input]') == 0) {
                var json = message.substring(7);
                var payload = JSON.parse(json);
                player.emit('input', payload);
            } else if (message.indexOf('[gamepadsChanged]') == 0) {
                var json = message.substring(17);
                var payload = JSON.parse(json);
                player.emit('gamepadsChanged', payload);
            }
        });
    });
};

module.exports = starfox;