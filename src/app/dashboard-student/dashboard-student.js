angular.module( 'playfully.dashboard-student', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'dashboard-student', {
    parent: 'site',
    url: '/home',
    views: {
      'main@': {
        controller: 'DashboardStudentCtrl',
        templateUrl: 'dashboard-student/dashboard-student.html'
      }
    },
    data:{
      pageTitle: 'Home',
      authorizedRoles: ['student']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  });
})

.controller( 'DashboardStudentCtrl', function ( $scope, $log, courses, games) {

  /* Attach the games to the courses retrieved in the resolve. */
  angular.forEach(games, function(game) {
    angular.forEach(courses, function(course) {
      if (!course.hasOwnProperty('games')) { course.games = []; }
      if (course.gameIds.indexOf(game.gameId) > -1) {
        course.games.push(game);
      }
    });
  });

  $scope.courses = courses;

});


