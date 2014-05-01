define(['util', 'entity', 'sound'], function(util, entity, sound) {

  var module = util.Extend(entity.Entity);

  module.prototype.Setup = function(data) {
    // Fires a sound if the beam is near the main ship.
    if (util.IsNear(data.p[0], data.p[1])) {
      sound.Fire();
    };
  };

  return { 'Fire': module };
});
