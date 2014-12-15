angular.module('reports', [])
.service('ReportsService', function ($http, $log, API_BASE, CoursesService, GamesService, $q) {

    this.get = function(reportId, gameId, courseId) {
      var apiUrl = API_BASE + '/dash/reports/' + reportId + '/game/' + gameId + '/course/' + courseId;
      return $http({method: 'GET', url: apiUrl})
        .then(function(response) {
          return sampleData;
          // return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    };
    // returns an object that contains the games available for this course and their information.
    this.getCourseGames = function(courseId){
        // get games available for this course
      return CoursesService.get(courseId).then(function(courseInfo) {
         var courses = [];
          // get an array of game information
          return GamesService.active().then(function(games) {
              angular.forEach(courseInfo.games,function(game) {
                  angular.forEach(games, function(gameInfo) {
                      if (game.id === gameInfo.gameId) {
                          courses.push(gameInfo);
                      }
                  });
              });
              return courses;
          });
      });
    };
    this.getCourseInfo = function(activeCourses) {
        var deferred = $q.defer();
        var courses = {};
        var gamePromises = [];
        var reportPromises = [];

        angular.forEach(activeCourses, function(course) {
            courses[course.id] = course;
            gamePromises.push(this.getCourseGames(course.id).then(function(games) {
                // set course games that are enabled
                courses[course.id].games = games.filter(function(game) {
                    return game.enabled;
                });
                return;
            }, function() {
                console.err('ReportsService - getCourseInfo: failed to retrieve course games');
            }));
        }.bind(this));
        $q.all(gamePromises).then(function() {
            angular.forEach(activeCourses, function(course) {
                angular.forEach(courses[course.id].games, function(game) {
                  reportPromises.push(GamesService.getAllReports(game.gameId).then(function(report) {
                    game.reports = report;
                  }));
                });
            });
            $q.all(reportPromises).then(function() {
               deferred.resolve(courses);
            }, function() {
               console.err('ReportsService - getCourseInfo: failed to retrieve game reports');
               deferred.reject('failed to retrieve game reports');
            });
        });

        return deferred.promise;

    };

    this.isValidReport = function(reportId,reportOptions){
      for(var i = 0; i < reportOptions.length; i++) {
        if(reportOptions[i].id === reportId) {
          return true;
        }
      }
      return false;
    };

    this.getDefaultReportId = function(fallBackId,reportOptions) {
      if( reportOptions &&
          reportOptions[0] &&
          reportOptions[0].id) {
        return reportOptions[0].id;
      } else {
        return fallBackId;
      }
    };

    this.selectStudents = function(activeCourse,studentIds) {
      // If there are studentIds in parameters, select those students
      // else select all students
      var selectedStudents = null;
      if (studentIds) {
        selectedStudents = studentIds.split(',');
      }
      angular.forEach(activeCourse.users, function(student) {
        if (selectedStudents && selectedStudents.indexOf(''+student.id) < 0) {
          student.isSelected = false;
          activeCourse.isPartiallySelected = true;
          activeCourse.isExpanded = true;
        } else {
          student.isSelected = true;
        }
      });
    };

    this.getSelectedStudentIds = function(course) {
      var studentIds = [];
      angular.forEach(course.users, function(student) {
        if (student.isSelected) {
          studentIds.push(student.id);
        }
      });
      return studentIds;
    };

    this.removeWatchOut = function (studentId, gameId, sowoId) {
      $log.info('called removeWatchOut', arguments);
    };
});


var sampleData = [  
  {  
    "gameId":"AA-1",
    "userId":"274",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408220940287,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        },
        {  
          "total":4,
          "overPercent":0.5,
          "timestamp":1409006293564,
          "id":"wo1",
          "name":"Contradictory Mechanic",
          "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }
      ],
      "shoutout":[
        {  
          "total":3,
          "overPercent":0.3333333333333333,
          "timestamp":1409016775555,
          "id":"so1",
          "name":"Nailed It!",
          "description":"Outstanding performance at identifying weaknesses of claim-data pairs."
        }
      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"275",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408229783997,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        }
      ],
      "shoutout":[]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"312",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408267584431,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        },
        {  
          "total":3,
          "overPercent":0.25,
          "timestamp":1409016775554,
          "id":"wo1",
          "name":"Contradictory Mechanic",
          "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }
      ],
      "shoutout":[  
        {  
          "total":3,
          "overPercent":0.3333333333333333,
          "timestamp":1409016775555,
          "id":"so1",
          "name":"Nailed It!",
          "description":"Outstanding performance at identifying weaknesses of claim-data pairs."
        }
      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"313",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"314",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"315",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  
        {  
          "total":3,
          "overPercent":0.3333333333333333,
          "timestamp":1409748623108,
          "id":"so1",
          "name":"Nailed It!",
          "description":"Outstanding performance at identifying weaknesses of claim-data pairs."
        }
      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"324",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1409006343350,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6728",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408584526794,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6704",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408221239188,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        },
        {  
          "total":3,
          "overPercent":0.25,
          "timestamp":1409006354800,
          "id":"wo1",
          "name":"Contradictory Mechanic",
          "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6707",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":3,
          "overPercent":1,
          "timestamp":1409006351872,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6711",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408383627148,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6712",
    "assessmentId":"sowo",
    "results":{  
      "watchout":[  
        {  
          "total":2,
          "overPercent":0.5,
          "timestamp":1408402526043,
          "id":"wo3",
          "name":"Straggler",
          "description":"Struggling with identifying strengths and weaknesses of claim-data pairs."
        },
        {  
          "total":4,
          "overPercent":0.5,
          "timestamp":1409006242534,
          "id":"wo1",
          "name":"Contradictory Mechanic",
          "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }
      ],
      "shoutout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6714",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6720",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  
        {  
          "total":3,
          "overPercent":0.3333333333333333,
          "timestamp":1409020373972,
          "id":"so1",
          "name":"Nailed It!",
          "description":"Outstanding performance at identifying weaknesses of claim-data pairs."
        }
      ],
      "watchout":[  
        {  
          "total":3,
          "overPercent":0.25,
          "timestamp":1409018307083,
          "id":"wo1",
          "name":"Contradictory Mechanic",
          "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
        }
      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6723",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6725",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6729",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6730",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6766",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6769",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6764",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6767",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6768",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  },
  {  
    "gameId":"AA-1",
    "userId":"6865",
    "assessmentId":"sowo",
    "results":{  
      "shoutout":[  

      ],
      "watchout":[  

      ]
    }
  }
];

