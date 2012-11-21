var https = require( 'https' )
    , util = require( 'util' )
    , xml2js = require( 'xml2js' )
    ;

exports.getSubscribers = function( req, res ) {
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
                //TODO Handle xml2js parse error

                var soapEnvelope = result['soap:Envelope'];
                var soapBody = soapEnvelope['soap:Body'];
                //console.log( util.inspect( result, false, null ) );
                //Make sure we have data before trying to parse
                if( soapBody.hasOwnProperty( 'soap:Fault' ) ) {
                    responseData.error = true;
                    responseData.errorMsg = soapBody['soap:Fault']['faultstring'];
                } else if( soapBody['RetrieveResponseMsg'].hasOwnProperty( 'Results' ) ) {
                    responseData.total = soapBody['RetrieveResponseMsg']['Results'].length;
                    responseData.data = soapBody['RetrieveResponseMsg']['Results'];
                } else {
                    responseData.total = 0;
                    responseData.data = [];
                }

                if( toString.call( responseData.data ) != '[object Array]' ) {
                    responseData.data = [ responseData.data ];
                }
            });

            // handle response (either error or data)
            if( responseData.error ) {
                res.json( 401, { error: responseData.errorMsg } );
            } else {
                res.json( 200, { total: responseData.total, data: responseData.data } );
            }
        } );
    } );

    //POST the request body
    SOAPRequest.write( msg );

    SOAPRequest.on( 'error', function( e ) {
        res.json( 500, e );
    });

    SOAPRequest.end();
};

exports.updateSubscriberStatus = function( req, res ) {
    try {
        var updatedStatus = req.body.updatedStatus;
    } catch( e ) {
        res.json( 500 , { error: 'Error: must provide the updatedStatus' } );
        return;
    }

    try {
        var subscriberId = req.body.subscriberId;
    } catch( e ) {
        res.json( 500 , { error: 'Error: must provide the subscriberId' } );
        return;
    }

    var msg = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
        msg += '<soap:Header>';
        msg += '<oAuth xmlns="http://exacttarget.com">';
            msg += '<oAuthToken>' + req.session.internalOauthToken + '</oAuthToken>';
        msg += '</oAuth>';
        msg += '<wsse:Security soap:mustUnderstand="1">';
            msg += '<wsse:UsernameToken wsu:Id="SecurityToken-0c530ced-95e8-4700-94f6-daba49999931">';
                msg += '<wsse:Username>ccc</wsse:Username>';
                msg += '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">ccc</wsse:Password>';
            msg += '</wsse:UsernameToken>';
        msg += '</wsse:Security>';
    msg += '</soap:Header>';
    msg += '<soap:Body>';
        msg += '<UpdateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">';
            msg += '<Objects xsi:type="Subscriber">';
            msg += '<ID>' + subscriberId + '</ID>';
                msg += '<Status>' + updatedStatus+ '</Status>';
            msg += '</Objects>';
        msg += '</UpdateRequest>';
    msg += '</soap:Body>';
    msg += '</soap:Envelope>';

    var optionsObj = {
        'hostname': 'webservice.exacttarget.com',
        'port': 443,
        'path': '/Service.asmx',
        'method': 'POST',
        'headers': {
            'Content-Type': 'text/xml',
            'SOAPAction': 'Update',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
    };

    var SOAPRequest = https.request( optionsObj , function( response ) {
        var data = ''
            , responseData = {}
            ;
        response.on( 'data' , function( chunk ) {
            data += chunk;
            //console.log( 'XML Data: ', data );
            var parser = new xml2js.Parser({ignoreAttrs: true, explicitArray: false});
            data = parser.parseString( data, function( err, result ) {
                //console.log( util.inspect( result, false, null ) );
                responseData.data = result['soap:Envelope']['soap:Body']['UpdateResponse']['Results'];
            });
        } );
        response.on( 'end' , function() {
            // handle data, send back to client using res
            res.json(200, { data: responseData.data } );
        } );
    } );

    SOAPRequest.write( msg );

    SOAPRequest.on( 'error', function( e ) {
        res.json( 500, e );
    });

    SOAPRequest.end();
};
