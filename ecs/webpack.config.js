const path = require("path");
const transformers = require('@egret/ts-transformer');

module.exports = {
    mode: "development",
    devtool: false,

    entry: "./src/index.ts",
    output: {
        library: 'pro',
        libraryTarget: 'assign',

        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },

    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
                getCustomTransformers: (program) => {
                    return ({
                        before: [
                            transformers.emitClassName(program),
                            transformers.emitDefine({ DEBUG: true })
                        ]
                    })
                }
            }
        }
    ]
    },
    resolve: {
        extensions: [
            ".ts"
        ]
    }
};