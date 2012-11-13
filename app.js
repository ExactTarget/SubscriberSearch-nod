/**
 * App dependencies.
 * Thanks to jamhul & donpark
 */
var express         = require( 'express' )
    , fs            = require( 'fs' )
    , hbs           = require( 'hbs' )
    , http          = require( 'http' )
    , jwt           = require( 'jwt-simple' )
    , path          = require( 'path' )
    , routes        = require( './routes' )
    , utils         = require( './app/utils/utils' )
    , blocks        = {}

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

app.get( '/', routes.index );

// handle SSO JWT
app.post('/login', function( req, res ) {
    if( !req.session.token ) {
        var secret          = options.settings.apiKeys[app.get('APIKey')].appSignature
            , encodedJWT    = req.body.jwt
            , decodedJWT    = jwt.decode(encodedJWT, secret)
            , appId         = options.settings.apiKeys[app.get( 'APIKey' )].appId
            , appSecret     = options.settings.apiKeys[app.get( 'APIKey' )].appSecret
            ;

        // Sanity Check for SSO via HUB
        if( decodedJWT ) {
            req.session.token = decodedJWT.request.user.oauthToken;
            req.session.tokenExpiration = decodedJWT.exp;

            var str = '<div style="padding: 20px;"><strong>Encoded JWT</strong>';
            str += '<div style="word-wrap: break-word; margin-bottom: 30px;">';
            str += encodedJWT;
            str += '</div>';
            str += '<strong>Decoded JWT</strong>';
            str += '<div style="width: 80%;"><code><pre>';
            str += JSON.stringify( decodedJWT, null, 4 );
            str += '</pre></code></div>';
            str += '</div>';
        }

        if( req.session.token ) {
            res.render( 'index', {
                appName: 'Subscriber Search'
                , content: str
            });
        }
    }
});

http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( "Express server listening on port " + app.get( 'port' ) );
});
