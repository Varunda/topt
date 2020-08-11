const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  target: "web",

  watch: module.exports.mode === "development",
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules/
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  externals: {
    "chart.js": "Chart",
    "vue": "Vue"
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],

  resolve: {
    modules: [
      path.resolve(__dirname, "./"),
      path.resolve(__dirname, "./../..")
    ],
    extensions: ['*', '.js', '.vue', '.json', ".ts", ".js"], // why , ".d.ts"?
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })
    ]
  },

  entry: "app.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, ".")
  }
};
