var serverAddress = require('./config.js').serverAddress;

/**
 * Configuration file for Protractor
 */
exports.config = {
  // The address of a running selenium server. If specified, Protractor will
  // connect to an already running instance of selenium. This usually looks like
  // seleniumAddress: 'http://localhost:4444/wd/hub'
  seleniumAddress: 'http://localhost:4444/wd/hub',

  capabilities: {
    browserName: 'chrome',
  },
	
//	framework: 'mocha',
	
	mochaOpts: {
		ui: 'bdd',
		reporter: 'list'
	},

  specs: ['../*.test.js'],
  exclude: [],

//  // A base URL for your application under test. Calls to protractor.get()
//  // with relative paths will be prepended with this.
  baseUrl: serverAddress,

  // Selector for the element housing the angular app - this defaults to
  // body, but is necessary if ng-app is on a descendant of <body>  
  rootElement: 'html',

  // ----- The cleanup step -----
  //
  // A callback function called once the tests have finished running and
  // the webdriver instance has been shut down. It is passed the exit code
  // (0 if the tests passed or 1 if not).
  onCleanUp: function() {}
};
