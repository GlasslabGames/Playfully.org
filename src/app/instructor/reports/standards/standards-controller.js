angular.module( 'instructor.reports')

.config(function ( $stateProvider, USER_ROLES) {
    $stateProvider.state('modal-xlg.standardsInfo', {
      url: '/reports/details/standards/game/:gameId/:type',
      data:{
        pageTitle: 'Standards Report'
      },
      resolve: {
      },
      views: {
        'modal@': {
          templateUrl: function($stateParams) {
            return 'instructor/reports/standards/_modal-' + $stateParams.type + '.html';
          },
          controller: function($scope, $log) {

          }
        }
      }
    });
})

.controller( 'StandardsCtrl',
  function($scope, $rootScope, $log, $state, $stateParams, $timeout, defaultCourse, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService) {
    ///// Setup selections /////

    // Report
    var reportId = 'standards';
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

      // Games
    $scope.games.selectedGameId = defaultGame.gameId;

    // Get the default standard from the user
    $scope.defaultStandards = "CCSS";

    ///// Setup options /////

    // Games
    $scope.games.options = {};
    angular.forEach(myGames, function(game) {
        $scope.games.options[''+game.gameId] = game;
    });

    // Reports
    $scope.reports.options = [];
    $scope.reports.standards = [];

    angular.forEach(gameReports.list, function(report) {
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
        // select report that matches this state
        if (reportId === report.id) {
          $scope.reports.selected = report;
        }
      }
    });

    // Check if game is premium and disabled
    if (defaultGame.price === 'Premium' && !defaultGame.assigned) {
       $scope.isGameDisabled = true;
    }
    // Check if selected game has selected report

    if (!ReportsService.isValidReport(reportId,$scope.reports.options))  {
      $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId,$scope.reports.options), {
        gameId: $stateParams.gameId,
        courseId: $stateParams.courseId
      });
      return;
    }

    // Set parent scope developer info

    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }


    $scope.state = {
      showStandardsDescriptions: true
    };

    $scope.getLabelInfo = function(label) {
        return REPORT_CONSTANTS.legend[label];
    };

   // retrieve user data
   ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function (users) {
           // set headers for standards table
          _initStandards();
           // populate student data with standards descriptions
          _populateStudentLearningData(users);
   });
   var _populateStudentLearningData = function(users) {
      if (users) {
        // Attach achievements and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].results    = angular.copy(user.results);
          $scope.students[user.userId].timestamp = angular.copy(user.timestamp);
        });
      }
   };
   var _initStandards = function () {
       // create list of standards
       angular.forEach($scope.reports.selected.table.groups, function(group) {
         angular.forEach(group.subjects, function(subject) {
            angular.forEach(subject.standards, function(standard) {
                $scope.reports.standards.push(standard);
            });
         });
       });
   };
    if(!$scope.reportInfo) {
      $scope.reportInfo = {
        labels: []
      };
    }
});

