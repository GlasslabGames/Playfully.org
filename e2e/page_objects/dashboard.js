var Dashboard = function() {
    
		this.path = {
			teacher: '/dashboard',
			student: '/home'
		}
	
    this.userIcon = {
			ttype: 'text',
			desc: 'should open correct user menu',
			locator: element(by.css(".navbar-btn.gl-bu-user"))
		}
		
		this.acctOption = {
			ttype: 'text',
			locator: element(by.linkText('Edit My Profile')),
			
		}
		
		this.logoutOption = {
			ttype: 'button',
			desc: 'should log out user',
			locator: element(by.linkText('Log Out')),
			text: 'Log Out'
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