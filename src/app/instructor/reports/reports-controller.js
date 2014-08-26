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
      allGames: function(GamesService) {
        return GamesService.all();
      },
      activeCourses: function(CoursesService) {
        return CoursesService.getActiveEnrollmentsWithStudents();
      }
    },
    data: {
      authorizedRoles: ['instructor'],
      pageTitle: 'Reports'
    }
  });
})


.controller( 'ReportsCtrl',
  function($scope, $state, $stateParams, $log, allGames, activeCourses, CoursesService, ReportsService, GamesService) {

    $scope.students = {};
    $scope.achievements = { options: {}, selected: null, active: [], startIndex: 0, totalCount: 0 };
    $scope.sowoInfo = {};
    $scope.achievementInfo = {};

    /* Courses */
    $scope.courses = { selectedId: null, options: {} };
    angular.forEach(activeCourses, function(course) {
      course.isExpanded = false;
      course.isPartiallySelected = false;
      $scope.courses.options[course.id] = course;
      angular.forEach(course.users, function(student) {
        if (!$scope.students.hasOwnProperty(student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });
    $scope.activeCourses = activeCourses;

    $scope.$watch('courses.selectedId', function(newValue, oldValue) {
      if (newValue == null) { return; }
      /**
       * Deselect all students in the old course, set expanded and selected
       * options accordingly.
       **/
      if (oldValue) {
        angular.forEach($scope.courses.options[oldValue].users, function(student) {
          student.isSelected = false;
        });
        $scope.courses.options[oldValue].isExpanded = false;
        $scope.courses.options[oldValue].isPartiallySelected = false;
      }
      if (!$scope.courses.options[newValue].isPartiallySelected) {
        angular.forEach($scope.courses.options[newValue].users, function(student) {
          student.isSelected = true;
        });
      }
    });

    /* Initialize with the first course in the list selected */
    $scope.courses.selectedId = null;
    if (activeCourses.length) {
      $scope.courses.selectedId = activeCourses[0].id;
    }
    
    /* Set the passed-in course to be the selected one */
    $scope.selectCourse = function($event, courseId) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.courses.selectedId = courseId;
    };

    /* Toggle the visibility of this student */
    $scope.toggleStudent = function($event, student, course) {
      $event.preventDefault();
      $event.stopPropagation();
      // Students are not selectable for Shout Out / Watch Out
      if ($scope.reports.selected && $scope.reports.selected.id == 'sowo') {
        return false;
      }

      student.isSelected = !student.isSelected;
      course.isPartiallySelected = false;

      /* If any students are not selected, set isPartiallySelected to true */
      angular.forEach(course.users, function(student) {
        if (!student.isSelected) {
          course.isPartiallySelected= true;
        }
      });
      if (student.isSelected && course.id != $scope.courses.selectedId) {
        $scope.selectCourse($event, course.id);
      }
    };

    $scope.games = {
      isOpen: false,
      selected: 'AA-1',
      options: {}
    };
    /* Set up active games in the games list */
    angular.forEach(allGames, function(game) {
      if (game.enabled) {
        $scope.games.options[''+game.gameId] = game;
      }
    });


    /* Hardcode available reports */
    $scope.reports = {
      isOpen: false,
      selected: null,
      options: []
    };

    $scope.selectGame = function($event, key) {
      $scope.games.selected = key;
      $scope.toggleDropdown($event, 'games');
    };

    $scope.selectReport = function($event, report) {
      $scope.reports.selected = report;
      $scope.toggleDropdown($event, 'reports');
    };

    $scope.selectGame = function($event, key) {
      $scope.games.selected = key;
      $scope.toggleDropdown($event, 'games');
    };

    $scope.toggleDropdown = function($event, collection) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[collection].isOpen = !$scope[collection].isOpen;
    };


    $scope.$watchCollection('games.selected', function(newValue, oldValue) {
      GamesService.getAllReports(newValue)
        .then(function(data) {
          if (data.list && data.list.length) {
            $scope.reports.options = data.list;
            $scope.reports.selected = data.list[0];

            angular.forEach($scope.reports.options, function(report) {
                if(report.id == 'achievements') {
                  _populateAchievements(report.achievements);
                }
            });
          }
          if (data.developer) {
            $scope.developer = data.developer;
          }
        });

    });


    $scope.$watchCollection('reports.selected', function(newValue, oldValue) {
      if ($scope.activeCourses.length === 0 || newValue == null || oldValue == null) {
        return;
      }

      ReportsService.get(newValue.id, $scope.games.selected, $scope.courses.selectedId)
        .then(function(data) {
          if (newValue.id == 'sowo') {
            _populateSowo(data);
          } else if (newValue.id == 'achievements') {
            _populateStudentAchievements(data);
          }
        });

    });

  $scope.$watch('achievements.selected', function(newValue, oldValue) {
    $scope.selectActiveAchievements(newValue, 0);
  });

  $scope.selectActiveAchievements = function(group, index) {
    angular.forEach($scope.achievements.options, function(option) {
      if (option.id == group) {
        var totalItems = 0;
        angular.forEach(option.subGroups, function(subGroup) {
          totalItems += subGroup.items.length;
        });
        $scope.achievements.totalCount = totalItems;

        if (index < 0 || totalItems < index + 3) {
          return false;
        } else {
          $scope.achievements.startIndex = index;
          $scope.achievements.active = option.list.slice(index, index + 3);
        }
      }
    });
  };

  $scope.isAwardedAchievement = function(activeAchv, studentAchv) {
    if(studentAchv) {
      for(var i = 0; i < studentAchv.length; i++) {
        // TODO: check for subgroup
        if( (studentAchv[i].item == activeAchv.id) &&
            studentAchv[i].won
          ) {
            return true;
        }
      }
    }

    return false;
  };

  $scope.getStudentResult = function(studentId, achievement) {
    angular.forEach($scope.students, function(student) {
      if (student.id == studentId) {
        angular.forEach(student.achievements, function(achv) {
          if (achv.group == achievement.group && achv.item == achievement.item) {
            return achv.won;
          }
        });
      }
    });
  };

  var _populateSowo = function(data) {
    // $scope.sowo = data;
    var sowo = data;
    /* Fake data for development
     var sowo = [{
      "results": {
          "watchout": [{
            "id": "wo1",
            "total": 6,
            "overPercent": 1,
            "timestamp": 1408040686051,
            "name": "Contradictory Mechanic",
            "description": "Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }]
      },
      "gameId": "AA-1",
      "userId": "25",
      "assessmentId": "sowo"
    },
    {
      "results": {
        "watchout": [{
          "id": "wo1",
          "total": 6,
          "overPercent": 1,
          "timestamp": 1408040686051,
          "name": "Contradictory Mechanic",
          "description": "Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }],
        "shoutout": [{
          "id":   "so1",
          "total": 3,
          "overPercent": 1,
          "timestamp": 1408040686053,
          "name": "Nailed It!",
          "description": "Outstanding performance at identifying weaknesses of claim-data pairs."
        }]
      },
      "gameId": "AA-1",
      "userId": "26",
      "assessmentId": "sowo"
    },
    {
      "results": {
        "shoutout": [{
          "id":   "so1",
          "total": 3,
          "overPercent": 1,
          "timestamp": 1408040686053,
          "name": "Nailed It!",
          "description": "Outstanding performance at identifying weaknesses of claim-data pairs."
          }]
        },
        "gameId": "AA-1",
        "userId": "27",
        "assessmentId": "sowo"
    },
    {
      "results": {
        "watchout": [{
          "id": "wo1",
          "total": 6,
          "overPercent": 1,
          "timestamp": 1408040686051,
          "name": "Contradictory Mechanic",
          "description": "Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        },
        {
          "id": "wo3",
          "total": 3,
          "overPercent": 1,
          "timestamp": 1408040686051,
          "name": "Straggler",
          "description": "Struggling with identifying strengths and weaknesses of claim-data pairs."
        }]
      },
      "gameId": "AA-1",
      "userId": "28",
      "assessmentId": "sowo"
    }];*/

    $scope.sowo = { 
      shoutOuts: [],
      watchOuts: []
    };

    if (sowo.length) {
      angular.forEach(sowo, function(assessment) {
        if (assessment.results.hasOwnProperty('shoutout')) {
          $scope.sowo.shoutOuts.push({
            student: $scope.students[assessment.userId],
            results: assessment.results['shoutout'],
            overflowText: _getOverflowText(assessment.results['shoutout'])
          });
        }
        if (assessment.results.hasOwnProperty('watchout')) {
          $scope.sowo.watchOuts.push({
            student: $scope.students[assessment.userId],
            results: assessment.results['watchout'],
            overflowText: _getOverflowText(assessment.results['watchout'])
          });
        }
      });
    }
  };

  var _getOverflowText = function(results) {
    overflowText = '';
    angular.forEach(results, function(r, i) {
      if (i >= 3) {
        overflowText += '<p>' + r.description + '</p>';
      }
    });
    return overflowText;
  };


  var _getRandomTime = function() {
    return Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000) + 1000;
  };

  var _populateAchievements = function(reports) {
    for(var i = 0; i < reports.length; i++) {
      reports[i].list = [];
      for(var j = 0; j < reports[i].subGroups.length; j++) {
        for(var k = 0; k < reports[i].subGroups[j].items.length; k++) {
          reports[i].subGroups[j].items[k].standard = {
            title:       reports[i].subGroups[j].title,
            description: reports[i].subGroups[j].description
          };

          reports[i].list.push( reports[i].subGroups[j].items[k] );
        }
      }
    }

    $scope.achievements.options = reports;
    $scope.achievements.selected = reports[0].id;
  };

  var _populateStudentAchievements = function(data) {
    // Attach achievements and time played to students
    angular.forEach(data, function(d) {
      $scope.students[d.userId].achievements    = d.achievements;
      $scope.students[d.userId].totalTimePlayed = d.totalTimePlayed;
    });

    // Create list of achievements
    /*
    angular.forEach(data[0].achievements, function(achievement) {
      var achv = angular.copy(achievement);
      delete achv.won;
      if (!$scope.achievements.options.hasOwnProperty(achievement.group)) {
        $scope.achievements.options[achievement.group] = [achv];
      } else {
        $scope.achievements.options[achievement.group].push(achv);
      }
      $scope.achievements.selected = data[0].achievements[0].group;
    });
    */
  };

});


