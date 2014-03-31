// Utility functions.
var Util = {
  __backgroundPattern: null
};

// Initializes a <canvas> tag and returns a 2d context.
Util.initLayer = function(elementId) {
  var canvas = document.getElementById(elementId);
  var ctx = canvas.getContext('2d');
  return ctx;
};

// Clears a canvas element.
Util.clearLayer = function(elementId) {
  var canvas = document.getElementById(elementId);
  canvas.width = canvas.width; // Fast clear trick.
};

// Resizes overlays.
Util.resizeWindow = function() {
  Util.__backgroundPattern = null;

  var size = Screen.dimensions();

  $('.overlay').css({
    width: size[0] + 'px',
    height: size[1] + 'px'
  });

  $('canvas.layer').attr('width', size[0]).attr('height', size[1]);
};

// Background move effect.
Util.updateBackground = function(x, y) {
  var fixed = false;

  var lm = Screen.size[0]*Screen.bound; // Leftmost
  var tm = Screen.size[1]*Screen.bound; // Topmost
  var rm = Screen.size[0]*(1.0 - Screen.bound); // Rightmost
  var bm = Screen.size[1]*(1.0 - Screen.bound); // Bottommost

  if (x < lm) {
    Screen.correction[0] += (lm - x);
    fixed = true;
  };
  if (y < tm) {
    Screen.correction[1] += (tm - y);
    fixed = true;
  };

  if (x > rm) {
    Screen.correction[0] += (rm - x);
    fixed = true;
  };
  if (y > bm) {
    Screen.correction[1] += (bm - y);
    fixed = true;
  };

  if (fixed || !Util.__backgroundPattern) {
    var el = document.getElementById('stars-layer');

    if (!Util.__backgroundPattern) {
      Util.__backgroundPattern = Layer.Stars.createPattern(document.getElementById('stars-background'), 'repeat');
    };

    var ctx = Layer.Stars;

    ctx.save();
      ctx.fillStyle = Util.__backgroundPattern;
      ctx.translate(Screen.correction[0], Screen.correction[1]);
      ctx.fillRect(-Screen.correction[0], -Screen.correction[1], el.width, el.height);
    ctx.restore();
  };
};

Util.isNear = function(x, y) {
  if (Screen.trackElementId != "") {
    var el = Entities[Screen.trackElementId];
    var xdiff = Math.abs(el.p[0] - x);
    var ydiff = Math.abs(el.p[1] - y);
    var mdiff = Math.max(xdiff, ydiff);
    if (mdiff < 1e3) {
      return true;
    };
  };
  return false;
};

var place = function(i) {
  var i = parseInt(i);
  switch (i) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return i + 'th';
  }
  return i + '';
};

var Extend = function(o) {
  var fn = function(data) {
    this.parent = new o();
    this.init(data);
  };
  for (i in o.prototype) {
    fn.prototype[i] = o.prototype[i];
  };
  return fn;
};

var update = function(data) {
  var i;
  for (i = 0; i < data.length; i++) {
    var line = data[i];
    if (line.fn) {
      if (line.fn == 'create') {
        if (line.kind == 'ship') {
          if (typeof Entities[line.id] == 'undefined') {
            var ship = new Ship(line.data);
            ship.setType(line.kind);
            ship.setId(line.id);
          };
        } else if (line.kind == 'ship-ai') {
          if (typeof Entities[line.id] == 'undefined') {
            var ship = new Ship(line.data);
            ship.setType(line.kind);
            ship.setId(line.id);
          };
        } else if (line.kind == 'fire') {
          if (typeof Entities[line.id] == 'undefined') {
            var fire = new Fire(line.data, line.kind);
            fire.setType(line.kind);
            fire.setId(line.id);
          };
        } else if (line.kind == 'powerup') {
          if (typeof Entities[line.id] == 'undefined') {
            var powerup = new PowerUp(line.data, line.kind);
            powerup.setType(line.kind);
            powerup.setId(line.id);
          };
        };
      } else if (line.fn == 'scores') {
        var table = $('#highscores');
        var tbody = table.find('tbody').empty();
        var j;
        for (j = 0; j < line.data.length; j++) {
          var tr = $('<tr>');
          tr.append($('<td>').text(place(j + 1)).addClass('place'));
          tr.append($('<td>').text(line.data[j].name));
          tr.append($('<td>').text(line.data[j].points).addClass('score'));
          tbody.append(tr);
        };
        $('#score-end-value').text($('#score-value').text());
      } else {
        var el = Entities[line.id];
        if (typeof el != 'undefined') {
          el[line.fn](line.data || {});
        };
      };
    };
  };
};

