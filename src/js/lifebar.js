define(['jquery'], function($) {

  // module properties.
  var module = function() {
    this.limit    = 0;
    this.current  = 0;
  };

  module.prototype.setLimit = function(n) {
    this.limit    = n;
    this.current  = n;
  };

  module.prototype.setCurrent = function(n) {
    if (this.limit > 0) {
      this.current = n;
      var p = 100*(n/this.limit);
      $('#life-progress-bar').css('width', p+'%');
    };
  };

  return new module();
});
