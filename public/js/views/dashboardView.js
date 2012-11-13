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
            this.render();
        }

        , clean: function() {
        }

        , render: function() {
            this.clean();
            console.log( 'dashboard render' );

            var templateObj = {};

            this.$el.html( DashboardTemplate, templateObj );

            this.sidebarView = new SubscriberDetailsView({
                el: $('#subscriberDetailsContainer')
            });
            this.gridView = new SubscriberGridView({
                el: $('#subscriberGridContainer')
            });

            this.sidebarView.render();
            this.gridView.render();
        }

    });
});
