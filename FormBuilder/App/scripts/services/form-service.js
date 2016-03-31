'use strict';
var itemId = 1;

app.service('FormService', function FormService($http, $q, $timeout) {

    var formsJsonPath = './static-data/fulldetails.json';
    var listFormsJsonPath = './static-data/list_forms.json';
    var listFormControlsJsonPath = './static-data/list_formcontrols.json';
   // var getForm = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchTieTree?formId=";
    var getForm = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchForm?formId=";
    var listForms = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchForms";
    var saveForm = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/SaveForm";

    return {
        sendAPI: function (api) {
            var self = this;
            return $http({
                method: "GET",
                url: api,
                data: '',
                timeout : 5000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function mySuccess(response) {
                return apiHelper.processResponse(response);
            }, function myError(reason) {
                return reason;
            });
        },

        form: function (tieId) {

            if (tieId > 0) {
                var api = getForm + tieId;

                return this.sendAPI(api);
            }

            // added error injection for testing 
            var path = formsJsonPath;

            var promise = $http.get(path),
                deferObject = deferObject || $q.defer();

            promise.then(
              // OnSuccess function
              function (response) {
                  // This code will only run if we have a successful promise.
                  var requestedForm = {};
                  angular.forEach(response.data, function (form) {
                      if (form.tieId == tieId) requestedForm = {
                          status: 200,
                          statusText: "ok",
                          data: form
                      };
                  });
                  deferObject.resolve(requestedForm);
              },
              // OnFailure function
              function (reason) {
                  // This code will only run if we have a failed promise.
                  deferObject.reject({
                      status: 404,
                      statusText: reason,
                      data: null
                  });
              });

            return deferObject.promise;
        },
        forms: function () {
            //////////return $http.get(listFormsJsonPath).then(function (response) {
            //////////    return response.data;;
            //////////});
            ////////// currently just dummy function
            ////////return $timeout(function () { }, 500).then(function () {
            ////////    return $http.get(listFormsJsonPath).then(function (response) {
            ////////        return response.data;;
            ////////    });
            ////////});
            var api = listForms;
            return this.sendAPI(api);
        },

        save: function (form) {
            var api = saveForm;
            return $http({
                method: "POST",
                url: api,
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ form: form })
            });
        }
        ,
        getNewId: function () {
            return "newId:" + itemId++;
        }
        ,
        resetNewId: function () {
            itemId = 1;
        }
    };
});
