/**
 * Created by louis on 4/6/16.
 */

angular.module('playfully.error', ['ui.router'])
.config(function config( $stateProvider ) {
    $stateProvider.state('serverError', {
        views: {
            'main@': {
                controller: 'ErrorCtrl',
                templateUrl: 'error/error.html'
            }
        },
        data:{
            pageTitle: 'Error'
        }
    });
})
.controller('ErrorCtrl', function($scope, $rootScope) {
    $scope.error = $rootScope.currentError;
});