var tools   	 = require('./lib/tools'),
		screenshot = tools.screenshot,
		runTest		 = tools.runTest,
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
			element(by.css(".login-button--instructor")).click();
			element(by.model('credentials.username')).sendKeys(acct.teacher.email);
			element(by.model('credentials.password')).sendKeys(acct.teacher.pass);
			// login
			screenshot(resultDir + 'landing-login(auto).png');
			element(by.css("input.btn.gl-btn--blue")).click()
			screenshot(resultDir + 'landing-login-2(auto).png');
		});
		
		it("should log out successfully - teacher", function() {
			
			screenshot(resultDir + 'landing-login-3(auto).png');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing-login-4(auto).png');

		});
			 
		it.skip("should log in successfully - student", function() {
			
			browser.get(serverAddress + landing.path);
			
			landing.loginButton.locator.click();
			element(by.css(".login-button--instructor")).click();
			element(by.model('credentials.username')).sendKeys(acct.teacher.email);
			element(by.model('credentials.password')).sendKeys(acct.teacher.pass);
			// login
			screenshot(resultDir + 'landing-login(auto).png');
			element(by.css("input.btn.gl-btn--blue")).click()
			screenshot(resultDir + 'landing-login-2(auto).png');
		});
		
//		browser.getCurrentUrl()
//			.then(function(url) {
//				console.log('url: ' + url);
//			});
//		
		
	});
		
});