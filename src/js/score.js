define(['jquery', 'isMobile'], function($, isMobile) {

  // module properties.
  var module = function() {
    this.el = $('#score');
    this.resize();

    var $that = this;

    $(window).resize(
      function() {
        $that.resize();
      }
    );

    if (!isMobile.any) {
      window.setInterval(
        function() {
          $that.__inc();
        }, 10
      );
    };
  };

  module.prototype.__value = 0;
  module.prototype.__current = 0;

  module.prototype.__inc = function() {
    if (this.__value < this.__current) {
      this.__value++;
      $('#score-value').text(this.__value);
    };
  };

  module.prototype.resize = function() {
    // Mobile features this bar at top.
    if (isMobile.any) {
      this.el.css({
        'top': '10px',
        'right': '10px'
      });
    } else {
      this.el.css({
        'bottom': '10px',
        'right': '10px'
      });
    };
  };

  module.prototype.set = function(n) {
    if (isMobile.any) {
      $('#score-value').text(n);
    } else {
      this.__current = parseInt(n, 10);
    };
  };

  return new module();
});
