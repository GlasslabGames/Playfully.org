angular.module( 'playfully.profile', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'modal.profile', {
    url: '/edit-profile',
    views: {
      'modal@': {
        controller: 'EditProfileModalCtrl',
        templateUrl: 'profile/profile-edit.html'
      }
    },
    data:{
      pageTitle: 'Edit Profile',
      authorizedRoles: ['student','instructor','manager','developer','admin']
    },
    resolve: {
      user: function(UserService) {
        return UserService.currentUser();
      }
    }
  });
  /*
  .state( 'editProfile', {
    parent: 'profileModal',
    url: 'edit-profile',
    views: {
      'modal@': {
        controller: 'EditProfileModalCtrl',
        templateUrl: 'profile/profile-edit.html'
      }
    },
    data:{
      pageTitle: 'Edit Profile',
      authorizedRoles: ['student','instructor','manager','developer','admin']
    },
    resolve: {
      user: function(UserService) {
        return UserService.currentUser();
      }
    }
  });*/
})

.controller( 'EditProfileModalCtrl', function ( $scope, $rootScope, $state, $log, $timeout, user, UserService ) {

  if (user.role == 'instructor') {
    user.name = user.firstName + (user.lastName ? ' ' + user.lastName : '');
  }
  $scope.user = angular.copy(user);

  // Make sure these fields are empty
  $scope.user.password = '';
  $scope.user.confirm = '';

  // Default standards
  $scope.user.standards = user.standards;
  $scope.defaultStandards = [ "CCSS", "TEKS" ];

  $scope.updateProfile = function(user) {
    if (user.name) {
      // name has space
      if(user.name.indexOf(' ') > -1) {
        firstName = user.name.substr(0, user.name.indexOf(' '));
        user.lastName = user.name.substr(user.name.indexOf(' ')+1);
        user.firstName = firstName;
      } else {
        // no space then no lastname and first is the whole name
        user.firstName = user.name;
        user.lastName = "";
      }
    }
    UserService.update(user)
      .success(function(data, status, headers, config) {
        $scope.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
        $scope.user.errors = [data.error];
      });
  };
});
