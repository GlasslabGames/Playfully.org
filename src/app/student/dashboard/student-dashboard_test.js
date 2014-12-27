describe('EnrollInCourseModalCtrl', function() {
  var scope, ctrl, courses, CoursesService, $modal;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $injector, _CoursesService_) {
    $httpBackend = $injector.get('$httpBackend');
    $modal = $injector.get('$modal');
    scope = $rootScope.$new();
    courses = [{ courseId: 1, code: 'abc123'}];
    CoursesService = _CoursesService_;

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

    ctrl = $controller('EnrollInCourseModalCtrl', {
      $scope: scope,
      courses: courses,
      CoursesService: CoursesService
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set initial scope state', function() {
    expect(scope.verification.code).toBe(null);
    expect(scope.verification.errors.length).toBe(0);
    $httpBackend.flush();
  });


  describe('$scope.verify', function() {
    it('should fail if user is already enrolled', function() {
      scope.verify({ code: 'abc123' });
      expect(scope.verification.errors.length).toBe(1);
      $httpBackend.flush();
    });

    it('should successfully verify a proper code', function() {
      $httpBackend.whenGET('/api/v2/lms/course/code/def456/verify').respond({});
      scope.verify({ code: 'def456' });
      $httpBackend.flush();
      expect(scope.enrollment).not.toBe(null);
      expect(scope.verification.errors.length).toBe(0);
    });

    it('should display an error when the verification fails', function() {
      $httpBackend.whenGET('/api/v2/lms/course/code/def456/verify').respond(500, {
        error: 'Bad code'
      });
      scope.verify({ code: 'def456' });
      $httpBackend.flush();
      expect(scope.enrollment).toBe(null);
      expect(scope.verification.errors.length).toBe(1);
      expect(scope.verification.errors[0]).toEqual('Bad code');
    });
  });

  describe('$scope.enroll', function() {
    it('should allow a successful enrollment', function() {
      // Minimal enrollment info needed to pass the test
      scope.enrollment = {"courseCode": "abc123"};
      $httpBackend.whenPOST('/api/v2/lms/course/enroll').respond({});
      scope.close = jasmine.createSpy("modal close spy");
      scope.enroll(scope.enrollment);
      $httpBackend.flush();
      expect(scope.enrollment.errors.length).toBe(0);
    });

    it('should show an error on failed enrollment', function() {
      scope.enrollment = {"courseCode": "abc123"};
      $httpBackend.whenPOST('/api/v2/lms/course/enroll').respond(500, {
        error: 'Unable to enroll'
      });
      scope.enroll(scope.enrollment);
      $httpBackend.flush();
      expect(scope.enrollment.errors.length).toBe(1);
      expect(scope.enrollment.errors[0]).toEqual('Unable to enroll');
    });
  });

});
