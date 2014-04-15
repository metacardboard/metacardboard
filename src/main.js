var bus, connect, connection, deck, events, loaddeck, room, setroom, url;

events = require('events');

deck = require('./deck.coffee');

connect = require('./connect.coffee');

bus = new events.EventEmitter();

url = 'https://goinstant.net/dashed/metacardboard';

connection = null;

room = null;

setroom = function(roomname) {
  $('#roomname-label').text(roomname);
  $('#roomname-input').val(roomname).attr("placeholder", roomname);
};

loaddeck = function(gist_url) {
  deck.load(gist_url);
};

goinstant.connect(url).then(function(result) {
  var userList;
  connection = result;
  room = result.rooms[0];
  setroom(room.name);
  $('#change-room').click(function(e) {
    return bus.emit('change-room', $('#roomname-input').val());
  });
  $('#deck-source').keydown(function(e) {
    if (e.keyCode === 13) {
      return e.preventDefault();
    }
  }).keyup(function(e) {
    if (e.keyCode === 13) {
      return console.log($(this).val());
    }
  });
  userList = new goinstant.widgets.UserList({
    room: room,
    collapsed: false,
    position: 'left'
  });
  return userList.initialize(function(err) {
    if (err) {
      throw err;
    }
  });
})["catch"](function(err) {
  return console.log(err);
});

bus.on('change-room', function(room_name) {
  var new_room, old_room;
  if ((room_name != null ? room_name.length : void 0) <= 0) {
    return;
  }
  old_room = connection.connection.room(room.name);
  new_room = connection.connection.room(room_name);
  return old_room.leave(function() {
    return new_room.join().then(function(_room) {
      room = _room.room;
      return setroom(room.name);
    });
  })["catch"](function(err) {
    return console.log(err);
  });
});
