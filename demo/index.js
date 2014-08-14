var http = require('http');
var express = require('express');
var arDrone = require('ar-drone');

// Create Express webapp
var app = express();
app.use(express.static('public'));

// Set up HTTP Server
var server = http.createServer(app);

// Mount socket.io on the HTTP server
var io = require('socket.io')(server);

// Create drone client
var drone = arDrone.createClient();

// Handle coket connections
io.on('connection', function(socket) {
    console.log('connection');

    socket.on('input', function(gamepad) {
        //console.log(gamepad);

        // Fly the drone!
        // Button commands take precedence
        if (gamepad.buttons[9].pressed) {
            drone.takeoff();
        } else if (gamepad.buttons[8].pressed) {
            drone.land();
        } else if (gamepad.buttons[2].pressed) {
            drone.stop();
        } else {
            // rotation controls
            if (gamepad.buttons[5].pressed) {
                drone.clockwise(0.5);
            } else if (gamepad.buttons[4].pressed) {
                drone.counterClockwise(0.5);
            } else {
                drone.clockwise(0);
            }

            // movement controls
            if (gamepad.axes[0] > 0.09) {
                drone.right(0.5);
            } else if (gamepad.axes[0] < -0.09) {
                drone.left(0.5);
            } else if (gamepad.axes[1] < -0.09) {
                drone.front(0.5);
            } else if (gamepad.axes[1] > 0.09) {
                drone.back(0.5);
            } else {
                drone.front(0);
            }
        }
    });

});

// Start HTTP Server
server.listen(3000, function() {
    console.log('Express server running on port 3000');
});
