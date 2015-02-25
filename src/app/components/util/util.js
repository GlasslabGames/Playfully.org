angular.module('util', ['session', 'ipCookie'])
    .factory('UtilService', function () {
        return {
            submitFormRequest: function (requestObj, requestFunc, successFunc, errorFunc) {
                var request = {
                    success: false,
                    errors: [],
                    successes: [],
                    isSubmitting: false
                };
                request.isSubmitting = true;
                return requestFunc().then(function (response) {
                    request.errors = [];
                    request.isSubmitting = false;
                    request.success = true;
                    requestObj = _.merge(requestObj, request);
                    if (successFunc) {
                        successFunc(response);
                    }
                }, function(response) {
                    request.isSubmitting = false;
                    request.errors = [];
                    request.errors.push(response.data.error);
                    requestObj = _.merge(requestObj, request);
                    if (errorFunc) {
                        errorFunc(response);
                    }
                });
            }
        };
    });