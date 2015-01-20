angular.module('gl-editable-text', [])
.directive('glEditableText', function($compile) {
  return {
    restrict: 'A',
    scope: {
      glEditableText:'=',
      glOnBeforeSave:'='
    },
    template: 'WHAT',
    link: function(scope, element, attr) {
      var form = "<textarea cols='85'rows='10'>" + scope.glEditableText + "</textarea>";
      var originalContent = '';
      scope.goBackContent = function ($event) {
      };
      element.on("click", function() {
        scope.$apply(function() {
          var buttons = "<button ng-click='glOnBeforeSave'>save</button><button ng-click='goBackContent($event)'>cancel</button>";
          var textArea = "<div ng-hi">"+ form + buttons + "</div>"
          var linkFn = $compile(form + buttons)(scope);
          originalContent = element.replaceWith(linkFn);
        });
      });


    }
  };
});

