var fs 		 = require('fs'),
		chai	 = require('chai'),
		expect = chai.expect;

var screenshotXtn = '.png';		// TODO - move to config page / tools

module.exports = {
	screenshot: screenshot,
	runTest: runTest,
	expectCurrentUrlToMatch: expectCurrentUrlToMatch,
	expectObjTextToMatch: expectObjTextToMatch,
	tstamp: tstamp,
	generateUser: generateUser
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
			writeScreenShot(png, fname+screenshotXtn);
		});
}

function generateUser(userType) {
	return {
		name: "glTest",
		email: "build+" + userType + "-" + tstamp().replace(/[^\w\.]/gi, '') + "@glasslabgames.org",
		pass: "gltest123"
	}
}

function zfill(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function tstamp() {
//	return (new Date()).toLocaleString();
	var date = (new Date());
	return date.getYear() + zfill(date.getMonth(),2) + zfill(date.getDate(),2) + '-' + zfill(date.getHours(),2) + '.' + date.getMinutes() + '.' + date.getSeconds()
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
// Use:  runTest(test spec, 
function runTest(element, userType) {
	
	var loc = element.locator;
	var text;
	if (userType) {
		text = element.text[userType];
	} else {
		text = element.text || "(No Description / Text)";
	}
	
	var description = element.desc || text;
	
	browser.ignoreSynchronization = true;

	switch(element.ttype) {

		case('text'):
			it("#Verifying text - " + description, function () {
				expectObjTextToMatch(loc, text);
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
//			it("#Verifying text field " + description, function() {
//				expect(loc).to.be.ok;
//				loc.sendKeys(element.testInput);
//			});
			break;

		case('btn'):		// NOTE - Still breaks if checking for btns on modals, so commented out
//			it("#Button appears and functions as expected", function() {
//				expectObjTextToMatch(loc, element.text);
//				
////				loc.click();	// TODO - add if stmt for 'auto' field before firing btn
//				// FUTURE - be able to trigger subsequent tests like page redirs, etc.
//			});
			break;

		case('pic'):
			it("#Picture appears as expected", function() {
				// TODO - add size/css/visibility test
				// screenshot?
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