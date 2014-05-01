define(['jquery'], function($) {

  var module = function() {};

  module.prototype.TrackElementId = '';

  module.prototype.Size = [];

  module.prototype.Correction = [0, 0];

  module.prototype.Offset = [0, 0];

  module.prototype.Bound = 0.4;

  module.prototype.Dimensions = function() {
    this.size = [ $(window).width(), $(window).height() ];
    return this.size;
  };

  return new module();
});
