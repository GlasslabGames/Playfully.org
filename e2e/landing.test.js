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
		acct			 = require('./mock_data/acct.js');		

//// Config ////
var serverAddress = "http://localhost:8001";
var resultDir = './e2e/results/';
////////////////

describe("Landing Page - Not Logged In", function() {
	
		var autoTestRoutine = landing;
	
		before(function () {
			browser.get(serverAddress + landing.path);
			screenshot(resultDir + 'landing.0(auto).png');
		});
	
		for (test in autoTestRoutine) {
			var testCase = autoTestRoutine[test];
			
			if (testCase.hasOwnProperty('ttype')) {
				runTest(testCase);
			} else {
//				console.log(test);
			}
		}
	
	describe("Login flow", function() {
		
		browser.get(serverAddress + landing.path);
		
		beforeEach(function() {
			browser.ignoreSynchronization = true;
		})
		
		it("should log in successfully - teacher", function() {
			
			landing.loginButton.locator.click();
			landing.login_teacher.locator.click();
			landing.field_email.locator.sendKeys(acct.user.teacher);
			landing.field_password.locator.sendKeys(acct.pass.teacher);
			screenshot(resultDir + 'landing.login-0(teacher).png');
			landing.signInBtn.locator.click();
			
			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
		});
		
		it("should log out successfully - teacher", function() {
			
			screenshot(resultDir + 'landing.login-2(teacher).png');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.login-3(teacher).png');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing.login-4(teacher).png');

			expectCurrentUrlToMatch(serverAddress + landing.path);
		});

		it("should log in successfully - student", function() {
			browser.get(serverAddress + landing.path);
			
			landing.loginButton.locator.click();
			landing.login_student.locator.click();
			landing.field_email.locator.sendKeys(acct.user.student);
			landing.field_password.locator.sendKeys(acct.pass.student);
			screenshot(resultDir + 'landing.login(student).png');
			landing.signInBtn.locator.click();
			screenshot(resultDir + 'landing.login-2(student).png');
			
			expectCurrentUrlToMatch(serverAddress + dashboard.path.student);
			
		});
		
		it("should log out successfully - student", function() {
			
			screenshot(resultDir + 'landing.login-5(student).png');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.login-6(student).png');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing.login-7(student).png');

			expectCurrentUrlToMatch(serverAddress + landing.path);
		});
	});
		
});
