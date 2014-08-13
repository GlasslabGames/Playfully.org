var Games = function() {
    
		this.path = '/games/AA-1';

		this.gameTitle = {
			mgo: {
				ttype: 'text',
				locator: element(by.css('.headline-2.gl-game-title')),
				desc: 'should display correct game title',
				text: 'Mars Generation One - Argubot Academy'		// FIXME - only applies to local & MGO
			},
			sce: {}
		}
		
		this.gameBanner = {
			mgo: {
				ttype: 'img',
				locator: element(by.css('.jumbotron img')),
				desc: 'should show game banner correctly'
			},
			sce: {}
		}
		
		this.subNav = {
			mgo: {
				ttype: 'text',
				locator: element(by.css('.gl-games-subnav')),
				text: 'Product Description\nStandards Alignment\nLesson Plans & Videos\nResearch\nReviews'
			},
			sce: {}
		}
		
}

module.exports = new Games();