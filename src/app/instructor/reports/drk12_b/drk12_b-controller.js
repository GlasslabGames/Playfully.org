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
    .controller('Drk12_bCtrl', function($scope, $state, $stateParams, $interval, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, drk12_bStore, usersData) {
        ///// Setup selections /////

        // basic variable set up
        var reportId = 'drk12_b';

        // Courses
        $scope.courses.selectedCourseId = $stateParams.courseId;
        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

        $scope.activeTab = [];
        $scope.selectTab = function(index) {
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

        var populateCharts = function() {
            if ($scope.noUserData) { return; }
            angular.forEach(usersData.courseSkills, function(value, key) {
                var interval = $interval(function() {
                    if (jQuery("#courseSkill_" + key).length > 0) {
                        doDrawCourseSkillPieCharts(key);
                        $interval.cancel(interval);
                    }
                }, 2);
            });
        };

        var doDrawCourseSkillPieCharts = function(skillKey) {
            var courseSkillStats = [];
            angular.forEach(usersData.courseSkills[skillKey], function(skillValue, skillKey) {
                courseSkillStats.push({skill: skillKey, total: skillValue});
            });

            var d3ContainerElem = d3.select("#courseSkill_" + skillKey).classed("blah", true); // TODO: Change this

            var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 187 - margin.left - margin.right,
                height = 187 - margin.top - margin.bottom;
            var radius = Math.min(width, height) / 2;

            // Create the container element with the appropriate height and width
            d3ContainerElem.selectAll("*").remove();
            var svg = d3ContainerElem.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var color = function(data) {
                var colorOptions = ["#22b473", "#fdd367", "#f0f0f0"];

                var dataIndex = courseSkillStats.reduce(function(previousValue, currentValue, index, array) {
                    if (data == currentValue) {
                        return index;
                    } else {
                        return previousValue;
                    }
                }, 0);
                return colorOptions[dataIndex];
            };

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.total; });

            var g = svg.selectAll(".arc, .textLabel")
                .data(pie(courseSkillStats))
                .enter();

            var circleG = g.append("g")
                .attr("class", "arc");

            circleG.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data); });

            var textG = g.append("g")
                .attr("class", "textLabel");

            textG.append("text")
                .attr("transform", function(d) {
                    var dataIndex = 0;
                    for (var i = 0; i < courseSkillStats.length; i++) {
                        if (d.data == courseSkillStats[i]) { dataIndex = i; }
                    }
                    var c = arc.centroid(d);
                    var offset = 0.5 + (0.3 * dataIndex);

                    if (isNaN(c[0])) { c[0] = 0; }
                    if (isNaN(c[1])) { c[1] = 0; }

                    return "translate(" + c[0]*offset +"," + c[1]*offset + ")";
                })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    if (d.data.total === 0) { return ""; }

                    return d.data.total;
                });
        };

        var populateStudentLearningData = function(usersReportData) {
            if (usersReportData) {
                if (usersReportData.length < 1 ) {
                    $scope.noUserData = true;
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

        $scope.tableStructuralData = {
            headers: [
                { title: "Name", value: "name", keepUnchecked: true },
                { title: "Current Mission", value: "currentMission", keepUnchecked: true }
            ],
            current: "name",
            columnFilter: "all",
            studentFilter: "all",
            reverseSort: false
        };

        var buttonTextChange = function(textBase) { // TODO: Is this still used?
            var partialReturnString = textBase.charAt(0).toLowerCase() + textBase.slice(1);
            return "Click button to " + partialReturnString;
        };

        $.each($scope.reports.selected.skills, function(skillKey, skill) {
            var skillHeader = {
                title: skill.name,
                description: skill.description,
                buttonDescription: buttonTextChange(skill.description),
                value: skillKey
            };
            $scope.tableStructuralData.headers.push(skillHeader);
        });

        $scope.shouldShowStudentRow = function(skillLevel) {
            if (!skillLevel) {
                skillLevel = "NotAttempted";
            }

            return skillLevel == $scope.tableStructuralData.studentFilter || $scope.tableStructuralData.studentFilter == 'all';
        };

        $scope.numberOfColumnsChecked = function() {
            if ($scope.tableStructuralData.columnFilter == 'all') {
                return 4;
            } else {
                return 1;
            }
        };

        $scope.sortSelected = function (colName) {
            if ($scope.tableStructuralData.current === colName) {
                $scope.tableStructuralData.reverseSort = !$scope.tableStructuralData.reverseSort;
            } else {
                $scope.tableStructuralData.current = colName;
            }
        };

        $scope.userSortFunction = function (colName) {
            return function (user) {
                if (colName === $scope.tableStructuralData.headers[0].value) {
                    return user.firstName;
                }
                if (colName === $scope.tableStructuralData.headers[1].value) {
                    return user.results.currentProgress.mission;
                }

                var score = 0;
                if (!user.results.currentProgress ||
                        !user.results.currentProgress.skillLevel ||
                        !user.results.currentProgress.skillLevel[$scope.tableStructuralData.current] ||
                        !user.results.currentProgress.skillLevel[$scope.tableStructuralData.current].level) {
                    score = -2;
                } else if (user.results.currentProgress.skillLevel[$scope.tableStructuralData.current].level == "NotAvailable") {
                    score = -2;
                } else {
                    var columnSkill = user.results.currentProgress.skillLevel[$scope.tableStructuralData.current];

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

        // populate student objects with report data
        populateStudentLearningData(usersData);

        populateCharts();
    });
