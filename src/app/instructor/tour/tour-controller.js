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
    { id: 1, text: "description for slide 1", image: "http://www.blackberry-wallpapers.com/uploads/allimg/110423/2-1104231551070-L.png" },
    { id: 2, text: "some text for slide 2", image: "http://blackberry-wallpapers.com/uploads/allimg/101227/2-10122H133520-L.jpg" },
    { id: 3, text: "what you see in the 3rd slide", image: "http://www.blackberrygood.com/uploads/allimg/110531/2-110531112T10-L.jpg" },
    { id: 4, text: "and that's a wrap!", image: "http://www.dertz.in/wallpapers/files/Alone%20Android%20480x320-982.jpg" }
  ];


});


