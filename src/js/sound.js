define(['sm2'], function() {

  var module = function() {
    this.init();
  };

  module.prototype.__status = false;

  module.prototype.volume = 100;

  module.prototype.__fire     = null;
  module.prototype.__hit      = null;
  module.prototype.__hitOther = null;

  module.prototype.setStatus = function(value) {
    this.__status = value;
  };

  module.prototype.init = function() {
    var $that = this;

    soundManager.setup({
      'url': '/js/swf/',
      'debugMode': false,
      'debugFlash': false,
      'onready': function() {
        $that.__fire = soundManager.createSound({
          'url': 'assets/shoot.wav'
        });
        $that.__hit = soundManager.createSound({
          'url': 'assets/hit.wav'
        });
        $that.__hitOther = soundManager.createSound({
          'url': 'assets/hit-other.wav'
        });
      }
    });
  };

  module.prototype.fire = function() {
    if (!this.__status) {
      return false;
    };
    if (this.__fire) {
      this.__fire.play();
    };
  };

  module.prototype.hitOther = function() {
    if (!this.__status) {
      return false;
    };
    if (this.__hitOther) {
      this.__hitOther.play();
    };
  };

  module.prototype.hit = function() {
    if (!this.__status) {
      return false;
    };
    if (this.__hit) {
      this.__hit.play();
    };
  };

  return new module();
});
