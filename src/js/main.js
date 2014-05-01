// Websocker server address.
var WEBSOCKET_SERVICE = 'ws://127.0.0.1:3223/w/';

// Frames configuration.
var FRAMES_PER_SECOND = 24;
var FRAME_INTERVAL    = 1000/FRAMES_PER_SECOND;

require(['jquery', 'util', 'game', 'controller', 'layer', 'entity', 'radar', 'ws', 'screen'],
  function($, util, game, controller, layer, entity, radar, ws, screen) {

    controller.OnStateChange(function(state) {
      ws.Send(state);
    });

    // Draw function.
    var draw = function(el) {

      var x = screen.Offset[0] + el.p[0] + screen.Correction[0];
      var y = screen.Offset[1] + el.p[1] + screen.Correction[1];
      var off = 200;

      if (x >= -off && x <= (screen.Size[0]+off) && y >= -off && y <= (screen.Size[1]+off)) {
        var ctx = layer.Ship;

        if (screen.TrackElementId == el.id) {
          updateBackground(x, y);

          ctx.beginPath();

          ctx.save();
            ctx.translate(x, y);
            var beat = 30 - 25*((lifebar.limit - lifebar.current)/lifebar.limit);
            var alpha = Math.abs(Math.sin(el.ticks/beat));

            ctx.fillStyle = 'rgba(255, 255, 255, '+(alpha*0.05)+');'
            ctx.strokeStyle = 'rgba(255, 255, 255, '+((1-alpha)*0.05)+');'
            //ctx.strokeStyle = 'rgba(255, 255, 255, 0.05);'
            ctx.lineWidth = 2;

            ctx.arc(0, 0, Math.max(el.w, el.h)*0.6, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
          ctx.restore();
        };

        ctx.beginPath();
        ctx.save();
          ctx.translate(x, y);
          ctx.rotate(el.t);
          ctx.translate(-el.w/2, -el.h/2);
          ctx.fillStyle = el.fillStyle || 'red';
          ctx.fillRect(0, 0, el.w, el.h);
        ctx.closePath();

        ctx.fill();

        ctx.restore();
      };

      el.ticks++;
    };

    var frame = function(step) {
      var id;

      layer.Clear('ship-layer');

      for (id in entity.All) {
        if (entity.All[id].Tick(step)) {
          draw(entity.All[id]);
        };
      };

      radar.Draw();
    };

    var last = 0;

    var loop = function() {
      requestAnimationFrame(loop);
      if (ws.Connected()) {
        var curr = +(new Date());
        if (last > 0) {
          var elapsed = curr - last;
          frame(elapsed/FRAME_INTERVAL);
        };
        last = curr;
      };
    };

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
          controller.Left(false);
        break;
        case KEY_RIGHT:
          controller.Right(false);
        break;
        case KEY_UP:
          controller.Up(false);
        break;
        case KEY_DOWN:
          controller.Down(false);
        break;
        case KEY_SHOOT:
          controller.Shoot(false);
        break;
      };

    });

    $(document).keydown(function(ev) {
      var k = getKey(ev.keyCode);

      switch (k) {
        case KEY_LEFT:
          controller.Left(true);
        break;
        case KEY_RIGHT:
          controller.Right(true);
        break;
        case KEY_UP:
          controller.Up(true);
        break;
        case KEY_DOWN:
          controller.Down(true);
        break;
        case KEY_SHOOT:
          controller.Shoot(true);
        break;
      };

    });

    // Background move effect.
    var updateBackground = function(x, y) {
      var fixed = false;

      var lm = screen.Size[0]*screen.Bound; // Leftmost
      var tm = screen.Size[1]*screen.Bound; // Topmost
      var rm = screen.Size[0]*(1.0 - screen.Bound); // Rightmost
      var bm = screen.Size[1]*(1.0 - screen.Bound); // Bottommost

      if (x < lm) {
        screen.Correction[0] += (lm - x);
        fixed = true;
      };
      if (y < tm) {
        screen.Correction[1] += (tm - y);
        fixed = true;
      };

      if (x > rm) {
        screen.Correction[0] += (rm - x);
        fixed = true;
      };
      if (y > bm) {
        screen.Correction[1] += (bm - y);
        fixed = true;
      };

      if (fixed || !util.__backgroundPattern) {
        var el = document.getElementById('stars-layer');

        if (!util.__backgroundPattern) {
          util.__backgroundPattern = layer.Stars.createPattern(document.getElementById('stars-background'), 'repeat');
        };

        var ctx = layer.Stars;

        ctx.save();
          ctx.fillStyle = util.__backgroundPattern;
          ctx.translate(screen.Correction[0], screen.Correction[1]);
          ctx.fillRect(-screen.Correction[0], -screen.Correction[1], el.width, el.height);
        ctx.restore();
      };
    };

    var attachEvents = function() {
      $('#form-handle').bind('submit', function() {
        return game.Connect();
      });
      $('#form-reset').bind('submit', function() {
        return game.Restart();
      });
    };

    // Binding resize event to resize function.
    $(window).resize(
      function() {
        util.ResizeWindow();
      }
    );

    // Ready to start game?
    $(document).ready(
      function() {
        attachEvents();
        util.ResizeWindow();
        game.Init();
      }
    );

    loop();

  }
);

