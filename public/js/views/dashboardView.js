define([
    'backbone'
    , 'text!templates/dashboard.html'
    , 'js/views/subscriberDetails'
    , 'js/views/subscriberGrid'
    , 'js/data/endpointsModel'
    , 'fuelux/all'
], function(
    Backbone
    , DashboardTemplate
    , SubscriberDetailsView
    , SubscriberGridView
    , EndpointsModel
) {
    return Backbone.View.extend({
        el: $('#primary')
        , initialize: function( options ) {
            _.bindAll( this
                , 'render'
                , 'clean'
                , 'updateSubscriberDetails'
                , '_defineEndpoints'
            );

            this.oAuthToken = $( '#accessToken' ).text();
            this.endpointModel = new EndpointsModel();
            this._defineEndpoints();
            
            this.endpointModel.on( 'change:soap', this.render );
        }

        , clean: function() {
        }

        , render: function() {
            this.clean();

            var templateObj = {};

            this.$el.html( DashboardTemplate, templateObj );

            this.sidebarView = new SubscriberDetailsView({
                el: $('#subscriberDetailsContainer')
            });
            this.gridView = new SubscriberGridView({
                el: $('#subscriberGridContainer')
            });

            $( this.gridView ).on( 'updateSubscriberDetails' , this.updateSubscriberDetails );

            this.sidebarView.render();
            this.gridView.render();
        }
        
        , updateSubscriberDetails: function( event , newDetails ) {
            this.sidebarView.updateDetails( newDetails );
        }

        , _defineEndpoints: function() {
            $.ajax({
                url: "//localhost:3000/defineEndpoints",
                type: 'GET',
                success: _.bind( function( response, textStatus, XHR ) {
                    for( var i = 0; i < response.count; i++ ) {
                        var type = response.items[i].type;
                        var url = response.items[i].url;
                        this.endpointModel.set( type, url );
                    }

                }, this )
                , error: function( XHR, textStatus, errorThrown ) {
                    //TODO: Handle error
                }
            });
        }

    });
});
