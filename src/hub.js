var Hub, promise, store, url;

store = require('store');

promise = require('when');

url = 'https://goinstant.net/dashed/metacardboard';

Hub = (function() {
  function Hub() {
    this.roomName = store.get('roomname') || 'lobby';
    this._displayName = store.get('displayname');
    this.connection = null;
  }

  Hub.prototype._userDefaults = function() {
    var userdefaults;
    userdefaults = {};
    if (this.roomName) {
      userdefaults.displayName = this.roomName;
    }
    return userdefaults;
  };

  Hub.prototype._room = function() {
    return this.connection.room(this.roomName);
  };

  Hub.prototype._user = function() {
    return this._room().self();
  };

  Hub.prototype.connect = function() {
    return goinstant.connect(url, {
      user: this._userDefaults()
    }).then((function(_this) {
      return function(result) {
        var obj, room;
        _this.connection = result.connection;
        room = _this._room();
        obj = {};
        if (!room.joined()) {
          return room.join(_this._userDefaults()).then(function(room, user) {
            _this._displayName = user.displayName;
            obj.room = room;
            obj.displayName = user.displayName;
            return obj;
          });
        }
        return room.self().get().then(function(result) {
          var user;
          user = result.value;
          _this._displayName = user.displayName;
          obj.room = room;
          obj.displayName = user.displayName;
          return obj;
        });
      };
    })(this));
  };

  Hub.prototype.displayName = function(_newName) {
    if (!!!_newName) {
      return this._displayName;
    }
    if (_newName.length <= 0) {
      return null;
    }
    return this._user().key('/displayName').set(_newName).then(function(result) {
      store.set('displayname', _newName);
      return result.value;
    });
  };

  Hub.prototype.users = function() {
    return this._room().users.get().then(function(result) {
      return console.log(result);
    });
  };

  return Hub;

})();

module.exports = new Hub();
