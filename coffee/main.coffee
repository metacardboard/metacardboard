events = require('events')
deck = require('./deck.coffee')
connect = require('./connect.coffee')


bus = new events.EventEmitter()

# goinstant
url = 'https://goinstant.net/dashed/metacardboard'


connection = null
room = null

setroom = (roomname)->

    $('#roomname-label')
        .text(roomname)

    $('#roomname-input')
        .val(roomname)
        .attr("placeholder", roomname)

    return;

loaddeck = (gist_url)->
    deck.load(gist_url)
    return;

goinstant.connect(url).then((result)->

        connection = result

        # lobby
        room = result.rooms[0];

        setroom(room.name)

        $('#change-room')
            .click((e)->
                bus.emit('change-room', $('#roomname-input').val())
                )

        $('#deck-source').keydown((e)->
            if (e.keyCode is 13)
                e.preventDefault()

        ).keyup((e)->
            # enter key
            if (e.keyCode is 13)
                console.log($(this).val())
            # return false;


        )

        userList = new goinstant.widgets.UserList({
            room: room,
            collapsed: false,
            position: 'left'
        });

        userList.initialize((err)->

            if (err)
                throw err
        );

        # console.log(room.self().get())

        # return room.self().get();

    )
    .catch((err)->

        # TODO: error handling
        console.log(err);
    )

bus.on('change-room', (room_name) ->

    if(room_name?.length <= 0)
        return

    old_room = connection.connection.room(room.name)
    new_room = connection.connection.room(room_name)

    old_room.leave(()->
        return new_room.join()
            .then((_room)->
                room = _room.room
                setroom(room.name)
            )
    ).catch((err)->

        # TODO: error handling
        console.log(err);
    )
)
