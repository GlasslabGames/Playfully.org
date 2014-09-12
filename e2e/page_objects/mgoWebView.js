var mgoWebView = function() {
	
	this.login = {
	
		path:   '/sdk/login',
		
		emailField: {
      ttype: 'field',
      locator: element(by.model('credentials.username'))
    },
		passwordField: {
      ttype: 'field',
      locator: element(by.model('credentials.password'))
    },
		passwordResetLink: {
      ttype: 'link',
      locator: element(by.css('a.link-forgot-password'))
    },
		
		edmodoLogin: {
      ttype: 'field',
      locator: element(by.css(".login-button.login-button--edmodo.login-button--flexible"))
    },
		
		submitBtn: {
      ttype: 'btn',
      locator: element(by.css("input.btn.gl-btn--blue"))
    },
		
		classCodeBtn: {
      ttype: 'btn',
      locator: element(by.css("button.btn.gl-btn--blue"))
    }
		
	},
	
	this.connect = {
		
		// Verified through Supertest in Platform, not needed for protractor
		path: '/sdk/connect'
		
	}
	
}

module.exports = new mgoWebView();
