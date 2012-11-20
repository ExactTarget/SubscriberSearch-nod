define([
    'backbone'
    , 'text!templates/dashboard.html'
    , 'js/views/subscriberDetails'
    , 'js/views/subscriberGrid'
    , 'fuelux/all'
], function(
    Backbone
    , DashboardTemplate
    , SubscriberDetailsView
    , SubscriberGridView
) {
    return Backbone.View.extend({
        el: $('#primary')
        , initialize: function( options ) {
            _.bindAll( this
                , 'render'
                , 'clean'
            );

            this.oAuthToken = $( '#accessToken' ).text();
            // We could have build up data to bind the render to here...but we don't
            // So let's just render this view right away
            this.render();
        }

        , clean: function() {
            // Clean up any cached objects and bindings
        }

        , render: function() {
            this.clean();
            //console.log( 'dashboard render' );

            // Define/render template
            var templateObj = {};
            this.$el.html( DashboardTemplate, templateObj );

            // Will contain the subscriber details
            this.sidebarView = new SubscriberDetailsView({
                el: $('#subscriberDetailsContainer')
            });

            // Will contain the FuelUX datagrid
            this.gridView = new SubscriberGridView({
                el: $('#subscriberGridContainer')
            });

            this.sidebarView.render();
            this.gridView.render();
        }

    });
});
