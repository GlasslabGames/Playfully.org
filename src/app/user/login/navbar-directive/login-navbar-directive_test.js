describe( 'Navbar login directive', function() {
  var $scope, elem, elemScope, User, $httpBackend, $translate;

  var userInfo = { firstName: 'John', lastName: 'Snow' };

  beforeEach(function() {
    module('user');
    module('ui.bootstrap.modal');
    module('pascalprecht.translate');
    module('user.login.navbar');
    module('user/login/navbar-directive/login-navbar-directive.html');
  });

  beforeEach(inject(function ($compile, $rootScope, _User_, $httpBackend, _$translate_) {
    User = _User_;
    $scope = $rootScope;
    $translate = _$translate_;
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
    expect($('button:visible')).toHaveClass('btn-login');
  });

  // it("should display a Log Out button when signed in", function() {
  //   User.currentUser = userInfo;
  //   $scope.$digest();
  //   expect($('button:visible').length).toBe(1);
  //   expect($('button:visible')).toHaveClass('btn-logout');
  // });

  it("should display user's name when authenticated", function() {
    User.currentUser = userInfo;
    $scope.$digest();
    expect($('.navbar-username').text()).toEqual('John');
  });

  // it("should call the login function when clicking the signin button", function() {
  //   spyOn(User, 'showLogin');
  //   $scope.$digest();
  //   $('.btn-login').click();
  //   expect(elemScope.login).toHaveBeenCalled();
  // });

  // it("should call the logout function when clicking the logout button", function() {
  //   User.currentUser = userInfo;
  //   spyOn(User, 'logout');
  //   $scope.$digest();
  //   $('.btn-logout').click();
  //   expect(elemScope.logout).toHaveBeenCalled();
  // });

});

