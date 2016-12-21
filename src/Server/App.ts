var requirejs = require("requirejs");

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,

    baseUrl: "output"
});

requirejs(['Server/Main'],
function (main: any) {
    //foo and bar are loaded according to requirejs
    //config, but if not found, then node's require
    //is used to load the module.
    main.run();
});