angular.module('reports', [])
.factory('ReportsService', function ($http, $log, API_BASE, CoursesService, GamesService) {

  var api = {

    get: function(reportId, gameId, courseId) {
      var apiUrl = API_BASE + '/dash/reports/' + reportId + '/game/' + gameId + '/course/' + courseId;
      return $http({method: 'GET', url: apiUrl})
        .then(function(response) {
          // return sampleData.partial;
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },
    // returns an object that contains the game available for this course and their information.
    getCourseGames: function(courseId){
        // get gameIds available for this course
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
              console.log('COURSES', courses);
              return courses;
          });
      });
    }
  };

  return api;

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
