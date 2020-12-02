const path = require("path");
const glob = require("glob");
const webpack = require("webpack");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const entryFiles = glob.sync("./src/**/*.ts");

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
    // todo: are these necessary? "jquery": "jQuery",
    // todo: are these necessary? "vue": "Vue",
    // todo: are these necessary? "chartjs": "Chart"
    /* note: consider Chart from chartjs */
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],

  resolve: {
    symlinks: true,
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      "tcore": "topt-core"
    },
    extensions: ['*', '.js', '.vue', '.json', ".ts", ".js"], // why , ".d.ts"?
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })
    ]
  },

  entry: entryFiles,
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, ".")
  }
};
