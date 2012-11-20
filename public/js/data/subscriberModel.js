define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({
        initialize: function() {
        }

        , url: function() {
            return '//localhost:3000/updateSubscriberStatus';
        }

        , toJSON: function() {
            return {
                updatedStatus: this.get( 'status' )
                , subscriberId: this.get( 'subscriberId' )
            };
        }

        , defaults: {
            emailAddress: ''
            , subscriberId: ''
            , status: null
            , created: ''
            , subscriberKey: ''
            , emailTypePreference: ''
            , fullName: ''
        }
    });
});
