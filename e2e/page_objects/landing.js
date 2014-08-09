var Landing = function() {
    
		this.path = '/';

		// english localizated text, will be located at ../../build/assets/
    // TODO - make the setup of the test identify the locale, use to add all text that should appear
	
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
    
//		this.login = {		// TODO - fix form elements as subelements of this
//			ttype: 'form',
//			desc: 'should be able to log in with valid credentials',
//			locator: element(by.css(''))
//		}
		
		this.login_teacher = {
			ttype: 'btn',
			locator: element(by.css(".login-button--instructor"))
		}
		
		this.login_student = {
			ttype: 'btn',
			locator: element(by.css(".login-button--student"))
		}
		
		this.field_email = {
			ttype: 'btn',
			locator: element(by.model('credentials.username'))
		}
		
		this.field_password = {
			ttype: 'btn',
			locator: element(by.model('credentials.password'))
		}
		
		this.signInBtn = {
			ttype: 'btn',
			locator: element(by.css("input.btn.gl-btn--blue")),
			text: 'Sign In'
		}
		
    //// GAMES ////
    
//    this.gameCard = {
//			ttype: 'text',
//			locator: element.all(by.css(".gl-game-card")),		// NOTE - returns list of cards
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
		
		 this.footer = {
			ttype: 'text',
			desc: 'shows footer correctly',
			locator: element(by.css('.gl-footer-nav.text-center')),
			text: "Support GlassLab Legal Developer Community"
		}
		
}

module.exports = new Landing();