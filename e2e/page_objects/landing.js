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
			text: "©2014 GlassLab, Inc.™ All rights reserved."
		}
    
    this.loginButton = {
			ttype: 'btn',
			locator: element(by.css(".gl-bu-login")),
			text: 'Sign In'
		}
    
		//// Login modal - triggered from loginButton
		this.login = {
			ttype: 'form',
			desc: 'should be able to log in with valid credentials',
			
			subElements: {
				loginAsBtn: {
					ttype: 'btn',
					locator: {
						student: element(by.css(".login-button--student")),
						teacher: element(by.css(".login-button--instructor"))
					}
				},
				email: {
					ttype: 'field',
					locator: element(by.model('credentials.username'))
				},
				password: {
					ttype: 'field',
					locator: element(by.model('credentials.password'))
				},
				submit: {
					ttype: 'btn',
					locator: element(by.css("input.btn.gl-btn--blue")),
					text: 'Sign In'
				}
			}
		}
		
    this.registerButton = {
			ttype: 'btn',
			locator: element(by.css(".gl-bu-register")),
			text: 'Register Now'
		}
		
		//// Register Modal - triggered from registerButton
		this.register = {
			ttype: 'form',
			desc: 'should be able to register',
			subElements: {
				registerAsBtn: {
					ttype: 'btn',
					locator: {
						student: element(by.css(".login-button--student")),		// NOTE - same as login
						teacher: element(by.css(".login-button--instructor"))
					}
				},
				email: {
					ttype: 'field',
					locator: element(by.model('account.email'))
				},
				password: {
					ttype: 'field',
					locator: element(by.model('account.password'))
				},
				passConfirm: {
					ttype: 'field',
					locator: element(by.model('account.confirm'))
				},
				firstName: {
					ttype: 'field',
					locator: element(by.model('account.firstName'))
				},
				policyChbx: {
					ttype: 'chbx',	// NOTE - triggered by .click()
					locator: element(by.model('account.acceptedTerms'))
					// FUTURE - link for policy - dead
				},
				newsletterChbx: {
					ttype: 'chbx',
					locator: element(by.model('account.newsletter'))
				},
				submit: {
					ttype: 'btn',
					locator: element(by.css("input.btn.gl-btn--blue")),
					text: 'Register'
				},
				closeWelcome: {
					ttype: 'btn',
					locator: element(by.css("button.btn.gl-btn--blue")),
					text: 'Okay'
				}
			}
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
//			text: ''	// Alt text
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
