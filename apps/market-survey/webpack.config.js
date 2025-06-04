const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: ['@voxer/api']
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
            '@voxer/api': path.resolve(__dirname, '../../apps/api/src/index.ts'),
        },
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
};