// Screen properties.
var Screen = {};

Screen.size = [];

Screen.dimensions = function() {
  Screen.size = [ $(window).width(), $(window).height() ];
  return Screen.size;
};

Screen.offset = [ 0, 0 ];
Screen.correction = [ 0, 0 ];
Screen.bound = 0.4;

// Lifebar properties.
var Lifebar = {};

Lifebar.limit = 0;
Lifebar.current = 0;

Lifebar.setLimit = function(n) {
  Lifebar.limit = n;
  Lifebar.current = n;
};

Lifebar.setCurrent = function(n) {
  if (Lifebar.limit > 0) {
    Lifebar.current = n;
    var p = 100*(n/Lifebar.limit);
    $('#life-progress-bar').css('width', p+'%');
  };
};

// Points properties.
var Points = {};

Points.set = function(n) {
  $('#score-value').text(n);
};


// Sound properties.
var Sound = {};

Sound.init = function() {
  lowLag.init({debug: 'none'});
  lowLag.load(['assets/fire.ogg'], 'fire');
  lowLag.load(['assets/hit-other.ogg'], 'hit-other');
  lowLag.load(['assets/hit.ogg'], 'hit');
};

Sound.fire = function() {
  lowLag.play('fire');
};

Sound.hitOther = function() {
  //lowLag.play('hit-other');
  lowLag.play('hit');
};

Sound.hit = function() {
  lowLag.play('hit');
};

Sound.init();

// Radar properties.
var Radar = {
  'draw': function() {
    var dst;
    var r;

    Util.clearLayer('radar-layer');

    var ctx = Layer.Radar;
    ctx.save();
      ctx.fillStyle = 'rgba(30, 30, 30, 0.3)';
      ctx.translate(100, 100);
      if (!Radar.__gradient) {
        var gradient = ctx.createRadialGradient(0, 0, 50, 0, 0, 100);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 128, 128, 0.5)');
        Radar.__gradient = gradient;
      };
      ctx.fillStyle = Radar.__gradient;
      ctx.arc(0, 0, 100, 0, Math.PI*2);
      ctx.fill();
    ctx.restore();

    if (Screen.trackElementId) {
      var offset = Entities[Screen.trackElementId].p;

      var id;
      for (id in Entities) {
        var el = Entities[id];
        var x = (el.p[0] - offset[0])/20;
        var y = (el.p[1] - offset[1])/20;
        var dst = x*x + y*y;
        if (dst < 1e4) {
          ctx.beginPath();

          if (id == Screen.trackElementId) {
            ctx.fillStyle = 'rgba(0, 255, 255, 1)';
            r = 2;
          } else {
            if (el.type == 'ship' || el.type == 'ship-ai') {
              ctx.fillStyle = 'rgba(255, 255, 255, '+(1-dst/1e4)+')';
              r = 1.5;
            } else if (el.type == 'powerup') {
              ctx.fillStyle = 'rgba(0, 255, 0, '+(1-dst/1e4)+')';
              r = 1;
            } else {
              ctx.fillStyle = 'rgba(255, 255, 0, '+(1-dst/1e4)+')';
              r = 0.5;
            };
          };

          ctx.arc(x + 100, y + 100, r, 0, Math.PI*2);

          ctx.fill();
          ctx.closePath();
        };
      };
    };
  }
};
