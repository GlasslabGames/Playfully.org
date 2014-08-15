var	chai	 			 = require('chai'),
		expect 			 = chai.expect,
		tools  			 = require('./lib/tools'),
		screenshot 	 = tools.screenshot,
		tstamp		 	 = tools.tstamp,
		runTest			 = tools.runTest,
		generateUser = tools.generateUser,
		acct			   = require('./mock_data/acct.js'),
		
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
};

describe("Teacher Test", function() {
	
	var testRoutine = 'teacher';

	beforeEach(function() {
		browser.ignoreSynchronization = true;
	});

	describe('Registration flow', function() {
		it('#should register normally', function(done) {
			
			browser.get(serverAddress + landing.path);
			
			var form = landing.register.subElements;
			var user = generateUser(testRoutine);
			
			landing.registerButton.locator.click()
				.then(function () {
					return form.registerAsBtn.locator[testRoutine].click(); // NOTE <- set to teacher here
				})
				.then(function () {
					return form.firstName.locator.sendKeys(user.name);
				})
				.then(function () {
					return form.email.locator.sendKeys(user.email);
					//			console.log(user.email);
				})
				.then(function () {
					return form.password.locator.sendKeys(user.pass);
				})
				.then(function () {
					return form.passConfirm.locator.sendKeys(user.pass);
				})
				.then(function () {
					screenshot(resultDir + testRoutine + '_register-normal-0');
					return form.policyChbx.locator.click();
				})
				.then(function () {
					return form.newsletterChbx.locator.click();
				})
				.then(function () {
					return form.submit.locator.click();
				})
				.then(function() {
					browser.sleep(400);			// FIXME
//					return form.closeWelcome.locator.getText()
//				})
//				.then(function(text) {
//					console.log("+++++++" + text + "''''''");
					form.closeWelcome.locator.click();
					screenshot(resultDir + testRoutine + '_register-normal-1');
					screenshot(resultDir + testRoutine + '_register-normal-2');
					expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
					return done();
				})
			
		});
		it.skip('#should register with Edmodo credentials', function() {
			
//			screenshot(resultDir + testRoutine + '_register-Edmodo');
			
		});
		it.skip('#should register with iCivics', function() {

//			screenshot(resultDir + testRoutine + '_register-iCivics');
		});
		
	});
	
	describe('Should show my dashboard correctly', function() {
		
		screenshot(resultDir + 'dashboard.general');
//    browser.sleep(50);
		screenshot(resultDir + 'dashboard.general-2');
		runTest(dashboard.activeNavLink, 'teacher');
		runTest(landing.footer);
		
	});
	
//	describe('Should show my class page correctly', function() {
//		
//		browser.get(serverAddress + classes.path);
//		screenshot(resultDir + 'dashboard.classes-0(teacher)');
//		screenshot(resultDir + 'dashboard.classes-1(teacher)');
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
//		screenshot(resultDir + 'dashboard.reports(teacher)');
//	});
//	
//	describe('Should show support page correctly', function() {		// NOTE will be redirect http://glasslabgames.org/support/
//		browser.get(serverAddress + support.path);
//		console.log('shouldnt get here');
//		
//		
//		screenshot(resultDir + 'dashboard.support(teacher)');
//	});
		
});
