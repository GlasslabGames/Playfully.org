angular.module( 'instructor.dashboard', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'instructorDashboard', {
    parent: 'site',
    url: '/dashboard',
    views: {
      'main@': {
        controller: 'InstructorDashboardCtrl',
        templateUrl: 'instructor/dashboard/instructor-dashboard.html'
      }
    },
    data:{
      pageTitle: 'Dashboard',
      authorizedRoles: ['instructor']
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollmentsWithStudents();
      },
      games: function(GamesService) {
        return GamesService.all();
      }
    }
  });
})

.controller( 'InstructorDashboardCtrl',
  function ( $scope, $log, courses, games, GamesService) {

    $scope.courses = courses;
    $scope.games = games;
    $scope.status = { 
      selectedOption: games[0].shortName
    };

    $scope.shoutOuts = [
      { firstName: 'Anika', lastName: 'Q', count: 2 },
      { firstName: 'Ben', lastName: 'D', count: 3 },
      { firstName: 'Carlos', lastName: 'E', count: 2 },
      { firstName: 'Cynthia', lastName: 'P', count: 1 },
      { firstName: 'Dan', lastName: 'C', count: 2 },
      { firstName: 'Dan', lastName: 'I', count: 1 }
    ];

    $scope.watchOuts = [
      { firstName: 'Hilary', lastName: 'C', count: 2 },
      { firstName: 'Hope', lastName: 'F', count: 1 },
      { firstName: 'Justin', lastName: 'A', count: 3 },
      { firstName: 'Martina', lastName: 'B', count: 1 },
      { firstName: 'Sandra', lastName: 'X', count: 2 },
      { firstName: 'Solomon', lastName: 'C', count: 1 },
    ];

    $scope.getTimes = function(n) { return new Array(n); };

});


