angular.module( 'instructor.reports')
    .service('drk12_bStore', function() {
        this.currentStudentsArray = [];
        this.skills = null;
        this.selectedSkill = null;
        this.isSingleSKillView = false;
        this.selectedStudent = null;
        this.selectedMission = null;
        this.modalTypes = ['info', 'studentInfo', 'drilldown'];

        this.isValidModalType = function(someString) {
            return this.modalTypes.indexOf(someString) > -1;
        };

        this.hasValidModalData = function(modalType) {
            if (modalType === this.modalTypes[1]) {
                return this.currentStudentsArray.length > 0 && this.getSkills() !== null && this.getSelectedSkill() !== null;
            } else if (modalType === this.modalTypes[2]) {
                return this.getSelectedSkill() !== null && this.getSelectedStudent() !== null && this.getSelectedMission !== null;
            } else {
                return true;
            }
        };

        this.reset = function() {
            if (!this.isSingleSKillView) { // Go back to initial skill in case modal is immediately re-opened. Otherwise leave it.
                this.selectedSkill = Object.keys(this.skills)[0];
            }
            this.currentStudentsArray = [];
            this.selectedStudent = null;
            this.selectedMission = null;
        };

        this.setCurrentStudents = function(currentStudentsArray) {
            if (currentStudentsArray) {
                this.currentStudentsArray = currentStudentsArray;
                if (currentStudentsArray.length > 0) {
                    this.selectedStudent = currentStudentsArray[0];
                }
            }
        };
        // Make sure this is pass-by-value
        this.getCurrentStudents = function() {
            return angular.copy(this.currentStudentsArray);
        };

        this.setSelectedStudent = function(selectedStudent) {
            if (selectedStudent) {
                this.selectedStudent = selectedStudent;
            }
        };

        this.getSelectedStudent = function() {
            return angular.copy(this.selectedStudent);
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

        this.setSelectedMission = function(selectedMission) {
            if (selectedMission) {
                this.selectedMission = selectedMission;
            }
        };

        this.getSelectedMission = function() {
            return this.selectedMission;
        };
    });
