var fs			= require('fs'),
		chai		= require('chai'),
		expect  = chai.expect,
		landing = require('./page_objects/landing.js');		

// abstract writing screen shot to a file
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);

    stream.write(buf = new Buffer(data, 'base64'));
    stream.end();
}

//// within a test:
//browser.takeScreenshot().then(function (png) {
//    writeScreenShot(png, 'exception.png');
//});



describe("Landing page - Anonymous user", function() {
	
	before(function() {
		browser.get("http://localhost:8001/");
	});
	
	it('should show default copy correctly', function() {
		
		element(by.css(".gl-copyright")).getText()
			.then(function(text) {
				expect(text).to.equal('©2014 GlassLab™');
			});
		browser.takeScreenshot()
			.then(function(png) {
				writeScreenShot(png, './e2e/results/landing-1.png');
			});
	});
	
	it('able to see navigation options correctly', function () {
		
		element(by.css(".gl-nav")).getCssValue()
			.then(function(text) {
				console.log(text);
			});
		element(by.css(".gl-nav")).getText()
			.then(function(text) {
				expect(text).to.equal('Home\nGames\nSupport\nRedeem\nSign In')
			});

	});

});