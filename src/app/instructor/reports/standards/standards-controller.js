angular.module( 'instructor.reports')

.config(function ( $stateProvider, USER_ROLES) {
    $stateProvider.state('modal-xlg.standardsInfo', {
      url: '/reports/details/standards/game/:gameId?:type?:progress?:defaultStandard',
      data:{
        pageTitle: 'Standards Report'
      },
      views: {
        'modal@': {
          templateUrl: function($stateParams, REPORT_CONSTANTS) {
            return 'instructor/reports/standards/_modal-' + $stateParams.type + '.html';
          },
          controller: function($scope, $log, $stateParams, StandardStore, REPORT_CONSTANTS) {
            $scope.progressTypes = REPORT_CONSTANTS.standardsLegendOrder;
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
            var standard = angular.copy(StandardStore.getStandard());
            if (standard) {
                $scope.progressText = standard.progress[$stateParams.progress];
            } else {
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
  function($scope, $rootScope, $log, $state, $stateParams, $timeout, defaultCourse, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, StandardStore, usersData) {
    ///// Setup selections /////

    // Report
    var reportId = 'standards';
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

    // students in course grouped by columns and rows
    var studentsToSort = [];
    
    $scope.courses.selected.users.forEach(function(student) { studentsToSort.push(student); });
    studentsToSort.sort(function(first,second) { return first.firstName.localeCompare(second.firstName); });
                        
    var columns = Math.floor((studentsToSort.length + 14) / 15);
    var rows = studentsToSort.length > 15 ? 15 : studentsToSort.length;
    var students = [];
                        
    for (var i=0;i<rows;i++) {
        var row = [];
        for (var j=0;j<columns;j++) {
            if (i + 15 * j < studentsToSort.length) {
                row.push(studentsToSort[i + 15 * j]);
            } else {
                row.push(null);
            }
        }
        students.push(row);
    }
    
    $scope.students = students;
    $scope.studentListWidth = 80 + 120 * columns;
                        
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

    $scope.progressTypes = REPORT_CONSTANTS.standardsLegendOrder;

    var _convertToGeneralType = function (type) {
      var general = type;
      // TODO: Refactor to more robust check
      angular.forEach($scope.progressTypes, function (progressType) {
          if (progressType[0] === type[0]) {
              general = progressType;
          }
      });
      return general;
   };
    $scope.getLabelInfo = function(label,type) {
        if (label && type) {
            label = _convertToGeneralType(label);
            return REPORT_CONSTANTS.legend[label][type];
        } else if (type === 'text') {
            // if student has no data
            return "notstarted";
        }
    };


   var _populateStudentLearningData = function(usersReportData) {
       if (usersReportData) {
           if (usersReportData.length < 1 ) {
               $scope.noUserData = true;
               return;
           } else {
               // Populate students in course with report data
               var students = $scope.courses.selected.users;
               angular.forEach(students, function (student) {
                   var userReportData = _findUserByUserId(student.id, usersReportData) || {};
                   student.results = userReportData.results;
                   student.timestamp = angular.copy(userReportData.timestamp);
               });
           }
      }
   };

  var _findUserByUserId = function (userId, users) {
      var found;
      for (var i = 0; i < users.length; i++) {
          if (users[i].userId == userId) {
              found = users[i];
          }
      }
      return found || null;
  };

   var _initStandards = function () {
       // create list of standards
       angular.forEach($scope.reports.selected.table.groups, function(group) {
         angular.forEach(group.subjects, function(subject) {
            angular.forEach(subject.standards, function(standard) {
                // to help generate student data for report table
                $scope.reports.standardsList.push(standard);
                // to help easily access standard info in legend modal
                $scope.reports.standardsDict[standard.id] = standard;
            });
         });
       });
       // for displaying legend information
       $scope.defaultStandard = $scope.reports.standardsList[0];
   };
   // To pass data to modal
   $scope.setStandard = function (standardId) {
       StandardStore.setStandard($scope.reports.standardsDict[standardId]);
   };
   $scope.setReport = function (report) {
       StandardStore.setReport(report);
    };
   $scope.setStandardDict = function (dictionary) {
       StandardStore.setStandardDict(dictionary);
    };
    // set headers for standards table
    _initStandards();
    // populate student data with standards descriptions
    _populateStudentLearningData(usersData);
});

