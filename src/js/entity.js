// TODO: Move to a saner location.
var Entities = {};

var Entity = function(data) {
  this.init(data);
};

// Entity unique identificator string.
Entity.prototype.id = '';

Entity.prototype.ticks = 0;

Entity.prototype.setType = function(type) {
  this.type = type;
};

Entity.prototype.w = 0;
Entity.prototype.h = 0;

// Entity position [x, y].
Entity.prototype.p = [0, 0];

// Direction unit vector [x, y].
Entity.prototype.d = [0, 0];

// Orientation angle (degrees)
Entity.prototype.t = 0;

// Position's rate of change.
Entity.prototype.s = 0;

Entity.prototype.data = {};

Entity.prototype.setId = function(id) {
  this.id = id;
  Entities[this.id] = this;
};

Entity.prototype.destroy = function() {
  delete Entities[this.id];
};

Entity.prototype.init = function(data) {
	this.fillStyle = 'red';

	if (data && data.m) {
		this.fillStyle = Layer.Ship.createPattern(document.getElementById(data.m), 'no-repeat');
	};

  this.setup(data);

  this.update(data);

  this.data = data;
};

Entity.prototype.kill = function() {
  delete Entities[this.id];
};

Entity.prototype.update = function(data) {
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
    };
  };
};

Entity.prototype.setup = function() {
  // Replace.
};

Entity.prototype.setPosition = function(x, y) {
  this.p = [x, y];
};

Entity.prototype.setDirection = function(x, y) {
  var d = Math.sqrt(x*x + y*y);
  if (d > 0) {
    this.d = [x/d, y/d];
    this.t = Math.atan2(this.d[1], this.d[0]);
  };
};

Entity.prototype.draw = function() {

  var x = Screen.offset[0] + this.p[0] + Screen.correction[0];
  var y = Screen.offset[1] + this.p[1] + Screen.correction[1];
  var off = 200;

  if (x >= -off && x <= (Screen.size[0]+off) && y >= -off && y <= (Screen.size[1]+off)) {
    var ctx = Layer.Ship;

    if (Screen.trackElementId == this.id) {
      Util.updateBackground(x, y);
      ctx.beginPath();

      ctx.save();
        ctx.translate(x, y);
        var beat = 30 - 25*((Lifebar.limit - Lifebar.current)/Lifebar.limit);
        var alpha = Math.abs(Math.sin(this.ticks/beat));

        ctx.fillStyle = 'rgba(255, 255, 255, '+(alpha*0.05)+');'
        ctx.strokeStyle = 'rgba(255, 255, 255, '+((1-alpha)*0.05)+');'
        //ctx.strokeStyle = 'rgba(255, 255, 255, 0.05);'
        ctx.lineWidth = 2;

        ctx.arc(0, 0, Math.max(this.w, this.h)*0.6, 0, Math.PI*2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      ctx.restore();
    };

    ctx.beginPath();
    ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.t);
      ctx.translate(-this.w/2, -this.h/2);
      ctx.fillStyle = this.fillStyle || 'red';
      ctx.fillRect(0, 0, this.w, this.h);
    ctx.closePath();

    ctx.fill();

    ctx.restore();

  };

  this.ticks++;

};

Entity.prototype.setSpeed = function(s) {
  this.s = s;
};

Entity.prototype.tick = function(factor) {
  var speed = this.s*factor;
  this.p[0] = this.p[0] + this.d[0]*speed;
  this.p[1] = this.p[1] + this.d[1]*speed;
  return true;
};
