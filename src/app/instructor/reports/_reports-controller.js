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
            .state('modal-xxxlg.map-viewer', {
                url: '/reports/mapviewer/game/:gameId/course/:courseId',
                data:{
                    pageTitle: 'Map Viewer',
                    authorizedRoles: ['instructor','admin']
                },
                onEnter: function($state, $interval, $timeout, UserService){
                    $state.checkLogin = null;

                    UserService.retrieveCurrentUser()
                        .success(function(data) {
                            $state.activeUserId = data.id;
                            $state.checkLogin = $interval(function () {
                                UserService.retrieveCurrentUser()
                                    .success(function(data) {
                                        if ($state.activeUserId != data.id) {
                                            if ($state.checkLogin) {
                                                $interval.cancel($state.checkLogin);
                                                $state.checkLogin = null;
                                            }
                                            $state.go('modal.game-user-mismatch', { }, {location: false});
                                        }
                                    })
                                    .error(function() {
                                        if ($state.checkLogin) {
                                            $interval.cancel($state.checkLogin);
                                            $state.checkLogin = null;
                                        }
                                        $state.go('modal.game-user-mismatch', { }, {location: false});
                                    });
                            }, 5000); // poll every 5 seconds to see if user changed/logged-out
                        })
                        .error(function() {
                            // failed -- abort game load
                            $state.go('modal.game-user-mismatch', { }, {location: false});
                        });
                },
                onExit: function($state, $interval){
                    if ($state.checkLogin) {
                        $interval.cancel($state.checkLogin);
                        $state.checkLogin = null;
                    }
                },
                resolve: {
                    gameDetails: function($stateParams, GamesService) {
                        return GamesService.getDetail($stateParams.gameId);
                    },
                    activeCourses: function(CoursesService, $filter) {
                        return CoursesService.getEnrollments()
                            .then(function(response) {
                                var filtered = $filter('filter')(response, {archived: false});
                                return filtered;
                            });
                    },
                    validAccess: function($state, $stateParams, GamesService) {
                        return GamesService.hasAccessToGameInCourse($stateParams.gameId, $stateParams.courseId)
                            .then(function (response) {
                                return response.data;
                            }, function (response) {
                                $state.go('root.home.default');
                                return response;
                            });
                    }
                },
                views: {
                    'modal@': {
                        templateUrl: 'games/game-play-modal.html',
                        controller: 'MapViewerModalCtrl'
                    }
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
                url: '/drk12_b/game/:gameId/course/:courseId',
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
                    usersData: function (ReportsService, Drk12Service, $stateParams) {
                        var reportId = 'drk12_b';
                        if (Drk12Service.reportDataFromServer === null ||
                            Drk12Service.currentReportCourseId === null ||
                            Drk12Service.currentReportCourseId !== $stateParams.courseId) {
                            Drk12Service.currentReportCourseId = $stateParams.courseId;
                            Drk12Service.reportDataFromServer = ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                        }
                        return Drk12Service.reportDataFromServer;
                    },
                    // Added to check if coming from drilldown. Inspired from https://stackoverflow.com/a/25945003/969869
                    previousState: function($state) {
                        return { name: $state.current.name, selectedSkill: $state.params.skill };
                    }
                }
            })
            .state('root.reports.details.drk12_b_drilldown', {
                url: '/drk12_b/game/:gameId/course/:courseId/drilldown/student/:studentId/skill/:skill/mission/:mission',
                templateUrl: 'instructor/reports/drk12_b/drk12_b-drilldown.html',
                controller: 'Drk12Drilldown',
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
                    usersData: function (ReportsService, Drk12Service, $stateParams) {
                        var reportId = 'drk12_b';
                        if (Drk12Service.reportDataFromServer === null ||
                            Drk12Service.currentReportCourseId === null ||
                            Drk12Service.currentReportCourseId !== $stateParams.courseId) {
                            Drk12Service.currentReportCourseId = $stateParams.courseId;
                            Drk12Service.reportDataFromServer = ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                        }
                        return Drk12Service.reportDataFromServer;
                    }
                }
            })
            .state('root.cleanChrome', {
                abstract: true,
                url: 'clean'
            })
            .state('root.cleanChrome.drk12ReportHelper', {
                controller: 'helperWrapperCtrl',
                url: '/reportHelper/game/:gameId/course/:courseId/location/:location?anchor',
                views: {
                    'main@': {
                        templateUrl: 'instructor/reports/drk12_b/helperDrawer/helperDrawerWrapper.html'
                    }
                }
            })
            .state('root.cleanChrome.drk12InstructionPlan', {
                url: '/instructionPlan/game/:gameId/course/:courseId/location/:location?noteId',
                views: {
                    'main@': {
                        controller: 'instructionPlanCtrl',
                        templateUrl: 'instructor/reports/drk12_b/instructionPlan/instructionPlanWrapper.html'
                    }
                },
                resolve: {
                    courseData: function(CoursesService, $stateParams) {
                        return CoursesService.getWithStudents($stateParams.courseId);
                    },
                    reportData: function (ReportsService, Drk12Service, $stateParams) {
                        var reportId = 'drk12_b';
                        if (Drk12Service.reportDataFromServer === null ||
                            Drk12Service.currentReportCourseId === null ||
                            Drk12Service.currentReportCourseId !== $stateParams.courseId) {
                            Drk12Service.currentReportCourseId = $stateParams.courseId;
                            Drk12Service.reportDataFromServer = ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId);
                        }
                        return Drk12Service.reportDataFromServer;
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

    .controller('ReportsCtrl', function ($scope, $window, $log, $state, $stateParams, myGames, activeCourses, gameReports) {

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

            $scope.games.options = {};
            $scope.games.hasGames = targetCourse.games.length > 0;

            angular.forEach(targetCourse.games, function (game) {
                $scope.games.options['' + game.gameId] = game;

                // collect at least one free game
                if (game.price === 'Free') {
                    freeGame = game;
                }
                // find out if selected game is available for selected course
                if (game.gameId === $scope.games.selectedGameId) {
                    if (game.price === 'Premium' && !game.assigned && freeGame) {
                        foundGame = freeGame;
                        // use free game instead if premium game is unassigned
                        newState.gameId = freeGame.id;
                    } else {
                        foundGame = game;
                        newState.gameId = $scope.games.selectedGameId;
                    }
                }
            });

            if (!newState.gameId && foundGame) {
                if (freeGame) {
                    foundGame = freeGame;
                    newState.gameId = freeGame.gameId;
                } else {
                    // if no free game, use premium unassigned game anyways
                    newState.gameId = foundGame.gameId;
                }
            } else {
                foundGame = targetCourse.games[0];
                // if game is not available, use first available game for this course
                newState.gameId = targetCourse.games[0].gameId;
            }

            _clearOtherCourses(courseId);

            $scope.games.selectedGameId = newState.gameId;

            $scope.reports.options = [];

            var exists = false;
            angular.forEach(foundGame.reports.list, function (report) {
                // only add enabled reports
                if (report.enabled) {
                    if (report.id === $scope.reports.selected.id) {
                        exists = true;
                    }
                    $scope.reports.options.push(angular.copy(report));
                }
            });

            // select first if on exists
            if (!exists && $scope.reports.options.length) {
                $scope.reports.selected = $scope.reports.options[0];
            }

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

        $scope.isStanfordGameId = function (gameId) {
            return $scope.games.options[gameId] && $scope.games.options[gameId].isStanford && $scope.games.options[gameId].isStanford === true;
        };

        $scope.goToMapViewer = function (courseId) {
            $state.go('modal-xxxlg.map-viewer', {gameId: 'TAMAP', courseId: courseId});
        };
    })

    .controller('ReportsDetailCtrl', function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService) {
        // TODO: Not sure why this is here and empty. Boilerplate that was going to be used but never was?
    })

    .controller('MapViewerModalCtrl', function ($scope, $state, gameDetails, activeCourses) {
        $scope.gamePlayInfo = {};
        if(gameDetails &&
            gameDetails.play &&
            gameDetails.play.page ) {
            $scope.gamePlayInfo = gameDetails.play.page;
            $scope.gamePlayInfo.title = gameDetails.longName;
        }
    });


