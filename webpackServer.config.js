//var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        //semaea_client: './src/Main.ts',
        semaea_server: './src/Server/App.ts'
        //parametric: './src/code/Showcase/Component/Parametric.tsx',
    },
    target: 'node',
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'output')
    },
    resolve: {
        // This path should always correspond tsconfig.json.compilerOptions.baseUrl
        root: path.resolve("src"),

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]

        // these are the defaults
        // modulesDirectories: ["web_modules", "node_modules"]
    },
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            /*{
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }*/
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    externals: {
        /*"react": "React",
        "React": "React",
        "React-Dom": "ReactDOM",
        "react-dom": "ReactDOM",
        "d3": "d3",
        "lodash": "_",
        "jquery": "jQuery",
        "rxjs": "Rx"*/
    },
    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin({
    //         names: ['vendor', 'manifest'] // Specify the common bundle's name.
    //     })
    // ]
};