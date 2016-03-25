'use strict';
var itemId = 1;

app.service('FormService', function FormService($http, $q, $timeout) {

    var formsJsonPath = './static-data/fulldetails.json';
    var listFormsJsonPath = './static-data/list_forms.json';
    var listFormControlsJsonPath = './static-data/list_formcontrols.json';
    var getForm = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchTieTree?formId=";
    var listForms = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchForms";
    var listControls = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchControlsBig";
    var getControl = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchControl?controlId=";

    return {
        formControls: function () {
            ////////////return $http.get(listFormsJsonPath).then(function (response) {
            ////////////    return response.data;;
            ////////////});
            //////////// currently just dummy function
            //////////return $timeout(function () { }, 500).then(function () {
            //////////    return $http.get(listFormControlsJsonPath).then(function (response) {
            //////////        return response.data;;
            //////////    });
            //////////});
            var api = listControls;
            return $http({
                method: "GET",
                url: api,
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function mySuccess(response) {
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
                return response.data;
            }, function myError(reason) {
                return reason;
            });
        },
        formControl: function (id) {
            var api = getControl + id;
            return $http({
                method: "GET",
                url: api,
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function mySuccess(response) {
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
                return response.data;
            }, function myError(reason) {
                return reason;
            });
        },
        form: function (tieId) {

            if (tieId > 0) {
                var api = getForm + tieId;
                return $http({
                    method: "GET",
                    url: api,
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function mySuccess(response) {
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
                    return response.data;
                }, function myError(reason) {
                    return reason;
                });
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
                      data: null});
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
            return $http({
                method: "GET",
                url: api,
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function mySuccess(response) {
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
                return response.data;
            }, function myError(reason) {
                return reason;
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
