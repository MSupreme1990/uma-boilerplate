const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './build/js'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$|\.js$/,
                exclude: /node_modules/,
                loaders: 'babel-loader'
            }
        ]
    },
};
