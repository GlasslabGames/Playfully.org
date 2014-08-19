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

.controller( 'InstructorTourModalCtrl', function ( $scope, $log, $sce ) {

  $scope.trustSrc = function(src) { return $sce.trustAsResourceUrl(src); };

  $scope.slides = [
    { id: 1, text: "Applause and happy dance! You are now a registered user and have access to all the wonders this site has to offer, including student management and reporting tools, professional development videos and more!",
      image: { url: "/assets/tour-1.png", width: 382, height: 382}
    },
    { id: 2, 
      destUrl: 'http://vimeo.com/103535906',
      video: {
        url: '//player.vimeo.com/video/103535906',
        title: 'Reporting tools',
        width: 480,
        height: 320
      }
    },
    {
      id: 3,
      destUrl: 'http://vimeo.com/103535905',
      video: {
        url: '//player.vimeo.com/video/103535905',
        title: 'Student management',
        width: 480,
        height: 320
      }
    },
    {
      id: 4,
      destUrl: 'http://vimeo.com/103535907',
      video: {
        url: '//player.vimeo.com/video/103535907',
        title: 'Instructional Resources',
        width: 480,
        height: 320
      }
    }
  ];


});


