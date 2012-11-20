var https = require( 'https' )
    ;

exports.getEndpoints = function( req, res ) {
    var optionsObj = {
        'hostname': 'www.exacttargetapis.com',
        'port': 443,
        'path': '/platform/v1/endpoints?access_token=' + req.session.token,
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'Encoding': 'utf-8'
        }
    };

    var PlatformRequest = https.request( optionsObj, function( response ) {
        var data = {}
            responseData = {}
            ;

        response.on( 'data', function( chunk ) {
            data = JSON.parse( chunk );
            //console.log( data );
            //parse data into responseData format
            responseData.count = data.count;
            responseData.items = data.items;
            responseData.page = data.page;
            responseData.pageSize = data.pageSize;
            //console.log( 'responseData', responseData );
        });

        response.on( 'end', function() {
            res.json( 200, { count: responseData.count, items: responseData.items, page: responseData.page, pageSize: responseData.pageSize } );
        });
    });

    PlatformRequest.on( 'error', function( e ) {
        console.log( e )
    });

    PlatformRequest.end();
};
