define([
    'backbone'
    , 'text!templates/sidebar.html'
    , 'text!templates/subscriberDetails.html'
    , 'date'
    , 'fuelux/all'
], function(
    Backbone
    , SidebarTemplate
    , SubscriberDetailsTemplate
    , Date
) {
    return Backbone.View.extend({
        initialize: function() {
            _.bindAll( this
                , 'clean'
                , 'render'
                , 'updateDetails'
                , '_displayDefaultMsg'
                , '_displayUpdateMsg'
                , '_updateStatus'
            );

            // Create generic model to store the data for a given
            // subscriber
            this.model = new Backbone.Model();

            //TODO: Bind render to the data
            this.model.on( 'change:detailsModel', this.render );
        }

        , clean: function() {
            // Clean up cached objects and bindings
        }

        , events: {
            'click #saveStatus': '_updateStatus'
        }

        , render: function() {
            this.clean();

            var detailsModel;

            // Sidebar template object
            var templateObj = {};
            // Title remains the same
            templateObj.sidebarTitle = 'Subscriber Details';
            $(this.el).html( Mustache.to_html( SidebarTemplate, templateObj ) );

            detailsModel = this.model.get( 'detailsModel' );

            // Should always be the same template, just update the
            // message and template accordingly
            if( !detailsModel ) {
                this._displayDefaultMsg();
            } else {
                this._displayUpdateMsg();

                // Create template object
                templateObj.firstName       = detailsModel.get( 'firstName' );
                templateObj.lastName        = detailsModel.get( 'lastName' );
                templateObj.emailAddress    = detailsModel.get( 'emailAddress' );
                templateObj.created         = new Date.parse( detailsModel.get( 'created' ) ).toString( 'd' );
                templateObj.status          = detailsModel.get( 'status' );
                templateObj.subscriberId    = detailsModel.get( 'subscriberId' );
                templateObj.subscriberKey   = detailsModel.get( 'subscriberKey' );

                // Render template
                $('#subscriberDetails').html( Mustache.to_html( SubscriberDetailsTemplate, templateObj ) ); 
            }
        }

        // Provide way to update the model
        , updateDetails: function( details ) {
            this.model.set( {
                detailsModel: details
            } );
        }

        , _displayDefaultMsg: function() {
            $('#detailsMsg').text( 'Please search for subscribers, then click the "View Details" button for a subscriber from the grid.' );
        }

        , _displayUpdateMsg: function() {
            $('#detailsMsg').text( 'Use the controls below to update a subscriber\'s status.' );
        }

        , _displaySubscriberDetails: function() {
            //
        }

        // Handler to update the status use the same model from the
        // gridView which allows us to use it's save method
        , _updateStatus: function( evt ) {
            var detailsModel;
            detailsModel = this.model.get( 'detailsModel' );
            if( detailsModel ) {
                detailsModel.set( { status: $( '#statusValue' ).val() } );
                detailsModel.save();
            }
            this.model.set( {
                detailsModel: null
            } );
        }
    });
});
