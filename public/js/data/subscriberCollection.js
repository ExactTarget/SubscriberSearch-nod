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
                , 'parse'
                , '_convertName'
                , '_useDataCallback'
            );

            this._columns = options.columns;
            this._formatter = options.formatter;
            //this.start = null;
            this.count = null;
            //this.pages: null;
            //this.page: null;
            this.lastPageNumber = null;
            this.search = null;

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

        , url: '//localhost:3000/searchSubscribers'

        , columns: function() {
            return this._columns;
        }

        , data: function( options, callback ) {
            this.dataCallback = callback;
            this.fetch({ type: 'POST', data: { searchTerm: options.search }});
        }

        , parse: function( response ) {
            var parsedData = []
                dataLength = response.data.length
                ;

            this.count = response.total;
            this.lastPageNumber = 0; // TODO

            for( var i = 0; i < dataLength; i++ ) {
                var attrObj = {};
                for( var a = 0; a < response.data[i]['Attributes'].length; a++ ) {
                    var attrName = response.data[i]['Attributes'][a]['Name'];
                    var attrValue = response.data[i]['Attributes'][a]['Value'];
                    attrObj[attrName] = attrValue;
                }

                var tmpObj = {
                    emailAddress: response.data[i]['EmailAddress']
                    , subscriberId: response.data[i]['ID']
                    , status: response.data[i]['Status']
                    , created: response.data[i]['CreatedDate']
                    , subscriberKey: response.data[i]['SubscriberKey']
                    , emailTypePreference: response.data[i]['EmailTypePreference']
                    , firstName: this._convertName( attrObj['First Name'] )
                    , lastName: this._convertName( attrObj['Last Name'] )
                };

                parsedData.push( tmpObj );
            }

            return parsedData;
        }

        , _convertName: function( namePart ) {
            if( !_.isString( namePart ) ) {
                return '';
            } else {
                return namePart;
            }
        }
    });
});
