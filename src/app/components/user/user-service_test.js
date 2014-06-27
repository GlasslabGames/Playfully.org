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
    it("returns user profile data", function() {
      $httpBackend.when('GET', '/api/user/25').respond(200, {
        data: {
          id: 25, role: 'student', firstName: 'Test', lastName: 'User'
        }});
      $httpBackend.expect('GET', '/api/user/25');
      var returnedPromise = UserService.getById(25);
      var result;
      returnedPromise.then(function(response) {
        result = response;
      });
      $httpBackend.flush();
      expect(result.data.lastName).toBe('User');
    });

  });


});
