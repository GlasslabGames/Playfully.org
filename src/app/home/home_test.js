describe('HomeCtrl', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    $httpBackend.whenGET('/assets/i18n/locale-english.json').respond({ });
    $httpBackend.expectGET('/assets/i18n/locale-english.json');

    $httpBackend.whenGET('/api/v2/data/eventsCount').respond({ });
    $httpBackend.expectGET('/api/v2/data/eventsCount');

    // Simulate login status call and return user not logged in
    var timestamp = 1234;
    spyOn(Date.prototype, 'getTime').and.returnValue(timestamp);
    $httpBackend.expectGET('/api/v2/auth/login/status?ts='+timestamp).respond(
      {"status":"error","error":{"key":"user.login.notLoggedIn"},"statusCode":200}
    );

    $httpBackend.whenGET('/api/v2/dash/games').respond({ });
    $httpBackend.expectGET('/api/v2/dash/games');

    ctrl = $controller('HomeCtrl', { $scope: scope });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set initial scope state', function() {
    expect(scope.subEmail).toEqual('');
    expect(scope.showSubscribeMessage).toBe(false);
    expect(scope.subscribeMessage).toEqual('');
    $httpBackend.flush();
  });

  describe('$scope.subscribe', function() {

    it('should not send request without email value', function() {
      expect(scope.subEmail).toEqual('');
      scope.subscribe(); 
      expect(scope.showSubscribeMessage).toBe(false);
      $httpBackend.flush();
    });

    it('should show Sending message with valid email', function() {
      expect(scope.subEmail).toEqual('');
      expect(scope.showSubscribeMessage).toBe(false);
      scope.subEmail = 'good@email.com';
      $httpBackend.whenPOST('/api/v2/auth/newsletter/subscribe').respond({});
      scope.subscribe();
      expect(scope.showSubscribeMessage).toBe(true);
      expect(scope.subscribeMessage).toBe("Sending...");
      $httpBackend.flush();
    });

    it('should show a thank you message after success', function() {
      scope.subEmail = 'good@email.com';
      $httpBackend.whenPOST('/api/v2/auth/newsletter/subscribe').respond({});
      scope.subscribe();
      $httpBackend.flush();
      expect(scope.showSubscribeMessage).toBe(true);
      expect(scope.subscribeMessage).toBe("Thank you for Subscribing!");
    });

  });

});
