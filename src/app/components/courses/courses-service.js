angular.module('courses', [])
.factory('CoursesService', function ($http, $log, API_BASE) {

  /* During development, date values for create and archive on a class
   * changed from seconds to milliseconds, so we try to turn both options
   * into a reasonable value
   **/
  var _normalizeDate = function(dt) {
    if (dt < 1000000000000) {
      // Value is in seconds. Convert to milliseconds.
      return dt * 1000;
    } else {
      // Value is already in milliseconds.
      return dt;
    }
  };

  var api = {

    get: function (courseId) {
      return $http.get(API_BASE + '/lms/course/' + courseId + '/info')
        .then(function(response) {
          return response.data;
        }, function(response) {
          return response;
        });
    },

    getWithStudents: function (courseId) {
      var apiUrl = API_BASE + '/lms/course/' + courseId + '/info';
      return $http({ method: 'GET', url: apiUrl, params: { showMembers: 1 }})
        .then(function(response) {
          return response.data;
        }, function(response) {
          return response;
        });
    },

    update: function (course) {
      /* Sort the array of grades (numerically) and
       * turn into a string for the API */
      course.grade = course.grade.sort(function (a, b) {
        return a - b;
      }).join(', ');
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    archive: function (course) {
      course.archived = true;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    unarchive: function (course) {
      course.archived = false;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    lock: function (course) {
      course.locked = true;
      course.lockedRegistration = true;
      $log.debug(course);
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    unlock: function (course) {
      course.locked = false;
      course.lockedRegistration = false;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },

    updateGames: function (course) {
      games = [];
      angular.forEach(course.games, function(game) {
        games.push({
          id: (game.gameId || game.id),
          settings: angular.copy(game.settings),
          assigned: angular.copy(game.assigned)
        });
      });
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
          $log.debug(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getEnrollmentsWithStudents: function () {
      var apiUrl = API_BASE + '/lms/courses';
      return $http({ method: 'GET', url: apiUrl, params: { showMembers: 1 }})
        .then(function(response) {
          var courses = response.data;
          angular.forEach(courses, function(course) {
            if (course.archivedDate) {
              // Adjust from seconds to milliseconds
              course.archivedDate = _normalizeDate(course.archivedDate);
            }
            if (course.dateCreated) {
              course.dateCreated = _normalizeDate(course.dateCreated);
            }
          });
          return courses;
        },
        function(response) {
          $log.error(response);
          return response;
        });
    },

    getActiveEnrollmentsWithStudents: function () {
      return this.getEnrollmentsWithStudents()
        .then(function(data) {
          var activeCourses = [];
          angular.forEach(data, function(course) {
            if (!course.archived) {
              activeCourses.push(course); 
            }
          });
          return activeCourses;
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
          $log.debug(response);
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
          $log.debug(response);
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
          $log.debug(response);
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
    },

    verifyGameInCourse: function(courseId, gameId) {
      return $http.get(API_BASE + '/lms/course/' + courseId + '/game/' + gameId + '/verify-course');
    },

    unassignAllPremiumGamesFromCourse: function(course) {
        course.premiumGamesAssigned = false;
        return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    },
    assignAllPremiumGamesFromCourse: function (course) {
      course.premiumGamesAssigned = true;
      return $http.post(API_BASE + '/lms/course/' + course.id + '/info', course);
    }
  };

  return api;

});
