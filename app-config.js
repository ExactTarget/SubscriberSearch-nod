exports.settings = {
    'port'          : 3000
    , 'uri'         : '//localhost:3000' //Without trailing slash
    , 'apiKeys'     : {
        // LocalNodeDemo App
        localNodeApp: {
            'clientId'          : '' // TODO: Paste your clientId in the quotes
            , 'clientSecret'    : '' // TODO: Paste your clientSecret in the quotes
            , 'appSignature'    : '' // TODO: Paste your appSignature in the quotes
        }
    }
    , 'debug' : ( process.env.NODE_ENV !== 'production' || process.env['DEBUG'] )
        ? true
        : false
};

if( process.env.NODE_ENV == 'production' ) {
    settings.uri    = '[productionAppEndpointHere]';
    settings.port   = process.env.PORT || 80;
}
