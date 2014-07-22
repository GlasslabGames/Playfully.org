angular.module( 'instructor.profile', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'profileModal', {
    abstract: true,
    parent: 'instructorDashboard',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'sm'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('instructorDashboard');
      });
    }
  })
  .state( 'editProfile', {
    parent: 'profileModal',
    url: '/edit-profile',
    views: {
      'modal@': {
        controller: 'EditProfileModalCtrl',
        templateUrl: 'instructor/profile/profile-edit.html'
      }
    },
    data:{
      pageTitle: 'Edit Profile',
      authorizedRoles: ['instructor']
    },
    resolve: {
      user: function(UserService) {
        return UserService.currentUser();
      },
    }
  });
})

.controller( 'EditProfileModalCtrl', function ( $scope, $rootScope, $log, user, UserService ) {

  user.name = user.firstName + ' ' + user.lastName;
  $scope.user = user;

  $log.info($scope.user);

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
          $state.go('home', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };
});




