var	chai	 		 = require('chai'),
		expect 		 = chai.expect,
		tools  		 = require('./lib/tools'),
		screenshot = tools.screenshot,
		tstamp		 = tools.tstamp,
		runTest		 = tools.runTest;
		
		// Custom testing functions
		expectCurrentUrlToMatch = tools.expectCurrentUrlToMatch,
		expectObjTextToMatch 		= tools.expectObjTextToMatch,
		
		// Page Objects
		landing 	 = require('./page_objects/landing.js'),
		dashboard  = require('./page_objects/dashboard.js'),
		classes		 = require('./page_objects/classes.js'),
		acct			 = require('./mock_data/acct.js');		

//// Config ////
var serverAddress = "http://localhost:8001";
var resultDir = './e2e/results/';
////////////////


	describe("Classes Page", function() {
		
		browser.get(serverAddress + landing.path);
		
		beforeEach(function() {
			browser.ignoreSynchronization = true;
		})
		
		before(function() {
			
			landing.loginButton.locator.click();
			landing.login_teacher.locator.click();
			landing.field_email.locator.sendKeys(acct.user.teacher);
			landing.field_password.locator.sendKeys(acct.pass.teacher);
			landing.signInBtn.locator.click();
			
		});
		
		it('Should show my predefined class info correctly', function() {
			
			// desc looks good
			
			// images look good
			// classCode matches
			
		})