var https = require( 'https' )
    , util = require( 'util' )
    , xml2js = require( 'xml2js' )
    ;

exports.getSubscribers = function( req, res ) {
    // Make sure we've got a search term
    try {
        var searchTerm = req.body.searchTerm;
    } catch( e ) {
        res.json( 500 , { error: 'Error: Must provide the searchTerm' } );
        return;
    }

    var msg = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
        msg += '<soapenv:Header>';
        msg += '<oAuth xmlns="http://exacttarget.com">';
            msg += '<oAuthToken>' + req.session.internalOauthToken + '</oAuthToken>';
        msg += '</oAuth>';
        msg += '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
            msg += '<wsse:UsernameToken wsu:Id="UsernameToken-32259181" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
                msg += '<wsse:Username>XXX</wsse:Username>';
                msg += '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">XXX</wsse:Password>';
            msg += '</wsse:UsernameToken>';
        msg += '</wsse:Security>';
    msg += '</soapenv:Header>';
    msg += '<soapenv:Body>';
        msg += '<RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">';
            msg += '<RetrieveRequest>';
                msg += '<ObjectType>Subscriber</ObjectType>';
                msg += '<Properties>ID</Properties>';
                msg += '<Properties>CreatedDate</Properties>';
                msg += '<Properties>Client.ID</Properties>';
                msg += '<Properties>EmailAddress</Properties>';
                msg += '<Properties>SubscriberKey</Properties>';
                msg += '<Properties>Status</Properties>';
                msg += '<Properties>UnsubscribedDate</Properties>';
                msg += '<Properties>EmailTypePreference</Properties>';
                msg += '<Filter xsi:type="SimpleFilterPart">';
                msg += '<Property>EmailAddress</Property>';
                msg += '<SimpleOperator>like</SimpleOperator>';
                msg += '<Value>' + searchTerm + '</Value>';
                msg += '</Filter>';
            msg += '</RetrieveRequest>';
        msg += '</RetrieveRequestMsg>';
    msg += '</soapenv:Body>';
    msg += '</soapenv:Envelope>';

    var optionsObj = {
        'hostname': 'webservice.exacttarget.com',
        'port': 443,
        'path': '/Service.asmx',
        'method': 'POST',
        'headers': {
            'Content-Type': 'text/xml',
            'SOAPAction': 'Retrieve',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
    };

    var SOAPRequest = https.request( optionsObj , function( response ) {
        //console.log( 'NODE::SearchTerm: ', searchTerm );
        var data = ''
            , responseData = {}
            ;

        response.on( 'data' , function( chunk ) {
            data += chunk;
        } );
        response.on( 'end' , function() {
            //console.log( 'XML Data: ', data );
            var parser = new xml2js.Parser({ignoreAttrs: true, explicitArray: false});
            data = parser.parseString( data, function( err, result ) {
                //console.log( util.inspect( result, false, null ) );
                //Make sure we have data before trying to parse
                if( result['soap:Envelope']['soap:Body']['RetrieveResponseMsg'].hasOwnProperty( 'Results' ) ) {
                    //console.log( 'has property' );
                    responseData.total = result['soap:Envelope']['soap:Body']['RetrieveResponseMsg']['Results'].length;
                    responseData.data = result['soap:Envelope']['soap:Body']['RetrieveResponseMsg']['Results'];
                } else {
                    //console.log( 'does not have property' );
                    responseData.total = 0;
                    responseData.data = [];
                }

                if( toString.call( responseData.data ) != '[object Array]' ) {
                    responseData.data = [ responseData.data ];
                }

                //console.log( responseData );
                
            });

            // handle data, send back to client using res
            res.json(200, { total: responseData.total, data: responseData.data } );
        } );
    } );

    //POST the request body
    SOAPRequest.write( msg );

    SOAPRequest.on( 'error', function( e ) {
        res.json( 500, e );
    });

    SOAPRequest.end();
};
