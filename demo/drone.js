var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    starfox = require('../index');

// Set up drone
var arDrone = require('ar-drone');
var client = arDrone.createClient();

// Serve up our test HTML 
var server = http.createServer(function(request, response) {
    var testFile = fs.createReadStream(path.join(__dirname, 'drone.html'));
    testFile.pipe(response);
});

starfox.mount(server);

// Handle gamepad events for our drone
starfox.on('connection', function(player) {

    player.on('input', function(gamepad) {
        // Button commands take precedence
        if (gamepad.buttons[9].pressed) {
            client.takeoff();
        } else if (gamepad.buttons[8].pressed) {
            client.land();
        } else if (gamepad.buttons[0].pressed) {
            client.stop();
        } else if (gamepad.buttons[1].pressed) {
            client.animate('flipRight', 500);
        } else if (gamepad.buttons[2].pressed) {
            client.animate('flipLeft', 500);
        } else if (gamepad.buttons[3].pressed) {
            client.animate('flipBehind', 500);
        } else {
            // Use axis information to orient the drone
            var leftX = gamepad.axes[0],
                leftY = gamepad.axes[1],
                rightX = gamepad.axes[2],
                rightY = gamepad.axes[3];

            // Update rotation
            if (rightX > 0.05) {
                client.clockwise(rightX);
            } else if (rightX < -0.05) {
                client.counterClockwise(Math.abs(rightX));
            } else {
                client.clockwise(0);
            }

            // Update altitude
            if (rightY > 0.05) {
                client.up(rightY);
            } else if (rightY < -0.05) {
                client.down(Math.abs(rightY));
            } else {
                client.up(0);
            }

            // Update left/right
            if (leftX > 0.09) {
                client.right(leftX);
            } else if (leftX < -0.09) {
                client.left(Math.abs(leftX));
            } else {
                client.right(0);
            }

            // Update front/back
            if (leftY > 0.09) {
                client.back(leftY);
            } else if (leftY < -0.09) {
                client.front(Math.abs(leftY));
            } else {
                client.front(0);
            }
        }
    });

    // gamepad plugged/unplugged
    player.on('gamepadsChanged', function(gamepads) {
        console.log(gamepads);
    });
});

// Start HTTP server
server.listen(3000);