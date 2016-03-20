'use strict';
var itemId = 1;

app.service('FormService', function FormService($http, $q, $timeout) {

    var formsJsonPath = './static-data/fulldetails.json';
    var listFormsJsonPath = './static-data/list_forms.json';
    var listFormControlsJsonPath = './static-data/list_formcontrols.json';

    return {
        formControls: function () {
            //return $http.get(listFormsJsonPath).then(function (response) {
            //    return response.data;;
            //});
            // currently just dummy function
            return $timeout(function () { }, 500).then(function () {
                return $http.get(listFormControlsJsonPath).then(function (response) {
                    return response.data;;
                });
            });
        },
        form: function (id) {
            // added error injection for testing 
            var path = formsJsonPath;
            if (id == 3) {
                path += "00";
            }
            var promise = $http.get(path),
                deferObject = deferObject || $q.defer();

            promise.then(
              // OnSuccess function
              function (response) {
                  // This code will only run if we have a successful promise.
                  var requestedForm = {};
                  angular.forEach(response.data, function (form) {
                      if (form.id == id) requestedForm = form;
                  });
                  deferObject.resolve(requestedForm);
              },
              // OnFailure function
              function (reason) {
                  // This code will only run if we have a failed promise.
                  deferObject.reject(reason);
              });

            return deferObject.promise;
        },
        forms: function () {
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
        ,
        getNewId: function () {
            return "newid -" + itemId++;
        }
        ,
        resetNewId: function () {
            itemId = 1;
        }
    };
});
