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
		landing 	 = new pageObjs.landing(),
		dashboard  = pageObjs.dashboard,
		classes		 = pageObjs.classes,
		reports    = pageObjs.reports,
		support		 = pageObjs.support,

		// Config
		config		 = require('./lib/config.js'),
		resultDir  = config.resultDir,	// TODO add tstamp subfolder here
		serverAddress = config.serverAddress;


//// logout fn:
//var logout = function() {
//	dashboard.userIcon.locator.click();
//	dashboard.logoutOption.locator.click();
//};

describe("Teacher routines", function() {
	
	var testRoutine = 'teacher';
	
//	beforeEach(function() {
////		browser.ignoreSynchronization = true;
//	});

	describe('- registration flow', function() {
		it('#should register normally', function(done) {
			
			browser.get(serverAddress + landing.path);
			browser.sleep(600);
			
			var form = landing.register.subElements;
			var user = generateUser(testRoutine);
			
			landing.registerButton.locator.click();
      form.registerAsBtn.locator[testRoutine].click();
			form.firstName.locator.sendKeys(user.name);
			form.email.locator.sendKeys(user.email);
			form.password.locator.sendKeys(user.pass);
			form.passConfirm.locator.sendKeys(user.pass);
			form.policyChbx.locator.click();
			form.newsletterChbx.locator.click();
			
			screenshot(resultDir + testRoutine + '_register(glasslab)');
			form.submit.locator.click()
				.then(function() {
					browser.sleep(2000);		// had to increase to account for invariably delayed (4s+) response times
					screenshot(resultDir + testRoutine + '_register(glasslab)-2');
					form.closeWelcome.locator.click()
						.then(function() {
							browser.sleep(300);
							expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
							done();
						});
				});

		});
		
	});
	
	describe('- new teacher user flow', function(done) {
		
		it('#should show the dashboard and tour properly', function(done) {
			
			browser.sleep(500);
			screenshot(resultDir + testRoutine + '_newlyRegisteredTeacher');
			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
			done();
		
		});
		
		it('#should be able to add a new class', function(done) {
			
			// go to classes page
			element(by.binding("'navbar.link.classes' | translate")).click();		// TODO - move to page object
			screenshot(resultDir + testRoutine + '_classes-newClass-01');
			expectCurrentUrlToMatch(serverAddress + classes.path);
			
			// add class
			classes.addCourse.locator.click()
				.then(function() {
					screenshot(resultDir + testRoutine + '_classes-newClass-modal-1');
					classes.newCourseName.locator.sendKeys('newClass');
					classes.newCourseGrade.locator.click();
					classes.newCourseSubmit1.locator.click();
					screenshot(resultDir + testRoutine + '_classes-newClass-modal-2');
					element(by.css(".gl-course-game-thumbnail.gl-thumb-AA-1")).click();		// TODO - move to page object
					element(by.css('input.btn.gl-btn--blue')).click()		// TODO - move to page object
						.then(function() {
							browser.sleep(100);
							screenshot(resultDir + testRoutine + '_classes-newClass-modal-3');
							element(by.partialButtonText('Done')).click();		// TODO - move to page object
							screenshot(resultDir + testRoutine + '_classes-newClass-02');
							done();
						});
				});
			
		});
		
	});
		
});
