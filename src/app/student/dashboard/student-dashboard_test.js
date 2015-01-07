
describe('StudentDashboardCtrl', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $injector, _CoursesService_) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    courses = [{ courseId: 1, code: 'abc123'}];
    games = [{ gameId:'SC', title: 'SimCityEDU', play: { type: 'missions' }},
             { gameId: 'AA-1',
               title: 'Argubot Academy',
               buttons: [{"name":"Getting Started Guide",
                          "authRequired":false,
                          "type":"page"}]},
             { gameId: 'AW-1', title: 'Argument Wars', hasLinks: true,
               play: { type: 'game' }}];
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

    ctrl = $controller('DashboardStudentCtrl', {
      $scope: scope,
      courses: courses,
      games: games,
      CoursesService: CoursesService
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should convert games from array to object', function() {
    expect(scope.gamesInfo['SC']).not.toBe(null);
    expect(_.keys(scope.gamesInfo['AA-1']).length).toEqual(3);
    expect(scope.gamesInfo['foo']).toBe(undefined);
    $httpBackend.flush();
  });

  describe('$scope.hasLinks', function() {
    it('should return false if game has no links', function() {
      expect(scope.hasLinks('SC')).toBe(false);
      $httpBackend.flush();
    });

    it('should return true if game does have links', function() {
      spyOn(scope, 'isValidLinkType').and.returnValue(true);
      expect(scope.hasLinks('AA-1')).toBe(true);
      $httpBackend.flush();
    });

    it('should return true if previous hasLinks attribute was cached on the object', function() {
      expect(scope.hasLinks('AW-1')).toBe(true);
      $httpBackend.flush();
    });
  });

  describe('$scope.isValidLinkType', function() {
    it("should not be valid unless type is 'play' or 'download'", function() {
      var invalidButton = {
        type: 'link'
      };
      expect(scope.isValidLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it("should not be valid if type is 'play' but has no links", function() {
      var invalidButton = {
        type: 'play',
        links: []
      };
      expect(scope.isValidLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it("should be valid if type is 'play' and has links", function() {
      var validButton = {
        type: 'play',
        links: [{target:'http://glasslabgames.org'}]
      };
      expect(scope.isValidLinkType(validButton)).toBe(true);
      $httpBackend.flush();
    });

    it("should not be valid if type is 'download' but has no links", function() {
      var invalidButton = {
        type: 'download',
        links: []
      };
      expect(scope.isValidLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it("should be valid if type is 'download' and has links", function() {
      var validButton = {
        type: 'download',
        links: [{target:'http://itunes.apple.com/'}]
      };
      expect(scope.isValidLinkType(validButton)).toBe(true);
      $httpBackend.flush();
    });
  });

  describe('$scope.isSingleLinkType', function() {
    it('should be false if there is more than one link', function() {
      var invalidButton = {
        links: [{target:'http://itunes.apple.com'},
                {target:'http://play.google.com'}]
      };
      expect(scope.isSingleLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it('should be false if there is no link', function() {
      var invalidButton = {};
      expect(scope.isSingleLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it('should be true if there is only one link', function() {
      var validButton = {
        links: [{target: 'http://itunes.apple.com/'}]
      };
      expect(scope.isSingleLinkType(validButton)).toBe(true);
      $httpBackend.flush();
    });
  });

  describe('$scope.isMultiLinkType', function() {
    it('should be false if there is no link', function() {
      var invalidButton = {};
      expect(scope.isMultiLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it('should be false if there is only one link', function() {
      var invalidButton = {
        links: [{target: 'http://itunes.apple.com'}]
      };
      expect(scope.isMultiLinkType(invalidButton)).toBe(false);
      $httpBackend.flush();
    });

    it('should be true if there is more than one link', function() {
      var validButton = {
        links: [{target: 'http://itunes.apple.com'},
                {target: 'http://play.google.com'}]
      };
      expect(scope.isMultiLinkType(validButton)).toBe(true);
      $httpBackend.flush();
    });
  });

  describe('$scope.goToPlayGame', function() {
    it('should pop up a modal if the game has missions', function() {
      $httpBackend.flush();
    });

    it("should go straight to the gameplay link if there aren't missions", function() {
      $httpBackend.flush();
    });
  });

});





describe('EnrollInCourseModalCtrl', function() {
  var scope, ctrl, courses, CoursesService;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $injector, _CoursesService_) {
    $httpBackend = $injector.get('$httpBackend');
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




