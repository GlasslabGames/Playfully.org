var Dashboard = function() {
    
//		this.path = '/';
	
    this.userIcon = {
			ttype: 'button',
			desc: 'should list navigation options correctly',
			locator: element(by.css(".navbar-btn.gl-bu-user")),
			text: 'Home\nGames\nSupport\nRedeem\nSign In'
		}

		this.navBar = {
			ttype: 'text',
			desc: 'should list navigation options correctly',
			locator: element(by.css(".gl-nav")),
			text: 'Home\nGames\nSupport\nRedeem\nSign In'
		}
    
		this.activeNavLink = {
			ttype: 'text',
			locator: element(by.css("a.gl-nav-link.ng-binding")),
			desc: 'should display the Dashboard link as active',
			text: 'Dashboard'
		}
}

module.exports = new Dashboard();