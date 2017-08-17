angular.module( 'instructor.reports')
    .service('Drk12Service', function() {
        this.reportDataFromServer = null;

        this.skills = {
            options: {
                connectingEvidence: {
                    displayLabel: 'Argument Schemes',
                    subSkills: {
                        all: "All Skills",
                        AUTHORITRON: "Authoritron",
                        OBSERVATRON: "Observatron",
                        CONSEBOT: "Consebot",
                        COMPARIDROID: "Comparidroid"
                    }
                },
                supportingClaims: {
                    displayLabel: 'Claims and Evidence',
                    subSkills: {
                        all: "All Skills",
                        FUSE_CORE: "Evidence",
                        CORE_ATTACK: "Contradictory"
                    }
                },
                criticalQuestions: {
                    displayLabel: 'Critical Questions',
                    subSkills: {
                        all: "All Skills",
                        AUTHORITRON: "Authoritron",
                        OBSERVATRON: "Observatron",
                        CONSEBOT: "Consebot",
                        COMPARIDROID: "Comparidroid"
                    }
                },
                usingBacking: {
                    displayLabel: 'Using Backing',
                    subSkills: {
                        all: "All Skills",
                        CREATED: "Backing to Support Evidence",
                        DEFENDED: "Backing to Defend"
                    }
                }
            }
        };
    });
