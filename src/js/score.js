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
    $('#module-value').text(n);
  };

  return new module();
});
