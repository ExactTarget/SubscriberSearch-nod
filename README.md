#SubscriberSearch-nod
=================

SubscriberSearch-nod is an example application which illustrates how to create a Hub Exchange application utilizing Single Sign-on (SSO) for ExactTarget's Interactive Marketing Hub.

This sample app provides assets and examples that  demonstrate the basics of how to create a user-contextualized Subscriber Search app which implement ExactTarget's Fuel Platform.

Prior to working with these examples, you should feel confident using App Center [URL to App Center documentation]. App Center is the your primary interface to register as a developer and define applications upon which you can then build.

The source code for these sample applications are open sourced and the code provided is intended to quickly enable you with the core concepts of developing apps with ExactTarget.

The Subscriber Search app you'll be building offers beneficial functionality; however the Sample Apps should be considered proof of concept style coding and there may additional security / performance steps that are outside the scope of it's purpose.

##Prerequisites (basic understanding of the following):
* (x)HTML(5)
* CSS(3)
* JavaScript
* AJAX, REST and RESTful interactions
* SOAP
* Backbone.js (client-side JS MVC tool)
* Underscore.js (Backbone's only dependency)
* jQuery
* Node.js installed locally

## Nice-to-haves
* Volo installed locally

##Running Sample Apps
Nearly every sample application we provide will require your API Keys (clientId, clientSecret) and the proper understanding of how to use these assets, please make sure you take time to review our [App Center tutorial].

##Requirements
* Access to App Center on http://code.exacttarget.com
* Node.js v0.8.9+
* ExpressJS (framework understanding)

##Quick start
* Clone the repo onto your local computer.
* Create a new Hub Exchange application in App Center [needs link to App Center Directions]

### Application Paths 

        Login URL   : http://localhost:3000/login
        Home URL    : http://localhost:3000
        Logout URL  : http://localhost:3000/logout

* Publish your app in app center (this makes it available in the HUB
* Update the app-config.js file with the following app information (values for these come from App Center):

		Client ID
		Client Secret
		App Signature

* Commit your changes
* Start your app locally by running the command:
		node app
* Login to the Interactive Marketing Hub and then click your app

## Touchpoints
* App Center utilization
	* Creating an app in App Center
	* Defining our app's endpoints
	* Application Keys / Signature definitions
* Subscriber Search App build up
	* Server-side
		* Login URL
		* Redirect URL
		* Logout URL
		* Implementing the JWT (JSON Web Token)
	* Client-side
		* Fuel UX implementation
		* Fuel Platform API implementation
		* ExactTarget SOAP API implementation

For more information about setting up an applcation in App Center, please see http://code.exacttarget.com/devcenter/????
