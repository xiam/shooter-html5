define(['jquery'], function($) {

  var module = function() {};

  module.prototype.trackElementId = '';

  module.prototype.size = [];

  module.prototype.correction = [0, 0];

  module.prototype.offset = [0, 0];

  module.prototype.bound = 0.4;

  module.prototype.dimensions = function() {
    this.size = [ $(window).width(), $(window).height() ];
    return this.size;
  };

  return new module();
});
