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

.constant('THIRD_PARTY_AUTH', {
  edmodo: true,
  icivics: false
})

.constant('USER_ROLES', {
  all: '*',
  student: 'student',
  instructor: 'instructor',
  manager: 'manager',
  admin: 'admin'
});

