exports.settings = {
    'port'          : 3000
    , 'uri'         : '//localhost:3000' //Without trailing slash
    , 'apiKeys'     : {
        // LocalNodeDemo App
        localNodeApp: {
            'appId'       : ''
            , 'appSecret'   : ''
            , 'appSignature': ''
        }
    }
    , 'debug'       : ( process.env.NODE_ENV !== 'production' || process.env['DEBUG'] )
        ? true
        : false
};

if( process.env.NODE_ENV == 'production' ) {
    settings.uri    = '//fuelnodesampleapp.jit.su';
    settings.port   = process.env.PORT || 80;
}
