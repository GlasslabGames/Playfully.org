describe('InstructorDashboardCtrl', function() {
  var scope, ctrl;

  beforeEach(module('playfully'));

  beforeEach(inject(function($rootScope, $controller, $state, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    spyOn($state, 'go');

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

    $httpBackend.whenGET('/api/v2/dash/reports/totalTimePlayed?gameId=AA-1&userIds=274').respond({});

    $httpBackend.whenGET('/api/v2/dash/game/AA-1/reports/all').respond({  
      "list":[{
        id:"achievements", enabled:true, name:"Learning Events & Time Played"
      }, { id:"sowo", enabled:true, name:"Shout Out and Watch Out Report" }],
      gameId:"AA-1", enabled:true, visible:true, shortName:"Argubot Academy EDU",
      longName:"Mars Generation One: Argubot Academy EDU"
    });

    $httpBackend.whenGET('/api/v2/dash/reports/sowo/game/AA-1/course/101').respond({ });
    
    ctrl = $controller('InstructorDashboardCtrl', {
      $scope: scope,
      activeCourses: [{id:101, title:"2nd period trigonometry", grade:["8","9"],
        users:[{id:274, username:"Student Number 100001", lastName:"B", 
          firstName:"Studenty", role:"student"}],
        games: [{id:"AA-1"}, {id:"SC"}, {id:"AW-1"}, {id:"GOG"}]}],
      coursesInfo: [],
      myGames: [{gameId: 'AA-1', shortName: 'Argubot Academy', price: 'Free' },
                {gameId:"AW-1", shortName:"Argument Wars", price:"Free"},
                {gameId:"SC", shortName:"SimCityEDU", price:"Free"}],
      defaultGameId: 'AA-1',
      messages: ['A sample message'],
      $stateParams: { courseId: 101, gameId: 'AA-1' }
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Initialization', function() {
  
    it('should set initial values based on retrieved data', function() {
      expect(_.keys(scope.students).length).toEqual(1);
      expect(_.keys(scope.courses).length).toEqual(4);
      expect(scope.myGames.length).toEqual(3);
      expect(scope.messages.length).toEqual(1);
      $httpBackend.flush();
    });

    it('should set up scope.status during init', function() {
      expect(scope.status.selectedGameId).toEqual('AA-1');
      expect(scope.status.selectedGame).not.toBe(null);
      expect(scope.status.selectedGame.shortName).toEqual('Argubot Academy');
      $httpBackend.flush();
    });
    
    it('should set up prev & next game IDs based on available games', function() {
      expect(scope.status.prevGameId).toEqual('SC');
      expect(scope.status.nextGameId).toEqual('AW-1');
      $httpBackend.flush();
    });

    it('should set attributes on $scope.courses object', function() {
      expect(scope.courses.isOpen).toBe(false);
      expect(scope.courses.selectedCourseId).toEqual(101);
      expect(_.keys(scope.courses.options).length).toEqual(1);
      $httpBackend.flush();
    });
  });


});
