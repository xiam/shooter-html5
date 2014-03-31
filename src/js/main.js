// Game connection.
var conn;

// Frames configuration.
var FRAMES_PER_SECOND = 24;
var FRAME_INTERVAL    = 1000/FRAMES_PER_SECOND;

// Drawing frames.
(function() {

  var frame = function(step) {
    var id;

    Util.clearLayer('ship-layer');

    for (id in Entities) {
      if (Entities[id].tick(step)) {
        Entities[id].draw();
      };
    };

    Radar.draw();
  };

  var last = 0;
  var loop = function() {
    requestAnimationFrame(loop);
    if (conn != null) {
      var curr = +(new Date());
      if (last > 0) {
        var elapsed = curr - last;
        frame(elapsed/FRAME_INTERVAL);
      };
      last = curr;
    };
  };

  loop();
})();

// Key constants.
var KEY_NONE    = 0;
var KEY_LEFT    = 1;
var KEY_RIGHT   = 2;
var KEY_UP      = 3;
var KEY_DOWN    = 4;
var KEY_SHOOT   = 5;

var getKey = function(i) {
  switch (i) {
    case 37:
    case 65:
      return KEY_LEFT;
    break;
    case 39:
    case 68:
      return KEY_RIGHT;
    break;
    case 38:
    case 87:
      return KEY_UP;
    break;
    case 40:
    case 83:
      return KEY_DOWN;
    break;
    case 32:
      return KEY_SHOOT;
    break;
  };
  return KEY_NONE;
};

$(document).keyup(function(ev) {
  var k = getKey(ev.keyCode);

  switch (k) {
    case KEY_LEFT:
      control.left(false);
    break;
    case KEY_RIGHT:
      control.right(false);
    break;
    case KEY_UP:
      control.up(false);
    break;
    case KEY_DOWN:
      control.down(false);
    break;
    case KEY_SHOOT:
      control.shoot(false);
    break;
  };

});

$(document).keydown(function(ev) {
  var k = getKey(ev.keyCode);

  switch (k) {
    case KEY_LEFT:
      control.left(true);
    break;
    case KEY_RIGHT:
      control.right(true);
    break;
    case KEY_UP:
      control.up(true);
    break;
    case KEY_DOWN:
      control.down(true);
    break;
    case KEY_SHOOT:
      control.shoot(true);
    break;
  };

});

// Game layers.
var Layer = {
  'Ship':   Util.initLayer('ship-layer'),
  'Radar':  Util.initLayer('radar-layer'),
  'Stars':  Util.initLayer('stars-layer')
};

// Game connection and main interface.
var Game = {
  'init': function() {
    $('.frame-overlay').hide();

    $('#instructions').show();
    if (window.localStorage) {
      if (window.localStorage.name != undefined) {
        $('#gamertag').val(window.localStorage.name);
      };
    };
    $('#gamertag')[0].focus();
  },
  'hideInstructions': function() {
    $('#instructions').fadeOut('slow');
  },
  'reset': function() {
    location.reload();

    return false;
  },
  'connect': function() {
    if (conn == null) {
      conn = new Ws();
      var name = $.trim($('#gamertag').val());
      if (window.localStorage) {
        window.localStorage.name = name;
      };
      conn.onconnect(function() {
        conn.send({
          'name': name
        });
        Game.hideInstructions();
      });
    };
    return false;
  },
  'end': function() {
    $('.frame-overlay').hide();
    $('#results').fadeIn();
    //$('#btn-restart')[0].focus();
    conn.close();
    conn = null;
  }
};

$(window).resize(
  function() {
    Util.resizeWindow();
  }
);

$(document).ready(
  function() {
    Util.resizeWindow();
    Game.init();
  }
);
