describe('HomeCtrl', function() {

  var scope, rootScope, $state, $location, createController, AUTH_EVENTS;

  beforeEach(function() {
    module('playfully');
  });

  beforeEach(inject(function ($rootScope, $controller, _$state_, _$location_, $httpBackend) {
    $state = _$state_;
    $location = _$location_;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    $httpBackend.whenGET('/assets/i18n/locale-en.json').respond({ });
    $httpBackend.expectGET('/assets/i18n/locale-en.json');
    $httpBackend.whenGET('/api/v2/auth/user/profile').respond({ });
    $httpBackend.expectGET('/api/v2/auth/user/profile');

    createController = function() {
      return $controller('HomeCtrl', {
        '$scope': scope
      });
    };
    $httpBackend.flush();
  }));

  it('should serve the page at the root of the site', function() {
    var controller = createController();
    $state.go('home');
    expect($location.path()).toBe('/');
  });
});
