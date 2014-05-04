define(['jquery', 'ws', 'entity', 'ship', 'fire', 'powerup', 'isMobile', 'sound'], function($, ws, entity, ship, fire, powerup, isMobile, sound) {

  var place = function(i) {
    var i = parseInt(i);
    switch (i) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return i + 'th';
    }
    return i + '';
  };

  var update = function(data) {
    var i;
    for (i = 0; i < data.length; i++) {
      var line = data[i];
      if (line.fn) {
        if (line.fn == 'create') {
          if (line.kind == 'ship') {
            if (typeof entity.all[line.id] == 'undefined') {
              var el = new ship(line.data);
              el.setType(line.kind);
              el.setId(line.id);
            };
          } else if (line.kind == 'ship-ai') {
            if (typeof entity.all[line.id] == 'undefined') {
              var el = new ship(line.data);
              el.setType(line.kind);
              el.setId(line.id);
            };
          } else if (line.kind == 'fire') {
            if (typeof entity.all[line.id] == 'undefined') {
              var el = new fire(line.data, line.kind);
              el.setType(line.kind);
              el.setId(line.id);
            };
          } else if (line.kind == 'powerup') {
            if (typeof entity.all[line.id] == 'undefined') {
              var el = new powerup(line.data, line.kind);
              el.setType(line.kind);
              el.setId(line.id);
            };
          };
        } else if (line.fn == 'scores') {
          var table = $('#highscores');
          var tbody = table.find('tbody').empty();
          var j;
          var limit = 1000;
          if (isMobile.any) {
            limit = 3;
          };
          for (j = 0; j < Math.min(line.data.length, limit); j++) {
            var tr = $('<tr>');
            tr.append($('<td>').text(place(j + 1)).addClass('place'));
            tr.append($('<td>').text(line.data[j].name));
            tr.append($('<td>').text(line.data[j].points).addClass('score'));
            tbody.append(tr);
          };
          $('#score-end-value').text($('#score-value').text());
        } else {
          var el = entity.all[line.id];
          if (typeof el != 'undefined') {
            el[line.fn](line.data || {});
          };
        };
      };
    };
  };

  // Game connection and main interface.
  var module = function() {
    var $that = this;
    ws.onClose(function() {
      $that.end();
    });
  };

  module.prototype.init = function() {
    $('#loading').fadeOut();
    $('.frame-overlay').hide();

    $('#instructions').show();
    if (window.localStorage) {
      if (window.localStorage.name != undefined) {
        $('#gamertag').val(window.localStorage.name);
      };
    };
    $('#gamertag')[0].focus();
  };

  module.prototype.hideInstructions = function() {
    $('#instructions').fadeOut('slow');
  };

  module.prototype.reset = function() {
    location.reload();

    return false;
  };

  module.prototype.connect = function() {
    $that = this;

    if ($('#enable-sound').is(':checked')) {
      sound.setStatus(true);
    };

    if (ws.connected() == false) {
      ws.connect(WEBSOCKET_SERVICE);
      ws.onReceive(update);

      var name = $.trim($('#gamertag').val());
      if (window.localStorage) {
        window.localStorage.name = name;
      };

      ws.onConnect(function() {
        ws.send({
          'name': name
        });
        $that.hideInstructions();
      });

    };

    return false;
  };

  module.prototype.end = function() {
    $('.frame-overlay').hide();
    $('#results').fadeIn();
    //$('#btn-restart')[0].focus();
    ws.close();
  };

  return new module();

});
