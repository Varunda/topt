const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class InlineChunkHtmlPlugin {
    constructor(htmlWebpackPlugin, tests) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.tests = tests;
    }

    getInlinedTag(publicPath, assets, tag) {
        if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
            return tag;
        }
        const scriptName = publicPath
            ? tag.attributes.src.replace(publicPath, '')
            : tag.attributes.src;

        if (!this.tests.some(test => scriptName.match(test))) {
            return tag;
        }

        const asset = assets[scriptName];
        if (asset == null) {
            return tag;
        }

        return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
    }

    apply(compiler) {
        let publicPath = compiler.options.output.publicPath || '';
        if (publicPath && !publicPath.endsWith('/')) {
            publicPath += '/';
        }

        compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
            const tagFunction = tag =>
                this.getInlinedTag(publicPath, compilation.assets, tag);

            const hooks = this.htmlWebpackPlugin.getHooks(compilation);
            hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
                assets.headTags = assets.headTags.map(tagFunction);
                assets.bodyTags = assets.bodyTags.map(tagFunction);
            });
        });
    }
}

module.exports = {
    mode: "production",
    devtool: false,
    target: "web",

    watch: module.exports.mode === "development",
    watchOptions: {
        aggregateTimeout: 1000,
        ignored: /node_modules/
    },

    resolve: {
        symlinks: true
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
        new HtmlWebpackPlugin({
            inject: "head",
            template: "./personal.html",
            minify: "false"
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/])
    ],

    entry: "./personal.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, ".")
    }
};
