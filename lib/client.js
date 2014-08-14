var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Create client object, inherits event emitter
function Starfox(options) {
    var self = this;

    // Check status of gamepad API support
    var gamepadSupportAvailable = !!navigator.getGamepads;

    if (gamepadSupportAvailable) {

        // Collect gamepad input on next animation frame
        function collect() {
            window.requestAnimationFrame(collect);
            var gamepads = navigator.getGamepads();
            var active = [];
            for (var i = 0; i < gamepads.length; i++) {
                // TODO: Check timestamps to determine if this is new input
                var pad = gamepads[i];
                pad && active.push(pad);
            }
            active.length > 0 && self.emit('input', active);
        }

        window.requestAnimationFrame(collect);

    } else {
        console.error('Gamepad APIs not supported!');
        return null;
    }
}
util.inherits(Starfox, EventEmitter);

// Export starfox singleton as module interface 
window.Starfox = module.exports = Starfox;