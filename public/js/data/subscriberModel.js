define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({
        initialize: function() {
        }

        // This will be used later when we need to update a subscriber
        // status
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
