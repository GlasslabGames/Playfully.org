describe('user', function() {

  var $rootScope, $http, $httpBackend, $modal;

  beforeEach(module('user'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$http_, _$modal_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $http = _$http_;
    $modal = _$modal_;

    userInfo = {
      id: 25,
      firstName: "John",
      lastName: "Smith",
      role: "student",
    };
    $httpBackend.when('GET', '/api/user').respond(200, { data: userInfo });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var UserService;
  beforeEach(inject(function($injector) {
    UserService = $injector.get('UserService');
  }));

  // describe('showLogin', function() {
  //   it("should open the login modal", function() {
  //     UserService.showLogin();
  //     $rootScope.$digest();
  //     expect(angular.element('.login-form').length).toBeGreaterThan(0);
  //   });
  // });


});
