var	chai	 		 = require('chai'),
		expect 		 = chai.expect,
		tools  		 = require('./lib/tools'),
		screenshot = tools.screenshot,
		tstamp		 = tools.tstamp,
		runTest		 = tools.runTest,
		acct			 = require('./mock_data/acct.js'),
		
		// Custom testing functions
		expectCurrentUrlToMatch = tools.expectCurrentUrlToMatch,
		expectObjTextToMatch 		= tools.expectObjTextToMatch,
		
		// Page Objects
		pageObjs   = require('./page_objects/index.js'),
		landing 	 = pageObjs.landing,
		dashboard  = pageObjs.dashboard,
		classes		 = pageObjs.classes,
		reports    = pageObjs.reports,
		support		 = pageObjs.support,

		// Config
		config		 = require('./lib/config.js'),
		resultDir  = config.resultDir,
		serverAddress = config.serverAddress;

// logout fn:
var logout = function() {
	dashboard.userIcon.locator.click();
	dashboard.logoutOption.locator.click();
}

describe("Teacher Test", function() {

	beforeEach(function() {
		browser.ignoreSynchronization = true;
	});

	describe('Registration flow', function() {
		it('#should register normally', function() {
			
			// TODO - will be replaced with registration instead of login
			landing.loginButton.locator.click();
			landing.login_teacher.locator.click();
			landing.field_email.locator.sendKeys(acct.user.teacher);
			landing.field_password.locator.sendKeys(acct.pass.teacher);
			screenshot(resultDir + 'reg.login-0(teacher).png');
			landing.signInBtn.locator.click();
			
			screenshot(resultDir + 'reg.login-1(teacher).png');
			
			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
			
		});
		it.skip('#should register with Edmodo credentials', function() {
			
		});
		it.skip('#should register with iCivics', function() {
			
		});
		
	});
	
	describe('Should show my dashboard correctly', function() {
		
		screenshot(resultDir + 'dashboard.general(teacher).png');
		runTest(dashboard.activeNavLink, 'teacher');
		runTest(landing.footer);
		
	});
	
//	describe('Should show my class page correctly', function() {
//		
//		browser.get(serverAddress + classes.path);
//		screenshot(resultDir + 'dashboard.classes-0(teacher).png');
//		screenshot(resultDir + 'dashboard.classes-1(teacher).png');
////		runTest(classes.classBar);	// FIXME
//		
//		browser.sleep(1000);
//		
//		classes.classBar.locator.getText()
//			.then(function(text) {
//				console.log(text);
//			});
//
//		// images look good
//		// classCode matches
//	});
	
//	describe('Should show my reports correctly', function() {
//		browser.get(serverAddress + reports.path);
//		
//		screenshot(resultDir + 'dashboard.reports(teacher).png');
//	});
//	
//	describe('Should show support page correctly', function() {		// NOTE will be redirect http://glasslabgames.org/support/
//		browser.get(serverAddress + support.path);
//		console.log('shouldnt get here');
//		
//		
//		screenshot(resultDir + 'dashboard.support(teacher).png');
//	});
		
});