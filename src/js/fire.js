define(['util', 'entity', 'sound'], function(util, entity, sound) {

  var module = util.extend(entity.entity);

  module.prototype.setup = function(data) {
    // Fires a sound if the beam is near the main ship.
    if (util.isNear(data.p[0], data.p[1])) {
      sound.fire();
    };
  };

  return module;
});
