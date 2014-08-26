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

describe("Teacher routines", function() {
	
	var testRoutine = 'teacher';

	beforeEach(function() {
		browser.ignoreSynchronization = true;
	});

	describe('- registration flow', function() {
		it('#should register normally', function(done) {
			
			browser.get(serverAddress + landing.path);
			
//			browser.debugger();
			
			var form = landing.register.subElements;
			var user = generateUser(testRoutine);
			
			landing.registerButton.locator.click();
      form.registerAsBtn.locator[testRoutine].click(); // NOTE <- set to teacher here
			form.firstName.locator.sendKeys(user.name);
			form.email.locator.sendKeys(user.email);
			form.password.locator.sendKeys(user.pass);
			form.passConfirm.locator.sendKeys(user.pass);
			form.policyChbx.locator.click();
			form.newsletterChbx.locator.click();
			form.submit.locator.click();
			
			screenshot(resultDir + testRoutine + '_register(glasslab)');
			browser.sleep(900)
				.then(function() {
					screenshot(resultDir + testRoutine + '_register(glasslab)-2');
					form.closeWelcome.locator.click()
						.then(function() {
							browser.sleep(100)
							expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
							done();
						});
				});

		});
		
	});
	
	describe('New teacher flow', function() {
		
		it('#should show the dashboard and tour properly', function(done) {
			
			browser.sleep(300);		// NOTE to allow modal to close
			screenshot(resultDir + testRoutine + 'newlyRegisteredTeacher');
			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
			done();
		
		});
		
		it('#should be able to add a new class', function() {
			
			// go to classes page
			element(by.binding("'navbar.link.classes' | translate")).click();		// TODO - move to page object
			screenshot(resultDir + testRoutine + '_classes-newClass-01');
			expectCurrentUrlToMatch(serverAddress + classes.path);
			
			// add class
			
			
			
			// check class code string
			
		});
		
		it.skip('#should be able to see the reports page', function() {
			
		});
		
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
