// Websocker server address.
var WEBSOCKET_SERVICE = 'ws://shooter.io/w/';

// Frames configuration.
var FRAMES_PER_SECOND = 24;
var FRAME_INTERVAL    = 1000/FRAMES_PER_SECOND;

require(['jquery', 'util', 'game', 'controller', 'layer', 'entity', 'radar', 'ws', 'screen', 'lifebar', 'isMobile'],

  function($, util, game, controller, layer, entity, radar, ws, screen, lifebar, isMobile) {

    // Binding controller change to websocket send.
    controller.onStateChange(function(state) {
      ws.send(state);
    });

    // Draw function.
    var draw = function(el) {

      var x = screen.offset[0] + el.p[0] + screen.correction[0];
      var y = screen.offset[1] + el.p[1] + screen.correction[1];

      var off = 200;

      if (x >= -off && x <= (screen.size[0]+off) && y >= -off && y <= (screen.size[1]+off)) {
        var ctx = layer.ship;

        if (screen.trackElementId == el.id) {
          updateBackground(x, y);

          ctx.save();
            ctx.beginPath();

            ctx.translate(x, y);
            var beat = 30 - 25*((lifebar.limit - lifebar.current)/lifebar.limit);
            var alpha = Math.abs(Math.sin(el.ticks/beat));

            ctx.fillStyle = 'rgba(255, 255, 255, '+(alpha*0.05)+')';
            ctx.strokeStyle = 'rgba(255, 255, 255, '+((1-alpha)*0.05)+')';
            ctx.lineWidth = 2;

            ctx.arc(0, 0, Math.max(el.w, el.h)*0.6, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

          ctx.restore();
        };

        ctx.save();
        ctx.beginPath();
          ctx.translate(x, y);

          if (el.N) {
            ctx.font = '16px Share Tech Mono';
            ctx.fillStyle = '#0ff';
            ctx.fillText(el.N, -80, -80);
          };

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

      layer.clear('ship-layer');

      for (id in entity.all) {
        if (entity.all[id].tick(step)) {
          draw(entity.all[id]);
        };
      };

      radar.draw();
    };

    var last = 0;

    var loop = function() {
      requestAnimationFrame(loop);
      if (ws.connected()) {
        var curr = +(new Date());
        if (last > 0) {
          var elapsed = curr - last;
          frame(elapsed/FRAME_INTERVAL);
        };
        last = curr;
      };
    };


    var phoneReposition = function() {
      var reposition = function(el) {
        el.height(el.width());
        //el.css('top', (($(window).height() - el.outerHeight())/2) + 'px');
        //el.css('line-height', el.height()+'px');
      };
      reposition($('#osc-fire'));
      reposition($('#osc-arrows'));
      reposition($('.osc-arrow'));
    };

    var captureIphone = function() {
      phoneReposition();
      $('.osc-button').bind('touchstart', function() {
        $(this).addClass('active');
        controller[$(this).data('value')](true);
      });
      $('.osc-button').bind('touchend', function() {
        $(this).removeClass('active');
        controller[$(this).data('value')](false);
      });
    };

    var captureKeyboard = function() {

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
            controller.left(false);
          break;
          case KEY_RIGHT:
            controller.right(false);
          break;
          case KEY_UP:
            controller.up(false);
          break;
          case KEY_DOWN:
            controller.down(false);
          break;
          case KEY_SHOOT:
            controller.shoot(false);
          break;
        };

      });

      $(document).keydown(function(ev) {
        var k = getKey(ev.keyCode);

        switch (k) {
          case KEY_LEFT:
            controller.left(true);
          break;
          case KEY_RIGHT:
            controller.right(true);
          break;
          case KEY_UP:
            controller.up(true);
          break;
          case KEY_DOWN:
            controller.down(true);
          break;
          case KEY_SHOOT:
            controller.shoot(true);
          break;
        };

      });
    };

    // Background move effect.
    var updateBackground = function(x, y) {
      var fixed = false;

      var lm = screen.size[0]*screen.bound; // Leftmost
      var tm = screen.size[1]*screen.bound; // Topmost
      var rm = screen.size[0]*(1.0 - screen.bound); // Rightmost
      var bm = screen.size[1]*(1.0 - screen.bound); // Bottommost

      if (x < lm) {
        screen.correction[0] += (lm - x);
        fixed = true;
      };
      if (y < tm) {
        screen.correction[1] += (tm - y);
        fixed = true;
      };

      if (x > rm) {
        screen.correction[0] += (rm - x);
        fixed = true;
      };
      if (y > bm) {
        screen.correction[1] += (bm - y);
        fixed = true;
      };

      if (fixed || !util.__backgroundPattern) {
        var el = document.getElementById('stars-layer');

        if (!util.__backgroundPattern) {
          util.__backgroundPattern = layer.stars.createPattern(document.getElementById('stars-background'), 'repeat');
        };

        var ctx = layer.stars;

        ctx.save();
          ctx.fillStyle = util.__backgroundPattern;
          ctx.translate(screen.correction[0], screen.correction[1]);
          ctx.fillRect(-screen.correction[0], -screen.correction[1], el.width, el.height);
        ctx.restore();
      };
    };

    var attachEvents = function() {
      $('#form-handle').bind('submit', function() {
        return game.connect();
      });
      $('#form-reset').bind('submit', function() {
        return game.restart();
      });

      $('body').bind('touchmove', function(ev) {
        ev.preventDefault();
      });

      if (isMobile.any) {
        captureIphone();
      } else {
        captureKeyboard();
      };
    };

    // Binding resize event to resize function.
    $(window).resize(
      function() {
        util.resizeWindow();
        if (isMobile.any) {
          phoneReposition();
        };
      }
    );

    // Ready to start game?
    $(window).ready(
      function() {
        attachEvents();
        util.resizeWindow();
        if (isMobile.any) {
          $('.desktop-only').hide();
        } else {
          $('.mobile-only').hide();
        };
        game.init();
      }
    );

    loop();

  }
);

