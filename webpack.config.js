var path = require("path");

module.exports = {
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee" }
        ]
    },
    entry: "./coffee/main.coffee",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "metacardboard.js",
        // library: "metacardboard",
        // libraryTarget: "umd"
    },
    watch: true,
    watchDelay: 500,
    devtool: 'source-map'
}
