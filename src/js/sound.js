define(['sm2'], function() {

  var module = function() {
    this.Init();
  };

  module.prototype.volume = 100;

  module.prototype.__fire     = null;
  module.prototype.__hit      = null;
  module.prototype.__hitOther = null;

  module.prototype.Init = function() {
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

  module.prototype.Fire = function() {
    if (this.__fire) {
      this.__fire.play();
    };
  };

  module.prototype.HitOther = function() {
    if (this.__hitOther) {
      this.__hitOther.play();
    };
  };

  module.prototype.Hit = function() {
    if (this.__hit) {
      this.__hit.play();
    };
  };

  return new module();
});
