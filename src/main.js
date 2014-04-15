var bus, deck, events, hub, store;

events = require('events');

store = require('store');

hub = require('./hub.coffee');

deck = require('./deck.coffee');

hub.connect().then(function(val) {
  console.log(val);
})["catch"](function(err) {
  console.log(err);
});

bus = new events.EventEmitter();
