angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) {
        $stateProvider.state('modal-xlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:gameId?:type?:progress?:defaultStandard',
            data:{
                pageTitle: 'Progress Report'
            },
            views: {
                'modal@': {
                    templateUrl: function($stateParams, REPORT_CONSTANTS) {
                        return 'instructor/reports/drk12_b/_modal-' + $stateParams.type + '.html';
                    },
                    controller: function($scope, $log, $stateParams, drk12_bStore) {
                        $scope.standardObj = {};
                        $scope.standardObj.selected = null;
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
        //$scope.students = $scope.courses.selected.users; // TODO: Add this back
        $scope.students = [];
        // Courses
        $scope.courses.selectedCourseId = $stateParams.courseId;
        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

        $scope.progressTypes = {
            "Advancing": {class:'Advancing', title: 'Advancing'},
            "Need-Support": {class:'NeedSupport', title: 'Need Support'},
            "Not-yet-attempted": {class:'NotAttempted', title: 'Not yet attempted / Not enough data'}
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
                    "currentMission": 12,
                    "currentProgress": {
                        "connectingEvidence": "Advancing",
                        "supportingClaims": "NeedSupport",
                        "criticalQuestions": "Advancing",
                        "usingBacking": "NotAttempted"
                    },
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
                isSelected: false
            };

            $scope.students.push(studentObject);
        }

        ////////////////////////////////////////////////////////////////////////////////////

        $scope.reportData = usersData;

        $scope.getFirstCriteriaLevel = function() {
            return usersData.courseSkills.connectingEvidence.level;
        };

        $scope.getSecondCriteriaLevel = function() {
            return usersData.courseSkills.supportingClaims.level;
        };

        $scope.getThirdCriteriaLevel = function() {
            return usersData.courseSkills.criticalQuestions.level;
        };

        $scope.getForthCriteriaLevel = function() {
            return usersData.courseSkills.usingBacking.level;
        };


        //$scope.courses.selected.users.forEach(function(student) { studentsToSort.push(student); }); // TODO: Add this back
        $scope.students.sort(function(first,second) { return first.firstName.localeCompare(second.firstName); });

        ///// Setup options /////

        // Games
        $scope.games.options = {}; //TODO: This appears to be report agnostic. Why is it placed in each report?
        angular.forEach(myGames, function(game) { //TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.games.options[''+game.gameId] = game;
        });

        // Reports
        $scope.reports.options = [];  // TODO: This appears to be report agnostic. Why is it placed in each report?

        angular.forEach(gameReports.list, function(report) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            if(report.enabled) {
                $scope.reports.options.push( angular.copy(report) );
                // select report that matches this state
                if (reportId === report.id) {
                    $scope.reports.selected = report;
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
                    angular.forEach($scope.students, function (student) {
                        var userReportData = _findUserByUserId(student.id, usersReportData.students) || {};
                        student.results = userReportData;
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

        $scope.setReport = function (report) { // TODO: Do we need this?
            drk12_bStore.setReport(report);
        };

        // populate student objects with report data
        _populateStudentLearningData(usersData);
    });
