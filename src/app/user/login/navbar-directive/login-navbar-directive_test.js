describe( 'Navbar login directive', function() {
  var $scope, elem, elemScope, UserService, $httpBackend;

  var userInfo = { firstName: 'John', lastName: 'Snow' };

  beforeEach(function() {
    module('user');
    module('ui.bootstrap.modal');
    module('user.login.navbar');
    module('user/login/navbar-directive/login-navbar-directive.html');
  });

  beforeEach(inject(function ($compile, $rootScope, _UserService_, $httpBackend) {
    UserService = _UserService_;
    $scope = $rootScope;
    elem = angular.element('<login-navbar></login-navbar>');
    $compile(elem)($rootScope);
    angular.element(document.body).append(elem);
    elemScope = elem.scope();

    $httpBackend.whenGET('user/login/form/login-form.html').respond(' ');
  }));


  afterEach(function() {
    elem.remove();
  });


  it("should display Sign In button when not authenticated", function() {
    $scope.$digest();
    expect($('button:visible').length).toBe(1);
    expect($('button:visible').text()).toEqual('Sign in');
  });

  it("should display a Log Out button when signed in", function() {
    UserService.currentUser = userInfo;
    $scope.$digest();
    expect($('button:visible').length).toBe(1);
    expect($('button:visible').text()).toEqual('Log out');
  });

  it("should display user's name when authenticated", function() {
    UserService.currentUser = userInfo;
    $scope.$digest();
    expect($('.navbar-username').text()).toEqual('John');
  });

  it("should call the login function when clicking the signin button", function() {
    spyOn(UserService, 'showLogin');
    $scope.$digest();
    $('.btn-login').click();
    expect(elemScope.login).toHaveBeenCalled();
  });

  it("should call the logout function when clicking the logout button", function() {
    UserService.currentUser = userInfo;
    spyOn(UserService, 'logout');
    $scope.$digest();
    $('.btn-logout').click();
    expect(elemScope.logout).toHaveBeenCalled();
  });

});

