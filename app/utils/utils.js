var utils = {};

utils.mergeOptions = function(options, defaultOptions) {
    if (!options || typeof options === 'function') {
        return defaultOptions;
    }
    
    var merged = {};

    for( var attrname in defaultOptions ) {
        merged[attrname] = defaultOptions[attrname];
    }
    
    for( var attrname in options ) {
        if ( options[attrname] ) {
            merged[attrname] = options[attrname];
        }
    }

    return merged;  
};

utils.getConfig = function() {
    var appConfig;
    
    try {
        // Usually we check for appConfig.js in project root.
        appConfig = require( '../../app-config' );
    } catch( e ) {
        try {
            appConfig = require(process.env.HOME+'/app-config'); // Looks for appConfig in home dir, used for no.de
        } catch( e ) {
            throw new Error( 'Could not load app\'s config.' );
        }
    }
    
    return appConfig;
}

module.exports = utils;
