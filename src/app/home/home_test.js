/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('HomeCtrl', function() {
  beforeEach(inject(function($injector) {
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('HomeCtrl', {
        '$scope': $scope
      });
    };

  }));
});
// describe( 'home section', function() {
//   beforeEach( module( 'playfully.home' ) );
// 
//   it( 'should have a dummy test', inject( function() {
//     expect( true ).toBeTruthy();
//   }));
// });
// 
// 
