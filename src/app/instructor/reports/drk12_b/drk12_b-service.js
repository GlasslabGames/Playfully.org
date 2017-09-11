angular.module( 'instructor.reports')
    .service('Drk12Service', function() {
        this.reportDataFromServer = null;

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
