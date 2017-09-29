angular.module( 'instructor.reports')
    .service('Drk12Service', function($http, API_BASE) {
        this.currentReportCourseId = null;
        this.reportDataFromServer = null;

        this.getInstructionPlans = function( courseId, gameId, skill ) {
            return $http.get(API_BASE + '/lms/course/' + courseId + '/game/' + gameId + '/skill/' + skill + '/notes' );
        };

        this.uploadInstructionPlan = function( courseId, gameId, skill, submissionData ) {
            return $http.post(API_BASE + '/lms/course/' + courseId + '/game/' + gameId + '/skill/' + skill + '/notes', submissionData );
        };

        this.skills = {
            options: {
                connectingEvidence: {
                    displayLabel: 'Argument Schemes',
                    subSkills: {
                        all: "All Sub Skills",
                        AUTHORITRON: "Authoritron",
                        OBSERVATRON: "Observatron",
                        CONSEBOT: "Consebot",
                        COMPARIDROID: "Comparidroid"
                    }
                },
                supportingClaims: {
                    displayLabel: 'Claims and Evidence',
                    subSkills: {
                        all: "All Sub Skills",
                        FUSE_CORE: "Claim Cores Built",
                        CORE_ATTACK: "Claim Cores Attacked"
                    }
                },
                criticalQuestions: {
                    displayLabel: 'Critical Questions',
                    subSkills: {
                        all: "All Sub Skills",
                        AUTHORITRON: "Authoritron",
                        OBSERVATRON: "Observatron",
                        CONSEBOT: "Consebot",
                        COMPARIDROID: "Comparidroid"
                    }
                },
                usingBacking: {
                    displayLabel: 'Using Backing',
                    subSkills: {
                        all: "All Sub Skills",
                        CREATED: "Backing Attached Before Battle",
                        DEFENDED: "Backing Used in Battle"
                    }
                }
            }
        };
    });
