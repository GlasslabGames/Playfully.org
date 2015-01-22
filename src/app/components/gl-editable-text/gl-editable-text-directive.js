angular.module('gl-editable-text', [])
.directive('glEditableText', function($compile,$q) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      glEditableText:'=',
      glOnBeforeSave:'='
    },
    template: "<div><div ng-click='editContent()' ng-show='hideMe' ng-transclude></div></div>"+"<div ng-hide='hideMe'><textarea ng-model='editableText' cols='85'rows='10'> </textarea>" + "<button ng-click='saveContent()'>save</button><button ng-click='goBackContent()'>cancel</button></div>",
    link: function(scope, element, attr) {
      // sets text area content
      scope.editableText = scope.glEditableText;
      scope.hideMe = true;
      scope.editContent = function () {
        scope.hideMe = false;
      };
      scope.goBackContent = function () {
        scope.editableText = scope.glEditableText;
        scope.hideMe = !scope.hideMe;
      };
      scope.saveContent = function() {
        var defer = $q.defer();
        // saves original text in case save fails
        var originalText = scope.glEditableText;
        // change content to text within text field
        scope.glEditableText = scope.editableText;
        scope.$apply();
        // request to save to database
        scope.glOnBeforeSave().then(function(result) {
          scope.hideMe = !scope.hideMe;
          defer.resolve(result);
        }, function() {
          $window.alert('Failed to save');
          console.log('failed to save');
          scope.glEditableText = originalText;
          defer.reject();
        });
        // pending
        // success
        // fail
        return defer.promise;
      };

      //element.on("click", function() {
      //  scope.hideMe = false;
      //});
      //var buttons = "<button ng-click='glOnBeforeSave'>save</button><button ng-click='goBackContent($event)'>cancel</button>";
      //var textArea = element.html() + "<div ng-hide='hideMe'>" + form + buttons + "</div>";
      //var linkFn = $compile(textArea)(scope);
    }
  };
});

