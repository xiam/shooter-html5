define(['jquery'], function($) {

  // module properties.
  var module = function() {};

  module.prototype.limit    = 0;
  module.prototype.current  = 0;

  module.prototype.SetLimit = function(n) {
    this.limit = n;
    this.current = n;
  };

  module.prototype.SetCurrent = function(n) {
    if (this.limit > 0) {
      this.current = n;
      var p = 100*(n/this.limit);
      $('#life-progress-bar').css('width', p+'%');
    };
  };

  return new module();
});
