# STARFOX

HTML 5 Gamepad controller input (works on latest Chrome), magically beamed to your node.js application over a web socket.

# API

## Server

See the demo directory, specifically `demo/app.js` for a simple example.  Requiring the `starfox` module returns a singleton object, which is an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

        var starfox = require('starfox');

        // Pass an HTTP server in to the module
        starfox.mount(httpServerYouCreate, {
            url: '', // the prefix URL for the JS file sent to the client, default none
            port: 8080 // port for web socket server, default 8080
        });

        // Each connection represents a single client, who might have multiple
        // gamepads attached.
        starfox.on('connection', function(player) {

            // Whenever the state of the gamepad changes (e.g. once when the button
            // is pressed, and again when it is let go), this event is fired
            player.on('input', function(gamepadState) {
                console.log(gamepadState);
            });

            // Whenever a gamepad is connected or disconnected, this event fires
            player.on('gamepadsChanged', function(gamepads) {
                console.log(gamepads);
            });
        });

## Client

The browser API for Starfox is generated on the server using browserify.  It can be included as a script tag, or your client-side application can require it and use it with browserify.  A simple demo usage is in `demo/demo.html`, but here's a bit more color on the API:

        <script src="/starfox.js"></script>
        <script>
        var sf = new Starfox(); // parameter is the websocket URL to use, 
                                // default is ws://+document.domain+8080

        // Emits a ready event when socket connects
        sf.on('ready', function() {
            console.log('It\'s about time you showed up, Fox. You\'re the only hope for our world!');
        });

        // Optional: listen for controller events on the client too:
        sf.on('input', function(gamepadState) {
            console.log(gamepadState);
        });
        sf.on('gamepadsChanged', function(gamepads) {
            console.log(gamepads);
        });
        </script>

# LICENSE

MIT