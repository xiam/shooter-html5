var PowerUp = Extend(Entity);

PowerUp.prototype.setup = function(data) {
  $(this.el).addClass('power-up').text(data.k);
};

