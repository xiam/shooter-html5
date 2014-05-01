define(['json2'], function() {

  // Websocket manager
  var module = function() {};

  module.prototype.__connectFn = function() {};
  module.prototype.__receiveFn = function() {};

  // Extra decoder, use a nil value for no decoding.
  module.prototype.decoder = null;

  // Internal WebSocket object.
  module.prototype.s = null;

  // Global connection status.
  module.prototype.connected = false;

  module.prototype.Connected = function() {
    return this.connected;
  };

  // Define callback for successful connection.
  module.prototype.OnConnect = function(fn) {
    this.__connectFn = fn;
  };

  // Define callback for data reception.
  module.prototype.OnReceive = function(fn) {
    this.__receiveFn = fn;
  };

  // Closes websocket.
  module.prototype.Close = function() {
    if (this.s) {
      this.s.close();
      this.s = null;
    };
  };

  // Initiates connection against the given host.
  module.prototype.Connect = function(url) {

    this.Close();

    this.s = new WebSocket(url);

    var $that = this;

    this.s.onerror = function(ev) {
      console.log('Ws.Error:', ev);
    };

    this.s.onopen = function() {
      $that.connected = true;
      $that.__connectFn();
      console.log('connected');
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
            $that.__receiveFn(line);
          };
        };
      };
    };

  };

  // Sends a JSON encoded chunk of data.
  module.prototype.Send = function(data) {
    var message = JSON.stringify(data);
    this.s.send(message);
  };

  return new module();
});
