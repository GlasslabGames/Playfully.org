(function() {

	window.GlassLabSDK = new _GlassLabSDK();

	function _GlassLabSDK() {
		this.httpRequest = null;
	}

	_GlassLabSDK.prototype.request = function( params ) {

		//console.log( "make request at: " + params.api );

		// Create the XML http request for the SDK call
		this.httpRequest = new XMLHttpRequest();

		// Set the object parameters and open the request
		this.httpRequest.apiKey = params.key;
		this.httpRequest.open( params.method, params.api, true );
		this.httpRequest.setRequestHeader( "Content-type", params.contentType );

		// Set the callback
		this.httpRequest.onreadystatechange = this.response;

		// Make the request
		this.httpRequest.send( params.data );
	}

	_GlassLabSDK.prototype.response = function() {

		// Check for completed requests
		if (this.readyState === 4) {
			// OK status, send the success callback
			if (this.status === 200 || this.status === 304) {
				document.getElementsByName( "flashObj" )[0].success( this.apiKey, this.responseText );
			}
			// All other status codes will return a failure callback
			else {
				document.getElementsByName( "flashObj" )[0].failure( this.apiKey, this.responseText );
			}
		}
	}
})();