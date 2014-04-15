store = require('store')
promise = require('when')

class Deck

    constructor: ()->
        @gist_url = store.get('deck_gist_url')
        @list = store.get('deck_list') || []
        @hash = null

    load: (gist_url)->

        $.ajax({
          url: 'https://api.github.com/gists/'+gist_url,
          type: 'GET',
          dataType: 'jsonp'
        })
        .success (rec)->

            meta = rec.meta
            data = rec.data

            if(meta.status != 200)
                return;

            file = Object.keys(data.files)[0]

            console.log(data.files[file].content)
            # content = gistdata.data.files[filename].content;
            # DoSomethingWith(content)
        .error (e)->
            console.log(e)

        return


module.exports = new Deck()
