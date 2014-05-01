define(['jquery', 'ws', 'entity', 'ship', 'fire', 'powerup'], function($, ws, entity, ship, fire, powerup) {

  var update = function(data) {
    var i;
    for (i = 0; i < data.length; i++) {
      var line = data[i];
      if (line.fn) {
        if (line.fn == 'Create') {
          if (line.kind == 'ship') {
            if (typeof entity.All[line.id] == 'undefined') {
              var el = new ship.Ship(line.data);
              el.SetType(line.kind);
              el.SetId(line.id);
            };
          } else if (line.kind == 'ship-ai') {
            if (typeof entity.All[line.id] == 'undefined') {
              var el = new ship.Ship(line.data);
              el.SetType(line.kind);
              el.SetId(line.id);
            };
          } else if (line.kind == 'fire') {
            if (typeof entity.All[line.id] == 'undefined') {
              var el = new fire.Fire(line.data, line.kind);
              el.SetType(line.kind);
              el.SetId(line.id);
            };
          } else if (line.kind == 'powerup') {
            if (typeof entity.All[line.id] == 'undefined') {
              var el = new powerup.PowerUp(line.data, line.kind);
              el.SetType(line.kind);
              el.SetId(line.id);
            };
          };
        } else if (line.fn == 'Scores') {
          var table = $('#highscores');
          var tbody = table.find('tbody').empty();
          var j;
          for (j = 0; j < line.data.length; j++) {
            var tr = $('<tr>');
            tr.append($('<td>').text(place(j + 1)).addClass('place'));
            tr.append($('<td>').text(line.data[j].name));
            tr.append($('<td>').text(line.data[j].points).addClass('score'));
            tbody.append(tr);
          };
          $('#score-end-value').text($('#score-value').text());
        } else {
          var el = entity.All[line.id];
          if (typeof el != 'undefined') {
            el[line.fn](line.data || {});
          };
        };
      };
    };
  };

  // Game connection and main interface.
  var module = function() {};

  module.prototype.Init = function() {
    $('.frame-overlay').hide();

    $('#instructions').show();
    if (window.localStorage) {
      if (window.localStorage.name != undefined) {
        $('#gamertag').val(window.localStorage.name);
      };
    };
    $('#gamertag')[0].focus();
  };

  module.prototype.HideInstructions = function() {
    $('#instructions').fadeOut('slow');
  };

  module.prototype.Reset = function() {
    location.reload();

    return false;
  };

  module.prototype.Connect = function() {
    $that = this;

    if (ws.Connected() == false) {
      ws.Connect(WEBSOCKET_SERVICE);
      ws.OnReceive(update);

      var name = $.trim($('#gamertag').val());
      if (window.localStorage) {
        window.localStorage.name = name;
      };

      ws.OnConnect(function() {
        ws.Send({
          'name': name
        });
        $that.HideInstructions();
      });

    };

    return false;
  };

  module.prototype.End = function() {
    $('.frame-overlay').hide();
    $('#results').fadeIn();
    //$('#btn-restart')[0].focus();
    ws.Close();
  };

  return new module();

});
