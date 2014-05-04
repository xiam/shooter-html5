// Utility functions.

define(['jquery', 'layer', 'screen', 'entity'], function($, layer, screen, entity) {

  var module = {
    __backgroundPattern: null
  };

  // Resizes overlays.
  module.resizeWindow = function() {
    module.__backgroundPattern = null;

    var size = screen.dimensions();

    $('.overlay').css({
      width: size[0] + 'px',
      height: size[1] + 'px'
    });

    screen.correction = [
      size[0]/2,
      size[1]/2
    ];

    $('canvas.layer').attr('width', size[0]).attr('height', size[1]);
  };

  module.isNear = function(x, y) {
    if (screen.trackElementId != "") {
      var el = entity.all[screen.trackElementId];
      var xdiff = Math.abs(el.p[0] - x);
      var ydiff = Math.abs(el.p[1] - y);
      var mdiff = Math.max(xdiff, ydiff);
      if (mdiff < 1e3) {
        return true;
      };
    };
    return false;
  };

  module.extend = function(o) {
    var fn = function(data) {
      this.parent = new o();
      if (this.init) {
        this.init(data);
      }
    };
    for (i in o.prototype) {
      fn.prototype[i] = o.prototype[i];
    };
    return fn;
  };

  return module;
});

