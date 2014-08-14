// UI Templates
var gamepadTpl = _.template($('#gamepadTemplate').html());
var noGamepadTpl = _.template($('#noGamepadsTemplate').html());

// Render the current state of any connected gamepads
$(function() {
    var $gamepads = $('#gamepads');

    // create a new starfox client
    var sf = new Starfox();

    // Returns null if the gamepad API is not supported
    if (!sf) {
        alert('The HTML 5 Gamepad API is not supported in this browser!');
        return;
    }

    // This event is emitted a lot, every animation frame. only called when
    // the browser detects connected gamepads
    sf.on('input', function(gamepads) {
        var out = '';
        gamepads.forEach(function(gamepad) {
            out += gamepadTpl(gamepad);
        });
        $gamepads.html(out);
    });
});