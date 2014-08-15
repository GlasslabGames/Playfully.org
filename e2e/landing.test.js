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

		// Config
		config		 		= require('./lib/config.js'),
		resultDir  		= config.resultDir,
		serverAddress = config.serverAddress,
		minSize				= config.smallestDimensions;

describe("Landing Page - Not Logged In", function() {
	
		var autoTestRoutine = landing;
	
		before(function () {
			browser.get(serverAddress + landing.path);
//			browser.driver.manage().window().setSize(minSize.x, minSize.y);		// NOTE mobile
			screenshot(resultDir + 'landing.0(auto)');
		});
	
		for (var test in autoTestRoutine) {
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
//			browser.ignoreSynchronization = true;
		})
		
		it("#Should log in successfully - teacher", function() {
			
			var form = landing.login.subElements;
			
			landing.loginButton.locator.click();
			
			form.loginAsBtn.locator.teacher.click();	// NOTE <- Set to teacher here
			form.email.locator.sendKeys(acct.user.teacher);
			form.password.locator.sendKeys(acct.pass.teacher);
			screenshot(resultDir + 'landing.login-0(teacher)');
			form.submit.locator.click();
			
			screenshot(resultDir + 'landing.login-1(teacher)');
			expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
		});
		
		it("#Should log out successfully - teacher", function() {
			
			screenshot(resultDir + 'landing.login-2(teacher)');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.login-3(teacher)');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing.login-4(teacher)');
			expectCurrentUrlToMatch(serverAddress + landing.path);
		});

		it("#Should log in successfully - student", function() {
			browser.get(serverAddress + landing.path);
			
			var form = landing.login.subElements;
			
			landing.loginButton.locator.click();
			
			form.loginAsBtn.locator.student.click();	// NOTE <- Set to student here
			form.email.locator.sendKeys(acct.user.student);
			form.password.locator.sendKeys(acct.pass.student);
			screenshot(resultDir + 'landing.login-0(student)');
			form.submit.locator.click();
			screenshot(resultDir + 'landing.login-1student).png');
			
			expectCurrentUrlToMatch(serverAddress + dashboard.path.student);
			
		});
		
		it("#Should log out successfully - student", function() {
			
			screenshot(resultDir + 'landing.login-5(student)');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.login-6(student)');
			dashboard.logoutOption.locator.click();
			screenshot(resultDir + 'landing.login-7(student)');
			
			expectCurrentUrlToMatch(serverAddress + landing.path);
		});
	});
	
	describe('Reset password flow', function() {
		it.skip('#Should reset teacher password', function() {
			
		});
		
		it.skip('#Should reset student password', function() {
			
		});
	});
		
});
