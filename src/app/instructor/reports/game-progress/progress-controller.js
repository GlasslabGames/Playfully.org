angular.module( 'instructor.reports')

    .controller( 'ProgressCtrl',
        function($scope, $rootScope, $log, $state, $stateParams, $timeout, defaultCourse, myGames, defaultGame, gameReports, ReportsService, usersData) {
            ///// Setup selections /////

            // Report
            var reportId = 'progress';

            $scope.reportInfo = _.find(gameReports.list, {id: reportId});


            // Courses
            $scope.courses.selectedCourseId = $stateParams.courseId;
            $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

            // students in course grouped by columns and rows
            var studentsToSort = [];

            $scope.courses.selected.users.forEach(function(student) { studentsToSort.push(student); });
            studentsToSort.sort(function(first,second) { return first.firstName.localeCompare(second.firstName); });

            var maxRows = 15;
            var visibleColumns = 7;
            var columns = Math.floor((studentsToSort.length + maxRows - 1) / maxRows);
            var rows = studentsToSort.length > maxRows ? maxRows : studentsToSort.length;
            var students = [];

            for (var i=0;i<rows;i++) {
                var row = [];
                for (var j=0;j<columns;j++) {
                    if (i + maxRows * j < studentsToSort.length) {
                        var student = studentsToSort[i + maxRows * j];
                        student.isSelected = true; // set to initally visible
                        row.push(student);
                    } else {
                        row.push(null);
                    }
                }
                students.push(row);
            }

            $scope.students = students;

            // Games
            $scope.games.selectedGameId = defaultGame.gameId;


            ///// Setup options /////

            // Games
            $scope.games.options = {};
            angular.forEach(myGames, function(game) {
                $scope.games.options[''+game.gameId] = game;
            });

            // Reports
            $scope.reports.options = [];

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


            var _populateStudentLearningData = function(usersReportData) {
                var totalGameplayTime = 0;
                var featureGameplayTime = {};
                if (usersReportData) {
                    if (usersReportData.length < 1 ) {
                        $scope.noUserData = true;
                    } else {
                        // Populate students in course with report data
                        var students = $scope.courses.selected.users;
                        angular.forEach(students, function (student) {
                            var userReportData = _findUserByUserId(student.id, usersReportData) || {};
                            student.results = userReportData.results;

                            totalGameplayTime += userReportData.results.totalTime;

                            _.each(userReportData.results.events, function(event) {
                                var hook = _.find($scope.reportInfo.hooks, {id: event.type});
                                event.color = hook.color;
                                event.title = hook.title;

                                event.durationString = moment.duration(event.duration).humanize();

                                if(!featureGameplayTime[event.type]) {
                                    featureGameplayTime[event.type] = 0;
                                }
                                featureGameplayTime[event.type] += event.duration;

                            });
                        });
                    }
                }

                _.each($scope.reportInfo.hooks, function(hook) {
                    if(featureGameplayTime[hook.id]) {
                        hook.gameplayTime = Math.round(100 * featureGameplayTime[hook.id] / totalGameplayTime)+"%";
                    }
                });

                $scope.totalGameplayTime = moment.duration(totalGameplayTime).humanize();
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

            // set headers for progress table
            // populate student data with progress descriptions
            _populateStudentLearningData(usersData);
        });

