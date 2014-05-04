define(['jquery', 'util', 'entity', 'screen', 'lifebar', 'sound', 'score', 'ws'], function($, util, entity, screen, lifebar, sound, score, ws) {

  var module = util.extend(entity.entity);

  module.prototype.ident = function(data) {
    // Centering ship.
    //var size = screen.dimensions();

    screen.offset = [
      -this.p[0],
      -this.p[1]
    ];

    // Lifebar limits.
    lifebar.setLimit(this.data.L);

    // Track this element.
    screen.trackElementId = this.id;
  };

  module.prototype.life = 0;

  module.prototype.points = 0;

  module.prototype.hit = function() {

    if (this.isMain()) {

      if (this.__hitTimer) {
        window.clearTimeout(this.__hitTimer);
      };

      $('#fx-hit').fadeIn('fast');
      $(document.body).addClass('shake');

      this.__hitTimer = window.setTimeout(
        function() {
          $('#fx-hit').fadeOut('fast');
          $(document.body).removeClass('shake');
        }, 500
      );

      sound.hit();
    } else {
      if (util.isNear(this.d[0], this.d[1])) {
        sound.hitOther();
      };
    };

  };

  module.prototype.update = function(data) {
    var k;
    for (k in data) {
      var v = data[k];
      switch (k) {
        case 'N':
          this.N = v;
        break;
        case 'h':
          this.h = v;
        break;
        case 'w':
          this.w = v;
        break;
        case 'p':
          this.setPosition(v[0], v[1]);
        break;
        case 'd':
          this.setDirection(v[0], v[1]);
        break;
        case 's':
          this.setSpeed(v);
        break;
        case 'L':
          if (v < this.life) {
            this.hit();
          };
          this.life = v;
          if (this.isMain()) {
            lifebar.setCurrent(v);
          };
        break;
        case 'P':
          if (this.isMain()) {
            score.set(v);
          };
        break;
      };
    };
  };

  module.prototype.destroy = function() {
    if (this.isMain()) {
      ws.close();
    };
    delete entity.all[this.id];
  };

  module.prototype.isMain = function() {
    if (screen.trackElementId) {
      return (screen.trackElementId == this.id);
    };
    return false;
  };

  return module;

});
