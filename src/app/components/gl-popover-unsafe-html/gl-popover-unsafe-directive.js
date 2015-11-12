angular.module("gl-popover-unsafe-html", [])

.directive("popoverHtmlUnsafePopup", function () {
    return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "components/gl-popover-unsafe-html/gl-popover-unsafe-popup.html"
    };
})

.directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
    return $tooltip("popoverHtmlUnsafe", "popover", "click");
}]);