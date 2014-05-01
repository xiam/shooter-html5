define(['util', 'layer'], function(util, layer) {

  var all = [];

  var module = function(data) {
    this.Init(data);
  };

  // module unique identificator string.
  module.prototype.id = '';

  module.prototype.ticks = 0;

  module.prototype.SetType = function(type) {
    this.type = type;
  };

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

  module.prototype.SetId = function(id) {
    this.id = id;
    all[this.id] = this;
  };

  module.prototype.Destroy = function() {
    delete all[this.id];
  };

  module.prototype.Init = function(data) {
    this.fillStyle = 'red';

    if (data && data.m) {
      this.fillStyle = layer.Ship.createPattern(document.getElementById(data.m), 'no-repeat');
    };

    this.Setup(data);

    this.Update(data);

    this.data = data;
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
      };
    };
  };

  module.prototype.Setup = function() {
    // Replace.
  };

  module.prototype.SetPosition = function(x, y) {
    this.p = [x, y];
  };

  module.prototype.SetDirection = function(x, y) {
    var d = Math.sqrt(x*x + y*y);
    if (d > 0) {
      this.d = [x/d, y/d];
      this.t = Math.atan2(this.d[1], this.d[0]);
    };
  };

  module.prototype.Draw = function() {
    // Replace.
  };

  module.prototype.SetSpeed = function(s) {
    this.s = s;
  };

  module.prototype.Tick = function(factor) {
    var speed = this.s*factor;
    this.p[0] = this.p[0] + this.d[0]*speed;
    this.p[1] = this.p[1] + this.d[1]*speed;
    return true;
  };

  return { 'Entity': module, 'All': all };
});
