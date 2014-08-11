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

	browser.get(serverAddress + landing.path);

	before(function() {

		// will be replaced
		landing.loginButton.locator.click();
		landing.login_teacher.locator.click();
		landing.field_email.locator.sendKeys(acct.user.teacher);
		landing.field_password.locator.sendKeys(acct.pass.teacher);
		landing.signInBtn.locator.click();

	});
	
	beforeEach(function() {
		browser.ignoreSynchronization = true;
	});

	describe('Registration flow', function() {
		it('#should register normally', function() {
			
		});
		it.skip('#should register with Edmodo credentials', function() {
			
		});
		it.skip('#should register with iCivics', function() {
			
		});
		
	});
	
	describe('Should show my dashboard correctly', function() {
		runTest(landing.footer);
		runTest(dashboard.activeNavLink);
		screenshot(resultDir + 'dashboard.general(teacher).png');
	});
	
	describe('Should show my class page correctly', function() {
		
		browser.get(serverAddress + classes.path);
		screenshot(resultDir + 'dashboard.classes(teacher).png');
		screenshot(resultDir + 'dashboard.classes-1(teacher).png');
		runTest(classes.classBar);

		// images look good
		// classCode matches
	});
	
	describe.skip('Should show my reports correctly', function() {
		browser.get(serverAddress + reports.path);
		
		
		screenshot(resultDir + 'dashboard.reports(teacher).png');
	});
	
	describe.skip('Should show support page correctly', function() {
		browser.get(serverAddress + support.path);
		
		
		screenshot(resultDir + 'dashboard.support(teacher).png');
	});
		
});