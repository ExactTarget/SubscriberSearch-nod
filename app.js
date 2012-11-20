/**
 * App dependencies.
 * Thanks to jamhul & donpark on github
 */
var express         = require( 'express' )
    , fs            = require( 'fs' )
    , hbs           = require( 'hbs' )
    , http          = require( 'http' )
    , https         = require( 'https' )
    , jwt           = require( 'jwt-simple' )
    , path          = require( 'path' )
    , routes        = require( './routes' )
    , platform      = require( './routes/platform' ) // TODO: REMOVE -> Used ONLY for initial UI buildup
    , soap          = require( './routes/soap' )
    , utils         = require( './app/utils/utils' )
    , blocks        = {}
    , endpoints     = {}
    , sessions      = {}

// Arguments passed in from command line
var argv        = []
    , opts      = {}
    , options
    ;
  
for( var arg in process.argv ) {
    if(  '--' === arg.substr( 0, 2 ) ) {
        var parts = arg.split( '=' );
        opts[ parts[0].substr( 2 ).replace( '-', '_' ) ] = parts[1] || true;
    } else {
        argv.push( arg );
    }
}

// Merge options from siteConf with passed in arguments
options = utils.mergeOptions( utils.getConfig(), opts );

// Define express as framework
var app = express();

// development ONLY
if( 'development' == app.get( 'env' ) ) {
    console.log( 'APP IS IN DEVELOPMENT MODE' );
    app.set( 'port', process.env.PORT || 3000 );
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'hbs' );
    app.set( 'APIKey', 'localNodeApp' );
    app.use( express.favicon() );
    app.use( express.logger('dev') );
    app.use( express.bodyParser() );
    app.use( express.cookieParser() );
    app.use( express.session( { secret: '5458a100-1d06-11e2-892e-0800200c9a66' } ) ); // generic UUID
    app.use( express.methodOverride() );
    app.use( app.router );
    app.use( express.static( path.join( __dirname, 'public') ) );
    app.use( express.errorHandler() );
}

// production ONLY
if( 'production' == app.get( 'env' ) ) {
    console.log( 'APP IS IN PRODUCTION MODE' );
    app.set( 'port', process.env.PORT || 3000 );
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'hbs' );
    app.set( 'APIKey', 'nodeSampleApp' );
    app.use( express.favicon() );
    app.use( express.logger() );
    app.use( express.bodyParser() );
    app.use( express.cookieParser() );
    app.use( express.session( { secret: '5458a100-1d06-11e2-892e-0800200c9a61' } ) ); // generic UUID
    app.use( express.methodOverride() );
    app.use( app.router );
    app.use( express.static( path.join( __dirname, 'public') ) );
}

app.use( express.cookieSession() );

// Handlebars helpers
hbs.registerHelper( 'extend', function( name, context ) {
    var block = blocks[name];
    if( !block ) {
        block = blocks[name] = [];
    }

    block.push( context( this ) );
});

hbs.registerHelper( 'block', function( name ) {
    var val = ( blocks[name] || [] ).join( '\n' );

    // clear the block
    blocks[name] = [];
    return val;
});

// Enable CORS
app.all( '/*', function( req, res, next ) {
    // Process preflight if it is OPTIONS request
    if( 'OPTIONS' == req.method ) {
        res.header( 'Access-Control-Allow-Origin', '*' );
        res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
        res.header( 'Access-Control-Allow-Headers', 'origin, x-requested-with, x-file-name, content-type, cache-control' );
        res.send( 203, 'No Content' );
    }

    next();
});

// DEFINE GET ROUTES
app.get( '/', routes.index );
app.get( '/defineEndpoints', platform.getEndpoints );

// DEFINE POST ROUTES
app.post( '/searchSubscribers', soap.getSubscribers );
app.post( '/updateSubscriberStatus', soap.updateSubscriberStatus );
// This route specifically handles SSO & JWT
app.post('/login', function( req, res ) {
    // If we don't already have a token in the request session
    if( !req.session.token ) {
        var secret          = options.settings.apiKeys[app.get('APIKey')].appSignature
            , encodedJWT    = req.body.jwt
            , decodedJWT    = jwt.decode(encodedJWT, secret)
            , appId         = options.settings.apiKeys[app.get( 'APIKey' )].appId
            , appSecret     = options.settings.apiKeys[app.get( 'APIKey' )].appSecret
            ;

        // Sanity Check for SSO via HUB
        if( decodedJWT ) {
            //Used for inspecting the SOAP object
            //console.log( JSON.stringify( decodedJWT, null, 4 ) );
            req.session.token = decodedJWT.request.user.oauthToken;
            req.session.internalOauthToken = decodedJWT.request.user.internalOauthToken;
            req.session.refreshToken = decodedJWT.request.user.refreshToken;
            req.session.tokenExpiration = decodedJWT.exp;
        }

        if( req.session.token ) {
            // Make call to obtain the endpoints
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

            // Mount the endpoints through this request in the session
            var PlatformRequest = https.request( optionsObj, function( response ) {
                var data = {}
                    responseData = {}
                    ;

                response.on( 'data', function( chunk ) {
                    data = JSON.parse( chunk );
                    for( var i = 0; i < data.items.length; i++ ) {
                        var type = data.items[i].type.replace( /\s+/g, '' );
                        responseData[ type ] = data.items[i].url;
                    }
                });

                response.on( 'end', function() {
                    req.session.soap = responseData.soap;
                    req.session.rest = responseData.rest;
                    res.redirect( '/' );
                });
            });

            PlatformRequest.on( 'error', function( e ) {
                res.json( 500, e );
            });

            PlatformRequest.end();
        }
    }
});

// Define the server and the handler
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( "Express server listening on port " + app.get( 'port' ) );
});
