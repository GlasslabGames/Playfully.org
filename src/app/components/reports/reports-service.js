angular.module('reports', [])
.service('ReportsService', function ($http, $log, API_BASE, CoursesService, GamesService, $q) {

    this.get = function(reportId, gameId, courseId) {
      var apiUrl = API_BASE + '/dash/reports/' + reportId + '/game/' + gameId + '/course/' + courseId;
      return $http({method: 'GET', url: apiUrl})
        .then(function(response) {
          //console.log('reports service:', response);
          // return sampleData.partial;
          return response.data;
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
          return GamesService.all().then(function(games) {
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
});
/**
 * Sample data to be used for development
 **/

/*var sampleData = {
  none: [],
  partial: [{"gameId":"AA-1","userId":"274","assessmentId":"sowo","results":{"shoutout":[],"watchout":[]}}],
  full: [{
  "gameId":"AA-1",
    "userId":"274",
    "assessmentId":"sowo",
    "results": { 
      "watchout": [{
        "total":2,
        "overPercent":0.5,
        "timestamp":1408220940287,
        "id":"wo3",
        "name":"Straggler",
        "description": "Struggling with identifying strengths and weaknesses of claim-data pairs."
      },
      {
        "total":4,
        "overPercent":0.5,
        "timestamp":1409006293564,
        "id":"wo1",
        "name":"Contradictory Mechanic",
        "description":"Student is struggling with claim-data pairs. They are consistently using evidence that contradicts their claim. More core construction practice is needed."
      }],
      "shoutout":[]
    }
},
{
  "gameId":"AA-1",
  "userId":"275",
  "assessmentId":"sowo",
  "results":{
    "watchout":[{
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
    }],
    "shoutout":[{
      "total":3,
      "overPercent":0.3333333333333333,
      "timestamp":1409016775555,
      "id":"so1",
      "name":"Nailed It!",
      "description":"Outstanding performance at identifying weaknesses of claim-data pairs."
    }]
  }
},
{
  "gameId":"AA-1",
  "userId":"276",
  "assessmentId":"sowo",
  "results": {
    "shoutout":[],
    "watchout":[]
  }
},
{
  "gameId":"AA-1",
  "userId":"305",
  "assessmentId":"sowo",
  "results": {
    "watchout": [{
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
    }],
    "shoutout":[]
  }
}]
};
*/
