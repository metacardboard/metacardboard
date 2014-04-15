var Deck, promise, store;

store = require('store');

promise = require('when');

Deck = (function() {
  function Deck() {
    this.gist_url = store.get('deck_gist_url');
    this.list = store.get('deck_list') || [];
    this.hash = null;
  }

  Deck.prototype.load = function(gist_url) {
    $.ajax({
      url: 'https://api.github.com/gists/' + gist_url,
      type: 'GET',
      dataType: 'jsonp'
    }).success(function(rec) {
      var data, file, meta;
      meta = rec.meta;
      data = rec.data;
      if (meta.status !== 200) {
        return;
      }
      file = Object.keys(data.files)[0];
      return console.log(data.files[file].content);
    }).error(function(e) {
      return console.log(e);
    });
  };

  return Deck;

})();

module.exports = new Deck();
