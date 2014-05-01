define(['jquery', 'util', 'entity'], function($, util, entity) {
  var module = util.Extend(entity.Entity);

  module.prototype.Setup = function(data) {
    $(this.el).addClass('power-up').text(data.k);
  };

  return { 'PowerUp': module };
});
