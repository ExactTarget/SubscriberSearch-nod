define([
    'backbone'
    , 'text!templates/subscriberGrid.html'
    , 'js/data/subscriberCollection'
    , 'underscore'
    , 'fuelux/all'
], function(
    Backbone
    , SubscriberGridView
    , SubscriberCollection
    , _
) {
    return Backbone.View.extend({
        initialize: function() {
            _.bindAll( this
                , 'clean'
                , 'render'
                , '_updateDetails'
            );

            this.subscriberCollection = new SubscriberCollection({
                columns: [
                    { property: 'emailAddress', label: 'Email Address', sortable: true },
                    { property: 'fullName', label: 'Full Name', sortable: true },
                    { property: 'viewDetails', label: '', sortable: false },
                    { property: 'status', label: 'Status', sortable: true },
                ]
                , formatter: function( items ) {
                    $.each( items, function( index, item ) {
                        //Handle empty name
                        if( '' == item.get( 'firstName' ) && '' == item.get( 'lastName' ) ) { var fullNameEmpty = 'N/A'; }
                        item.emailAddress = item.get( 'emailAddress' );
                        item.fullName = ( fullNameEmpty ) ? fullNameEmpty : item.get( 'firstName' ) + ' ' + item.get( 'lastName' );
                        item.viewDetails = '<button type="button" class="btn btn-primary viewDetails" id="' + item.get( 'subscriberId' ) + '">View Details</button>';
                        item.status = item.get( 'status' );
                    });
                }
            });

            this.subscriberCollection.bind( 'sync' , function() {
                $( '#subscriberGrid' ).datagrid( 'renderData' );
            } );

            this.subscriberCollection.bind( 'reset' , _.bind( function() {
                this._updateDetails( { currentTarget: { id: this.lastSelectedSubscriberId } } );
            } , this ) );

            this.lastSelectedSubscriberId = null;
        }

        , clean: function() {
        }

        , events: {
            "click .btn.btn-primary.viewDetails": "_updateDetails"
        }

        , render: function() {
            this.clean();

            var templateObj = {};
            templateObj.gridTitle = 'Subscriber Listings';
            templateObj.searchPlaceholder = 'Search for subscribers';

            $(this.el).html( Mustache.to_html( SubscriberGridView, templateObj ) );

            $('#subscriberGrid').datagrid({
                dataSource: this.subscriberCollection
            });
        }

        , _updateDetails: function( evt ) {
            var model = this.subscriberCollection.where({ 'subscriberId': evt.currentTarget.id });
            this.lastSelectedSubscriberId = evt.currentTarget.id;
            $( this ).trigger( 'updateSubscriberDetails' , model );
        }
    });
});
