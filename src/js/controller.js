// Generic controller logic.

define(function() {

  var module = function() {};

  module.prototype.__onStateChange = function() {};

  module.prototype.__lastSentCode = 0;

  module.prototype.__state = {
    x: 0,
    y: 0,
    s: 0
  };

  module.prototype.send = function(x, y) {
    if (this.__lastSentCode.x != this.__state.x || this.__lastSentCode.y != this.__state.y || this.__lastSentCode.s != this.__state.s) {
      this.__onStateChange(this.__state);
      this.__lastSentCode = {
        'x': this.__state.x,
        'y': this.__state.y,
        's': this.__state.s
      };
    };
  };

  // Defines a callback for when control state is changed.
  module.prototype.onStateChange = function(fn) {
    this.__onStateChange = fn;
  };

  // Shoot instruction.
  module.prototype.shoot = function(s) {
    if (s) {
      this.__state.s = 1;
    } else if (this.__state.s == 1) {
      this.__state.s = 0;
    };
    this.send();
  };

  // Left instruction.
  module.prototype.left = function(s) {
    if (s) {
      this.__state.x = -1;
    } else if (this.__state.x == -1) {
      this.__state.x = 0;
    };
    this.send();
  };

  // Right instruction.
  module.prototype.right = function(s) {
    if (s) {
      this.__state.x = 1;
    } else if (this.__state.x == 1) {
      this.__state.x = 0;
    };
    this.send();
  };

  // Up instruction.
  module.prototype.up = function(s) {
    if (s) {
      this.__state.y = -1;
    } else if (this.__state.y == -1) {
      this.__state.y = 0;
    };
    this.send();
  };

  // Down instruction.
  module.prototype.down = function(s) {
    if (s) {
      this.__state.y = 1;
    } else if (this.__state.y == 1) {
      this.__state.y = 0;
    };
    this.send();
  };

  return new module();
});
