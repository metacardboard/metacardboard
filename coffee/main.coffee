# node.js
events = require('events')

# misc
store = require('store')

# app
hub = require('./hub.coffee')
deck = require('./deck.coffee')

hub.connect().then (val)->
    console.log(val.room)


    # userlist
    userList = new goinstant.widgets.UserList({
        room: val.room,
        collapsed: false,
        position: 'left'
    });

    userList.initialize (err)->
        if (err)
            throw err

    # deck loading
    $('#deck-source').keydown (e)->
        if (e.keyCode is 13)
            e.preventDefault()

    .keyup (e)->
        # enter key
        if (e.keyCode is 13)
            deck.load($(this).val())
        # return false;

    $('#load-deck').click (e)->
        deck.load($('#deck-source').val())

    return

.catch (err) ->
    # TODO: error
    console.log(err)
    return;

bus = new events.EventEmitter()
