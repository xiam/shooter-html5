define(['jquery', 'util', 'entity', 'screen', 'lifebar', 'sound', 'score'], function($, util, entity, screen, lifebar, sound, score) {

  var module = util.Extend(entity.Entity);

  module.prototype.Ident = function(data) {
    // Centering ship.
    var size = screen.Dimensions();

    screen.Offset = [
      -this.p[0],
      -this.p[1]
    ];

    // Lifebar limits.
    lifebar.SetLimit(this.data.L);

    // Track this element.
    screen.TrackElementId = this.id;
  };

  module.prototype.life = 0;

  module.prototype.points = 0;

  module.prototype.Hit = function() {

    if (this.IsMain()) {

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

      sound.Hit();
    } else {
      if (util.IsNear(this.d[0], this.d[1])) {
        sound.HitOther();
      };
    };

  };

  module.prototype.Update = function(data) {
    var k;
    for (k in data) {
      var v = data[k];
      switch (k) {
        case 'h':
          this.h = v;
        break;
        case 'w':
          this.w = v;
        break;
        case 'p':
          this.SetPosition(v[0], v[1]);
        break;
        case 'd':
          this.SetDirection(v[0], v[1]);
        break;
        case 's':
          this.SetSpeed(v);
        break;
        case 'L':
          if (v < this.life) {
            this.Hit();
          };
          this.life = v;
          if (this.IsMain()) {
            lifebar.SetCurrent(v);
          };
        break;
        case 'P':
          if (this.IsMain()) {
            score.Set(v);
          };
        break;
      };
    };
  };

  module.prototype.Destroy = function() {
    if (this.IsMain()) {
      game.End();
    } else {
      delete entity.All[this.id];
    };
  };

  module.prototype.IsMain = function() {
    return (screen.TrackElementId == this.id);
  };

  return { 'Ship': module };
});
