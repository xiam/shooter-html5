// Utility functions.

define(['jquery', 'layer', 'screen', 'entity'], function($, layer, screen, entity) {

  var module = {
    __backgroundPattern: null
  };

  // Resizes overlays.
  module.ResizeWindow = function() {
    module.__backgroundPattern = null;

    var size = screen.Dimensions();

    $('.overlay').css({
      width: size[0] + 'px',
      height: size[1] + 'px'
    });

    $('canvas.layer').attr('width', size[0]).attr('height', size[1]);
  };

  module.IsNear = function(x, y) {
    if (screen.TrackElementId != "") {
      var el = entity.All[screen.TrackElementId];
      var xdiff = Math.abs(el.p[0] - x);
      var ydiff = Math.abs(el.p[1] - y);
      var mdiff = Math.max(xdiff, ydiff);
      if (mdiff < 1e3) {
        return true;
      };
    };
    return false;
  };

  module.Place = function(i) {
    var i = parseInt(i);
    switch (i) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return i + 'th';
    }
    return i + '';
  };

  module.Extend = function(o) {
    var fn = function(data) {
      this.parent = new o();
      if (this.Init) {
        this.Init(data);
      }
    };
    for (i in o.prototype) {
      fn.prototype[i] = o.prototype[i];
    };
    return fn;
  };

  return module;
});

