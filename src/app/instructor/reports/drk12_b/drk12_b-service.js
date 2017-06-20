angular.module( 'instructor.reports')
    .service('Drk12Service', function() {
        this.reportDataFromServer = null;

        this.skills = {
            options: {
                connectingEvidence: 'Argument Schemes',
                supportingClaims: 'Claims and Evidence',
                criticalQuestions: 'Critical Questions',
                usingBacking: 'Using Backing'
            }
        };
    });
