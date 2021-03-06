const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function baseConfig({ environment, devtool }) {
    return {
        context: __dirname,

        entry: [
            './src/index',
        ],

        output: {
            path: path.resolve(__dirname, '../server/public/build'),
            filename: 'bundle.js',
        },
        devtool: devtool,

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                useBabel: true,
                                babelOptions: {
                                    presets: [
                                        'react',
                                    ],
                                    plugins: [
                                        'react-hot-loader/babel',
                                    ],
                                },
                            },
                        },
                    ],
                },

                {
                    test: /\.jsx?$/,
                    include: /node_modules.react-icons/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['es2015', { modules: false }],
                                    'react',
                                ],
                                plugins: [
                                    'react-hot-loader/babel',
                                ],
                            },
                        },
                    ],
                },

                {
                    test: /\.{jpg|svg|png|gif}$/,
                    use: [
                        {loader: 'file-loader'},
                    ],
                },
            ],
        },

        plugins: [
            new CheckerPlugin(),

            new webpack.WatchIgnorePlugin([
                /scss\.d\.ts$/,
            ]),

            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(environment),
            }),
        ],
    };
}

function developmentConfig(config, { devServer }) {
    // Styles
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            { loader: 'style-loader' },
            {
                loader: 'typings-for-css-modules-loader',
                options: {
                    namedExport: true,
                    modules: true,
                    localIdentName: '[name]-[local]-[hash:base64:5]',
                    importLoaders: 1,
                },
            },
            { loader: 'sass-loader' },
        ],
    });

    // Dev server
    if (devServer) {
        config.entry.unshift('react-hot-loader/patch');
        config.entry.unshift('webpack-dev-server/client?http://localhost:8080');

        config.devServer = {
            host: 'localhost',
            port: 8080,
            hot: true,
            overlay: true,
            publicPath: 'http://localhost:8080/build/',
            headers: { 'Access-Control-Allow-Origin': '*' },
        };

        config.output.publicPath = 'http://localhost:8080/build/';
    }

    return config;
}

function productionConfig(config) {
    config.output.publicPath = '/build/';

    // Styles
    const extractStyles = new ExtractTextPlugin({
        filename: '[name].css',
    });

    config.module.rules.push({
        test: /\.scss$/,
        use: extractStyles.extract([
            {
                loader: 'css-loader',
                options: {
                    namedExport: true,
                    modules: true,
                    localIdentName: '[name]-[local]-[hash:base64:5]',
                    importLoaders: 1,
                },
            },
            { loader: 'sass-loader' },
        ]),
    });

    config.plugins.push(extractStyles);

    // Optimize bundle
    config.plugins.push(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }));

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: config.devtool !== false,
    }));

    return config;
}

function config({
    environment = 'development',
    devServer = false,
    devtool = false,
} = {}) {
    const environmentConfig = environment === 'development' ? developmentConfig : productionConfig;

    const env = {
        environment,
        devServer,
        devtool,
    };

    return environmentConfig(baseConfig(env), env);
}

module.exports = config;
