describe( 'AppCtrl', function() {

  var scope, rootScope, $location, createController, AUTH_EVENTS;

  beforeEach(function() {
    module('playfully');
  });

  beforeEach(inject(function ($rootScope, $controller, _$location_, _AUTH_EVENTS_) {
    $location = _$location_;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    AUTH_EVENTS = _AUTH_EVENTS_;

    createController = function() {
      return $controller('AppCtrl', {
        '$scope': scope
      });
    };
  }));

  // it('should set currentUser on successful login', function() {
  //   var controller = createController();
  //   $location.path('/');
  //   expect(scope.currentUser).toBeNull();
  //   rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { username: 'testuser'});
  //   expect(scope.currentUser).not.toBeNull();
  // });

  // it('should close a modal instance on successful login', function() {
  //   var controller = createController();
  //   rootScope.modalInstance = { close: function() {} };
  //   spyOn(rootScope.modalInstance, 'close');
  //   $location.path('/');
  //   rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { username: 'testuser'});
  //   expect(rootScope.modalInstance.close).toHaveBeenCalled();
  // });

  // it('should clear the currentUser on successful logout', function() {
  //   var controller = createController();
  //   $location.path('/');
  //   rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { username: 'testuser'});
  //   expect(scope.currentUser).not.toBeNull();
  //   rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
  //   expect(scope.currentUser).toBeNull();
  // });

});

