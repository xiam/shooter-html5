define(['jquery'], function($) {
  // module properties.
  var module = function() {};

  module.prototype.Set = function(n) {
    $('#module-value').text(n);
  };

  return new module();
});
