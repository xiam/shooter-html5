define(['jquery'], function($) {
  // module properties.
  var module = function() {};

  module.prototype.set = function(n) {
    $('#module-value').text(n);
  };

  return new module();
});
