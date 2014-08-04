var params = browser.params;

describe("Forgot password link on login modal", function() {
  var ptor;

  var InstructorLoginModal = function() {
    this.forgotPasswordLink = element(by.css('.link-forgot-password'));

    this.get = function() {
      browser.get('/login/instructor');
      ptor = protractor.getInstance();
      ptor.sleep( params.modal.waitTime );
    };

  };

  it('should display a forgot password link on login modal', function() {
    var loginModal = new InstructorLoginModal();
    loginModal.get();
    expect(ptor.isElementPresent(loginModal.forgotPasswordLink)).toBe(true);
    expect(loginModal.forgotPasswordLink.getText()).toBe('Forgot your password?');
  });

  it('should display a password reset modal when clicking Forgot Password link',
    function() {
      var loginModal = new InstructorLoginModal();
      loginModal.get();
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
    this.closeButton = element(by.css('#password-reset-modal button.close'));
    this.errorTooltip = element(by.css('.form-error'));
    this.alert = element(by.repeater('error in formInfo.errors').row(0));

    this.get = function() {
      browser.get('/forgot-password');
      ptor = protractor.getInstance();
      ptor.sleep( params.modal.waitTime );
    };

    this.fillEmailField = function ( email ) {
      this.emailField.sendKeys(email);
    };
  };

  it('should default to a disabled submit button', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    expect(resetModal.submitButton.isEnabled()).toBe(false);
  }, 10000);

  it('should enable submit button with a valid email address', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    resetModal.fillEmailField( params.emailAddress.valid );
    expect(resetModal.submitButton.isEnabled()).toBe(true);
  }, 10000);

  it('should disable submit button without a valid email address', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    resetModal.fillEmailField( params.emailAddress.invalid );
    expect(resetModal.submitButton.isEnabled()).toBe(false);
  }, 10000);

  it('should show an error tooltip onblur of badly formed email input', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    expect(resetModal.errorTooltip.isDisplayed()).toBeFalsy();
    resetModal.fillEmailField( params.emailAddress.invalid );
    resetModal.modal.click();
    expect(resetModal.errorTooltip.isDisplayed()).toBeTruthy();
  }, 10000);

  it('should close the modal when clicking the x button', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    expect(ptor.isElementPresent(resetModal.modal)).toBe(true);
    resetModal.closeButton.click().then(function() {
      expect(ptor.isElementPresent(resetModal.modal)).toBe(false);
    });
  }, 10000);

  it('should show an error if the email address is not found', function() {
    var resetModal = new PasswordResetModal();
    resetModal.get();
    resetModal.fillEmailField( params.emailAddress.valid );
    resetModal.submitButton.click();
    expect(resetModal.alert.isDisplayed()).toBeTruthy();
  }, 10000);
});
