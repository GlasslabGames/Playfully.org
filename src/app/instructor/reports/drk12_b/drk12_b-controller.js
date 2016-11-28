angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) {
        $stateProvider.state('modal-xlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:type/?:studentId',
            data:{
                pageTitle: 'Progress Report'
            },
            views: {
                'modal@': {
                    templateUrl: function($stateParams, REPORT_CONSTANTS) {
                        return 'instructor/reports/drk12_b/_modal-' + $stateParams.type + '.html';
                    },
                    controller: function($scope, $log, $stateParams, drk12_bStore) {
                        // TODO: Make sure page will work through refresh.
                        var currentStudent = drk12_bStore.getCurrentStudent();
                        if (currentStudent) {
                            $scope.student = currentStudent;
                        }

                        $scope.skills = drk12_bStore.getSkills();
                    }
                }
            }
        });
    })
    .service('drk12_bStore', function() {
        var currentStudent;
        var skills;

        this.setCurrentStudent = function(currentStudent) {
            if (currentStudent) {
                this.currentStudent = currentStudent;
            }
        };
        // Make sure this is pass-by-value
        this.getCurrentStudent = function() {
            return angular.copy(this.currentStudent);
        };

        this.setSkills = function(skills) {
            if (!this.skills) {
                this.skills = skills;
            }
        };

        this.getSkills = function() {
            return this.skills;
        };
    })
    .controller('Drk12_bCtrl', function($scope, $state, $stateParams, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, drk12_bStore, usersData) {
        ///// Setup selections /////

        // Report
        var reportId = 'drk12_b';

        // Courses
        $scope.courses.selectedCourseId = $stateParams.courseId;
        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

        // students in course grouped by columns and rows to use with _students.html. This is a bit perverse.
        // NOTE: $scope.students IS NOT what is used for the report. This variable is only used for the _students.html TODO: fix this
        var initialStudents = [];

        $scope.courses.selected.users.forEach(function(student) { initialStudents.push(student); });
        initialStudents.sort(function(first,second) { return first.firstName.localeCompare(second.firstName); });

        var maxRows = 15;
        var visibleColumns = 7;
        var columns = Math.floor((initialStudents.length + maxRows - 1) / maxRows);
        var rows = initialStudents.length > maxRows ? maxRows : initialStudents.length;
        var students = [];

        for (var i=0;i<rows;i++) {
            var row = [];
            for (var j=0;j<columns;j++) {
                if (i + maxRows * j < initialStudents.length) {
                    var student = initialStudents[i + maxRows * j];
                    student.isSelected = true; // set to initially visible
                    row.push(student);
                } else {
                    row.push(null);
                }
            }
            students.push(row);
        }

        $scope.students = students;
        $scope.studentAreaWidth = students.length === 0 ? 200 : 80 + 120 * Math.min(visibleColumns, columns);

        $scope.activeTab = [];
        $scope.selectTab = function(index) {
            // When going to the class tab reset the checkboxes on the student tab
            if (index === 0) {
                $scope.columns.headers.forEach(function(header) {
                    if (!header.keepUnchecked) {
                        header.checked = true;
                    }
                });
            }

            $scope.activeTab[index] = true;
        };

        /////////////////////////////////////////// Static Report data ////////////////////////////

        $scope.progressTypes = {
            advancing: {class:'Advancing', title: 'Advancing'},
            needSupport: {class:'NeedSupport', title: 'Need Support'},
            notYetAttempted: {class:'NotAttempted', title: 'Not yet attempted / Not enough data'}
        };

        ///////////////////////////////////////////////////////////////////////////////////////////

        $scope.reportData = usersData;

        $scope.getSkillClass = function(skill) {
            return usersData.courseSkills[skill].level;
        };

        ///// Setup options /////

        // Games
        $scope.games.options = {}; // TODO: This appears to be report agnostic. Why is it placed in each report?
        angular.forEach(myGames, function(game) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.games.options[''+game.gameId] = game;
        });

        $scope.games.selectedGameId = defaultGame.gameId; // TODO: This appears to be report agnostic. Why is it placed in each report?


        // Reports
        $scope.reports.options = [];  // TODO: This appears to be report agnostic. Why is it placed in each report?

        angular.forEach(gameReports.list, function(report) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            if(report.enabled) {
                $scope.reports.options.push( angular.copy(report) );
                // select report that matches this state
                if (reportId === report.id) {
                    $scope.reports.selected = report;
                    drk12_bStore.setSkills($scope.reports.selected.skills);
                }
            }
        });

        // Check if selected game has selected report

        if (!ReportsService.isValidReport(reportId,$scope.reports.options))  { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId,$scope.reports.options), {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId
            });
            return;
        }

        // Set parent scope developer info

        if (gameReports.hasOwnProperty('developer')) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.developer.logo = gameReports.developer.logo;
        }

        /*
        Currently this is initialized when the page element is rendered.
        Heavily influenced by http://stackoverflow.com/a/24973235/969869
         */
        $scope.doDrawCourseStatusChart = function() {
            var d3ContainerElem = d3.select("#drk12_bChart").classed("svg-container", true);

            if ($scope.noUserData) { return; }

            var margin = {top: 20, right: 0, bottom: 40, left: 40},
                width = 800 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            d3ContainerElem.selectAll("*").remove();
            var svg = d3ContainerElem.append("svg")
                .attr("viewBox", "0 0 800 200")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .classed("svg-content-responsive", true);

            var chartGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(usersData.courseProgress.map(function(d) { return d.mission; }));
            y.domain([0, d3.max(usersData.courseProgress, function(d) { return d.studentCount; })]);

            // Progress Bars
            chartGroup.selectAll(".bar")
                .data(usersData.courseProgress)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.mission); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.studentCount); })
                .attr("height", function(d) { return height - y(d.studentCount); });

            // Progress Bar Labels
            chartGroup.selectAll("text.bar")
                .data(usersData.courseProgress)
                .enter().append("text")
                .attr("class", "bar")
                .attr("text-anchor", "middle")
                .attr("x", function(d) { return x(d.mission) + x.rangeBand()/2; })
                .attr("y", function(d) { return y(d.studentCount) - 5; })
                .text(function(d) { return d.studentCount === 0 ? "" : d.studentCount; });

            chartGroup.append("path")
                .attr("class", "axis-bar")
                .attr("d", ["M", 0, 0, "v", height, "h", width].join(" "));

            chartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            chartGroup.selectAll("g.x.axis g.tick")
                .append("circle")
                .attr("r", 5);

            chartGroup.append("g")
                .attr("class", "y axis")
                .append("text")
                    .attr("y", height / 2)
                    .attr("x", -10)
                    .attr("text-anchor", "middle")
                    .attr("transform", "rotate(-90 -10 " + height/2 + ")")
                    .text("# of students");

            chartGroup.append("g")
                .attr("class", "x axis")
                .append("text")
                    .attr("y", height + 9)
                    .attr("x", -16)
                    .attr("dy", ".71em")
                    .attr("text-anchor", "middle")
                    .text("Missions");
        };

        var _populateStudentLearningData = function(usersReportData) {
            if (usersReportData) {
                if (usersReportData.length < 1 ) {
                    $scope.noUserData = true;
                    return;
                } else {
                    // Populate students in course with report data

                    angular.forEach($scope.courses.selected.users, function (student) {
                        student.results = _findUserByUserId(student.id, usersReportData.students) || {};
                        if (student.results.missions) {
                            student.results.missions.sort(function(first,second) { return first.mission - second.mission; });

                            student.results.missions.forEach(function(mission) {
                                if (!student.results.currentProgress) {
                                    student.results.currentProgress = {};
                                    student.results.currentProgress.mission = 0;
                                }
                                if (mission.mission == student.results.currentProgress.mission) {
                                    mission.current = true;
                                } else if (mission.mission > student.results.currentProgress.mission) {
                                    mission.paddingObject = true;
                                }
                                var totalCorrect =
                                    mission.skillLevel.connectingEvidence.score.correct +
                                    mission.skillLevel.supportingClaims.score.correct +
                                    mission.skillLevel.criticalQuestions.score.correct +
                                    mission.skillLevel.usingBacking.score.correct;
                                var totalAttempts =
                                    mission.skillLevel.connectingEvidence.score.attempts +
                                    mission.skillLevel.supportingClaims.score.attempts +
                                    mission.skillLevel.criticalQuestions.score.attempts +
                                    mission.skillLevel.usingBacking.score.attempts;
                                mission.totalCorrect = totalCorrect;
                                mission.totalAttempts = totalAttempts;
                            });
                        } else {
                            student.results = { currentProgress: { mission: 0, skillLevel: {} } };
                        }
                    });
                }
            }
        };

        var _findUserByUserId = function (userId, reportData) {
            var found;
            for (var i = 0; i < reportData.length; i++) {
                if (reportData[i] && reportData[i].userId == userId) {
                    found = reportData[i];
                    return found;
                }
            }
            return null;
        };

        $scope.columns = {
            headers: [
                { title: "Name", value: "name", keepUnchecked: true },
                { title: "Current Mission", value: "currentMission", keepUnchecked: true }
            ],
            current: "name",
            reverseSort: false
        };

        $.each($scope.reports.selected.skills, function(skillKey, skill) {
            var skillHeader = {
                title: skill.name,
                description: skill.description,
                value: skillKey,
                checked: true
            };
            $scope.columns.headers.push(skillHeader);
        });

        $scope.goToStudentViewWithSkill = function(skill) {
            $.each($scope.columns.headers, function(index, header) {
                if(!header.keepUnchecked) {
                    header.checked = header.value == skill;
                }
            });
            $scope.selectTab(1);
        };

        $scope.numberOfColumnsChecked = function() {
            var headerCheckedCount = 0;
            $scope.columns.headers.forEach(function(header) {
                if(header.checked) { headerCheckedCount++; }
            });
            return headerCheckedCount;
        };

        $scope.sortSelected = function (colName) {
            if ($scope.columns.current === colName) {
                $scope.columns.reverseSort = !$scope.columns.reverseSort;
            } else {
                $scope.columns.current = colName;
            }
        };

        $scope.userSortFunction = function (colName) {
            return function (user) {
                if (colName === $scope.columns.headers[0].value) {
                    return user.firstName;
                }
                if (colName === $scope.columns.headers[1].value) {
                    return user.results.currentProgress.mission;
                }

                var score = 0;
                if (!user.results.currentProgress ||
                        !user.results.currentProgress.skillLevel ||
                        !user.results.currentProgress.skillLevel[$scope.columns.current] ||
                        !user.results.currentProgress.skillLevel[$scope.columns.current].level) {
                    score = -2;
                } else if (user.results.currentProgress.skillLevel[$scope.columns.current].level == "NotAvailable") {
                    score = -2;
                } else {
                    var columnSkill = user.results.currentProgress.skillLevel[$scope.columns.current];

                    if (columnSkill.score.attempts === 0) { score = 0; }
                    else { score = columnSkill.score.correct / columnSkill.score.attempts; }

                    if (columnSkill.level == $scope.progressTypes.notYetAttempted.class) { score--; }
                }

                return score;
            };
        };

        $scope.setCurrentStudent = function (student) {
            drk12_bStore.setCurrentStudent(student);
        };

        $scope.shouldShowTableCellFromSkillLevel = function (skillLevel) {
            return skillLevel !== undefined && skillLevel != null && skillLevel != "NotAvailable";
        };

        // populate student objects with report data
        _populateStudentLearningData(usersData);
    });
