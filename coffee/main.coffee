# node.js
events = require('events')

# misc
store = require('store')

# app
hub = require('./hub.coffee')
deck = require('./deck.coffee')

hub.connect().then (val)->
    console.log(val)

    # console.log(box.displayName('poop'))
    return

.catch (err) ->
    # TODO: error
    console.log(err)
    return;

bus = new events.EventEmitter()
