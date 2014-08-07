var params = browser.params;

describe("Login Options", function() {
  var ptor;

  var LoginModal = function() {
    this.loginOptions = element.all(by.css('.login-option'));
    this.registerLink = element(by.css('.link-register'));
    this.loginInstructorButton = element(by.partialButtonText('Teacher'));
    this.loginStudentButton = element(by.partialButtonText('Student'));
    this.edmodoButton = element(by.partialButtonText('Edmodo'));

    this.get = function() {
      browser.get('/login');
      ptor = protractor.getInstance();
    };

  };

  it("should display a modal of options when clicking the Sign In button",
    function() {
      browser.get('/');
      ptor = protractor.getInstance();
      element(by.css('.gl-bu-login')).click();
      ptor.sleep( params.modal.waitTime );
      expect(element(by.css('.modal-dialog')).isDisplayed()).toBeTruthy();
      expect(ptor.getCurrentUrl()).toContain('/login');
      expect(element(by.css('.modal-title')).getText()).toBe('Sign In');
  });

  it("should show multiple login options", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    loginModal.loginOptions.then(function(items) {
      expect(items.length).toBe(4);
    });
  });

  it("should link to register modal", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    expect(loginModal.registerLink.getText()).toEqual('Create an account');
    expect(loginModal.registerLink.isDisplayed()).toBeTruthy();
  });

  it("should link to teacher login", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    loginModal.loginInstructorButton.click().then(function() {
      ptor.sleep(500);
      expect(ptor.getCurrentUrl()).toContain('/login/instructor');
    });
  });

  it("should link to student login", function() {

    var loginModal = new LoginModal();
    loginModal.get();
    loginModal.loginStudentButton.click().then(function() {
      expect(ptor.getCurrentUrl()).toContain('/login/student');
    });
  });
});






describe("Instructor Login", function() {
  var ptor;

  var InstructorLoginModal = function() {
    this.modalWindow = element(by.css('.modal-dialog'));
    this.emailField = element(by.model('credentials.username'));
    this.passwordField = element(by.model('credentials.password'));
    this.submitButton = element(by.css('.modal-dialog input[type=submit]'));
    this.forgotPasswordLink = element(by.css('.link-forgot-password'));
    this.errorTooltip = element(by.css('.form-error'));
    this.alert = element(by.binding('authError'));

    this.get = function() {
      browser.get('/login/instructor');
      ptor = protractor.getInstance();
      ptor.sleep( params.modal.waitTime );
    };

  };

  it("should display a modal with login form", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    expect(element(by.css('.modal-dialog')).isDisplayed()).toBeTruthy();
    expect(element(by.css('.modal-title')).getText()).toBe('Teacher/Parent Sign In');
  });
  
  it("should have email address and password fields", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    expect(modal.emailField.getAttribute('type')).toEqual('email');
    expect(modal.emailField.getAttribute('placeholder')).toEqual('Email address');
    expect(modal.passwordField.getAttribute('type')).toEqual('password');
    expect(modal.passwordField.getAttribute('placeholder')).toEqual('Password');
  });

  it("should disable submit button until form is properly filled out", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    expect(modal.submitButton.isEnabled()).toBe(false);
    modal.emailField.sendKeys( params.emailAddress.valid );
    modal.passwordField.sendKeys( 'password' );
    expect(modal.submitButton.isEnabled()).toBe(true);
  });

  it("should have a link to Forgot Password modal", function() {
    browser.get('/logout');
    var modal = new InstructorLoginModal();
    modal.get();
    expect(ptor.isElementPresent(modal.forgotPasswordLink)).toBe(true);
    modal.forgotPasswordLink.click().then(function() {
      expect(ptor.getCurrentUrl()).toContain('forgot-password');
    });
  });

  it("should show an error tooltip with invalid email", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    expect(modal.errorTooltip.isDisplayed()).toBeFalsy();
    modal.emailField.sendKeys( params.emailAddress.invalid );
    modal.modalWindow.click().then(function() {
      expect(modal.errorTooltip.isDisplayed()).toBe(true);
      expect(modal.errorTooltip.getText()).toContain('enter a valid email address');
    });
  });

  it("should show an error message with invalid credentials", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    expect(modal.alert.isDisplayed()).toBe(false);
    modal.emailField.sendKeys( params.login.invalid.username );
    modal.passwordField.sendKeys( params.login.invalid.password );
    modal.submitButton.click().then(function() {
      expect(modal.alert.isDisplayed()).toBe(true);
      expect(modal.alert.getText()).toContain('invalid username or password');
    });
  });

  it("should redirect to the Instructor dashboard on successful login", function() {
    var modal = new InstructorLoginModal();
    modal.get();
    modal.emailField.sendKeys( params.login.valid.username );
    modal.passwordField.sendKeys( params.login.valid.password );
    modal.submitButton.click().then(function() {
      expect(ptor.getCurrentUrl()).toContain('/dashboard');
    });
    browser.get('/logout');
  });

});






describe("Student Login", function() {
  var ptor;

  var StudentLoginModal = function() {
    this.modalWindow = element(by.css('.modal-dialog'));
    this.usernameField = element(by.model('credentials.username'));
    this.passwordField = element(by.model('credentials.password'));
    this.submitButton = element(by.css('.modal-dialog input[type=submit]'));
    this.forgotPasswordLink = element(by.css('.link-forgot-password'));
    this.errorTooltip = element(by.css('.form-error'));
    this.alert = element(by.binding('authError'));

    this.get = function() {
      browser.get('/login/student');
      ptor = protractor.getInstance();
      ptor.sleep( params.modal.waitTime );
    };

  };

  it("should display a modal with login form", function() {
    var modal = new StudentLoginModal();
    modal.get();
    expect(element(by.css('.modal-dialog')).isDisplayed()).toBeTruthy();
    expect(element(by.css('.modal-title')).getText()).toBe('Student Sign In');
  });

  it("should have username and password fields", function() {
    var modal = new StudentLoginModal();
    modal.get();
    expect(modal.usernameField.getAttribute('type')).toEqual('text');
    expect(modal.usernameField.getAttribute('placeholder')).toEqual('Screen name');
    expect(modal.passwordField.getAttribute('type')).toEqual('password');
    expect(modal.passwordField.getAttribute('placeholder')).toEqual('Password');
  });
  
  it("should disable submit button until form is properly filled out", function() {
    var modal = new StudentLoginModal();
    modal.get();
    expect(modal.submitButton.isEnabled()).toBe(false);
    modal.usernameField.sendKeys( 'test' );
    modal.passwordField.sendKeys( 'password' );
    expect(modal.submitButton.isEnabled()).toBe(true);
  });

  it("should show an error message with invalid credentials", function() {
    var modal = new StudentLoginModal();
    modal.get();
    expect(modal.alert.isDisplayed()).toBe(false);
    modal.usernameField.sendKeys( 'unknown' );
    modal.passwordField.sendKeys( 'user' );
    expect(modal.submitButton.isEnabled()).toBe(true);
    modal.submitButton.click().then(function() {
      expect(modal.alert.isDisplayed()).toBe(true);
      expect(modal.alert.getText()).toContain('invalid username or password');
    });
  });

  it("should redirect to the Student dashboard on successful login", function() {
    var modal = new StudentLoginModal();
    modal.get();
    modal.usernameField.sendKeys( 'test2' );
    modal.passwordField.sendKeys( 'test' );
    modal.submitButton.click().then(function() {
      expect(ptor.getCurrentUrl()).toContain('/home');
    });
  });

});
