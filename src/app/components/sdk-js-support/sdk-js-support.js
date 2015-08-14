angular.module('sdk-js-support', [])
    .factory('SdkSupportService', function ($window, $state) {

        var xdm,
            sdk = $window.GlassLabSDK;

        if (sdk) {
            try {
                xdm = new sdk.XDMessage();

                xdm.on('api', function(params, callback){
                    params.success = function(responseData) {
                        callback({"success": responseData});
                    };
                    params.error = function(responseData) {
                        callback({"error": responseData});
                    };
                    sdk.request(params);

                });

                xdm.open();
            } catch(err) {
                // fails when not called within a client iframe, safe to ignore
            }
        }

        return {
            closeIframe: function() {
                if(xdm) {
                    // redirect to login so next time the sdk iframe is displayed, the login form is ready to go again
                    $state.go('sdk.sdkv2LoginOptions');
                    xdm.invoke("close-iframe");
                }
            },
            isInJsSdkIframe: function() {
                return !!xdm;
            }
        };
    });