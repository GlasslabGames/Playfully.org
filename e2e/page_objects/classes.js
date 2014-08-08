var classCode = require('../mock_data/acct.js').stage;	// FIXME - Not dynamic

var Classes = function() {
    
		this.path = '/classes';

		this.addCourse = {
			ttype: 'btn',
			locator: element(by.css('.gl-courses-add.gl-courses-add--blue'))
		}
		
		this.classBar = {
			ttype: 'text',
			locator: element(by.css('div.gl-course.container-fluid.ng-scope')),	// FUTURE - will be repeater
			text: 'GLTestClass\nGrade: 6, 5, 7, 9, 8, 10, 12, 11\nClass Code: '+classCode+'\nEdit\nMars Generation One - Argubot Academy\nSimCityEDU: Pollution Challenge!\nView Student List (1)'
		}
		
		this.classDesc = {
			ttype: 'text',
			locator: element(by.css('.gl-course-desc')),
			text: 'GLTestClass\nGrade: 6, 5, 7, 9, 8, 10, 12, 11\nClass Code: '+classCode+'\nEdit'
		}
		
		this.classEditLink = {
			ttype: 'btn',
			locator: element(by.linkText('Edit'))
		}
}

module.exports = new Classes();