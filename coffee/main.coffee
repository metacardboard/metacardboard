# node.js
events = require('events')

# misc
store = require('store')

# app
box = require('./connect.coffee')
deck = require('./deck.coffee')

box.connect().then (val)->
    console.log(val)

    console.log(box.displayName('poop'))
    return

.catch (err) ->
    # TODO: error
    console.log(err)
    return;

bus = new events.EventEmitter()
