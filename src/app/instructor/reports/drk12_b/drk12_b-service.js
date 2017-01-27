angular.module( 'instructor.reports')
    .service('drk12_bStore', function() {
        this.currentStudentsArray = [];
        this.skills = null;
        this.selectedSkill = null;

        this.setCurrentStudents = function(currentStudentsArray) {
            if (currentStudentsArray) {
                this.currentStudentsArray = currentStudentsArray;
            }
        };
        // Make sure this is pass-by-value
        this.getCurrentStudents = function() {
            return angular.copy(this.currentStudentsArray);
        };

        this.setSkills = function(skills) {
            this.skills = skills;
        };

        this.getSkills = function() {
            return this.skills;
        };

        this.setSelectedSkill = function(selectedSkill) {
            if ((!selectedSkill || selectedSkill === "all") && this.skills) {
                selectedSkill = Object.keys(this.skills)[0];
            }

            this.selectedSkill = selectedSkill;
        };

        this.getSelectedSkill = function() {
            if (!this.selectedSkill) {
                this.selectedSkill = Object.keys(this.skills)[0];
            }

            return this.selectedSkill;
        };
    });
