var Controller = function() {};

Controller.prototype.lastSentCode = 0;

Controller.prototype.state = {
  x: 0,
  y: 0,
  s: 0
};

Controller.prototype.send = function(x, y) {
  if (!conn) {
    return;
  };
  if (this.lastSentCode.x != this.state.x || this.lastSentCode.y != this.state.y || this.lastSentCode.s != this.state.s) {
    conn.send(this.state);
    this.lastSentCode = {
      'x': this.state.x,
      'y': this.state.y,
      's': this.state.s
    };
  };
};

Controller.prototype.shoot = function(s) {
  if (s) {
    this.state.s = 1;
  } else if (this.state.s == 1) {
    this.state.s = 0;
  };
  this.send();
};

Controller.prototype.left = function(s) {
  if (s) {
    this.state.x = -1;
  } else if (this.state.x == -1) {
    this.state.x = 0;
  };
  this.send();
};

Controller.prototype.right = function(s) {
  if (s) {
    this.state.x = 1;
  } else if (this.state.x == 1) {
    this.state.x = 0;
  };
  this.send();
};

Controller.prototype.up = function(s) {
  if (s) {
    this.state.y = -1;
  } else if (this.state.y == -1) {
    this.state.y = 0;
  };
  this.send();
};

Controller.prototype.down = function(s) {
  if (s) {
    this.state.y = 1;
  } else if (this.state.y == 1) {
    this.state.y = 0;
  };
  this.send();
};

var control = new Controller();
