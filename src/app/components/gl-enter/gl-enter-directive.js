angular.module('gl-enter', [])
.directive('glEnter', function($document) {
  return function(scope, element, attrs) {
    element.focus();
    $document.bind('keyup', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.glEnter);
        });
        event.preventDefault();
        $document.unbind('keyup');
      }
    });

  };
});

