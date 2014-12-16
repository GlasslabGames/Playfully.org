angular.module('research', [])
.factory('ResearchService', function($timeout){
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
            afterDate.setMonth(afterDate.getMonth()+1);
            afterDate.setDate(0);
            if(afterDate < this.maxDate || this.maxDate < this.minDate){
                this.maxDate = afterDate;
            }
            this.endDate = this.endDate || new Date(this.maxDate);
            if(this.maxDate < this.endDate || this.endDate < this.startDate){
                this.endDate = new Date(this.maxDate);
            }
        }
    };

    research.nextLoad = function($scope, urls, index){
        if(!urls[index]){
            return;
        }
        window.open(urls[index]);
        index++;
        if(index < urls.length){
            $timeout(function(){
                research.nextLoad($scope, urls, index);
            }, 100);
        } else{
            $scope.loading = false;
        }
    };

    return research;
});
