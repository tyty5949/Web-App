const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = env => {
  // create a nice object from the env variable
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    mode: 'production',
    resolve: {
      alias: {
        /* Semantic ui theme aliases */
        '../../theme.config$': path.join(__dirname, '/src_client/semantic-ui-theme/theme.config'),
        'semantic-ui-theme': path.resolve(__dirname, 'src_client/semantic-ui-theme'),

        /* Client aliases */
        less: path.resolve(__dirname, 'src_client/less/'),
        services: path.resolve(__dirname, 'src_client/js/services'),
        contexts: path.resolve(__dirname, 'src_client/js/contexts')
      }
    },
    entry: {
      app: ['./src_client/js/index.js']
    },
    output: {
      path: path.join(__dirname, 'build/'),
      publicPath: '/',
      filename: './js/[name].js',
      sourceMapFilename: '../sourcemaps/[name].js.map'
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.(css)$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            'less-loader'
          ]
        },
        {
          test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].css'
      }),
      new HtmlWebPackPlugin({
        template: './src_client/public/app.html',
        filename: './app.html'
      }),
      new HtmlWebPackPlugin({
        template: './src_client/public/login.html',
        filename: './login.html'
      })
    ]
  };
};
