define([
    'backbone'
    , 'js/data/subscriberModel'
], function(
    Backbone
    , SubscriberModel
) {
    return Backbone.Collection.extend({
        model: SubscriberModel
        , initialize: function( options ) {

            _.bindAll( this
                , 'columns'
                , 'data'
            );

            this._columns = options.columns;
            this._formatter = options.formatter;
            this.count = null;
            this.lastPageNumber = null;
            this.search = null;

            // We'll be caching the FuelUX datagrid callback so we can
            // call it once we've received our SOAP results of
            // subscribers
            this.bind( 'reset' , this._useDataCallback );
        }

        , _useDataCallback: function() {
            if( this._formatter ) {
                var data = this.models
                this._formatter( data );
            }

            this.dataCallback({
                data: this.models
                , start: 0
                , end: this.models.length
                , count: this.models.length
                , pages: 1
                , page: 1
            });
        }

        // TODO: We'll define this in the next step in app.js
        , url: '//localhost:3000/searchSubscribers'

        // Required by the datagrid
        , columns: function() {
            return this._columns;
        }

        // Required by the datagrid
        , data: function( options, callback ) {
            this.dataCallback = callback;
            this.fetch({ type: 'POST', data: { searchTerm: options.search }});
        }
    });
});
