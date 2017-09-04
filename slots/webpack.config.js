const webpack = require("webpack");
const path = require('path');

const plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress:{
            warnings: false,
        }
    })
];

module.exports = {
    entry: './dev/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'static/js/'),
    },
    // plugins: plugins,
    module: {
        loaders: [{
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                },
            }
        ],
    }
};
