angular.module('util', ['session', 'ipCookie'])
    .factory('UtilService', function ($q) {
        return {
            submitFormRequest: function (requestObj, requestFunc, successFunc, errorFunc) {
                requestObj.isSubmitting = true;
                return requestFunc().then(function (response) {
                    requestObj.errors = [];
                    requestObj.isSubmitting = false;
                    requestObj.success = true;
                    if (successFunc) {
                        successFunc(response);
                    }
                }, function(response) {
                    requestObj.isSubmitting = false;
                    requestObj.errors = [];
                    requestObj.errors.push(response.data.error);
                    if (errorFunc) {
                        errorFunc(response);
                    }
                });
            }
        };
    });