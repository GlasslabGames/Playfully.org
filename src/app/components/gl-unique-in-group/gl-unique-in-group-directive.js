angular.module('gl-unique-in-group', [])
.directive('glUniqueInGroup', function ($parse, $log){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        var group = $parse(attr.glUniqueInGroup)(scope),
            lowercaseGroup = _.map(group, function(elem) { return elem.toLowerCase(); });

        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
            var valid = lowercaseGroup.indexOf(value.toLowerCase()) === -1;
            ngModel.$setValidity('isUniqueInGroup', valid);
            return valid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
            ngModel.$setValidity('isUniqueInGroup',
                                 lowercaseGroup.indexOf(value.toLowerCase()) === -1);
            return value;
        });

      }
   };
});
