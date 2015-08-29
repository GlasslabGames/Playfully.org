describe('Auth', function() {

  var $q, AuthService, UserService, Session, $httpBackend;

  beforeEach(function() {
    module('auth', function($provide) {
      $provide.constant('API_BASE', '/api/v2');
    });
    module('session');
    module('user');
  });

  beforeEach(inject(function(_$q_, _AuthService_, _UserService_, _Session_, _$httpBackend_) {
    $q = _$q_;
    AuthService = _AuthService_;
    Session = _Session_;
    UserService = _UserService_;
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
    var serviceUrl = '/api/v2/auth/login/glasslab';

    it("returns a promise for the call to the API", function() {
      var user = null;
      $httpBackend.when('POST', serviceUrl).respond(200, {
        id: 25, role: 'student', firstName: 'Test', lastName: 'User'});
      $httpBackend.expect('POST', serviceUrl);
      AuthService.login({username: 'test2', password: 'test'})
        .then(function(result) { user = result.data; });
      $httpBackend.flush();
      expect(user.id).toBe(25);
      expect(user.role).toBe('student');
    });

  });


  describe("Logging out", function() {
    var serviceUrl = '/api/v2/auth/logout';
    it("destroys the existing session", function() {
      $httpBackend.when('POST', serviceUrl).respond(200, {});
      $httpBackend.expect('POST', serviceUrl);
      Session.create(25, 'student', 'glasslab');
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
      expect(AuthService.isAuthorized(['student', 'instructor', 'admin'])).toBeTruthy();
    });

    it("returns false if there is no session", function() {
      Session.destroy();
      expect(AuthService.isAuthorized(['student', 'instructor', 'admin'])).toBeFalsy();
    });

    it("returns false if session's role is not allowed", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthorized(['instructor', 'admin'])).toBeFalsy();
    });

    it("can be called with a single role as a string", function() {
      Session.create(25, 'student');
      expect(AuthService.isAuthorized('student')).toBeTruthy();
    });
  });


  describe("Sending password reset link", function() {
    var serviceUrl = '/api/v2/auth/password-reset/send/';
    it("returns success if the server has sent the reset email", function() {
      var result = null;
      $httpBackend.when('POST', serviceUrl)
        .respond(200, {});
      $httpBackend.expect('POST', serviceUrl);

      AuthService.sendPasswordResetLink('gooduser@test.com')
        .success(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(Object.getOwnPropertyNames(result).length).toBe(0);
    });

    it("returns an error if the email address is unknown", function() {
      var result = null;
      $httpBackend.when('POST', serviceUrl)
        .respond(400, {error: "user not found", key: "email.no.exist"});
      $httpBackend.expect('POST', serviceUrl);

      AuthService.sendPasswordResetLink('foo@bar.com')
        .error(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(result.key).toBe('email.no.exist');
    });
  });


  describe("Verifying password reset code", function() {
    it("returns success if the code is verified", function() {
      var serviceUrl = '/api/v2/auth/password-reset/12345/verify';
      var result = null;
      $httpBackend.when('GET', serviceUrl).respond(200, {});
      $httpBackend.expect('GET', serviceUrl);

      AuthService.verifyPasswordResetCode('12345')
        .success(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(Object.getOwnPropertyNames(result).length).toBe(0);
    });

    it("returns an error if the code has expired", function() {
      var serviceUrl = '/api/v2/auth/password-reset/54321/verify';
      var badResponse = { error: "code expired", key: "code.expired" };
      var result = null;
      $httpBackend.when('GET', serviceUrl).respond(400, badResponse);
      $httpBackend.expect('GET', serviceUrl);

      AuthService.verifyPasswordResetCode('54321')
        .error(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(result.key).toBe('code.expired');
    });
  });

  describe("Updating password after reset", function() {
    var serviceUrl = '/api/v2/auth/password-reset/update';

    it("should return success if server completes the update", function() {
      var result = null;
      $httpBackend.when('POST', serviceUrl).respond(200, {});
      $httpBackend.expect('POST', serviceUrl);

      AuthService.updatePassword('password', '12345')
        .success(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(Object.getOwnPropertyNames(result).length).toBe(0);
    });

    it("should return an error if password is empty", function() {
      var result = null;
      $httpBackend.when('POST', serviceUrl)
        .respond(400, {error: "missing code", key: "missing.code.pass"});
      $httpBackend.expect('POST', serviceUrl);

      AuthService.updatePassword('', '12345')
        .error(function(data, status, headers, config) { result = data; });
      $httpBackend.flush();
      expect(result.key).toBe('missing.code.pass');
    });


  });
});
