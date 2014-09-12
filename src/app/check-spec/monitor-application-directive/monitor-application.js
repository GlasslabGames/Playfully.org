angular.module('playfully.checkSpec')
    .directive(
    'glMonitorApplication',
    [
        'DetectionSvc',
        'ConfigRsrc',
        function (DetectionSvc, ConfigRsrc) {
            return {
                restrict: 'A',
                require: 'glMonitorPanel',
                link: function (scope, element, attrs, ctrl) {
                    /**
                     Method extracts title attribute from directive attrs
                     object. The title is then pushed to the parent controller.

                     @method setTitle
                     **/
                    function setTitle() {
                        var title = (attrs.glMonitorApplication.length) ? attrs.glMonitorApplication : 'Application Requirements' ;
                        ctrl.setTitle(title);
                    }

                    /**
                     Method pushes setting object to a common API housed on
                     the parent controller.

                     @method addSetting
                     **/
                    function addSetting(setting) {
                        ctrl.addSetting(setting);
                    }

                    /**
                     Method configures setting object based upon a promise.

                     @method buildSetting
                     **/
                    function buildSetting(description, details, promise) {
                        // Define & Initialize.
                        var setting = {
                            description: description,
                            status: undefined,
                            details: undefined,
                            loading: false
                        };

                        // Promise.
                        promise.then(
                            function (response) {
                                setting.status = true;
                                setting.details = details.success;
                                addSetting(setting);
                            },
                            function (response) {
                                setting.status = false;
                                setting.details = details.error;
                                addSetting(setting);
                            }
                        );
                    }

                    /**
                     Method builds initial settings object for the underlying template.

                     @method buildPrepSetting
                     **/
                    function buildPrepSetting() {
                        // Define.
                        var tests = ['Browser', 'Operating System', 'Cookies', 'Screen Size', 'Server Connection', 'Connection Speed'],
                            settings = [];

                        // Iterate over tests.
                        angular.forEach(tests, function (test) {
                            settings.push({description: test, loading: true});
                        });

                        ctrl.addSettings(settings);
                    }

                    /**
                     Method builds browser setting object. The settings
                     object is then pushed to the parent controller.

                     @method buildBrowserSetting
                     **/
                    function buildBrowserSetting() {
                        var browser = DetectionSvc.browser,
                            setting = {
                                description: 'Browser',
                                status: browser.supported,
                                details: browser.details,
                                loading: false
                            };

                        addSetting(setting);
                    }

                    /**
                     Method builds operating system setting object. The settings
                     object is then pushed to the parent controller.

                     @method buildOSSetting
                     **/
                    function buildOSSetting() {
                        var OS = DetectionSvc.OS,
                            setting = {
                                description: 'Operating System',
                                status: OS.supported,
                                details: OS.details,
                                loading: false
                            };

                        addSetting(setting);
                    }

                    /**
                     Method builds cookie setting object. The settings
                     object is then pushed to the parent controller.

                     @method buildCookieSetting
                     **/
                    function buildCookieSetting() {
                        var cookies = DetectionSvc.cookies,
                            setting = {
                                description: 'Cookies',
                                status: cookies.enabled,
                                details: cookies.details,
                                loading: false
                            };

                        addSetting(setting);
                    }

                    /**
                     Method builds screen object. The settings
                     object is then pushed to the parent controller.

                     @method buildScreenSetting
                     **/
                    function buildScreenSetting() {
                        var screenSize = DetectionSvc.screen,
                            setting = {
                                description: 'Screen Size',
                                status: screenSize.supported,
                                details: screenSize.details,
                                loading: false
                            };

                        addSetting(setting);
                    }

                    /**
                     Method prepares the description, details and promise object
                     for the configuration setting object.

                     @method buildServerSetting
                     **/
                    function buildServerSetting() {
                        // Define.
                        var description, details, promise;

                        // Initialize.
                        description = 'Server Connection';
                        details = {
                            success: 'Server is connected.',
                            error: 'Server is not connected.'
                        };
                        promise = ConfigRsrc.get();

                        // Build setting.
                        buildSetting(description, details, promise);
                    }

                    /**
                     Method builds connection setting object. The settings
                     object is then pushed to the parent controller.

                     @method buildConnectionSetting
                     **/
                    function buildConnectionSetting() {
                        var connection = DetectionSvc.getConnectionSupport(scope);
                        connection.then(function (response) {
                            var setting = {
                                description: 'Connection Speed',
                                status: response.supported,
                                details: response.details,
                                loading: false
                            };

                            addSetting(setting);
                        });
                    }

                    /**
                     Method executes initialization process.

                     @method initialize
                     **/
                    function initialize() {
                        setTitle();
                        buildPrepSetting();
                        buildBrowserSetting();
                        buildOSSetting();
                        buildCookieSetting();
                        buildScreenSetting();
                        buildServerSetting();
                        buildConnectionSetting();
                    }

                    // Entry point for the directive.
                    initialize();
                }
            };
        }
    ]
);
