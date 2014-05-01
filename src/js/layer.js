define(function() {
  var module = {};

  // Initializes a <canvas> tag and returns a 2d context.
  module.create = function(elementId) {
    var canvas = document.getElementById(elementId);
    var ctx = canvas.getContext('2d');
    return ctx;
  };

  // Clears a canvas element.
  module.clear = function(elementId) {
    var canvas = document.getElementById(elementId);
    canvas.width = canvas.width; // Fast clear trick.
  };

  // Game layers.
  // TODO: Make them dynamic.
  module.ship   = module.create('ship-layer');
  module.radar  = module.create('radar-layer');
  module.stars  = module.create('stars-layer');

  return module;
});
