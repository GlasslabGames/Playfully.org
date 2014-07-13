angular.module('courses', [])
.factory('CoursesService', function ($http, $log, API_BASE) {

  var api = {

    get: function (courseId) {
      return $http
        .get(API_BASE + '/lms/course/' + courseId)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    update: function (courseId, data) {
      return $http
        .post(API_BASE + '/lms/course/' + courseId)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
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

    enroll: function() {
      return $http
        .post(API_BASE + '/lms/course/enroll')
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
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
    }

  };

  return api;

});
