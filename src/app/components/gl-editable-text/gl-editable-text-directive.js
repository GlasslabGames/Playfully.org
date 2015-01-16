angular.module('gl-editable-text', [])
.directive('glEditableText', function($document) {
  return function(scope, element, attrs) {
    //
    element.bind('click', function() {
      console.log('editable click')
    });
  };
});

