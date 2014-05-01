define(['jquery', 'util', 'entity'], function($, util, entity) {
  var module = util.extend(entity.entity);

  module.prototype.setup = function(data) {
    $(this.el).addClass('power-up').text(data.k);
  };

  return module;
});
