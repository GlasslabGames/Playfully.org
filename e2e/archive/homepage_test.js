describe("Home page (signed out)", function() {
  var ptor;

  var LoggedOutHomepage = function() {
    this.title = element(by.tagName('h1'));
    this.signInButton = element(by.css('.gl-bu-login'));
    this.registerButton = element(by.css('.gl-bu-register'));
    this.copyright = element(by.css('.gl-copyright'));

    this.get = function() {
      browser.get('/');
      ptor = protractor.getInstance();
    };

  };


  it("should have an H1 tag that reads 'Playfully'", function() {
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();
    expect(ptor.isElementPresent(loggedOutHome.title)).toBe(true);
    expect(loggedOutHome.title.getText()).toBe('PLAYFULLY');
  });

  it("should display a Sign In button", function() {
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();
    expect(loggedOutHome.signInButton.getText()).toBe('Sign In');
  });

  it("should display a modal when clicking Sign In button", function() {
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();
    expect(ptor.isElementPresent(by.css('.modal-dialog'))).toBe(false);
    loggedOutHome.signInButton.click();
    expect(ptor.isElementPresent(element(by.css('.modal-dialog')))).toBe(true);
    expect(element(by.css('.modal-title')).getText()).toBe('Sign In');
  });

  it("should display a Register button", function() {
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();
    expect(loggedOutHome.registerButton.getText()).toBe('Register Now');
  });

  it("should display a modal when clicking Register button", function() {
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();
    expect(ptor.isElementPresent(by.css('.modal-dialog'))).toBe(false);
    loggedOutHome.registerButton.click();
    expect(ptor.isElementPresent(element(by.css('.modal-dialog')))).toBe(true);
    expect(element(by.css('.modal-title')).getText()).toBe('Create a Playfully Account!');
  });

  it("should have the current year for copyright in the footer", function() {
    var currentYear = new Date().getFullYear();
    var loggedOutHome = new LoggedOutHomepage();
    loggedOutHome.get();

    expect(ptor.isElementPresent(loggedOutHome.copyright)).toBe(true);

    loggedOutHome.copyright.getText().then(function(txt) {
      yearMatch = txt.match(/\d{4}/);
      expect(parseInt(yearMatch[0])).toBe(currentYear);
    });
  });


});
