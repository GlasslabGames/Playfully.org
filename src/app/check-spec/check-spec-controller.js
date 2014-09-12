// this module contains:
// 1. the state for check-spec.html
// 2. also the directives within check-spec: monitor-application-directive, monitor-panel-directive

angular.module( 'playfully.checkSpec', [
  'ui.router',
  'checkSpec'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'checkSpec', {
    url: '/check',
    views: {
      "main": {
        controller: 'CheckCtrl',
        templateUrl: 'check-spec/check-spec.html'
      }
    }
  });
})

.controller( 'CheckCtrl', function ($scope) {

});


