var bus, deck, events, hub, store;

events = require('events');

store = require('store');

hub = require('./hub.coffee');

deck = require('./deck.coffee');

hub.connect().then(function(val) {
  var userList;
  console.log(val.room);
  userList = new goinstant.widgets.UserList({
    room: val.room,
    collapsed: false,
    position: 'left'
  });
  userList.initialize(function(err) {
    if (err) {
      throw err;
    }
  });
  $('#deck-source').keydown(function(e) {
    if (e.keyCode === 13) {
      return e.preventDefault();
    }
  }).keyup(function(e) {
    if (e.keyCode === 13) {
      return deck.load($(this).val());
    }
  });
  $('#load-deck').click(function(e) {
    return deck.load($('#deck-source').val());
  });
})["catch"](function(err) {
  console.log(err);
});

bus = new events.EventEmitter();
