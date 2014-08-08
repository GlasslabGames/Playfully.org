var fs 		 = require('fs'),
		chai	 = require('chai'),
		expect = chai.expect;
		
module.exports = {
	screenshot: screenshot,
	runTest: runTest,
	expectCurrentUrlToMatch: expectCurrentUrlToMatch,
	tstamp: tstamp
}

function writeScreenShot(data, filename) {
	var stream = fs.createWriteStream(filename);

	stream.write(buf = new Buffer(data, 'base64'));
	stream.end();
}

/*
 * Syntax for screenshot naming
 * conventions:
 * [objective].[action]-[##].png
 */
function screenshot(fname) {
		browser.takeScreenshot()
		.then(function (png) {
			writeScreenShot(png, fname);
		});
}

function tstamp() {
	return (new Date()).toLocaleString();
}

function expectCurrentUrlToMatch(url) {
	browser.getCurrentUrl()
			.then(function(currUrl) {
//				console.log('currUrl: ' + currUrl);
				expect(currUrl).to.eql(url);
			});
}
	
// The DRY function to defining each test case outlined in page objects
function runTest(element) {
	
	var loc = element.locator;
		
	var description = element.desc || "(No Description)";		// TODO - make this more robust with something like this
	
		beforeEach(function() {
			browser.ignoreSynchronization = true;
		})

	switch(element.ttype) {

		case('text'):
			it("Verifying text - " + description, function () {
				loc.getText()
					.then(function(text) {
						expect(text).to.eql(element.text)
					});
			});
			break;

		case('form'):
//			it.skip("Verifying form - " + description, function() {
//				var submit;
//				for (subElem in element.fields) {
//					if (subElem.ttype == btn) {
//						submit = subElem;
//					} else {
//						runTest(subElement);
//					}
//				}
//				runTest(btn);
//			});
			break;

		case('field'):
			it("Verifying text field " + description, function() {
				expect(loc).to.be.ok;
				loc.sendKeys(element.testInput);
			});
			break;

		case('btn'):
//			it.skip("Button appears and functions as expected", function() {
//				loc.getText()
//					.then(function(text) {
//						expect(text).to.eql(element.text);
//					});
//				loc.click();
//				// FUTURE - be able to trigger subsequent tests like page redirs, etc.
//			});
			break;

		case('pic'):
			it("Picture appears as expected", function() {
				// TODO - add size/css/visibility test
				console.log('pic!!');
			});
			break;

		default:
			it.skip('Unimplemented test: "' + description + '"', function() {
				console.log('Unknown test type: ' + element.ttype);
			});
			break;
		}	
}