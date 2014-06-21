describe('User API', function() {

  var $http, $httpBackend;

  beforeEach(function() {
    module('user');
    module('user.service');
  });

  beforeEach(inject(function(UserService, _$httpBackend_) {
    service = UserService;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe("Getting a user by ID", function() {
    it('should make an appropriate service call, given a userid', function() {
      $httpBackend.expectGET('/api/v2/auth/user/12345').respond({});
      service.get('12345');
      $httpBackend.flush();
    });
  });


  describe("Updating a user record", function() {
    it('should post data and add a timestamp', function() {
      cb = new Date().getTime();
      $httpBackend.whenPOST('/api/v2/auth/user/12345').respond({});
      $httpBackend.expectPOST('/api/v2/auth/user/12345');
      service.update({ firstName: 'John', id: 12345 });
      $httpBackend.flush(); 
    });
  });


  describe("Logging a user in", function() {
    it('should take a credentials object containing username and password', function() {
      var credentials = { username: 'test', password: 'password' };
      $httpBackend.expectPOST('/api/v2/auth/login/glasslab', credentials).respond({});
      service.login(credentials);
      $httpBackend.flush();
    });
  });


  describe("Logging a user out", function() {
    it('should receive a POST request', function() {
      $httpBackend.expectPOST('/api/v2/auth/logout', {}).respond({});
      service.logout();
      $httpBackend.flush();
    });
  });


  describe("Registering a user", function() {
    it('should include data passed to the method in the POST', function() {
      postData = {username: 'test', password: 'foo', password_confirm: 'foo'};
      cb = new Date().getTime();
      $httpBackend.expectPOST('/api/v2/user/register?cb='+cb, postData).respond({});
      service.register(postData);
      $httpBackend.flush();
    });
  });

  
  describe("Get login status", function() {
    it('should send an empty get request', function() {
      $httpBackend.expectGET('/api/v2/auth/login/status').respond({});
      service.getLoginStatus();
      $httpBackend.flush();
    });
  });


});
