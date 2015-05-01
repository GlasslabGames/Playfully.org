angular.module( 'instructor.reports')

.config(function ( $stateProvider, USER_ROLES) {
    $stateProvider.state('modal-xlg.standardsInfo', {
      url: '/reports/details/standards/game/:gameId/:type/:progress/:defaultStandard',
      data:{
        pageTitle: 'Standards Report'
      },
      views: {
        'modal@': {
          templateUrl: function($stateParams) {
            return 'instructor/reports/standards/_modal-' + $stateParams.type + '.html';
          },
          controller: function($scope, $log, $stateParams, StandardStore, REPORT_CONSTANTS) {
            $scope.standardObj = {};
            $scope.standardObj.selected = null;
            $scope.getLabelInfo = function(label,type) {
                if (label && type) {
                    return REPORT_CONSTANTS.legend[label][type];
                } else {
                    return label;
                }

            };
            if ($stateParams.defaultStandard){
              $scope.standardObj.selected = $stateParams.defaultStandard;
            }
            console.dir($scope.selectedStandard);
            var standard = angular.copy(StandardStore.getStandard());
            if (standard) {
                $scope.progressText = standard.progress[$stateParams.progress];
            }
            var report = angular.copy(StandardStore.getReport());
            if (report) {
                $scope.report = report;
            }
            var standardDictionary = angular.copy(StandardStore.getStandardDict());
            if (standardDictionary) {
                $scope.standardDictionary = standardDictionary;
            }
          }
        }
      }
    });
})
.service('StandardStore', function() {
        var _standard = null;
        var _report = null;
        var _dictionary = null;
        this.setStandard = function(standard) {
            if (standard) {
              _standard = standard;
            }
        };
        this.getStandard = function () {
            var standardCopy = angular.copy(_standard);
            // reset after retrieval
            _standard = null;
            return standardCopy;
        };
        this.setReport = function (report) {
            if (report) {
              _report = report;
            }
        };
        this.getReport = function () {
            var reportCopy = angular.copy(_report);
            // reset after retrieval
            _report = null;
            return reportCopy;
        };
        this.setStandardDict = function (dictionary) {
            if (dictionary) {
              _dictionary = dictionary;
            }
        };
        this.getStandardDict = function () {
            var dictionaryCopy = angular.copy(_dictionary);
            // reset after retrieval
            _dictionary = null;
            return dictionaryCopy;
        };
})
.controller( 'StandardsCtrl',
  function($scope, $rootScope, $log, $state, $stateParams, $timeout, defaultCourse, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, StandardStore) {
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
    $scope.reports.standardsList = [];
    $scope.reports.standardsDict = {};

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

    $scope.getLabelInfo = function(label,type) {
        return REPORT_CONSTANTS.legend[label][type];
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
   $scope.setStandard = function (standardId) {
       StandardStore.setStandard($scope.reports.standardsDict[standardId]);
   };
   $scope.setReport = function (report) {
       StandardStore.setReport(report);
    };
   $scope.setStandardDict = function (dictionary) {
       StandardStore.setStandardDict(dictionary);
    };


   var _initStandards = function () {
       // create list of standards
       angular.forEach($scope.reports.selected.table.groups, function(group) {
         angular.forEach(group.subjects, function(subject) {
            angular.forEach(subject.standards, function(standard) {
                $scope.reports.standardsList.push(standard);
                $scope.reports.standardsDict[standard.id] = standard;
            });
         });
       });
       $scope.defaultStandard = $scope.reports.standardsList[0];
   };
    if(!$scope.reportInfo) {
      $scope.reportInfo = {
        labels: []
      };
    }
});

