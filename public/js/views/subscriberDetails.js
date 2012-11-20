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

            this.model = new Backbone.Model();

            //Render the view accordingly
            this.model.on( 'change:detailsModel', this.render );
        }

        , clean: function() {
        }

        , events: {
            'click #saveStatus': '_updateStatus'
        }

        , render: function() {
            var detailsModel;

            this.clean();

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

                //Format the created date

                templateObj.firstName       = detailsModel.get( 'firstName' );
                templateObj.lastName        = detailsModel.get( 'lastName' );
                templateObj.emailAddress    = detailsModel.get( 'emailAddress' );
                templateObj.created         = new Date.parse( detailsModel.get( 'created' ) ).toString( 'd' );
                templateObj.status          = detailsModel.get( 'status' );
                templateObj.subscriberId    = detailsModel.get( 'subscriberId' );
                templateObj.subscriberKey   = detailsModel.get( 'subscriberKey' );

                $('#subscriberDetails').html( Mustache.to_html( SubscriberDetailsTemplate, templateObj ) ); 
            }
        }

        , updateDetails: function( details ) {
            this.model.set( {
                detailsModel: details
            } );
        }

        , _displayDefaultMsg: function() {
            $('#detailsMsg').text( 'Please click the "View Details" button for a subscriber from the grid.' );
        }

        , _displayUpdateMsg: function() {
            $('#detailsMsg').text( 'Use the controls below to update a subscriber\'s status.' );
        }

        , _displaySubscriberDetails: function() {
            //
        }

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
