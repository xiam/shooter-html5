define(['jquery', 'layer', 'screen', 'entity'], function($, layer, screen, entity) {

  // Radar prototype.
  var module = function() {};

  module.prototype.__gradient = null;

  module.prototype.draw = function() {
    var dst;
    var r;

    layer.clear('radar-layer');

    var ctx = layer.radar;
    ctx.save();
      ctx.fillStyle = 'rgba(30, 30, 30, 0.3)';
      ctx.translate(100, 100);
      if (!this.__gradient) {
        this.__gradient = ctx.createRadialGradient(0, 0, 50, 0, 0, 100);
        this.__gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        this.__gradient.addColorStop(1, 'rgba(0, 128, 128, 0.5)');
      };
      ctx.fillStyle = this.__gradient;
      ctx.arc(0, 0, 100, 0, Math.PI*2);
      ctx.fill();
    ctx.restore();

    if (screen.trackElementId) {
      var offset = entity.all[screen.trackElementId].p;

      var id;
      for (id in entity.all) {
        var el = entity.all[id];
        var x = (el.p[0] - offset[0])/20;
        var y = (el.p[1] - offset[1])/20;
        var dst = x*x + y*y;
        if (dst < 1e4) {
          ctx.beginPath();

          if (id == screen.trackElementId) {
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
  };

  return new module();
});
