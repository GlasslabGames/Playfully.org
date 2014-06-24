describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( function() {
      module( 'playfully' );
      module( 'auth' );
    });



    beforeEach( inject( function( $controller, _$location_, $rootScope, _Auth_ ) {
      $location = _$location_;
      Auth = _Auth_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl', {
        $location: $location,
        $scope: $scope,
        Auth: Auth });
    }));

    // it( 'should pass a dummy test', inject( function() {
    //   expect( AppCtrl ).toBeTruthy();
    // }));
  });
});

