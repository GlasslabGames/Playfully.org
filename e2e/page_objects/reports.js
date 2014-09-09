var Reports = function() {
    
		this.path = '/reports';
	
		this.courseRow = {
			ttype: 'btn',
			locator: element(by.css(".gl-reports-nav-course.ng-binding"))		// NOTE untested
		}
		
		this.bannerImage = {
			ttype: 'img',
			locator: element(by.css('.gl-reports-header')).element(by.css('img'))
		}
		
		this.gameDropdown = {
			ttype: 'btn',
//			locator: element(by.css('.btn.btn-default.gl-reports-dropdown.gl-reports-dropdown--game.ng-binding'))
			locator: element(by.binding('games.options[games.selected].shortName'))
		}
		this.reportDropdown = {
			ttype: 'btn',
			locator: element(by.binding("reports.selected.name"))
		}
		this.downloadBtn = {
			ttype: 'btn',
			locator: element(by.css(".fa.fa-download"))
		}	
		this.printBtn = {
			ttype: 'btn',
			locator: element(by.css(".fa.fa-print"))
		}
		
		this.classDropdown = {
			ttype: 'btn',
			locator: element(by.css("gl-arrow-right gl-reports-course-toggle"))		// NOTE untested
		}

}

module.exports = new Reports();
