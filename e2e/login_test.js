// Login
//
describe("Login Options", function() {
  var ptor;

  var LoginModal = function() {
    this.loginOptions = element.all(by.css('.login-option'));
    this.registerLink = element(by.css('a[ui-sref=registerOptions]'));
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
      ptor.sleep(1000);
      expect(element(by.css('.modal-dialog')).isDisplayed()).toBeTruthy();
      expect(ptor.getCurrentUrl()).toContain('/login');
      expect(element(by.css('.modal-title')).getText()).toBe('Sign In');
  });

  it("should show multiple login options", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    ptor.sleep(1000);
    loginModal.loginOptions.then(function(items) {
      expect(items.length).toBe(4);
    });
  });

  it("should link to register modal", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    ptor.sleep(1000);
    expect(loginModal.registerLink.getText()).toEqual('Create an account');
    expect(loginModal.registerLink.isDisplayed()).toBeTruthy();
  });

  it("should link to teacher login", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    ptor.sleep(1000);
    loginModal.loginInstructorButton.click();
    expect(ptor.getCurrentUrl()).toContain('/login/instructor');
  });

  it("should link to student login", function() {
    var loginModal = new LoginModal();
    loginModal.get();
    ptor.sleep(1000);
    loginModal.loginStudentButton.click();
    expect(ptor.getCurrentUrl()).toContain('/login/student');
  });
});
