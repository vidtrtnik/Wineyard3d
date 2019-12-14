var up = false;
var down = false;
var left = false;
var right = false;
var space = false;

function initInput() {
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
}

// KEYBOARD

function keyDownHandler(event) {
    if (event.keyCode == 39) {
        right = true;
    } else if (event.keyCode == 37) {
        left = true;
    }
    if (event.keyCode == 40) {
        down = true;
    } else if (event.keyCode == 38) {
        up = true;
    } else if (event.keyCode == 32) {
        space = true;
    }
}

function keyUpHandler(event) {
    if (event.keyCode == 39) {
        right = false;
    } else if (event.keyCode == 37) {
        left = false;
    }
    if (event.keyCode == 40) {
        down = false;
    } else if (event.keyCode == 38) {
        up = false;
    } else if (event.keyCode == 32) {
        space = false;
    }
}
