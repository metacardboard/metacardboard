store = require('store')
promise = require('when')

url = 'https://goinstant.net/dashed/metacardboard'

class Hub
    constructor: ()->

        @roomName = store.get('roomname') or 'lobby'
        @_displayName = store.get('displayname')

        @connection = null

    userDefaults: ()->

        userdefaults = {}
        if(@roomName)
            userdefaults.displayName = @roomName

        return userdefaults

    room: ()->
        return connection.room(@roomName)

    user: ()->
        return @room().self()

    connect: ()->

        return goinstant.connect(url, {user: @userDefaults()})
            .then (result)=>


                @connection = connection = result.connection

                room = connection.room(@roomName)
                obj = {}

                if(!room.joined())
                    return room.join(@userDefaults()).then (room, user)=>

                        @_displayName = user.displayName


                        obj.roomName = @roomName
                        obj.displayName = user.displayName

                        return obj


                return room.self().get().then (result)=>

                    user = result.value

                    @_displayName = user.displayName



                    # obj.users =
                    obj.roomName = @roomName
                    obj.displayName = user.displayName

                    return obj

            # .catch (err) =>
            #     if (err)
            #         @err = err
            #         @connected = false;
            #     return;


    displayName: (_newName)->

        if(!!!_newName)
            return @display_name

        if(_newName.length <= 0)
            return null

        return @user().key('/displayName').set(_newName).then (result)->

            store.set('displayname', _newName)

            return result.value



module.exports = new Hub()
