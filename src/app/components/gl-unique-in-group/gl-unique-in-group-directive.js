angular.module('gl-unique-in-group', [])
.directive('glUniqueInGroup', function ($parse, $log){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        var group = $parse(attr.glUniqueInGroup)(scope);
        $log.info('group');
        $log.info(group);

        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
            var valid = group.indexOf(value) === -1;
            ngModel.$setValidity('isUniqueInGroup', valid);
            return valid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
            ngModel.$setValidity('isUniqueInGroup', group.indexOf(value) === -1);
            return value;
        });

      }
   };
});
