describe("Password reset", function() {
  var ptor;

  var InstructorLoginModal = function() {
    this.forgotPasswordLink = element(by.css('a[ui-sref=passwordReset]'));

    this.get = function() {
      browser.get('/login/instructor');
      ptor = protractor.getInstance();
    };

  };

  it('should display a forgot password link on login modal', function() {
    var loginModal = new InstructorLoginModal();
    loginModal.get();
    expect(ptor.isElementPresent(loginModal.forgotPasswordLink)).toBe(true);
    expect(loginModal.forgotPasswordLink.getText()).toBe('Forgot your password?');
  });

  it('should display a password reset modal when clicking Forgot Password link', function() {
    var loginModal = new InstructorLoginModal();
    loginModal.get();
    ptor.sleep(1000);
    loginModal.forgotPasswordLink.click();
    ptor.waitForAngular();
    expect(ptor.getCurrentUrl()).toContain('forgot-password');
  }, 10000);


  // it("should have an H1 tag that reads 'Playfully'", function() {
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();
  //   expect(ptor.isElementPresent(loggedOutHome.title)).toBe(true);
  //   expect(loggedOutHome.title.getText()).toBe('Playfully.');
  // });

  // it("should display a Sign In button", function() {
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();
  //   expect(loggedOutHome.signInButton.getText()).toBe('Sign In');
  // });

  // it("should display a modal when clicking Sign In button", function() {
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();
  //   expect(ptor.isElementPresent(by.css('.modal-dialog'))).toBe(false);
  //   loggedOutHome.signInButton.click();
  //   expect(ptor.isElementPresent(element(by.css('.modal-dialog')))).toBe(true);
  //   expect(element(by.css('.modal-title')).getText()).toBe('Sign In');
  // });

  // it("should display a Register button", function() {
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();
  //   expect(loggedOutHome.registerButton.getText()).toBe('Register Now');
  // });

  // it("should display a modal when clicking Register button", function() {
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();
  //   expect(ptor.isElementPresent(by.css('.modal-dialog'))).toBe(false);
  //   loggedOutHome.registerButton.click();
  //   expect(ptor.isElementPresent(element(by.css('.modal-dialog')))).toBe(true);
  //   expect(element(by.css('.modal-title')).getText()).toBe('Create a Playfully Account!');
  // });

  // it("should have the current year for copyright in the footer", function() {
  //   var currentYear = new Date().getFullYear();
  //   var loggedOutHome = new LoggedOutHomepage();
  //   loggedOutHome.get();

  //   expect(ptor.isElementPresent(loggedOutHome.copyright)).toBe(true);

  //   loggedOutHome.copyright.getText().then(function(txt) {
  //     yearMatch = txt.match(/\\d{4}/);
  //     expect(parseInt(yearMatch[0])).toBe(currentYear);
  //   });
  // });


});
