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

            // This collection will act as the datagrid datasource
            this.subscriberCollection = new SubscriberCollection({
                columns: [
                    { property: 'emailAddress', label: 'Email Address', sortable: true },
                    { property: 'fullName', label: 'Full Name', sortable: true },
                    { property: 'viewDetails', label: '', sortable: false },
                    { property: 'status', label: 'Status', sortable: true },
                ]
                , formatter: function( items ) {
                    $.each( items, function( index, item ) {
                        item.emailAddress = item.get( 'emailAddress' );
                        item.fullName = item.get( 'firstName' ) + ' ' + item.get( 'lastName' );
                        item.viewDetails = '<button type="button" class="btn btn-primary viewDetails" id="' + item.get( 'subscriberId' ) + '">View Details</button>';
                        item.status = item.get( 'status' );
                    });
                }
            });

            // Bind to the collection's sync so when the details panel
            // saves data, the grid re-renders
            this.subscriberCollection.bind( 'sync' , function() {
                $( '#subscriberGrid' ).datagrid( 'renderData' );
            } );

            this.subscriberCollection.bind( 'reset' , _.bind( function() {
                this._updateDetails( { currentTarget: { id: this.lastSelectedSubscriberId } } );
            } , this ) );

            this.lastSelectedSubscriberId = null;
        }

        , clean: function() {
            // Tidy up
        }

        , events: {
            "click .btn.btn-primary.viewDetails": "_updateDetails"
        }

        , render: function() {
            this.clean();

            var templateObj = {};
            // The following are used for the datagrid UI
            templateObj.gridTitle = 'Subscriber Listings';
            templateObj.searchPlaceholder = 'Search for subscribers';

            $(this.el).html( Mustache.to_html( SubscriberGridView, templateObj ) );

            // Instantiate the datagrid and provide this view's
            // collection as its datasource
            $('#subscriberGrid').datagrid({
                dataSource: this.subscriberCollection
            });
        }

        // Pass the selected model to the subscriberDetails model
        , _updateDetails: function( evt ) {
            var model = this.subscriberCollection.where({ 'subscriberId': evt.currentTarget.id });
            this.lastSelectedSubscriberId = evt.currentTarget.id;
            $( this ).trigger( 'updateSubscriberDetails' , model );
        }
    });
});
