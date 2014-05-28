var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    starfox = require('../index');

// Serve up our test HTML 
var server = http.createServer(function(request, response) {
    var testFile = fs.createReadStream(path.join(__dirname + '/demo.html'));
    testFile.pipe(response);
});

// Mount starfox on the HTTP server so it can serve resources/listen for
// events from the client
starfox.mount(server);

// Handle events for connected players
starfox.on('connection', function(player) {
    
    // Input event is emitted when the state of the controller changes
    player.on('input', function(gamepad) {
        console.log(gamepad);
    });

    // gamepadsChanged is fired when a gamepad is plugged or unplugged
    player.on('gamepadsChanged', function(gamepads) {
        console.log(gamepads);
    });
});

// Start HTTP server
server.listen(3000);