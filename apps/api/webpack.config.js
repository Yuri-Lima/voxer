const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: [], // Bundle everything except node_modules
            additionalModuleDirs: ['../../node_modules'] // Include workspace node_modules
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            // Add any path mappings if needed in the future
        },
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
};
