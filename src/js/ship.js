var Ship = Extend(Entity);

Ship.prototype.ident = function(data) {
  // Centering ship.
  var size = Screen.dimensions();

  Screen.offset = [
    -this.p[0],
    -this.p[1]
  ];

  // Lifebar limits.
  Lifebar.setLimit(this.data.L);

  // Track this element.
  Screen.trackElementId = this.id;
};

Ship.prototype.life = 0;

Ship.prototype.points = 0;

Ship.prototype.hit = function() {

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

    Sound.hit();
  } else {
    if (Util.isNear(this.d[0], this.d[1])) {
      Sound.hitOther();
    };
  };

};

Ship.prototype.update = function(data) {
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
          Lifebar.setCurrent(v);
        };
      break;
      case 'P':
        if (this.isMain()) {
          Points.set(v);
        };
      break;
    };
  };
};

Ship.prototype.destroy = function() {
  if (this.isMain()) {
    Game.end();
  } else {
    delete Entities[this.id];
  };
};

Ship.prototype.isMain = function() {
  return (Screen.trackElementId == this.id);
};
