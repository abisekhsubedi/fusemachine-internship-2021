const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = (env) => {

    const isProduction = env.production ? true : false;
    const envType = isProduction ? 'production' : 'development';

    // you don't have to do this in webpack 5 but stay with don't break it
    return {
        mode: envType,
        entry: ['./src/app.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/script.js'
        },
        /*Loaders*/
        module: {
            rules: [
                // for loading css, use style-loader while in production
                {
                    test: /\.css$/,
                    use: 'css-loader'
                },
                // for loading scss file
                {
                    test: /\.scss$/,
                    use: [
                        // fallback to style-loader in development
                        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                // for loading images
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]',
                            outputPath: 'images/',
                            publicPath: isProduction ? '../images/' : ''
                        }
                    }]
                },
                // for loading babel to for new JS syntax to work
                {
                    test: /\.js$/,
                    exclude: '/node_modules/',
                    use: ['babel-loader']
                },
                // for loading fonts
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]',
                            outputPath: 'fonts/',
                            publicPath: isProduction ? '../fonts/' : ''
                        }
                    }]
                }
            ]
        },
        // plugins
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            new CleanWebpackPlugin(['dist']),
            // htmlwebpackplugin
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/templates/index.html',
                title: 'Fusemachine assignment'
            }),
            new HtmlWebpackPlugin({
                filename: 'login.html',
                template: './src/templates/login.html',
                title: 'Fusemachine assignment'
            }),
            new HtmlWebpackPlugin({
                filename: 'settings.html',
                template: './src/templates/settings.html'
            }),
            new CopyWebpackPlugin([{
                from: 'src/templates',
                to: ''
            }]),
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                disable: !isProduction, // Disable during development
                pngquant: {
                    quality: '80-100'
                }
            }),
            new CopyWebpackPlugin([{
                from: 'src/images',
                to: 'images/[path][name].[ext]'
            }])
        ],
        // optimization
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    uglifyOptions: {
                        keep_classnames: true,
                        warnings: false
                    }
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        devServer: {
            contentBase: './dist',
            hot: true
        },
    };
};
