var box, bus, deck, events, store;

events = require('events');

store = require('store');

box = require('./connect.coffee');

deck = require('./deck.coffee');

box.connect().then(function(val) {
  console.log(val);
  console.log(box.displayName('poop'));
})["catch"](function(err) {
  console.log(err);
});

bus = new events.EventEmitter();
