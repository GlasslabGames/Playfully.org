describe('Auth', function() {

  var $q, AuthService, Session, $httpBackend;

  beforeEach(function() {
    module('auth', function($provide) {
      $provide.constant('API_BASE', '/api/v2');  
    });
    module('session');
  });

  beforeEach(inject(function(_$q_, _AuthService_, _Session_, _$httpBackend_) {
    $q = _$q_;
    AuthService = _AuthService_;
    Session = _Session_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(function() {
    var deferred = $q.defer();
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Logging in", function() {
    it("sets session information on success", function() {
      $httpBackend.when('POST', '/api/v2/auth/login/glasslab').respond(200, {
        id: 25, role: 'student', firstName: 'Test', lastName: 'User'});
      $httpBackend.expect('POST', '/api/v2/auth/login/glasslab');
      AuthService.login({username: 'test2', password: 'test'});
      $httpBackend.flush();
      expect(Session.userId).toBe(25);
      expect(Session.userRole).toBe('student');
    });

    it("does not set session on failure", function() {
      $httpBackend.when('POST', '/api/v2/auth/login/glasslab').respond(401, {});
      $httpBackend.expect('POST', '/api/v2/auth/login/glasslab');
      AuthService.login({username: 'test2', password: 'wrong'});
      $httpBackend.flush();
      expect(Session.userId).toBeNull();
      expect(Session.userRole).toBeNull();
    });
  });


  describe("Logging out", function() {
    it("destroys the existing session", function() {
      $httpBackend.when('POST', '/api/v2/auth/logout').respond(200, {});
      $httpBackend.expect('POST', '/api/v2/auth/logout');
      Session.create(25, 'student');
      expect(Session.userId).toBe(25);
      AuthService.logout();
      $httpBackend.flush();
      expect(Session.userId).toBeNull();

    });
  });


  describe("isAuthenticated", function() {
    it("returns true if there is a session", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthenticated()).toBeTruthy();
    });

    it("returns false if there is no session", function() {
      Session.destroy();
      expect(AuthService.isAuthenticated()).toBeFalsy();
    });
  });


  describe("isAuthorized", function() {
    it("returns true if session has the expected role", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthorized(['student', 'instructor'])).toBeTruthy();
    });

    it("returns false if there is no session", function() {
      Session.destroy();
      expect(AuthService.isAuthorized(['student', 'instructor'])).toBeFalsy();
    });

    it("returns false if session's role is not allowed", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthorized(['instructor'])).toBeFalsy();
    });

    it("can be called with a single role as a string", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthorized('student')).toBeTruthy();
    });
  });


});
