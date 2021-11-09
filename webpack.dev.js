const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path')

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: [{
            directory: path.join(__dirname, 'public'),
            watch: false,
        }, {
            directory: path.join(__dirname, 'node_modules'),
            publicPath: '/node_modules',
            watch: false,
        }],
        hot: true,
        proxy: {
            '/api': {...localProxy},
            '/node-dev/': {...localProxy},
            '/node-sage/': {...localProxy},
            '/sage/': {...localProxy},
        },
        watchFiles: {
            paths: 'src/**/*',
            options: {
                cwd: path.join(__dirname, '/')
            }
        },
    },
    devtool: 'inline-source-map',
    plugins: []
});
