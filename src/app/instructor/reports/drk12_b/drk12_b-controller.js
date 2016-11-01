angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) {
        $stateProvider.state('modal-xlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:gameId?:type?:progress?:defaultStandard',
            data:{
                pageTitle: 'drk12_b Report'
            },
            views: {
                'modal@': {
                    templateUrl: function($stateParams, REPORT_CONSTANTS) {
                        return 'instructor/reports/drk12_b/_modal-' + $stateParams.type + '.html';
                    },
                    controller: function($scope, $log, $stateParams, drk12_bStore, REPORT_CONSTANTS) {
                        $scope.progressTypes = REPORT_CONSTANTS.drk12_bLegendOrder;
                        $scope.standardObj = {};
                        $scope.standardObj.selected = null;
                        $scope.getLabelInfo = function(label,type) {
                            if (label && type) {
                                return REPORT_CONSTANTS.legend[label][type];
                            } else {
                                return label;
                            }
                        };
                        if ($stateParams.defaultStandard){
                            $scope.standardObj.selected = $stateParams.defaultStandard;
                        }
                        var standard = angular.copy(drk12_bStore.getStandard());
                        if (standard) {
                            $scope.progressText = standard.progress[$stateParams.progress];
                        } else {
                            // Do nothing on purpose
                        }
                        var report = angular.copy(drk12_bStore.getReport());
                        if (report) {
                            $scope.report = report;
                        }
                        var standardDictionary = angular.copy(drk12_bStore.getStandardDict());
                        if (standardDictionary) {
                            $scope.standardDictionary = standardDictionary;
                        }
                    }
                }
            }
        });
    })
    .service('drk12_bStore', function() {
        var _standard = null;
        var _report = null;
        var _dictionary = null;
        this.setStandard = function(standard) {
            if (standard) {
                _standard = standard;
            }
        };
        this.getStandard = function () {
            var standardCopy = angular.copy(_standard);
            // reset after retrieval
            _standard = null;
            return standardCopy;
        };
        this.setReport = function (report) {
            if (report) {
                _report = report;
            }
        };
        this.getReport = function () {
            var reportCopy = angular.copy(_report);
            // reset after retrieval
            _report = null;
            return reportCopy;
        };
        this.setStandardDict = function (dictionary) {
            if (dictionary) {
                _dictionary = dictionary;
            }
        };
        this.getStandardDict = function () {
            var dictionaryCopy = angular.copy(_dictionary);
            // reset after retrieval
            _dictionary = null;
            return dictionaryCopy;
        };
    })
    .controller('Drk12_bCtrl', function($scope, $state, $stateParams, myGames, defaultGame, gameReports, REPORT_CONSTANTS, ReportsService, drk12_bStore, usersData) {
        ///// Setup selections /////

        // Report
        var reportId = 'drk12_b';
        // Courses
        $scope.courses.selectedCourseId = $stateParams.courseId;
        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

        // students in course grouped by columns and rows
        var studentsToSort = [];

        /////////////////////////////////////////// Fake data ////////////////////////////////

        var mockData = {
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
                    "currentMission": 12,
                    "missions": [
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
                                    "level": "NeedSupport",
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
                                    "level": "NeedSupport",
                                    "score": {
                                        "correct": 1,
                                        "attempts": 4
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
                            "mission":7,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 3,
                                        "attempts": 4
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NeedSupport",
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
                                    "level": "NeedSupport",
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
                            "mission":9,
                            "skillLevel": {
                                "connectingEvidence": {
                                    "level": "Advancing",
                                    "score": {
                                        "correct": 2,
                                        "attempts": 2
                                    }
                                },
                                "supportingClaims": {
                                    "level": "NeedSupport",
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
                                    "level": "NeedSupport",
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
                isSelected: false,
                results: []
            };
            for (var l = 1; l <= 22; l++) {
                var missionObject = {
                    missionNumber: l
                };

                var gradeRandomizer = Math.random();

                if(gradeRandomizer >= 0.33) {
                    missionObject.grade = "Pass";
                } else if (gradeRandomizer >= 0.66) {
                    missionObject.grae = "Incomplete";
                } else {
                    missionObject.grade = "noData";
                }
                studentObject.results.push(missionObject);
            }

            studentsToSort.push(studentObject);
        }

        ////////////////////////////////////////////////////////////////////////////////////

        $scope.getFirstCriteriaLevel = function() {
            return mockData.courseSkills.connectingEvidence.level;
        };

        $scope.getSecondCriteriaLevel = function() {
            return mockData.courseSkills.supportingClaims.level;
        };

        $scope.getThirdCriteriaLevel = function() {
            return mockData.courseSkills.criticalQuestions.level;
        };

        $scope.getForthCriteriaLevel = function() {
            return mockData.courseSkills.usingBacking.level;
        };


        //$scope.courses.selected.users.forEach(function(student) { studentsToSort.push(student); }); // TODO: Add this back
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
                    student.isSelected = true; // set to initially visible
                    row.push(student);
                } else {
                    row.push(null);
                }
            }
            students.push(row);
        }

        $scope.students = students;
        $scope.studentAreaWidth = 80 + 120 * Math.min(visibleColumns, columns);

        // Games
        $scope.games.selectedGameId = defaultGame.gameId;

        // Get the default standard from the user
        $scope.defaultStandards = "CCSS";

        ///// Setup options /////

        // Games
        $scope.games.options = {};
        angular.forEach(myGames, function(game) {
            $scope.games.options[''+game.gameId] = game;
        });

        // Reports
        $scope.reports.options = [];
        $scope.reports.standardsList = [];
        $scope.reports.standardsDict = {};

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

        $scope.state = {
            showStandardsDescriptions: true
        };

        $scope.progressTypes = REPORT_CONSTANTS.drk12_bLegendOrder;

        $scope.getLabelInfo = function(label,type) {
            if (label && type) {
                return REPORT_CONSTANTS.legend[label][type];
            }
            //else if (type === 'text') { // TODO: Not sure the point of this yet.
            //    // if student has no data
            //    return "notstarted";
            //}
        };

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

            x.domain(mockData.courseProgress.map(function(d) { return d.mission; }));
            y.domain([0, d3.max(mockData.courseProgress, function(d) { return d.studentCount; })]);

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
                .data(mockData.courseProgress)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.mission); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.studentCount); })
                .attr("height", function(d) { return height - y(d.studentCount); });

            svg.selectAll("text.bar")
                .data(mockData.courseProgress)
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
                    var students = $scope.courses.selected.users;
                    angular.forEach(students, function (student) {
                        var userReportData = _findUserByUserId(student.id, usersReportData) || {};
                        student.results = userReportData.results;
                        student.timestamp = angular.copy(userReportData.timestamp);
                    });
                }
            }
        };

        /*
         // populate with test data
         var _populateStudentLearningData = function(usersReportData) {
         var students = $scope.courses.selected.users;
         angular.forEach(students, function (student) {
         student.results = { };
         student.results['6.RP.A.1'] = 'Partial';
         student.results['6.RP.A.2'] = 'Partial';
         student.results['6.RP.A.3'] = 'Partial';
         student.results['6.RP.A.3.A'] = 'Partial';
         student.timestamp = new Date();
         });
         };
         */

        var _findUserByUserId = function (userId, users) {
            var found;
            for (var i = 0; i < users.length; i++) {
                if (users[i].userId == userId) {
                    found = users[i];
                }
            }
            return found || null;
        };

        var _initStandards = function () {
            // create list of standards
            //angular.forEach($scope.reports.selected.table.groups, function(group) {
            angular.forEach($scope.reports.options[3].table.groups, function(group) { // TODO: Remove. Using standards stuff as a stand-in
                angular.forEach(group.subjects, function(subject) {
                    angular.forEach(subject.standards, function(standard) {
                        // to help generate student data for report table
                        $scope.reports.standardsList.push(standard);
                        // to help easily access standard info in legend modal
                        $scope.reports.standardsDict[standard.id] = standard;
                    });
                });
            });
            // for displaying legend information
            $scope.defaultStandard = $scope.reports.standardsList[0];
        };
        // To pass data to modal
        $scope.setStandard = function (standardId) {
            drk12_bStore.setStandard($scope.reports.standardsDict[standardId]);
        };
        $scope.setReport = function (report) {
            drk12_bStore.setReport(report);
        };
        $scope.setStandardDict = function (dictionary) {
            drk12_bStore.setStandardDict(dictionary);
        };
        // set headers for standards table
        _initStandards();
        // populate student data with standards descriptions
        _populateStudentLearningData(usersData);
    });
