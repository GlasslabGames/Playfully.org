describe("Forgot password link on login modal", function() {
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

});


describe("Password Reset", function() {
  var ptor;

  var PasswordResetModal = function() {
    this.submitButton = element(by.css('input[type=submit]'));
    this.emailField = element(by.model('formInfo.email'));
    this.modal = element(by.css('.modal-dialog'));
    this.closeButton = element(by.css('button.close'));

    this.get = function() {
      browser.get('/forgot-password');
      ptor = protractor.getInstance();
    };

  };

  it('should default to a disabled submit button', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    ptor.sleep(1000);
    expect(resetModal.submitButton.isEnabled()).toBe(false);
  }, 10000);

  it('should enable submit button with a valid email address', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    ptor.sleep(1000);
    resetModal.emailField.sendKeys('gooduser@email.com');
    expect(resetModal.submitButton.isEnabled()).toBe(true);
  }, 10000);

  it('should disable submit button without a valid email address', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    ptor.sleep(1000);
    resetModal.emailField.sendKeys('bademail');
    expect(resetModal.submitButton.isEnabled()).toBe(false);
  }, 10000);

  it('should close the modal when clicking the x button', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    ptor.sleep(1000);
    expect(ptor.isElementPresent(resetModal.modal)).toBe(true);
    resetModal.closeButton.click();
    expect(ptor.isElementPresent(resetModal.modal)).toBe(false);
  }, 10000);
});
