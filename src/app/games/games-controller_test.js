var allGamesInfoData = [
  { gameId: 'TEST'}, { price: 'TBD' },
  { gameId: 'SC', price: 'Free' }, { gameId: 'AW-1', price: 'Free' }];
var freeGamesData = [
  { gameId: 'SC', price: 'Free' },
  { gameId: 'AW-1', price: 'Free' }];
var premiumGamesData = [{ gameId: 'TEST' }];
var comingSoonGamesData = [{ price: 'TBD' }];



describe('GameCatalogCtrl', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $state, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    spyOn($state, 'go');

    $httpBackend.whenGET('/assets/i18n/locale-english.json').respond({ });
    $httpBackend.expectGET('/assets/i18n/locale-english.json');

    // Simulate login status call and return user not logged in
    var timestamp = 1234;
    spyOn(Date.prototype, 'getTime').and.returnValue(timestamp);
    $httpBackend.expectGET('/api/v2/auth/login/status?ts='+timestamp).respond(
      {"status":"error","error":{"key":"user.login.notLoggedIn"},"statusCode":200}
    );

    $httpBackend.whenGET('/api/v2/dash/games').respond({ });
    $httpBackend.expectGET('/api/v2/dash/games');

    ctrl = $controller('GameCatalogCtrl', {
      $scope: scope,
      allGamesInfo: allGamesInfoData,
      freeGames: freeGamesData,
      premiumGames: premiumGamesData,
      comingSoonGames: comingSoonGamesData
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should filter out games with TBD prices or id of TEST', function() {
    expect(scope.allGamesInfo.length).toBe(2);
    $httpBackend.flush();
  });

  describe('$scope.goToGameDetail', function() {
    it("Should not go to the detail page if price is 'Coming Soon'", inject(function($state) {
      scope.goToGameDetail('Coming Soon', 'AW-1');
      expect($state.go).not.toHaveBeenCalled();
      $httpBackend.flush();
    }));

    it("Should go to the detail page if price is not 'Coming Soon'", inject(function($state) {
      scope.goToGameDetail('Free', 'SC');
      expect($state.go).toHaveBeenCalledWith('root.games.detail.product', {gameId: 'SC'});
      $httpBackend.flush();
    }));
  });

  describe('$scope.truncateText', function() {
    it('should not shorten text that is already short enough', function() {
      var result = scope.truncateText('Hello', 20);
      expect(result).toEqual('Hello');
      $httpBackend.flush();
    });

    it('should shorten text that is longer than the limit', function() {
      var longText = 'This is some text that should be too long.';
      // Don't forget to account for the ellipsis being added
      expect(scope.truncateText(longText, 10).length).toEqual(11);
      $httpBackend.flush();
    });

    it('should not shorten text that is exactly as long as the limit', function() {
      var exactLengthText = '123456789';
      expect(scope.truncateText(exactLengthText, 9)).toEqual(exactLengthText);
      $httpBackend.flush();
    });

  });


});


describe('GameCatalogCtrl as a developer', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    scope.currentUser = { role: 'developer' };

    $httpBackend.whenGET('/assets/i18n/locale-english.json').respond({ });
    $httpBackend.expectGET('/assets/i18n/locale-english.json');

    // Simulate login status call and return user not logged in
    var timestamp = 1234;
    spyOn(Date.prototype, 'getTime').and.returnValue(timestamp);
    $httpBackend.expectGET('/api/v2/auth/login/status?ts='+timestamp).respond(
      {"status":"error","error":{"key":"user.login.notLoggedIn"},"statusCode":200}
    );

    $httpBackend.whenGET('/api/v2/dash/games').respond({ });
    $httpBackend.expectGET('/api/v2/dash/games');

    ctrl = $controller('GameCatalogCtrl', {
      $scope: scope,
      allGamesInfo: allGamesInfoData,
      freeGames: freeGamesData,
      premiumGames: premiumGamesData,
      comingSoonGames: comingSoonGamesData
    });
  }));

  it('should allow a developer to see all games', function() {
    // Note that we've set up a currentUser with role of developer in the
    // beforeEach above
    expect(scope.allGamesInfo.length).toBe(4);
    $httpBackend.flush();
  });

});




