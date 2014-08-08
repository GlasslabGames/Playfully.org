var tools   	 = require('./lib/tools'),
		chai	 		 = require('chai'),
		
		expect 		 = chai.expect,
		screenshot = tools.screenshot,
		tstamp		 = tools.tstamp,
		runTest		 = tools.runTest,
		expectCurrentUrlToMatch = tools.expectCurrentUrlToMatch,
		
		landing 	 = require('./page_objects/landing.js'),
		dashboard  = require('./page_objects/dashboard.js'),
		acct			 = require('./mock_data/acct.js');		

//// Config ////
var serverAddress = "http://localhost:8001";
var resultDir = './e2e/results/';
////////////////

describe("Landing Page - Not Logged In", function() {
	
		var testRoutine = landing;
	
		before(function () {
			browser.get(serverAddress + landing.path);
			screenshot(resultDir + 'landing-1(auto).png');
		});
	
		for (test in testRoutine) {
			var testCase = testRoutine[test];
			
			if (testCase.hasOwnProperty('ttype')) {
				runTest(testCase);
			} else {
				console.log(test);
			}
		}
	
	describe("Login flow", function() {
		
		browser.get(serverAddress + landing.path);
		
		it("should log in successfully - teacher", function() {
			
			landing.loginButton.locator.click();
			landing.login_teacher.locator.click();
			landing.field_email.locator.sendKeys(acct.teacher.email);
			landing.field_password.locator.sendKeys(acct.teacher.pass);
			screenshot(resultDir + 'landing-login(teacher).png');
			element(by.css("input.btn.gl-btn--blue")).click()
			screenshot(resultDir + 'landing-login-2(teacher).png');
			
			browser.getCurrentUrl()
			.then(function(url) {
				expect(url).to.eql(serverAddress + dashboard.path);
			});
		});
		
		it("should log out successfully - teacher", function() {
			browser.ignoreSynchronization = true;
			
			screenshot(resultDir + 'landing-login-3(teacher).png');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing-login-4(teacher).png');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing-login-5(teacher).png');

			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
		});

		it("should log in successfully - student", function() {
			
			browser.get(serverAddress + landing.path);
			
			landing.loginButton.locator.click();
			landing.login_student.locator.click();
			landing.field_email.locator.sendKeys(acct.student.email);
			landing.field_password.locator.sendKeys(acct.student.pass);
			// login
			screenshot(resultDir + 'landing-login(student).png');
			element(by.css("input.btn.gl-btn--blue")).click()		// FIXME
			screenshot(resultDir + 'landing-login-2(student).png');
			
			
		});
		
		it("should log out successfully - student", function() {
			browser.ignoreSynchronization = true;
			
			screenshot(resultDir + 'landing-login-3(student).png');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing-login-4(student).png');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing-login-5(student).png');

			expectCurrentUrlToMatch(serverAddress + dashboard.path.student);
		});
	});
		
});
