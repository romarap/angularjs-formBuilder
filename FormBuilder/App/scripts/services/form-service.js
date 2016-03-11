'use strict';

app.service('FormService', function FormService($http, $timeout) {

    var formsJsonPath = './static-data/fulldetails.json';
    var listFormsJsonPath = './static-data/list_forms.json';

    return {
        
        form:function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            return $http.get(formsJsonPath).then(function (response) {
                var requestedForm = {};
                angular.forEach(response.data, function (form) {
                    if (form.id == id) requestedForm = form;
                });
                return requestedForm;
            });
        },
        forms: function() {
            //return $http.get(listFormsJsonPath).then(function (response) {
            //    return response.data;;
            //});
            // currently just dummy function
            return $timeout(function () { }, 500).then(function () {
                return $http.get(listFormsJsonPath).then(function (response) {
                    return response.data;;
                });
            });
        },
        save: function (form) {
            // currently just dummy function
            return $timeout(function () { }, 2000).then(function () {
                return;
            });
        }
    };
});
