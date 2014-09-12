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
		pageObjs  = require('./page_objects/index.js'),
		landing 	= new pageObjs.landing(),
		dashboard = pageObjs.dashboard,
		classes		= pageObjs.classes,
		reports   = pageObjs.reports,
		mgoLogin  = pageObjs.mgoWebView.login,

		// Config
		config		 		= require('./lib/config.js'),
		resultDir  		= config.resultDir,
		serverAddress = config.serverAddress,
		minSize				= config.smallestDimensions;

describe.skip("Landing Page", function() {
	
	describe("- not logged in", function() {
	
			var autoTestRoutine = landing;

			before(function () {
				browser.get(serverAddress + landing.path);
	//			browser.driver.manage().window().setSize(minSize.x, minSize.y);		// NOTE mobile
				browser.sleep(50);    // FIXME - not ideal
				screenshot(resultDir + 'landing.initial(anon)');
			});

			for (var test in autoTestRoutine) {
				var testCase = autoTestRoutine[test];

				if (testCase.hasOwnProperty('ttype')) {
					runTest(testCase);
				} else {
	//				console.log(test);
				}
			}
	});
	
	describe("- login flow, existing users", function() {
		
		browser.get(serverAddress + landing.path);
		
		beforeEach(function() {
			browser.ignoreSynchronization = true;
		});
		
		it("#Should log in successfully - teacher", function(done) {
			
			var form = landing.login.subElements;
			
			landing.loginButton.locator.click();
			
			form.loginAsBtn.locator.teacher.click();	// NOTE <- Set to teacher here
			form.email.locator.sendKeys(acct.user.teacher);
			form.password.locator.sendKeys(acct.pass.teacher);
			screenshot(resultDir + 'landing.login(teacher)-01');
			form.submit.locator.click()
				.then(function() {
					browser.sleep(400);		// NOTE - allows modal shade to disappear
					screenshot(resultDir + 'landing.login(teacher)-02');
					expectCurrentUrlToMatch(serverAddress + dashboard.path.teacher);
					done();
				});
	
		});
		
		it("#have access to games page", function(done) {

			// go to games page
			element(by.binding("'navbar.link.games' | translate")).click();		// TODO - move to page object
			browser.sleep(150);
			screenshot(resultDir + 'landing.games(teacher)-01');
			expectCurrentUrlToMatch(serverAddress + pageObjs.games.path);
			done();

		});


		it("#have access to classes page", function(done) {

			// go to classes page
			element(by.binding("'navbar.link.classes' | translate")).click();		// TODO - move to page object
			browser.sleep(100);
			screenshot(resultDir + 'landing.classes(teacher)-01');
			expectCurrentUrlToMatch(serverAddress + classes.path);
			done();

		});

		it("#have access to reports page", function(done) {

			// go to reports page
			element(by.binding("'navbar.link.reports' | translate")).click();		// TODO - move to page object
			browser.sleep(300);		// NOTE - allows banner image to fully load
			screenshot(resultDir + 'landing.reports(teacher)-01');
			expectCurrentUrlToMatch(serverAddress + reports.path);

			// click games dropdown, screenshot
			reports.gameDropdown.locator.click();
			screenshot(resultDir + 'landing.reports(teacher)-02');
			
      // TODO - scroll below fold, all the juicy stuff is here
// 			browser.driver.manage().window().scrollTo(500);
			
//			screenshot(resultDir + 'landing.reports(teacher)-02cont');
        
        
			// TODO - check class dropdown toggle
			// TODO - filter by student
			// TODO - switch between classes
			// TODO - check popup text
			
			// switch to 21st century, screenshot
			element(by.css(".btn.ng-binding.ng-scope.ng-pristine.ng-valid.gl-btn--ltgrey")).click();
			screenshot(resultDir + 'landing.reports(teacher)-03');
			
			// click reports dropdown, switch to SOWO, screenshot
			reports.reportDropdown.locator.click();
			screenshot(resultDir + 'landing.reports(teacher)-04');
			
			// switch to SOWO, screenshot
			
			done();

		});
		
		it("#should log out successfully - teacher", function(done) {
			
			screenshot(resultDir + 'landing.logout(teacher)-01');
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.logout(teacher)-02');
			dashboard.logoutOption.locator.click()
				.then(function() {
					browser.sleep(150);
					screenshot(resultDir + 'landing.logout(teacher)-03');
					expectCurrentUrlToMatch(serverAddress + landing.path);
					done();
				});
			
		});

		it("#should log in successfully - student", function(done) {
			browser.get(serverAddress + landing.path);
			
			var form = landing.login.subElements;
			
			landing.loginButton.locator.click();
			
			form.loginAsBtn.locator.student.click();	// NOTE <- Set to student here
			form.email.locator.sendKeys(acct.user.student);
			form.password.locator.sendKeys(acct.pass.student);
			screenshot(resultDir + 'landing.login(student)-01');
			form.submit.locator.click()
				.then(function() {
					browser.sleep(400);		// NOTE - allows modal shade to disappear
					screenshot(resultDir + 'landing.login(student)-02');
					expectCurrentUrlToMatch(serverAddress + dashboard.path.student);
					done();
				});
		});
		
		it.skip("#should see dashboard and my games pages", function() {
			
			// check & ss dashboard
			
			// check & ss games
			
		});
		
		it("#should log out successfully - student", function(done) {
			
			dashboard.userIcon.locator.click();
			screenshot(resultDir + 'landing.logout(student)-01');
			dashboard.logoutOption.locator.click()
				.then(function() {
					browser.sleep(150);
					browser.pause();
					expectCurrentUrlToMatch(serverAddress + landing.path);
					screenshot(resultDir + 'landing.logout(student)-02');
					done();
				});
		});
	
	it("#should log in througuh the MGO web view successfully - student", function(done) {
		
			browser.get(serverAddress + mgoLogin.path);
			
			mgoLogin.emailField.locator.sendKeys(acct.user.student);
			mgoLogin.passwordField.locator.sendKeys(acct.pass.student);
			screenshot(resultDir + 'landing.loginMGO(student)-01');
      
      mgoLogin.submitBtn.locator.click()
        .then(function() {
            browser.sleep(150);
            screenshot(resultDir + 'landing.loginMGO(student)-02');
            done();
        });

		});
		
	});
	
	describe('- reset password flow', function() {
		it.skip('#should reset teacher password', function() {
			
		});
		
		it.skip('#should reset student password', function() {
			
		});
	});
	
});
