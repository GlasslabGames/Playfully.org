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

        $scope.progressTypes = { // TODO: This is redundant. Should probably move to service.
            advancing: {class:'Advancing', title: 'Advancing'},
            needSupport: {class:'NeedSupport', title: 'Needs Support'},
            notYetAttempted: {class:'NotAttempted', title: 'Not enough data'}
        };

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

        ///// Setup options /////

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

                    usersData.courseProgress.forEach(function(missionObject) {
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

                            var skill1Name = Object.keys($scope.skills.options)[0]; var skill1Correct = 0; var skill1Attempts = 0;
                            var skill2Name = Object.keys($scope.skills.options)[1]; var skill2Correct = 0; var skill2Attempts = 0;
                            var skill3Name = Object.keys($scope.skills.options)[2]; var skill3Correct = 0; var skill3Attempts = 0;
                            var skill4Name = Object.keys($scope.skills.options)[3]; var skill4Correct = 0; var skill4Attempts = 0;

                            student.results.missions.forEach(function(missionRecord) {
                                if (missionRecord.skillLevel[skill1Name].score.attempts > 0) {
                                    skill1Correct += missionRecord.skillLevel[skill1Name].score.correct;
                                    skill1Attempts += missionRecord.skillLevel[skill1Name].score.attempts;
                                }
                                if (missionRecord.skillLevel[skill2Name].score.attempts > 0) {
                                    skill2Correct += missionRecord.skillLevel[skill2Name].score.correct;
                                    skill2Attempts += missionRecord.skillLevel[skill2Name].score.attempts;
                                }
                                if (missionRecord.skillLevel[skill3Name].score.attempts > 0) {
                                    skill3Correct += missionRecord.skillLevel[skill3Name].score.correct;
                                    skill3Attempts += missionRecord.skillLevel[skill3Name].score.attempts;
                                }
                                if (missionRecord.skillLevel[skill4Name].score.attempts > 0) {
                                    skill4Correct += missionRecord.skillLevel[skill4Name].score.correct;
                                    skill4Attempts += missionRecord.skillLevel[skill4Name].score.attempts;
                                }
                            });

                            if (student.results.currentProgress.skillLevel[skill1Name]) {
                                student.results.currentProgress.skillLevel[skill1Name].average = (skill1Correct / skill1Attempts) * 100;
                            }
                            if (student.results.currentProgress.skillLevel[skill2Name]) {
                                student.results.currentProgress.skillLevel[skill2Name].average = (skill2Correct / skill2Attempts) * 100;
                            }
                            if (student.results.currentProgress.skillLevel[skill3Name]) {
                                student.results.currentProgress.skillLevel[skill3Name].average = (skill3Correct / skill3Attempts) * 100;
                            }
                            if (student.results.currentProgress.skillLevel[skill4Name]) {
                                student.results.currentProgress.skillLevel[skill4Name].average = (skill4Correct / skill4Attempts) * 100;
                            }

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
            alert('not implemented yet');
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
                        return user.results.currentProgress.skillLevel[$scope.selectedSkill].average;
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

        $scope.getPopoverText = function(missionName) {
            if (missionName === 'BT') {
                return "Bot Trainer 5000 helps students practice critiquing skills";
            } else if (missionName === 'ST') {
                return "Scheme Trainer helps students practice their argument scheme identification and critical questions";
            }
        };

        $scope.toggleHelperFullScreen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.isFooterFullScreen = !$scope.isFooterFullScreen;

            if ($scope.isFooterFullScreen) {
                jQuery('.gl-drk12-footerhelper').addClass("fullscreen");
                jQuery('.gl-drk12_b-helperMenu').addClass("fullscreen");
                jQuery('.gl-drk12_b-helperMainContent').addClass("fullscreen");
                jQuery('.gl-navbar--top').css("z-index", 1);
            } else {
                jQuery('.gl-drk12-footerhelper').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMenu').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMainContent').removeClass("fullscreen");
                jQuery('.gl-navbar--top').css("z-index", 10);
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

        $scope.footerHelperClicked = function() {
            $scope.isFooterOpened = !$scope.isFooterOpened;
            $scope.$broadcast("FOOTERHELPER_CLICKED",  $scope.tabs[0].active, $scope.selectedSkill);

            /*
             Ideally the reportHelper html element would be a direct child of the body tag. Since this isn't possible
             We do this craziness to help create that illusion
             */
            if (!$scope.isFooterOpened) {
                $scope.isFooterFullScreen = false;
                jQuery('.gl-drk12-footerhelper').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMenu').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMainContent').removeClass("fullscreen");
                jQuery('.gl-navbar--top').css("z-index", 10);
            }
        };

        // populate student objects with report data
        populateStudentLearningData(usersData);

        /*
        Currently this is initialized when the page element is rendered.
        Heavily influenced by http://stackoverflow.com/a/24973235/969869
         */
        $scope.doDrawCourseStatusChart = function() {
            var d3ContainerElem = d3.select("#drk12_bChart").classed("svg-container", true);

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
                .attr("d", ["M", 35, 140, "v", 0, "h", width-70].join(" "));

            chartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            chartGroup.selectAll("g.x.axis g.tick")
                .append("circle")
                .attr("r", 8);
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

            var d3ContainerElem = d3.select("#courseSkill_" + skillKey).classed("blah", true); // TODO: Change this

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
                .style("text-anchor", "middle")
                .text(function(d) {
                    if (d.data.total === 0) { return ""; }

                    return d.data.total;
                });
        };

        populateCharts();
    });
