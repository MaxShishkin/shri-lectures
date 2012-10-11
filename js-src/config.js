requirejs.config({

  baseUrl: "./lib",

  paths: {
    "app": "../app"
  },

  shim: {
    'underscore': {
      exports: '_'
    },

    "backbone": {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
    },

    "bootstrap": {
        deps: ["jquery"]
    }
  },

});