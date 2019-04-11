const path = require("path");

module.exports = {
    mode: "development",
    devtool: false,

    entry: "./src/index.ts",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader",
            
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [
            ".ts"
        ]
    }
};