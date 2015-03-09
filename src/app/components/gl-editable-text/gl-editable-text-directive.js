angular.module('gl-editable-text', [])
.directive('glEditableText', function($compile,$q,$timeout) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      glEditableText:'=',
      glOnBeforeSave:'=',
      glEditTrigger:'=',
      glEditTextAreaSize:'=',
      glShowEdit: '=',
      glEditLimit: '='
    },
    templateUrl: "components/gl-editable-text/gl-editable-text-template.html",
    link: function(scope, element, attr) {
      scope.edit = {};
      // sets textarea content as current text
      scope.edit.content = scope.glEditableText;
      scope.hideEdit = true;
      if (scope.glShowEdit) {
          scope.hideEdit = false;
      }
      scope.editContent = function () {
        scope.hideEdit = false;
      };
      scope.glEditTrigger = function () {
        scope.hideEdit = !scope.hideEdit;
      };
      scope.goBackContent = function () {
        scope.edit.content = scope.glEditableText;
        scope.hideEdit = !scope.hideEdit;
      };
      scope.saveContent = function() {
        var defer = $q.defer();
        // saves original text in case save fails
        var originalText = scope.glEditableText;
        // change content to text within text field
        scope.glEditableText = scope.edit.content;
        if (scope.glEditableText === scope.edit.content) {
            scope.hideEdit = !scope.hideEdit;
            return;
        }
        $timeout(function() {
          // complete task if request fulfilled. timeout gives parent scope time to digest new glEditableText value
          scope.glOnBeforeSave().then(function (result) {
              scope.hideEdit = !scope.hideEdit;
              defer.resolve(result);
          }, function () {
              scope.glEditableText = originalText;
              defer.reject();});
        }, 10);
        return defer.promise;
      };
    }
  };
});

