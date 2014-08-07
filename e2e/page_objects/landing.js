var Landing = function() {
    
		this.path = '/';
	
    this.navBar = {
			ttype: 'text',
			desc: 'should list navigation options correctly',
			locator: element(by.css(".gl-nav")),
			text: 'Home\nGames\nSupport\nRedeem\nSign In'
		}
		
		this.activeNavLink = {
			ttype: 'text',
			locator: element(by.css('.active a.gl-nav-link')),
			text: "Home"
		}

		this.copyright = {
			ttype: 'text',
			desc: 'shows copyright correctly',
			locator: element(by.css('.gl-copyright')),
			text: "©2014 GlassLab™"
		}
    
    this.loginButton = {
			ttype: 'btn',
			locator: element(by.css(".gl-bu-login")),
			text: 'Sign In'
		}
		
    this.registerButton = {
			ttype: 'btn',
			locator: element(by.css(".gl-bu-register")),
			text: 'Register Now'
		}
    
    // english localizated text, will be located at ../../build/assets/
    // TODO - make the setup of the test identify the locale, use to add all text that should appear

    this.footer = {
			ttype: 'text',
			desc: 'shows footer correctly',
			locator: element(by.css('.gl-footer-nav.text-center')),
			text: "Support GlassLab Legal Developer Community"
		}
    
		this.login = {
			ttype: 'form',
			desc: 'should be able to log in with valid credentials',
			locator: element(by.css('.'))
		}
		
    //// GAMES ////
    
//    this.gameCard = {
//			ttype: 'text',
//			locator: element(by.css(".gl-game-card")),		// NOTE - returns list of cards
//			text: ''
//		}
//		
//		this.gameThumb = {
//			ttype: 'pic',
//			locator: element(by.css(".gl-game-thumbnail")),
//			text: ''
//		}
//		this.gameDesc = {
//			ttype: 'text',
//			locator: element(by.css(".gl-game-description")),
//			text: ''
//		}
    
}

module.exports = new Landing();