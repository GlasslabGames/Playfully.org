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
        //var initialStudents = $scope.courses.selected.users; // TODO: Add this back
        var initialStudents = [];
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

        /////////////////////////////////////////// Fake data ////////////////////////////////

        usersData = {
            "gameId": "AA-1",
            "assessmentId": "drk12_b",
            "timestamp": 123412341234,
            "totalMissions": 22,
            "courseProgress": [
                {
                    "mission": 1,
                    "studentCount": 2
                },
                {
                    "mission": 2,
                    "studentCount": 0
                },
                {
                    "mission": 3,
                    "studentCount": 3
                },
                {
                    "mission": 4,
                    "studentCount": 4
                },
                {
                    "mission": 5,
                    "studentCount": 0
                },
                {
                    "mission": 6,
                    "studentCount": 0
                },
                {
                    "mission": 7,
                    "studentCount": 4
                },
                {
                    "mission": 8,
                    "studentCount": 0
                },
                {
                    "mission": 9,
                    "studentCount": 7
                },
                {
                    "mission": 10,
                    "studentCount": 6
                },
                {
                    "mission": 11,
                    "studentCount": 0
                },
                {
                    "mission": 12,
                    "studentCount": 0
                },
                {
                    "mission": 13,
                    "studentCount": 0
                },
                {
                    "mission": 14,
                    "studentCount": 0
                },
                {
                    "mission": 15,
                    "studentCount": 1
                },
                {
                    "mission": 16,
                    "studentCount": 2
                },
                {
                    "mission": 17,
                    "studentCount": 0
                },
                {
                    "mission": 18,
                    "studentCount": 0
                },
                {
                    "mission": 19,
                    "studentCount": 0
                },
                {
                    "mission": 20,
                    "studentCount": 0
                },
                {
                    "mission": 21,
                    "studentCount": 0
                },
                {
                    "mission": 22,
                    "studentCount": 0
                }
            ],
            "courseSkills": {
                "connectingEvidence": {
                    "level": "Advancing",
                        "score": {
                        "correct": 2,
                            "attempts": 4
                    }
                },
                "supportingClaims": {
                    "level": "NeedSupport",
                        "score": {
                        "correct": 3,
                            "attempts": 9
                    }
                },
                "criticalQuestions": {
                    "level": "NotAttempted",
                        "score": {
                        "correct": 0,
                            "attempts": 0
                    }
                },
                "usingBacking": {
                    "level": "NotAttempted",
                    "correct": 0,
                        "attempts": 0
                }
            },
            "students": [
                {
                    "userId": 1,
                    "currentProgress": {
                        "mission": 12,
                        "connectingEvidence": {
                            "level": "Advancing",
                            "score": {
                                "correct": 2,
                                "attempts": 4
                            }
                        },
                        "supportingClaims": {
                            "level": "NeedSupport",
                            "score": {
                                "correct": 1,
                                "attempts": 4
                            }
                        },
                        "criticalQuestions": {
                            "level": "Advancing",
                            "score": {
                                "correct": 1,
                                "attempts": 2
                            }
                        },
                        "usingBacking": {
                            "level": "NotAttempted",
                            "score": {
                                "correct": 0,
                                "attempts": 0
                            }
                        }
                    },
                    "missions": [
                        {
                            "mission":1,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":2,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":3,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 2,
                                        "attempts": 4
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":4,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":5,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 1,
                                        "attempts": 1
                                    }
                                },
                                "supportingClaims": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 3,
                                        "attempts": 4
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":6,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 1,
                                        "attempts": 2
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NeedSupport",
                                    "score": {
                                        "correct": 2,
                                        "attempts": 5
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":7,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "NotAttempted",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAttempted",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":8,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 3,
                                        "attempts": 4
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":9,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "NeedSupport",
                                    "score": {
                                        "correct": 2,
                                        "attempts": 5
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        },
                        {
                            "mission":10,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 2,
                                        "attempts": 2
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NotAttempted",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "criticalQuestions": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                },
                                "usingBacking": {
                                    "level": "NotAvailable",
                                    "score": {
                                        "correct": 0,
                                        "attempts": 0
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        };

        for (var k = 0; k < 10; k++) {
            var studentObject = {
                firstName: "first" + k,
                lastName: "last" + k,
                id: k,
                isSelected: true
            };

            initialStudents.push(studentObject);
        }

        ////////////////////////////////////////////////////////////////////////////////////

        $scope.reportData = usersData;

        $scope.getSkillClass = function(skill) {
            return usersData.courseSkills[skill].level;
        };

        initialStudents.sort(function(first,second) { return first.firstName.localeCompare(second.firstName); });
        // Due to _students.html requiring an array within an array for displaying students, this data structure is perverse.
        $scope.students = [];
        initialStudents.forEach(function(student) {
            $scope.students.push([student]);
        });

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
            var d3ContainerElem = d3.select("#drk12_bChart"); // TODO: probably want a better way of selecting the element

            //if ($scope.noUserData) { return; } // TODO: Re-implement this

            var margin = {top: 20, right: 20, bottom: 20, left: 40},
                width = 800 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom");

            var yAxis = d3.svg.axis().scale(y).orient("left");

            d3ContainerElem.selectAll("*").remove();
            var svg = d3ContainerElem.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(usersData.courseProgress.map(function(d) { return d.mission; }));
            y.domain([0, d3.max(usersData.courseProgress, function(d) { return d.studentCount; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("# of students");

            svg.selectAll(".bar")
                .data(usersData.courseProgress)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.mission); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.studentCount); })
                .attr("height", function(d) { return height - y(d.studentCount); });

            svg.selectAll("text.bar")
                .data(usersData.courseProgress)
                .enter().append("text")
                .attr("class", "bar")
                .attr("text-anchor", "middle")
                .attr("x", function(d) { return x(d.mission) + x.rangeBand()/2; })
                .attr("y", function(d) { return y(d.studentCount) - 5; })
                .text(function(d) { return d.studentCount; });
        };

        var _populateStudentLearningData = function(usersReportData) {
            if (usersReportData) {
                if (usersReportData.length < 1 ) {
                    $scope.noUserData = true;
                    return;
                } else {
                    // Populate students in course with report data

                    angular.forEach($scope.students, function (studentWrappedInArray) {
                        var student = studentWrappedInArray[0];
                        student.results = _findUserByUserId(student.id, usersReportData.students) || {};
                        if (student.results.missions) {
                            student.results.missions.sort(function(first,second) { return first.mission - second.mission; });

                            student.results.missions[student.results.missions.length-1].current = true;
                            student.results.missions.forEach(function(mission) {
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

                            // Pad the results with blank missions where there's not enough data
                            for (var i = student.results.missions.length; i < usersData.totalMissions; i++) {
                                var paddingObject = {
                                    "mission": i,
                                    "paddingObject": true,
                                    "skillLevel": {
                                        "connectingEvidence": {
                                            "level": "",
                                            "score": {
                                                "correct": 0,
                                                "attempts": 0
                                            }
                                        },
                                        "supportingClaims": {
                                            "level": "",
                                            "score": {
                                                "correct": 0,
                                                "attempts": 0
                                            }
                                        },
                                        "criticalQuestions": {
                                            "level": "",
                                            "score": {
                                                "correct": 0,
                                                "attempts": 0
                                            }
                                        },
                                        "usingBacking": {
                                            "level": "",
                                            "score": {
                                                "correct": 0,
                                                "attempts": 0
                                            }
                                        }
                                    }
                                };

                                var skills = drk12_bStore.getSkills();
                                paddingObject.skillLevel.connectingEvidence.level = skills.connectingEvidence.missions.indexOf(i) != -1 ? "NotAttempted" : "NotAvailable";
                                paddingObject.skillLevel.supportingClaims.level = skills.supportingClaims.missions.indexOf(i) != -1 ? "NotAttempted" : "NotAvailable";
                                paddingObject.skillLevel.criticalQuestions.level = skills.criticalQuestions.missions.indexOf(i) != -1 ?  "NotAttempted" : "NotAvailable";
                                paddingObject.skillLevel.usingBacking.level = skills.usingBacking.missions.indexOf(i) != -1 ? "NotAttempted" : "NotAvailable";
                                student.results.missions.push(paddingObject);
                            }
                        }
                    });
                }
            }
        };

        var _findUserByUserId = function (userId, reportData) {
            var found;
            for (var i = 0; i < reportData.length; i++) {
                if (reportData[i].userId == userId) {
                    found = reportData[i];
                    return found;
                }
            }
            return null;
        };

        $scope.columns = {
            headers: [
                { title: "Name", value: "name"},
                { title: "Current Mission", value: "currentMission"}
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
                header.checked = header.value == skill;
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
            return function (userWrappedInArray) {
                var user = userWrappedInArray[0];
                if (colName === $scope.columns.headers[0].value) {
                    return user.firstName;
                }
                if (colName === $scope.columns.headers[1].value) {
                    return user.results.currentProgress.mission;
                }

                var columnSkill = user.results.currentProgress[$scope.columns.current];
                var score = columnSkill.score.correct / columnSkill.score.attempts;
                if (columnSkill.level == $scope.progressTypes.notYetAttempted.class) { score--; }

                return score;
            };
        };

        $scope.setCurrentStudent = function (student) {
            drk12_bStore.setCurrentStudent(student);
        };

        // populate student objects with report data
        _populateStudentLearningData(usersData);
    });
