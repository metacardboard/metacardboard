var Connect, promise, store, url;

store = require('store');

promise = require('when');

url = 'https://goinstant.net/dashed/metacardboard';

Connect = (function() {
  function Connect() {
    this.roomName = store.get('roomname') || 'lobby';
    this._displayName = store.get('displayname');
    this.connection = null;
  }

  Connect.prototype.userDefaults = function() {
    var userdefaults;
    userdefaults = {};
    if (this.roomName) {
      userdefaults.displayName = this.roomName;
    }
    return userdefaults;
  };

  Connect.prototype.room = function() {
    return connection.room(this.roomName);
  };

  Connect.prototype.user = function() {
    return this.room().self();
  };

  Connect.prototype.connect = function() {
    return goinstant.connect(url, {
      user: this.userDefaults()
    }).then((function(_this) {
      return function(res) {
        var connection, obj, room;
        _this.connection = connection = res.connection;
        room = connection.room(_this.roomName);
        obj = {};
        if (!room.joined()) {
          return room.join(_this.userDefaults()).then(function(room, user) {
            _this._displayName = user.displayName;
            obj.roomName = _this.roomName;
            obj.displayName = user.displayName;
            return obj;
          });
        }
        return room.self().get().then(function(result) {
          var user;
          user = result.value;
          _this._displayName = user.displayName;
          obj.roomName = _this.roomName;
          obj.displayName = user.displayName;
          return obj;
        });
      };
    })(this));
  };

  Connect.prototype.displayName = function(_newName) {
    if (!!!_newName) {
      return this.display_name;
    }
    if (_newName.length <= 0) {
      return null;
    }
    return this.user().key('/displayName').set(_newName).then(function(result) {
      store.set('displayname', _newName);
      return result.value;
    });
  };

  return Connect;

})();

module.exports = new Connect();
