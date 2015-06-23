angular.module('research', [])
.factory('ResearchService', function($timeout, $http, API_BASE){
    // this refers to the $scope of the controller, which is set via bind
    var research = {};
    research.updateMinMaxDate = function(){
        if(this.startDate){
            this.minDate = new Date(this.startDate);
        } else {
            this.minDate = null;
        }
        if(this.minDate){
            var afterDate = new Date(this.minDate);
            afterDate.setDate(afterDate.getDate()+6);
            if(afterDate < this.maxDate || this.maxDate < this.minDate){
                this.maxDate = afterDate;
            }
            var today = new Date();
            if(this.maxDate > today){
                this.maxDate = today;
            }
            this.endDate = this.endDate || new Date(this.maxDate);
            if(this.maxDate < this.endDate || this.endDate < this.startDate){
                this.endDate = new Date(this.maxDate);
            }
        }
    };

    return research;
});
