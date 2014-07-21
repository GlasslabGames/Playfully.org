var Landing = function() {
    
    //// NAVIGATION ////
    
    this.navBar = element(by.css("gl-nav"));
    // class active describes selected option
    
    this.activeNavLink = navBar.element(by.css("active"));
    
    
    this.loginButton = element(by.css("gl-bu-login"));
    //this.registerButton = element(by.css("gl-bu-reg"));
    // TODO - perhaps add class "gl-bu-reg" to reg button to make unique
    
    // english localizated text, will be located at ../../build/assets/
    // TODO - make the setup of the test identify the locale, use to add all text that should appear

    
    this.footer = element(by.css("gl-footer-nav"));
    
    //// GAMES ////
    
    this.gameCard = element(by.css("gl-game-card"));  // NOTE - returns list of cards
    this.gameThumb = element(by.css("gl-game-thumbnail"));
    this.gameDesc = element(by.css("gl-game-description"));
    
    
    
}

module.exports = new Landing();