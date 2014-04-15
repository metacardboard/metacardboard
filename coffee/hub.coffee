store = require('store')
promise = require('when')

url = 'https://goinstant.net/dashed/metacardboard'

class Hub
    constructor: ()->

        @roomName = store.get('roomname') or 'lobby'
        @_displayName = store.get('displayname')

        @connection = null

    # goinstant specific
    _userDefaults: ()->

        userdefaults = {}
        if(@roomName)
            userdefaults.displayName = @roomName

        return userdefaults

    _room: ()->
        return @connection.room(@roomName)

    _user: ()->
        return @_room().self()

    connect: ()->

        return goinstant.connect(url, {user: @_userDefaults()})
            .then (result)=>


                @connection = result.connection

                room = @_room()
                obj = {}

                if(!room.joined())
                    return room.join(@_userDefaults()).then (room, user)=>

                        @_displayName = user.displayName

                        obj.room = room
                        obj.displayName = user.displayName

                        return obj


                return room.self().get().then (result)=>

                    user = result.value

                    @_displayName = user.displayName

                    # obj.users =
                    obj.room = room
                    obj.displayName = user.displayName

                    return obj

            # .catch (err) =>
            #     if (err)
            #         @err = err
            #         @connected = false;
            #     return;

    displayName: (_newName)->

        if(!!!_newName)
            return @_displayName

        if(_newName.length <= 0)
            return null

        return @_user().key('/displayName').set(_newName).then (result)->

            store.set('displayname', _newName)

            return result.value

    users: ()->
        return @_room().users.get().then (result)->
            console.log(result)


module.exports = new Hub()
