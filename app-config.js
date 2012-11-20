exports.settings = {
    'port'          : 3000
    , 'uri'         : '//localhost:3000' //Without trailing slash
    , 'apiKeys'     : {
        // LocalNodeDemo App
        localNodeApp: {
            'appId'       : 'xg4x3x7az5zf23xfnwm7evje'
            , 'appSecret'   : 'GtfH9jymZHgBeKBVQFE8XjpE'
            , 'appSignature': 'eqx42cryopqg2utwy0ngwzc4lju1krmzld0jghcdnqgliqofuyc3qrlxq1mxmyzpikqeh4qx4gky3kevd0n1pzqu3dtudb1n5cs3no0gb4win03r5zs3ozmbfodmtnx1lnj0xrysic4pto2xo1nbycvwnah0xsr0ro21bwfokswji5cy1ezuvg5qhkmqpul53vwmbbjlxhwkbkeaml5u51typqol0yphvwlths4rnelfnaamqgxe0nus4tnyu2r'
        }
    }
    , 'debug'       : ( process.env.NODE_ENV !== 'production' || process.env['DEBUG'] )
        ? true
        : false
};

if( process.env.NODE_ENV == 'production' ) {
    settings.uri    = '[productionAppEndpointHere]';
    settings.port   = process.env.PORT || 80;
}
