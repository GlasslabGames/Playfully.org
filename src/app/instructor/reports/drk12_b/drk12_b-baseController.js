angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) {
        $stateProvider.state('modal-xxlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:gameId/course/:courseId',
            data:{
                pageTitle: 'Progress Report'
            },
            views: {
                'modal@': {
                    templateUrl: function($stateParams, REPORT_CONSTANTS) {
                        return 'instructor/reports/drk12_b/modal-info.html';
                    }
                }
            }
        });
    })
    .controller('Drk12_bCtrl', function($scope, $state, $stateParams, $interval, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, Drk12Service, usersData, previousState) {
        ///// Setup selections /////

        // basic variable set up
        var reportId = 'drk12_b';
        $scope.selectedStudents = [];
        $scope.isFooterOpened = false;
        $scope.isFooterFullScreen = false;
        $scope.selectedSkill = 'connectingEvidence';
        $scope.selectedSubSkill = 'all';

        // Courses
        $scope.courses.selectedCourseId = $stateParams.courseId;
        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

        $scope.tabs = [{active: true}, {active: false}];

        if (previousState.name === 'root.reports.details.drk12_b_drilldown') {
            $scope.tabs[0].active = false; $scope.tabs[1].active = true;
            $scope.selectedSkill = previousState.selectedSkill;
        }

        /////////////////////////////////////////// Static Report data ////////////////////////////
        $scope.skills = Drk12Service.skills;
        $scope.skills.isDropdownOpen = false;

        ///////////////////////////////////////////////////////////////////////////////////////////

        var sortStringsAndNumbers = function(first, second) {
            if (typeof first.mission === 'number') {
                if (typeof second.mission === 'number') {
                    return first.mission - second.mission;
                } else if (typeof second.mission === 'string') {
                    return -1;
                } else { // We should never hit this case
                    console.warn('Mission sorting discovered a mission key that is not a string or number. Mission: ', second);
                    return 0;
                }
            } else if (typeof first.mission === 'string') {
                if (typeof second.mission === 'number') {
                    return 1;
                } else if (typeof second.mission === 'string') {
                    return first.mission < second.mission ? 1 : -1;
                } else { // We should never hit this case
                    console.warn('Mission sorting discovered a mission key that is not a string or number. Mission: ', second);
                    return 0;
                }
            } else {
                console.warn('Mission sorting discovered a mission key that is not a string or number. Mission: ', first);
                return 0;
            }
        };

        $scope.reportData = usersData;
        usersData.courseProgress.sort(function(first,second) {
            return sortStringsAndNumbers(first, second);
        });

        /////////////////////////////////////////// Setup stuff ////////////////////////////

        // Games
        $scope.games.options = {}; // TODO: This appears to be report agnostic. Why is it placed in each report?
        angular.forEach(myGames, function(game) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.games.options['' + game.gameId] = game;
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

                    usersData.courseProgress.forEach(function(missionObject) { // This is somewhat perverse logic using info.json
                        if ($scope.reports.selected.skills) {
                            if ($scope.reports.selected.skills[Object.keys($scope.skills.options)[0]].missions.indexOf(missionObject.mission) === -1) {
                                missionObject[Object.keys($scope.skills.options)[0]] = {disabled: true};
                            }
                            if ($scope.reports.selected.skills[Object.keys($scope.skills.options)[1]].missions.indexOf(missionObject.mission) === -1) {
                                missionObject[Object.keys($scope.skills.options)[1]] = {disabled: true};
                            }
                            if ($scope.reports.selected.skills[Object.keys($scope.skills.options)[2]].missions.indexOf(missionObject.mission) === -1) {
                                missionObject[Object.keys($scope.skills.options)[2]] = {disabled: true};
                            }
                            if ($scope.reports.selected.skills[Object.keys($scope.skills.options)[3]].missions.indexOf(missionObject.mission) === -1) {
                                missionObject[Object.keys($scope.skills.options)[3]] = {disabled: true};
                            }
                        }
                    });
                }
            }
        });

        // Check if selected game has selected report

        if (!ReportsService.isValidReport(reportId, $scope.reports.options))  { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId, $scope.reports.options), {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId
            });
            return;
        }

        // Set parent scope developer info

        if (gameReports.hasOwnProperty('developer')) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.developer.logo = gameReports.developer.logo;
        }

        /////////////////////////////////////////// Child page stuff ////////////////////////////

        $scope.openReportHelperView = function() {
            var url = $state.href('root.cleanChrome.drk12ReportHelper', {gameId: $scope.games.selectedGameId, courseId: $scope.courses.selectedCourseId, location: $scope.selectedSkill});
            window.open(url, '_child');
        };

        $scope.openInstructionPlanView = function() {
            var url = $state.href('root.cleanChrome.drk12InstructionPlan', {gameId: $scope.games.selectedGameId, courseId: $scope.courses.selectedCourseId, location: $scope.selectedSkill});
            window.open(url, '_child');
        };

        ///////////////////////////////////////////////////////////////////////////////////////////

        var populateStudentLearningData = function(usersReportData) {
            if (usersReportData) {
                if (usersReportData.length < 1 ) {
                    $scope.noUserData = true;
                } else {
                    // Populate students in course with report data

                    angular.forEach($scope.courses.selected.users, function (student) {
                        student.results = _findUserByUserId(student.id, usersReportData.students) || {};
                        if (student.results.missions) {
                            student.results.missions.sort(function(first, second) {
                                return sortStringsAndNumbers(first, second);
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
                if (reportData[i] && reportData[i].userId === userId) {
                    found = reportData[i];
                    return found;
                }
            }
            return null;
        };

        $scope.toggleStudentCheck = function(student) {
            if ($scope.selectedStudents.indexOf(student) === -1) {
                $scope.selectedStudents.push(student);
            } else {
                $scope.selectedStudents.splice($scope.selectedStudents.indexOf(student), 1);
            }
        };

        $scope.toggleDropdown = function($event) {
            $event.stopPropagation();
            $scope.skills.isDropdownOpen = ! $scope.skills.isDropdownOpen;
        };

        $scope.selectSkill = function($event, skillKey) {
            $event.stopPropagation();
            $scope.selectedSkill = skillKey;
            $scope.selectedSubSkill = 'all';
        };

        $scope.selectSubSkill = function($event, subSkillKey) {
            $event.stopPropagation();
            $scope.selectedSubSkill = subSkillKey;
            $scope.skills.isDropdownOpen = false;
        };

        $scope.sortingData = {
            current: 'student',
            isReverseSort: false
        };

        $scope.sortSelected = function (colName) {
            if ($scope.sortingData.current === colName) {
                $scope.sortingData.isReverseSort = !$scope.sortingData.isReverseSort;
            } else {
                $scope.sortingData.current = colName;
            }
        };

        $scope.isStudentTableReverseSort = false;

        $scope.userSortFunction = function (colName) {
            return function (user) {
                if (colName === 'student') { // TODO: Deal with these magic values
                    return user.firstName + ' ' + user.lastName;
                }
                if (colName === 'average') { // TODO: Deal with these magic values
                    if (user.results.currentProgress.skillLevel && user.results.currentProgress.skillLevel[$scope.selectedSkill]) {
                        if ($scope.selectedSubSkill === 'all') {
                            return user.results.currentProgress.skillLevel[$scope.selectedSkill].average;
                        } else if (user.results.currentProgress.skillLevel[$scope.selectedSkill].detail && user.results.currentProgress.skillLevel[$scope.selectedSkill].detail[$scope.selectedSubSkill]) {
                            return user.results.currentProgress.skillLevel[$scope.selectedSkill].detail[$scope.selectedSubSkill].average;
                        } else {
                            return -1;
                        }
                    } else {
                        return -1;
                    }
                }
            };
        };

        $scope.openModal = function() {
            $state.go('modal-xxlg.drk12_bInfo', {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId
            });
        };

        $scope.getPopoverTitle = function(missionName) {
            if (missionName === 'BT') {
                return "BT - Bot Trainer";
            } else if (missionName === 'ST') {
                return "ST - Scheme Trainer";
            }
        };

        $scope.getSkillPercentForSelectedSkill = function(skill) {
            if (!skill || skill.level === "NotAvailable") {
                return "";
            } else if (skill.level === "NotAttempted") {
                return "-";
            }

            var score = 0;
            if ($scope.selectedSubSkill === 'all') {
                if (skill.score.attempts === 0) {
                    return "-";
                } else {
                    score = (skill.score.correct / skill.score.attempts) * 100;
                }
            } else {
                if (!skill.detail || !skill.detail[$scope.selectedSubSkill] || skill.detail[$scope.selectedSubSkill].attempts === 0) {
                    return "-";
                } else {
                    score = (skill.detail[$scope.selectedSubSkill].correct / skill.detail[$scope.selectedSubSkill].attempts) * 100;
                }
            }
            return score.toFixed(0) + "%";
        };

        $scope.getSkillAverageForSelectedSkill = function(skill) {
            if (!skill || skill.level === "NotAvailable") {
                return "-";
            } else if (skill.level === "NotAttempted") {
                return "-";
            }

            var average = 0;
            if ($scope.selectedSubSkill === 'all') {
                if (!skill.score || !skill.score.attempts || (skill.score.attempts === 0 && skill.score.average === 0)) {
                    return "-";
                } else {
                    average = skill.average;
                }
            } else {
                if (!skill.detail || !skill.detail[$scope.selectedSubSkill] || (skill.detail[$scope.selectedSubSkill].attempts === 0 && skill.detail[$scope.selectedSubSkill].average === 0)) {
                    return "-";
                } else {
                    average = skill.detail[$scope.selectedSubSkill].average;
                }
            }
            return average.toFixed(0) + "%";
        };

        $scope.subSkillPercentToLevel = function(percent, parentSkillLevel) {
            if (parentSkillLevel === 'NotAvailable') {
                return "NotAvailable";
            } else if (percent < 0.7) {
                return "NeedSupport";
            } else if (percent >= 0.7) {
                return "Advancing";
            } else if (isNaN(percent) && parentSkillLevel !== "NotAvailable") {
                return "NotAttempted";
            } else if (isNaN(percent)) {
                return "NotAvailable";
            }
        };

        $scope.getPopoverText = function(missionName) {
            if (missionName === 'BT') {
                return "Bot Trainer 5000 helps students practice critiquing skills";
            } else if (missionName === 'ST') {
                return "Scheme Trainer helps students practice their argument scheme identification and critical questions";
            }
        };

        $scope.navigateToDrilldown = function(student, mission) {
            if (!student || !mission || mission.skillLevel[$scope.selectedSkill].level === "NotAttempted" || mission.skillLevel[$scope.selectedSkill].level === "NotAvailable") { // TODO: Fix magic strings
                return;
            }

            $state.go('root.reports.details.drk12_b_drilldown', {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId,
                studentId: student.id,
                skill: $scope.selectedSkill,
                mission: mission.mission
            });
        };

        $scope.printPage = function() {
            window.print();
        };

        // populate student objects with report data
        populateStudentLearningData(usersData);

        /*
        Currently this is initialized when the page element is rendered.
        Heavily influenced by http://stackoverflow.com/a/24973235/969869
         */
        $scope.doDrawCourseStatusChart = function() {
            var d3ContainerElem = d3.select("#drk12_bChart").classed("drk-svg-container", true);

            if ($scope.noUserData) { return; }

            var margin = {top: 20, right: 0, bottom: 40, left: 10},
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
                .classed("drk-svg-content-responsive", true);

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
                .attr("width", 39)
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
                .attr("d", ["M", 35, 140, "v", 0, "h", width-70].join(" "));

            chartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            chartGroup.selectAll("g.x.axis g.tick")
                .append("circle")
                .attr("r", 8);

            chartGroup.selectAll("g.x.axis g.tick text") // Positioning the lower text
                .attr("y", 19);
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
            var numberOfSlicesWithNonZeroValues = 0;
            angular.forEach(usersData.courseSkills[skillKey], function(skillValue, skillKey) {
                if (skillValue > 0) {numberOfSlicesWithNonZeroValues++;}
                courseSkillStats.push({skill: skillKey, total: skillValue});
            });

            var d3ContainerElem = d3.select("#courseSkill_" + skillKey).classed("drk-pie-chart", true);

            var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 148 - margin.left - margin.right,
                height = 148 - margin.top - margin.bottom;
            var radius = Math.min(width, height) / 2;

            // Create the container element with the appropriate height and width
            d3ContainerElem.selectAll("*").remove();
            var svg = d3ContainerElem.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var color = function(data) {
                var colorOptions = ["#22b473", "#fdd367", "#cccccc"];

                var dataIndex = courseSkillStats.reduce(function(previousValue, currentValue, index, array) {
                    if (data === currentValue) {
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

            // Hackery to get pie charts with only one "slice" to have label centered
            var labelArc = d3.svg.arc()
                .outerRadius(Math.floor(numberOfSlicesWithNonZeroValues / 2) * 50)
                .innerRadius(Math.floor(numberOfSlicesWithNonZeroValues / 2) * 50);

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
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .attr("fill", "white")
                .style("text-anchor", "middle")
                .text(function(d) {
                    if (d.data.total === 0) { return ""; }

                    return d.data.total;
                });
        };

        populateCharts();
    });
