var fs 		 = require('fs'),
		chai	 = require('chai'),
		expect = chai.expect;
		
module.exports = {
	screenshot: screenshot,
	runTest: runTest,
	expectCurrentUrlToMatch: expectCurrentUrlToMatch,
	expectObjTextToMatch: expectObjTextToMatch,
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

function expectObjTextToMatch(locator, text) {
	locator.getText()
		.then(function(objText) {
			expect(objText).to.eql(text);
		});
}
	
// The DRY function to defining each test case outlined in page objects
function runTest(element, textKey) {
	
	var loc = element.locator;
	var text = element.text[textKey] || element.text || "(No Description / Text)";	// NOTE - have to add {key:objs.(text)
	var description = element.desc || text;		// TODO - make this more robust
	
	browser.ignoreSynchronization = true;

	switch(element.ttype) {

		case('text'):
			it("#Verifying text - " + description, function () {
				loc.getText()
					.then(function(text) {
						expect(text).to.eql(element.text)
					});
				expectObjTextToMatch(loc, element.text);
			});
			break;

		case('form'):		// NOTE - Form definitions still forming, not implemented in auto
//			it.skip("#Verifying form - " + description, function() {
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
			it("#Verifying text field " + description, function() {
				expect(loc).to.be.ok;
				loc.sendKeys(element.testInput);
			});
			break;

		case('btn'):		// NOTE - Still breaks if checking for btns on modals, so commented out
//			it("#Button appears and functions as expected", function() {
//				expectObjTextToMatch(loc, element.text);
//				
////				loc.click();	// TODO - add case for 'auto' field before firing btn
//				// FUTURE - be able to trigger subsequent tests like page redirs, etc.
//			});
			break;

		case('pic'):
			it("#Picture appears as expected", function() {
				// TODO - add size/css/visibility test
				console.log('pic!!');
			});
			break;

		default:
			it.skip('#Unimplemented test: "' + description + '"', function() {
				console.log('Unknown test type: ' + element.ttype);
			});
			break;
		}	
}