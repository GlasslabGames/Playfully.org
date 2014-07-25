angular.module('courses', [])
.factory('CoursesService', function ($http, $log, API_BASE) {

  var api = {

    get: function (courseId) {
      return $http.get(API_BASE + '/lms/course/' + courseId + '/info')
        .then(function(response) {
          return response.data;
        }, function(response) {
          return response;
        });
    },

    update: function (course) {
      /* Hack to create an `id` attribute so the API will be happy */
      angular.forEach(course.games, function(game) { game.id = game.gameId; });
      /* Turn the array of grades into a string for the API */
      course.grade = course.grade.join(', ');
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
        // .then(function (response) {
        //   $log.info(response);
        //   return response.data;
        // }, function (response) {
        //   $log.error(response);
        //   return response;
        // });
    },

    archive: function (course) {
      /* Hack to create an `id` attribute so the API will be happy */
      angular.forEach(course.games, function(game) { game.id = game.gameId; });
      course.archived = true;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    unarchive: function (course) {
      /* Hack to create an `id` attribute so the API will be happy */
      angular.forEach(course.games, function(game) { game.id = game.gameId; });
      course.archived = false;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    lock: function (course) {
      course.locked = true;
      course.lockedRegistration = true;
      $log.info(course);
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    updateGames: function (course) {
      games = [];
      angular.forEach(course.games, function(game) {
        games.push({
          id: game.gameId,
          settings: angular.copy(game.settings)
        });
      });
      $log.info(games);
      return $http.post(API_BASE + '/lms/course/' + course.id + '/games', games);
    },


    /* DEPRECATED?
    delete: function (courseId) {
      return $http
        .delete(API_BASE + '/lms/course/' + courseId)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },
    */

    getEnrollments: function() {
      return $http
        .get(API_BASE + '/lms/courses')
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getEnrollmentsWithStudents: function () {
      var apiUrl = API_BASE + '/lms/courses';
      return $http({ method: 'GET', url: apiUrl, params: { showMembers: 1 }})
        .then(function(response) { return response.data; },
            function(response) { $log.error(response); return response; });
    },


    create: function(data) {
      /* Hack to create an `id` attribute so the API will be happy */
      angular.forEach(data.games, function(game) { game.id = game.gameId; });
      /* Turn the array of grades into a string for the API */
      data.grade = data.grade.join(', ');
      return $http.post(API_BASE + '/lms/course/create', data);
    },

    validateCode: function (code) {
      return $http
        .post(API_BASE + '/lms/course/code/valid')
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getNewCode: function () {
      return $http
        .post(API_BASE + '/lms/course/code/newcode')
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(reponse);
          return response;
        });
    },

    enroll: function(courseCode) {
      return $http.post(API_BASE + '/lms/course/enroll', { courseCode: courseCode });
    },

    unenroll: function() {
      return $http
        .post(API_BASE + '/lms/course/unenroll')
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    unenrollUser: function(courseId, userId) {
      var data = { course: courseId, user: userId };
      return $http.post(API_BASE + '/lms/course/unenroll-user', data);
    },

    verifyCode: function(code) {
      return $http.get(API_BASE + '/lms/course/code/' + code + '/verify');
    }

  };

  return api;

});
