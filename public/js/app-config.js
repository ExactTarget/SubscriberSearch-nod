requirejs.config({
    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.1/jquery.min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min',
        'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.1.1/bootstrap.min',
        'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min',
        'mustache': '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.5.0-dev/mustache.min',
        'date': '//cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min'
    },

    shim: {
        'underscore': {
            exports: '_'
        }
        , 'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
        , 'mustache': {
            exports: 'Mustache'
        }
        , 'date': {
            exports: 'Date'
        }
    }
});
