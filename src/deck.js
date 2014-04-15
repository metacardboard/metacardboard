var Deck;

Deck = (function() {
  function Deck() {
    this.gist_url = null;
    this.list = [];
    this.hash = null;
  }

  Deck.prototype.load = function(gist_url) {
    return console.log('LOOOL');
  };

  return Deck;

})();

module.exports = new Deck();
