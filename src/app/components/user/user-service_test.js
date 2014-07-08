describe('UserService', function() {

  var $q, UserService, Session, $httpBackend;

  beforeEach(function() {
    module('user', function($provide) {
      $provide.constant('API_BASE', '/api/v2');  
    });
    module('session');
  });

  beforeEach(inject(function(_$q_, _UserService_, _Session_, _$httpBackend_) {
    $q = _$q_;
    UserService = _UserService_;
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


  describe("get user by ID", function() {
    var serviceUrl = '/api/v2/auth/user';
    it("returns user profile data when ID is recognized", function() {
      var result = null;
      $httpBackend.when('GET', serviceUrl + '/25').respond(200, {
        data: {
          id: 25, role: 'student', firstName: 'Test', lastName: 'User'
        }});
      $httpBackend.expect('GET', serviceUrl + '/25');
      UserService.getById(25)
        .success(function(response) { result = response; });
      $httpBackend.flush();
      expect(result.data.firstName).toBe('Test');
    });

    it("returns an error when unauthorized", function() {
      var result = null;
      $httpBackend.when('GET', serviceUrl + '/2000').respond(401, {
        statusText: 'Unauthorized'
      });
      $httpBackend.expect('GET', serviceUrl + '/2000');
      UserService.getById(2000)
        .error(function(data, status, headers, config) {
          result = { status: status, statusText: data.statusText };
        });
      $httpBackend.flush();
      expect(result.status).toBe(401);
      expect(result.statusText).toBe('Unauthorized');
    });

  });


});
