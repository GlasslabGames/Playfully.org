angular.module( 'instructor.reports')

.config(function ( $stateProvider, USER_ROLES) {
    $stateProvider.state('modal-xlg.standardsInfo', {
      url: '/reports/details/standards/game/:gameId/:type',
      data:{
        pageTitle: 'Standards Report'
      },
      resolve: {
      },
      views: {
        'modal@': {
          templateUrl: function($stateParams) {
            return 'instructor/reports/standards/_modal-' + $stateParams.type + '.html';
          },
          controller: function($scope, $log) {

          }
        }
      }
    });
})

.controller( 'StandardsCtrl',
  function($scope, $rootScope, $log, $state, $stateParams, $timeout, defaultCourse, myGames, defaultGame, REPORT_CONSTANTS) {

    $scope.state = {
      showStandardsDescriptions: true
    };

    $scope.games.selectedGameId = defaultGame.gameId;

    $scope.games.options = {};
    angular.forEach(myGames, function(game) {
        $scope.games.options[''+game.gameId] = game;
    });

    $scope.getLabelInfo = function(label, type) {
        return REPORT_CONSTANTS.legend[label][type];
    };

    if(!$scope.reportInfo) {
      $scope.reportInfo = {
        labels: []
      };
    }
});

