const path = require('path');
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    mode: "development",
    entry: ['babel-polyfill', path.resolve(__dirname, 'djsr/frontend/src/index.js')],
    output: {
        // options related to how webpack emits results

        // where compiled files go
        path: path.resolve(__dirname, "djsr/frontend/static/frontend/public/"),
        filename: '[name]-[hash].js',
        // 127.0.0.1/static/frontend/public/ where files are served from
        publicPath: "/static/frontend/public/",
        filename: 'main.js',  // the same one we import in index.html
    },
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test for js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {presets: ["@babel/env"]}
                },
            }
        ],
    },
    plugins: [
        new BundleTracker({
          path: __dirname,
          filename: "/djsr/webpack-stats.json",
        }),
    ],
};