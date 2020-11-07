//var webpack = require('webpack');
var path = require('path');

module.exports = {
    mode: 'development', // can also be 'production' or 'none'
    entry: {
        semaea_client: './src/Main.ts',
        //semaea_server: './src/Server/App.ts'
        //parametric: './src/code/Showcase/Component/Parametric.tsx',
    },
    target: 'web',
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'output')
    },
    resolve: {
        modules: [
            // This path should always correspond tsconfig.json.compilerOptions.baseUrl
            path.resolve("src")

            // these are the defaults
            , "web_modules", "node_modules"
        ],

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        
        fallback: { "path": require.resolve("path-browserify") }
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    devtool: "source-map",
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
