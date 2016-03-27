'use strict';


var apiHelper = new function () {

    this.processResponse = function (response) {
            try {
                if (response.data == null || response.data.d == null) {
                    return {
                        status: 404,
                        statusText: "Not Found",
                        data: null
                    };
                }
                return {
                    status: 200,
                    statusText: "ok",
                    data: response.data.d
                };
            }
            catch (e) {
                return {
                    status: 500,
                    statusText: e.message,
                    data: null
                };
            }
    },

    this.sendAPI = function ($http,api,cache) {
        var self = this;
        return $http({
            method: "GET",
            url: api,
            data: '',
            timeout: 5000,
            headers: {
                "Content-Type": "application/json"
            },
            cache : cache,
        }).then(function mySuccess(response) {
            return apiHelper.processResponse(response);
        }, function myError(reason) {
            return reason;
        });
    }

   
}