angular.module( 'playfully.profile', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'profileModal', {
    abstract: true,
    parent: 'home',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'sm'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('home');
      });
    }
  })
  .state( 'editProfile', {
    parent: 'profileModal',
    url: '/edit-profile',
    views: {
      'modal@': {
        controller: 'EditProfileModalCtrl',
        templateUrl: 'profile/profile-edit.html'
      }
    },
    data:{
      pageTitle: 'Edit Profile',
      authorizedRoles: ['instructor', 'student']
    },
    resolve: {
      user: function(UserService) {
        return UserService.currentUser();
      },
    }
  });
})

.controller( 'EditProfileModalCtrl', function ( $scope, $rootScope, $state, $log, $timeout, user, UserService ) {

  if (user.role == 'instructor') {
    user.name = user.firstName + ' ' + user.lastName;
  }
  $scope.user = angular.copy(user);

  $scope.updateProfile = function(user) {
    if (user.name && user.name.indexOf(' ') > -1) {
      firstName = user.name.substr(0, user.name.indexOf(' '));
      user.lastName = user.name.substr(user.name.indexOf(' ')+1);
      user.firstName = firstName;
    }
    UserService.update(user)
      .success(function(data, status, headers, config) {
        $rootScope.modalInstance.close();
        return $timeout(function () {
          $state.go(user.role + 'Dashboard', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };
});
