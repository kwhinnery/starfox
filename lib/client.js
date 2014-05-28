var util = require('util'),
    events = require('events'),
    WebSocket = require('ws'),
    gamepadSupport = require('./gamepadsupport');

// Create client object, inherits event emitter
function Starfox(url) {
    var self = this;

    // Check status of gamepad API support
    var gamepadSupportAvailable = !!navigator.webkitGetGamepads || 
        !!navigator.webkitGamepads;

    if (gamepadSupportAvailable) {
        // Create a websocket client
        var wsUrl = url || 'ws://'+document.domain+':8080';
        var ws = new WebSocket(wsUrl);
        ws.onopen = function() {
            self.emit('ready');
        };

        // Initialize gamepad input, and pipe to the server over the socket
        gamepadSupport.init();

        // Fired when a gamepad is connected or disconnected
        gamepadSupport.on('gamepadsChanged', function(e) {
            self.emit('gamepadsChanged', e);
            ws.send('[gamepadsChanged]'+JSON.stringify(e));
        });

        // Fired whenever input status changes, e.g. this is fired twice on a
        // button press
        gamepadSupport.on('input', function(e) {
            self.emit('input', e);
            ws.send('[input]'+JSON.stringify(e));
        });

    } else {
        console.error('Gamepad APIs not supported!');
        return null;
    }
}
util.inherits(Starfox, events.EventEmitter);

// Export starfox singleton as module interface 
window.Starfox = module.exports = Starfox;