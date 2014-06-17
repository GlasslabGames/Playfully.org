describe("Home page", function() {
  var ptor;

  beforeEach(function() {
    browser.get('/');
    ptor = protractor.getInstance();
  });


  it("should have an H1 tag that reads 'Playfully'", function() {
    h1 = by.tagName('h1');
    expect(ptor.isElementPresent(h1)).toBe(true);
    expect(element(h1).getText()).toBe('Playfully');
  });



});