describe('GameDetailCtrl', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $state, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    spyOn($state, 'go');

    $httpBackend.whenGET('/assets/i18n/locale-english.json').respond({ });
    $httpBackend.expectGET('/assets/i18n/locale-english.json');

    // Simulate login status call and return user not logged in
    var timestamp = 1234;
    spyOn(Date.prototype, 'getTime').and.returnValue(timestamp);
    $httpBackend.expectGET('/api/v2/auth/login/status?ts='+timestamp).respond(
      {"status":"error","error":{"key":"user.login.notLoggedIn"},"statusCode":200}
    );

    $httpBackend.whenGET('/api/v2/dash/games').respond({ });
    $httpBackend.expectGET('/api/v2/dash/games');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('User with permissions', function() {
    var gameDetails = {"buttons":[{"name":"Getting Started Guide","authRequired":false,"type":"link","links":[{"target":"_blank","link":"https://s3-us-west-1.amazonaws.com/playfully-games/SC/guides/SCE+quick+start+guide.pdf"}]},{"name":"Download","type":"download","authRequired":true,"links":[{"name":"PC (1.0GB)","OS":"Windows","link":"https://s3-us-west-1.amazonaws.com/playfully-games/SC/downloads/2.1.1128/SimCityEDU_setup.msi","target":"_blank"},{"name":"Mac (1.0GB)","OS":"Mac","link":"https://s3-us-west-1.amazonaws.com/playfully-games/SC/downloads/2.1.1128/SimCityEDU_setup.dmg","target":"_blank"}]},{"name":"Play Game","type":"play","authRequired":true,"links":[{"name":"Play Game","type":"play"}]}],"release":"live","price":"Free","releaseDate":"Nov 2, 2013","type":"Client Download","platform":{"type":"PC & Mac","icon":{"small":"assets/platform-client.png","large":"assets/platform-client@2x.png"}},"subject":"21st Century Skills, Science, ELA","grades":"6 - 8","play":{"type":"missions"}, "pages":{"product":{},"standards":{},"lessonPlans":{}, "research":{},"reviews":{},"check":{}}};

    beforeEach(inject(function($controller) {
      ctrl = $controller('GameDetailCtrl', {
        $scope: scope,
        $stateParams: { gameId: 'SC' },
        gameDetails: gameDetails,
        myGames: [{"gameId":"AW-1","enabled":true,"visible":true,"maintenance":null,"shortName":"Argument Wars","longName":"Argument Wars","price":"Free","releaseDate":"Aug 1, 2010","type":"Browser","platform":{"type":"Flash/Browser"}},{"gameId":"SC","enabled":true,"visible":true,"maintenance":null,"shortName":"SimCityEDU","longName":"SimCityEDU: Pollution Challenge!","price":"Free","releaseDate":"Nov 2, 2013","type":"Client Download"}]
      });
    }));

    it('should initialize scope variables', function() {
      expect(scope.currentPage).toBe(null);
      expect(scope.gameId).toEqual('SC');
      expect(scope.gameDetails).toEqual(gameDetails);
      expect(_.keys(scope.navItems).length).toBe(6);
      $httpBackend.flush();
    });

    describe('$scope.hasPermsToPlayGame', function() {
      it('should do something', function() {
        expect(scope.hasPermsToPlayGame()).toBe(true);
        $httpBackend.flush();
      });
    });


  });

  describe('User without permissions', function() {

    beforeEach(inject(function($controller) {
      var gameDetails = {};

      ctrl = $controller('GameDetailCtrl', {
        $scope: scope,
        $stateParams: { gameId: 'SC' },
        gameDetails: gameDetails,
        myGames: [{"gameId":"AW-1"}]
      });
    }));

    describe('$scope.hasPermsToPlayGame', function() {
      it('should do something', function() {
        expect(scope.hasPermsToPlayGame()).toBe(false);
        $httpBackend.flush();
      });
    });

  });
});












