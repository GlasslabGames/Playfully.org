// describe('user', function() {
// 
//   var $rootScope, $http, $httpBackend, $modal;
// 
//   beforeEach(module('user'));
// 
//   beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$http_, _$modal_) {
//     $rootScope = _$rootScope_;
//     $httpBackend = _$httpBackend_;
//     $http = _$http_;
//     $modal = _$modal_;
// 
//     userInfo = {
//       id: 25,
//       firstName: "John",
//       lastName: "Smith",
//       role: "student",
//     };
//     $httpBackend.when('GET', '/api/user').respond(200, { data: userInfo });
//     $httpBackend.when('POST', '/api/v2/auth/login/glasslab').respond(200, { data: userInfo });
//   }));
// 
//   afterEach(function() {
//     $httpBackend.verifyNoOutstandingExpectation();
//     $httpBackend.verifyNoOutstandingRequest();
//   });
// 
//   var User;
//   beforeEach(inject(function($injector) {
//     User = $injector.get('User');
//   }));
// 
// 
//   describe("Logging in a user", function() {
// 
//     // it("should assign current user on successful login", function() {
//     //   User.login({username: "test_user", password: "test_password"});
//     //   $httpBackend.flush();
//     //   expect(User.currentUser.firstName).toEqual('John');
//     // });
//   });
// 
//   // describe('showLogin', function() {
//   //   it("should open the login modal", function() {
//   //     UserService.showLogin();
//   //     $rootScope.$digest();
//   //     expect(angular.element('.login-form').length).toBeGreaterThan(0);
//   //   });
//   // });
// 
// 
// });
