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
      myGames: [{gameId:"AW-1", shortName:"Argument Wars", price:"Free"},
                {gameId:"SC", shortName:"SimCityEDU", price:"Free"}],
      defaultGameId: 'AA-1',
      messages: [],
      $stateParams: { courseId: 101, gameId: 'AA-1' }
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should do something', function() {
    $httpBackend.flush();
  });



});
