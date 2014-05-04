define(['json2'], function() {

  // Websocket manager
  var module = function() {};

  module.prototype.__connectFn = function() {};
  module.prototype.__receiveFn = function() {};
  module.prototype.__closeFn = function() {};

  // Extra decoder, use a nil value for no decoding.
  module.prototype.decoder = null;

  // Internal WebSocket object.
  module.prototype.s = null;

  // Global connection status.
  module.prototype.__connected = false;

  module.prototype.connected = function() {
    return this.__connected;
  };

  // Define callback for successful connection.
  module.prototype.onConnect = function(fn) {
    this.__connectFn = fn;
  };

  // Define callback for data reception.
  module.prototype.onReceive = function(fn) {
    this.__receiveFn = fn;
  };

  // Define callback for websocket closing.
  module.prototype.onClose = function(fn) {
    this.__closeFn = fn;
  };

  // Closes websocket.
  module.prototype.close = function() {
    if (this.s) {
      this.s.close();
      this.s = null;
      this.__closeFn();
    };
  };

  // Initiates connection against the given host.
  module.prototype.connect = function(url) {

    this.close();

    this.s = new WebSocket(url);

    var $that = this;

    this.s.onerror = function(ev) {
      console.log('Ws.error:', ev);
    };

    this.s.onopen = function() {
      $that.__connected = true;
      $that.__connectFn();
      console.log('connected');
    };

    this.s.onclose = function() {
      $that.__connected = false;
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
            $that.__receiveFn(line);
          };
        };
      };
    };

  };

  // Sends a JSON encoded chunk of data.
  module.prototype.send = function(data) {
    var message = JSON.stringify(data);
    this.s.send(message);
  };

  return new module();
});
