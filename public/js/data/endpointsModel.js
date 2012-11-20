define([
    'backbone'
], function( 
    Backbone
) {
    return Backbone.Model.extend({
        initialize: function() {
            console.log( 'endpoint Model init' );
        }
    });
});
