#SubscriberSearch-nod
=================

SubscriberSearch-nod is an example application which illustrates how to create a Hub Exchange application utilizing Single Sign-on (SSO) for ExactTarget's Interactive Marketing Hub.

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

##Requirements
* Access to App Center on http://code.exacttarget.com
* Node.js v0.8.9+

##Quick start
1. Clone the repo onto your local computer.
2. Create a new Hub Exchange application in App Center
### Application Paths 

        Login URL   : http://localhost:3000/login
        Home URL    : http://localhost:3000
        Logout URL  : http://localhost:3000/logout

4. Update the app-config.js file with the following app information:

* Client ID
* Client Secret
* App Signature

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

This page provides assets and examples to demonstrate the creation of a user-contextualized Subscriber Search app which implement ExactTarget's Fuel Platform.
Prior to working with these exempts, you should thoroughly feel confident in using App Center [URL to App Center documentation]. App Center is the your primary interface to register as a developer and define applications upon which you can then build.
The source code for these sample applications are open sourced and the code provided is intended to quickly enable you with the core concepts of developing apps with ExactTarget.
The Subscriber Search app you'll be building through these tutorials offer beneficial functionality; however these tutorials should be considered proof of concept style coding and there may additional security / performance steps that are outside the scope of it's purpose.

##Running Sample Apps
Nearly every sample application we provide will require your API Keys (clientId, clientSecret) and the proper understanding of how to use these assets, please make sure you take time to review our [App Center tutorial].
