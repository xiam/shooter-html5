var Fire = Extend(Entity);

Fire.prototype.setup = function(data) {
  // Fires a sound if the beam is near the main ship.
  if (Util.isNear(data.p[0], data.p[1])) {
    Sound.fire();
  };
};
