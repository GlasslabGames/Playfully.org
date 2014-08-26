var classCode = require('../mock_data/acct.js').stage;	// FIXME - Not dynamic

var Classes = function() {
    
		this.path = '/classes';

		this.addCourse = {
			ttype: 'btn',
			locator: element(by.css('.gl-courses-add.gl-courses-add--blue'))
		}

		////////////////////
		//// NEW COURSE ////
		////////////////////
		this.newCourseName = {	// TODO - move into form parent element
			ttype: 'input',
			locator: element(by.model('course.title'))
		}
		this.newCourseGrade = {
			// TODO make repeater, select grades randomly
			ttype: 'btn',
			locator: element(by.id('grade-9'))
		}
		this.newCourseSubmit = {
			ttype: 'btn',
			locator: element(by.css(".btn.gl-btn--blue"))
		}
		this.newCourseCancel = {
			ttype: 'btn',
			locator: element(by.css(".btn.gl-btn--blue"))
		}
		// -----------------/
		
		this.classBar = {
			ttype: 'text',
			locator: element(by.css('.gl-course.container-fluid.ng-scope')),	// FUTURE - will be repeater
			// course in courses | filter:{archived: (state.current.name == 'courses.archived')}
			text: 'GLTestClass\nGrade: 6, 5, 7, 9, 8, 10, 12, 11\nClass Code: '+classCode+'\nEdit\nMars Generation One - Argubot Academy\nSimCityEDU: Pollution Challenge!\nView Student List (1)'   
		}
		
		this.games = {
			ttype: 'text',
			locator: element.all(by.repeater('game in course.games'))
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
