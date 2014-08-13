angular.module( 'instructor.tour', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'tourModal', {
    abstract: true,
    parent: 'instructorDashboard',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'lg'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('instructorDashboard');
      });
    }
  })
  .state( 'instructorTour', {
    parent: 'tourModal',
    url: '/instructor-tour',
    views: {
      'modal@': {
        controller: 'InstructorTourModalCtrl',
        templateUrl: 'instructor/tour/tour.html'
      }
    },
    data:{
      pageTitle: 'Instructor Tour',
      authorizedRoles: ['instructor']
    }
  });
})

.controller( 'InstructorTourModalCtrl', function ( $scope, $log ) {

  $scope.slides = [
    { id: 1, text: "Applause and happy dance! You are now a registered user and have access to all the wonders this site has to offer, including student management and reporting tools, professional development videos and more!",
      image: { url: "/assets/tour-1.png", width: 382, height: 382}
    },
    { id: 2, 
      video: {
        url: 'http://127.0.0.1:8001/assets/reporting-tools.mov',
        width: 480,
        height: 320
      }
    },
    { id: 3,
      video: {
        url: 'http://127.0.0.1:8001/assets/student-management.mov',
        width: 480,
        height: 320
      }
    }
  ];


});


