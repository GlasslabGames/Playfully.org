angular.module('playfully.config', [])

.constant('API_BASE', '/api/v2')

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth:login-success',
  loginFailure: 'auth:login-failure',
  logoutSuccess: 'auth:logout-success',
  sessionTimeout: 'auth:session-timeout',
  notAuthenticated: 'auth:not-authenticated',
  notAuthorized: 'auth:not-authorized',
  userRetrieved: 'auth:user-retrieved'
})

.constant('ERRORS', {
  'general': "We encountered an error. Please try again."
})

/**
 * Use FEATURES.can[DoSomething] to create toggles for app features
 * that can be turned on / off depending whether they're ready.
 * These are surfaced through $rootScope.features.can[DoSomething]
 **/
.constant('FEATURES', {
  'canRemoveWO': false
})

.constant('CHECKLIST', {
  'visitGameCatalog': 'check-list:visit-game-catalog',
  'createCourse': 'check-list:create-class',
  'inviteStudents': 'check-list:invite-students',
  'closeFTUE': 'check-list:close-ftue'
})

.constant('THIRD_PARTY_AUTH', {
  edmodo: true,
  icivics: true
})

.constant('USER_ROLES', {
  all:					'*',
  student:				'student',
  instructor:			'instructor',
  manager:				'manager',			// role was deprecated, no longer supported
  developer:			'developer',
  admin: 				'admin',
  reseller:				'reseller',
  reseller_candidate:	'res-cand'
})

.constant('STRIPE', {
  test: {
      publishableKey: "pk_test_0T7q98EI508iQGcjdv1DVODS"
  },
  live: {
      publishableKey: "pk_live_Z5Uhx2i2CAxZsRyD03iPG9In"
  }
})

.constant('EMAIL_VALIDATION_PATTERN', {
	test: /^[-0-9a-z.+_]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i,
	live: /^[-0-9a-z._]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i
})

.config(function($logProvider){
  // $logProvider.debugEnabled(false);
});

