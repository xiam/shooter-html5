define(['util', 'layer'], function(util, layer) {

  var all = [];

  var module = function(data) {
    this.init(data);
  };

  // module unique identificator string.
  module.prototype.id = '';

  module.prototype.ticks = 0;

  module.prototype.setType = function(type) {
    this.type = type;
  };

  module.prototype.N = '';
  module.prototype.w = 0;
  module.prototype.h = 0;

  // module position [x, y].
  module.prototype.p = [0, 0];

  // Direction unit vector [x, y].
  module.prototype.d = [0, 0];

  // Orientation angle (degrees)
  module.prototype.t = 0;

  // Position's rate of change.
  module.prototype.s = 0;

  module.prototype.data = {};

  module.prototype.setId = function(id) {
    this.id = id;
    all[this.id] = this;
  };

  module.prototype.destroy = function() {
    delete all[this.id];
  };

  module.prototype.init = function(data) {
    this.fillStyle = 'red';

    if (data && data.m) {
      this.fillStyle = layer.ship.createPattern(document.getElementById(data.m), 'repeat');
    };

    this.setup(data);

    this.update(data);

    this.data = data;
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
      };
    };
  };

  module.prototype.setup = function() {
    // Replace.
  };

  module.prototype.setPosition = function(x, y) {
    this.p = [x, y];
  };

  module.prototype.setDirection = function(x, y) {
    var d = Math.sqrt(x*x + y*y);
    if (d > 0) {
      this.d = [x/d, y/d];
      this.t = Math.atan2(this.d[1], this.d[0]);
    };
  };

  module.prototype.draw = function() {
    // Replace.
  };

  module.prototype.setSpeed = function(s) {
    this.s = s;
  };

  module.prototype.tick = function(factor) {
    var speed = this.s*factor;
    this.p[0] = this.p[0] + this.d[0]*speed;
    this.p[1] = this.p[1] + this.d[1]*speed;
    return true;
  };

  return { 'entity': module, 'all': all };
});
