angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router',
  'reports'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'reports', {
    url: '/reports',
    views: {
      main: {
        templateUrl: 'instructor/reports/reports.html',
        controller: 'ReportsCtrl'
      }
    },
    resolve: {
      // gameDetails: function($stateParams, GamesService) {
      //   return GamesService.getDetail($stateParams.gameId);
      // }
    },
    data: {
      authorizedRoles: ['instructor'],
      pageTitle: 'Reports'
    }
  });
})


.controller( 'ReportsCtrl',
  function($scope, $state, $stateParams, $log, CoursesService, ReportsService) {

    $scope.courses = [];
    $scope.students = [];
    $scope.achievements = [];
    $scope.activeAchievements = [];

    CoursesService.getEnrollmentsWithStudents()
      .then(function(data) {
        $log.info(data);
        angular.forEach(data, function(course) {
          if (!course.archived) {
            $scope.courses.push(course);
          }
        });
        angular.forEach($scope.courses[0].users, function(student) {
          $scope.students.push(student);
        });
        $scope.courses[0].isExpanded = true;
        ReportsService.getAchievements('AA-1', $scope.courses[0].id)
          .then(function(students) {
            angular.forEach(students, function(student) {
              angular.forEach($scope.students, function(s) {
                if (s.id == student.userId) {
                  s.achievements = student.achievements;
                }
              });
            });
            angular.forEach($scope.students[0].achievements, function (achievement) {
              var obj = angular.copy(achievement);
              delete obj.won;
              $scope.achievements.push(obj);
            });
            $scope.activeAchievements.push($scope.achievements[0]);
            $scope.activeAchievements.push($scope.achievements[1]);
            $scope.activeAchievements.push($scope.achievements[2]);
            $log.info($scope.activeAchievements);
          });
      });


  $scope.getStudentResult = function(studentId, achievement) {
    angular.forEach($scope.students, function(student) {
      if (student.id == studentId) {
        angular.forEach(student.achievements, function(achv) {
          if (achv.group == achievement.group && achv.item == achievement.item) {
            $log.info('Got a match at least');
            return achv.won;
          }
        });
      }
    });
  };




});


