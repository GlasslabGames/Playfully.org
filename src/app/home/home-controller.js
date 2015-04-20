angular.module( 'playfully.home', ['ui.router'])

.config(function config( $stateProvider ) {

  $stateProvider.state( 'root.home', {
    abstract: true,
    views: {
      'main@': {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.html'
      }
    },
    data:{
      pageTitle: 'Home'
    }
  })
  .state('root.home.default', {
    url: '',
    resolve: {
      allGamesInfo: function (GamesService) {
        return GamesService.all();
      },
      /*freeGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, {'price': 'Free'});
      },
      premiumGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, {'price': 'Premium'});
      },*/
      comingSoonGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, {'price': 'Coming Soon'});
      },
      gamesAvailableForLicense: function () {
        return true;
      }
    },
    views: {
      'catalog': {
        controller: 'GameCatalogCtrl',
        templateUrl: 'home/home-game-catalog.html'
      }
    }
  });
})

.controller( 'HomeCtrl', function ( $scope, $location, $log, $http, $window, $anchorScroll, ipCookie, Session) {

  $scope.subEmail = "";
  $scope.showSubscribeMessage = false;
  $scope.subscribeMessage = "";
  $scope.subscribe = function() {
    if( $scope.subEmail &&
        $scope.subEmail.length > 1) {
      $scope.showSubscribeMessage = true;
      $scope.subscribeMessage = "Sending...";
      $http.post('/api/v2/auth/newsletter/subscribe', {
        email: $scope.subEmail
      })
        .success(function() {
          $scope.subscribeMessage = "Thank you for Subscribing!";
        })
        .error(function(data) {
          $log.error(data);
        });
    }
  };

  $scope.myInterval = 6000;
  $scope.slides = [
    { image: 'home-banner-mission'},
    { image: 'home-banner-approach' },
    { image: 'home-banner-start'},
    { image: 'home-banner-results'}
  ];

  $scope.go = function(url){
    $location.path(url);
  };

  $scope.goToLink = function (path) {
      $window.open(path, '_blank');
  };

  $scope.goToAnchor = function(anchorId) {
    if ($location.hash() !== anchorId) {
      // anchorScroll will be automatically invoked when
      // $location.hash changes
      $location.hash(anchorId);
    } else {
      // otherwise we're already on that hash and need
      // to call it again to reposition
      $anchorScroll();
    }
  };

  $http.get('/api/v2/data/eventsCount')
    .success(function(data) {
      $scope.eventCount = data.eventCount;
    })
    .error(function(data) {
      $log.error(data); 
    });

});


