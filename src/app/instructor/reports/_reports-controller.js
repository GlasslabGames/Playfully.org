angular.module( 'instructor.reports', [
    'playfully.config',
    'ui.router',
    'reports',
    'courses',
    'stickyNg',
    'reports.const',
    'LocalStorageModule'
])
    .config(function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state( 'root.reports', {
                abstract: true,
                url: 'reports',
                views: {
                    'main@': {
                        templateUrl: 'instructor/reports/reports.html',
                        controller: 'ReportsCtrl'
                    }
                },
                resolve: {
                    courses: function (CoursesService) {
                        return CoursesService.getEnrollmentsWithStudents();
                    },
                    activeCourses: function (courses, $q, $filter) {
                        var deferred = $q.defer();
                        var active = $filter('filter')(courses, {archived: false});
                        deferred.resolve(active);
                        return deferred.promise;
                    },
                    coursesInfo: function(activeCourses, ReportsService) {
                        return ReportsService.getCourseInfo(activeCourses);
                    },
                    defaultCourse: function(activeCourses) {
                        if (activeCourses[0]) {
                            return activeCourses[0];
                        }
                        return null;
                    },
                    myGames: function(defaultCourse, coursesInfo) {
                        if (defaultCourse) {
                            return coursesInfo[defaultCourse.id].games;
                        }
                        return {};
                    },
                    defaultGame: function(defaultCourse, myGames) {
                        if (defaultCourse && !defaultCourse.premiumGamesAssigned) {
                            var freeGame = _.find(myGames, {price: "Free"});
                            if (freeGame) {
                                return freeGame;
                            }
                        }
                        if (myGames[0]) {
                            return myGames[0];
                        }
                        return null;
                    },
                    gameReports: function(defaultGame) {
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return {};
                    }
                },
                data: {
                    authorizedRoles: ['instructor', 'admin'],
                    pageTitle: 'Reports'
                }
            })

            /**
             * If the user navigates the default Reports route, we need to choose
             * the first game and first course.
             **/
            .state('root.reports.default', {
                url: '',
                controller: function($scope, $state, $log, defaultGame, activeCourses) {
                    if (activeCourses.length && defaultGame) {
                        $state.go('root.reports.details.' + $scope.reports.options[0].id, {
                            gameId: defaultGame.gameId,
                            courseId: activeCourses[0].id
                        });
                    }
                },
                data: {
                    authorizedRoles: ['instructor','admin'],
                    pageTitle: 'Reports'
                }
            })

            .state('root.reports.details', {
                url: '/details',
                template: '<div ui-view></div>',
                controller: 'ReportsDetailCtrl'
            })
            .state('root.reports.details.progress', {
                url: '/progress/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/game-progress/progress.html',
                controller: 'ProgressCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        defaultGame = _.findWhere(myGames, { 'id': $stateParams.gameId });
                        return defaultGame;
                    },
                    gameReports: function (defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    },
                    usersData: function (ReportsService,$stateParams) {
                        var reportId = 'progress';
                        return ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                    }
                }
            })
            .state('root.reports.details.sowo', {
                url: '/sowo/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/sowo/sowo.html',
                controller: 'SowoCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams,coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function(defaultCourse) {
                        // all available games for this course
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        angular.forEach(myGames, function (game) {
                            if (game.id === $stateParams.gameId) {
                                defaultGame = game;
                            }
                        });
                        return defaultGame;
                    },
                    gameReports: function(defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    }
                }
            })
            .state('root.reports.details.achievements', {
                url: '/achievements/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/achievements/achievements.html',
                controller: 'AchievementsCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function(defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        angular.forEach(myGames, function(game) {
                            if (game.id === $stateParams.gameId) {
                                defaultGame = game;
                            }
                        });
                        return defaultGame;
                    },
                    gameReports: function(defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    }
                }
            })
            .state('root.reports.details.competency', {
                url: '/competency/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/competency/competency.html',
                controller: 'CompetencyCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        angular.forEach(myGames, function (game) {
                            if (game.id === $stateParams.gameId) {
                                defaultGame = game;
                            }
                        });
                        return defaultGame;
                    },
                    gameReports: function(defaultGame) {
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    }
                }
            })
            .state('modal-xlg.competencyInfo', {
                url: '/reports/details/competency/game/:gameId/info',
                data:{
                    pageTitle: 'Competency Report Info',
                    authorizedRoles: ['instructor','admin']
                },
                resolve: {
                },
                views: {
                    'modal@': {
                        templateUrl: 'instructor/reports/competency/info.html',
                        controller: 'CompetencyInfoModalCtrl'
                    }
                }
            })
            .state('root.reports.details.mission-progress', {
                url: '/mission-progress/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/mission-progress/mission-progress.html',
                controller: 'MissionProgressCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        angular.forEach(myGames, function (game) {
                            if (game.id === $stateParams.gameId) {
                                defaultGame = game;
                            }
                        });
                        return defaultGame;
                    },
                    gameReports: function (defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    }
                }
            })
            .state('root.reports.details.drk12_b', {
                url: '/drk12_b/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/drk12_b/drk12_b.html',
                controller: 'Drk12_bCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        return _.findWhere(myGames, { 'id': $stateParams.gameId }) || myGames[0];
                    },
                    gameReports: function (defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    },
                    usersData: function (ReportsService, $stateParams) {
                        var reportId = 'drk12_b';
                        return ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                    }
                }
            })
            .state('root.reports.details.standards', {
                url: '/standards/game/:gameId/course/:courseId?skillsId&stdntIds',
                templateUrl: 'instructor/reports/standards/standards.html',
                controller: 'StandardsCtrl',
                parameters: ['gameId','courseId'],
                resolve: {
                    defaultCourse: function ($stateParams, coursesInfo) {
                        return coursesInfo[$stateParams.courseId];
                    },
                    myGames: function (defaultCourse) {
                        return defaultCourse.games;
                    },
                    defaultGame: function (defaultCourse, myGames, $stateParams) {
                        var defaultGame = myGames[0];
                        defaultGame = _.findWhere(myGames, { 'id': $stateParams.gameId });
                        return defaultGame;
                    },
                    gameReports: function (defaultGame) {
                        // set game report for default game
                        var reports = {};
                        if (defaultGame) {
                            return defaultGame.reports;
                        }
                        return reports;
                    },
                    usersData: function (ReportsService,$stateParams) {
                        var reportId = 'standards';
                        return ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                    }
                }
            });
    })

    .controller('ReportsCtrl', function ($scope, $log, $state, $stateParams, myGames, activeCourses, gameReports) {

        $scope.reportDisplayType = 'wide';
        $scope.isStudentListVisible = false;

        $scope.games = {};
        $scope.developer = {};
        $scope.courses = {};
        $scope.activeCourses = activeCourses;
        $scope.reports = {};
        $scope.students = {};

        // Games - Setup game options and selected game //////////////

        $scope.games.isOpen = false;
        $scope.games.selectedGameId = null;
        $scope.games.options = {};
        $scope.games.hasGames = myGames.length > 0;

        angular.forEach(myGames, function (game) {
            if (game.enabled) {
                $scope.games.options['' + game.gameId] = game;
                if (game.gameId == $stateParams.gameId) {
                    $scope.games.selectedGameId = game.gameId;
                }
            }
        });

        // Courses - Setup course options and select course ///////////
        $scope.courses.isOpen = false;
        $scope.courses.selectedCourseId = null;
        $scope.courses.options = {};

        if (activeCourses.length) {
            $scope.courses.selectedCourseId = activeCourses[0].id;
            $scope.courses.selected = activeCourses[0];
        }

        angular.forEach(activeCourses, function (course) {
            course.isExpanded = false;
            course.isPartiallySelected = false;
            $scope.courses.options[course.id] = course;
        });

        // Reports  - Setup report options based on selected game /////////

        $scope.reports.isOpen = false;
        $scope.reports.selected = null;
        $scope.reports.options = [];

        angular.forEach(gameReports.list, function (report) {
            // only add enabled reports
            if (report.enabled) {
                $scope.reports.options.push(angular.copy(report));
            }
        });

        // select first if on exists
        if ($scope.reports.options.length) {
            $scope.reports.selected = $scope.reports.options[0];
        }

        /* Students */

        // Adds students from activeCourses to student object

        angular.forEach(activeCourses, function (course) {
            angular.forEach(course.users, function (student) {
                if (!$scope.students.hasOwnProperty(student.id)) {
                    $scope.students[student.id] = student;
                }
            });
        });

        /* Allow individual students to be toggled on or off. */
        $scope.toggleStudent = function ($event, student, course, reportId) {
            $event.preventDefault();
            $event.stopPropagation();
            if (reportId !== 'sowo') {
                student.isSelected = !student.isSelected;
            }
        };


        $scope.selectCourse = function ($event, courseId) {
            $event.preventDefault();
            $event.stopPropagation();

            var newState = {
                gameId: null,
                courseId: courseId
            };

            // check if selected game is available for selected course
            var targetCourse = _.find($scope.courses.options, {id: parseInt(courseId)});
            var freeGame = null;
            var foundGame = null;
            angular.forEach(targetCourse.games, function (game) {
                // collect at least one free game
                if (game.price === 'Free') {
                    freeGame = game;
                }
                // find out if selected game is available for selected course
                if (game.gameId === $scope.games.selectedGameId) {
                    foundGame = game;
                    if (game.price === 'Premium' && !game.assigned && freeGame) {
                        // use free game instead if premium game is unassigned
                        newState.gameId = freeGame.id;
                    } else {
                        newState.gameId = $scope.games.selectedGameId;
                    }
                }
            });
            if (!newState.gameId && foundGame) {
                if (freeGame) {
                    newState.gameId = freeGame.gameId;
                } else {
                    // if no free game, use premium unassigned game anyways
                    newState.gameId = foundGame;
                }
            } else {
                // if game is not available, use first available game for this course
                newState.gameId = targetCourse.games[0].gameId;
            }

            _clearOtherCourses(courseId);
            $state.go('root.reports.details.' + $scope.reports.selected.id, newState);
        };
        // Reset all classes and their students except for the id passed in
        // (which should be the newly-selected course.
        var _clearOtherCourses = function (exceptedCourseId) {
            angular.forEach($scope.courses.options, function (course) {
                if (course.id != exceptedCourseId) {
                    angular.forEach(course.users, function (student) {
                        student.isSelected = false;
                    });
                    course.isPartiallySelected = false;
                }
            });
        };

        $scope.goToSelected = function (reportId, parameters) {
            $state.go('root.reports.details' + '.' + reportId, parameters);
        };

        $scope.toggleDropdown = function ($event, collection) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[collection].isOpen = !$scope[collection].isOpen;
        };

        // GH: Needed to fix PLAY-393, where IE requires the border-collapse property
        // of the reports table to be 'separate' instead of 'collapse'. Tried to
        // use conditional IE comments in index.html, but it doesn't work with
        // IE 10 and higher.
        $scope.isIE = function () {
            return $window.navigator.userAgent.test(/trident/i);
        };
    })

    .controller('ReportsDetailCtrl', function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService) {
        // TODO: Not sure why this is here and empty. Boilerplate that was going to be used but never was?
    });


