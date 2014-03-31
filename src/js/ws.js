var SHOOTER_WS_URL = 'ws://shooter.io/w/';

var Ws = function() {
  this.init();
};

Ws.prototype.decoder = null;
Ws.prototype.s = null;
Ws.prototype.connected = false;

Ws.prototype.init = function() {
  //this.decoder = new Backstream(512);
  //this.connect('ws://' + location.host + '/w/');
  this.connect(SHOOTER_WS_URL);
};

Ws.prototype.onconnect = function(fn) {
  this.__connectFn = fn;
};

Ws.prototype.close = function() {
  this.s.close();
};

Ws.prototype.connect = function(url) {
  this.s = new WebSocket(url);
  var $that = this;
  this.s.onerror = function(ev) {
    console.log('error', ev);
  };
  this.s.onopen = function() {
    $that.connected = true;
    if (typeof $that.__connectFn == 'function') {
      $that.__connectFn();
      console.log('connected');
    };
  };
  this.s.onclose = function() {
    $that.connected = false;
  };
  this.s.onmessage = function(message) {
    //var data = $that.decoder.decode(message.data);
    var data = message.data;
    //console.log('recv: ', data.length/1024);
    if (data) {
      var lines = data.split('\n');
      for (var i = 0; i < lines.length; i++) {
        if (lines[i]) {
          var line = JSON.parse(lines[i]);
          $that.recv(line);
        };
      };
    };
  };
};

Ws.prototype.send = function(data) {
  var s = JSON.stringify(data);
  this.s.send(s);
};

Ws.prototype.recv = function(data) {
  update(data);
};
