angular.module('checkSpec')
.factory('DetectionSvc',
    [
        '$q',
        '$timeout',
        '$http',
        function ($q, $timeout, $http) {
            var service = {
                /**
                 Property houses the browser detection object.

                 @property browser
                 @type Object
                 **/
                browser: {
                    identity: undefined,
                    version: undefined,
                    supported: undefined,
                    details: undefined
                },

                /**
                 Property houses the OS detection object.

                 @property OS
                 @type Object
                 **/
                OS: {
                    identity: undefined,
                    supported: undefined,
                    details: undefined
                },

                /**
                 Property houses the cookie detection object.

                 @property cookies
                 @type Object
                 **/
                cookies: {
                    enabled: undefined,
                    details: undefined
                },

                /**
                 Property houses the screen detection object.

                 @property screen
                 @type Object
                 **/
                screen: {
                    width: undefined,
                    height: undefined,
                    supported: undefined,
                    details: undefined
                },

                /**
                 Property houses array of potential browser objects.

                 @property dataBrowser
                 @type Array
                 **/
                dataBrowser: [
                    {
                        string: navigator.userAgent,
                        subString: 'Chrome',
                        identity: 'Chrome'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'OmniWeb',
                        versionSearch: 'OmniWeb/',
                        identity: 'OmniWeb'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'Apple',
                        identity: 'Safari',
                        versionSearch: 'Version'
                    },
                    {
                        prop: window.opera,
                        identity: 'Opera',
                        versionSearch: 'Version'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'iCab',
                        identity: 'iCab'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'KDE',
                        identity: 'Konqueror'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Firefox',
                        identity: 'Firefox'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'Camino',
                        identity: 'Camino'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Netscape',
                        identity: 'Netscape'
                    },
                    {
                        string: document.documentMode ? 'Internet Explorer' : null,
                        subString: 'Internet Explorer',
                        identity: 'Internet Explorer',
                        versionSearch: 'Internet Explorer'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Gecko',
                        identity: 'Mozilla',
                        versionSearch: 'rv'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Mozilla',
                        identity: 'Netscape',
                        versionSearch: 'Mozilla'
                    }
                ],

                /**
                 Property houses array of potential Operating System objects.

                 @property dataOS
                 @type Array
                 **/
                dataOS: [
                    {
                        string: navigator.platform,
                        subString: 'Win',
                        identity: 'Windows'
                    },
                    {
                        string: navigator.platform,
                        subString: 'Mac',
                        identity: 'Mac'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'iPhone',
                        identity: 'iPhone/iPod'
                    },
                    {
                        string: navigator.platform,
                        subString: 'Linux',
                        identity: 'Linux'
                    }
                ],

                /**
                 Property houses connection speed properties.

                 @property dataConnection
                 @type Object
                 **/
                dataConnection: {
                    image: '/assets/connection.jpg',
                    speed: 750
                },

                /**
                 Property houses array of supported operating systems.

                 @property supportedOS
                 @type Array
                 **/
                supportedOS: [
                    {
                        identity: 'Windows'
                    },
                    {
                        identity: 'Mac'
                    }
                ],

                /**
                 Property houses array of supported browsers.

                 @property supportedBrowsers
                 @type Array
                 **/
                supportedBrowsers: [
                    {
                        identity: 'Chrome',
                        version: 29
                    },
                    {
                        identity: 'Firefox',
                        version: 23
                    },
                    {
                        identity: 'Internet Explorer',
                        version: 10
                    }
                    /*,
                     {
                     identity: 'Safari',
                     version: 6
                     },

                     */
                ],

                /**
                 Property houses supported screen size properties.

                 @property supportedScreenSize
                 @type Object
                 **/
                supportedScreenSize: {
                    width: 1024,
                    height: 500
                },

                /**
                 Method searches the navigator object for the given dataString.
                 The dataString typically represents the name of browser. When
                 a match is found, the browser's version number is returned.

                 @method searchVersion
                 @param {String} dataString Browser string
                 @return {Number} Browser version
                 **/
                searchVersion: function (dataString) {
                    var index = dataString.indexOf(service.versionSearchString);
                    if (index === -1) {
                        return;
                    }
                    return parseFloat(dataString.substring(index + service.versionSearchString.length + 1));
                },

                /**
                 Method searches the navigator object for the given data property.

                 @method searchString
                 @param {String} data String to search
                 **/
                searchString: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var dataString = data[i].string;
                        var dataProp = data[i].prop;
                        service.versionSearchString = data[i].versionSearch || data[i].identity;
                        if (dataString) {
                            if (dataString.indexOf(data[i].subString) !== -1) {
                                return data[i].identity;
                            }
                        } else if (dataProp) {
                            return data[i].identity;
                        }
                    }
                },

                /**
                 Method attempts to match the passed identity parameter against
                 an array of supported operating systems.

                 @method isOSSupported
                 @param {String} identity Name of operation system
                 @return {Boolean}
                 **/
                isOSSupported: function (identity) {
                    var support = false;
                    angular.forEach(service.supportedOS, function (OS) {
                        if (identity === OS.identity) {
                            support = true;
                        }
                    });

                    return support;
                },

                /**
                 Method attempts to match the passed width and height parameters
                 against supported screen width and height properties.

                 @method isScreenSizeSupported
                 @param {Number} width Browser width
                 @param {Number} height Browser height
                 @return {Boolean}
                 **/
                isScreenSizeSupported: function (width, height) {
                    // Define.
                    var supported = true;

                    // Constrain width.
                    if (width < service.supportedScreenSize.width) {
                        supported = false;
                    }

                    // Constrain height.
                    if (height < service.supportedScreenSize.height) {
                        supported = false;
                    }

                    return supported;
                },

                /**
                 Method attempts to match the passed identify and version parameters
                 against an array of supported browsers.

                 @method isBrowserSupported
                 @param {String} identity Browser name
                 @param {String} version Browser version
                 @return {Boolean}
                 **/
                isBrowserSupported: function (identity, version) {
                    // Define.
                    var supported = false;

                    // Iterate over supported browsers identities.
                    angular.forEach(service.supportedBrowsers, function (browser) {
                        if (identity === browser.identity) {
                            if (version >= browser.version) {
                                supported = true;
                            }
                        }
                    });

                    return supported;
                },

                /**
                 Method attempts to match the passed speed parameter
                 against a supported data connection speed.

                 @method isConnectionSpeedSupported
                 @param {Number} speed Connection speed
                 @return {Boolean}
                 **/
                isConnectionSpeedSupported: function (speed) {
                    // Define.
                    var supported = false;

                    if (speed >= service.dataConnection.speed) {
                        supported = true;
                    }

                    return supported;
                },

                /**
                 Method gets the width and height of the browser.

                 @method getScreenSize
                 @return {Object} Screen object
                 **/
                getScreenSize: function () {
                    // Define.
                    var response = {};

                    // Initailize.
                    response.width =  window.screen.width || document.body.clientWidth;
                    response.height = window.screen.height || document.body.clientHeight;

                    // Update.
                    service.screen.width = response.width;
                    service.screen.height = response.height;

                    return response;
                },

                /**
                 Method gets connection support object.

                 @method getConnectionSupport
                 @param {Object} context scope object
                 @return {Object} Connection promise object
                 **/
                getConnectionSupport: function (context) {
                    // Define.
                    var deferred, imagePath, downloadSize, download, startTime;

                    // Initialize.
                    deferred = $q.defer();
                    imagePath = service.dataConnection.image + '?cb=' + Math.random();
                    downloadSize = 5616998;
                    download = new Image();
                    startTime = (new Date()).getTime();

                    // Onload event.
                    download.onload = function () {
                        context.$apply(function () {
                            // Define.
                            var endTime, duration, bitsLoaded, speedBps, speedKbps, speedMbps, response;

                            // Initialize.
                            response = {};
                            endTime = (new Date()).getTime();
                            duration = (endTime - startTime) / 1000;
                            bitsLoaded = downloadSize * 8;
                            speedBps = (bitsLoaded / duration).toFixed(2);
                            speedKbps = (speedBps / 1024).toFixed(2);
                            speedMbps = (speedKbps / 1024).toFixed(2);

                            // Response object.
                            response.kbps = speedKbps + ' kbps';
                            response.supported = service.isConnectionSpeedSupported(speedKbps);
                            if (response.supported) {
                                response.details = 'Your bandwidth (' + speedKbps + ' kbps) is supported.';
                            } else {
                                response.details = 'Your bandwidth (' + speedKbps + ' kbps) is not supported.';
                            }

                            deferred.resolve(response);
                        });
                    };

                    // Update image source path.
                    download.src = imagePath;

                    return deferred.promise;
                },

                /**
                 Method gets browser support object.

                 @method getBrowserSupport
                 @return {Object} Browser object
                 **/
                getBrowserSupport: function () {
                    // Define.
                    var response = {};

                    // Initialize.
                    response.identity = service.searchString(service.dataBrowser) || 'An unknown browser';
                    response.version = service.searchVersion(navigator.userAgent) || service.searchVersion(navigator.appVersion) || document.documentMode || 'an unknown version';
                    response.supported = service.isBrowserSupported(response.identity, response.version);

                    if (response.supported) {
                        response.details = response.identity + ' ' + response.version + ' is supported.';
                    } else {
                        response.details = response.identity + ' ' + response.version + ' is not supported.';
                    }

                    return response;
                },

                /**
                 Method gets screen support object.

                 @method getScreenSupport
                 @return {Object} Screen object
                 **/
                getScreenSupport: function () {
                    // Define.
                    var response = {}, screenSize;

                    // Initialize.
                    screenSize = service.getScreenSize();
                    response.width = screenSize.width;
                    response.height = screenSize.height;
                    response.supported = service.isScreenSizeSupported(screenSize.width, screenSize.height);

                    if (response.supported) {
                        response.details = response.width + 'x' + response.height + ' is supported.';
                    } else {
                        response.details = response.width + 'x' + response.height + ' is not supported.';
                    }

                    // Update.
                    service.screen = response;

                    return response;
                },

                /**
                 Method gets cookie support object.

                 @method getCookieSupport
                 @return {Object} Cookie object
                 **/
                getCookieSupport: function () {
                    // Define.
                    var response = {};

                    // Initialize.
                    response.enabled = (navigator.cookieEnabled) ? true : false;
                    response.details = (response.enabled) ? 'Cookies enabled.' : 'Cookies disabled.';

                    // Update.
                    service.cookies = response;

                    return response;
                },

                /**
                 Method gets operating system support object.

                 @method getOSSupport
                 @return {Object} OS object
                 **/
                getOSSupport: function () {
                    // Define.
                    var response = {};

                    // Initialize.
                    response.identity = service.searchString(service.dataOS) || 'an unknown OS';
                    response.supported = service.isOSSupported(response.identity);
                    response.details = (response.supported) ? response.identity + ' is supported.': response.identity + ' is not supported.';

                    // Update.
                    service.OS = response;

                    return response;
                },

                /**
                 Method executes initialization process.

                 @method initialize
                 **/
                initialize: function () {
                    service.browser = service.getBrowserSupport();
                    service.OS = service.getOSSupport();
                    service.cookies = service.getCookieSupport();
                    service.screen = service.getScreenSupport();
                }
            };
            service.initialize();

            return service;
        }
    ]
);

