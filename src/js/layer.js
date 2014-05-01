define(function() {
  var module = function() {};

  // Initializes a <canvas> tag and returns a 2d context.
  module.Initialize = function(elementId) {
    var canvas = document.getElementById(elementId);
    var ctx = canvas.getContext('2d');
    return ctx;
  };

  // Clears a canvas element.
  module.Clear = function(elementId) {
    var canvas = document.getElementById(elementId);
    canvas.width = canvas.width; // Fast clear trick.
  };

  // Game layers.
  // TODO: Make them dynamic.
  module.Ship = module.Initialize('ship-layer');
  module.Radar = module.Initialize('radar-layer');
  module.Stars = module.Initialize('stars-layer');

  return module;
});
