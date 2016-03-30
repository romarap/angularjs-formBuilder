'use strict';


app.service('controlsService', function ($http, $q, $timeout, $cacheFactory) {
    var listControls = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchControlsBig";
    var getControl = "http://81.109.89.222/QansMark/Anon/EditorSvc.asmx/FetchControl?controlId=";

    // create cache object. The cache id must be unique
    var controlCache = $cacheFactory('controlsService');

    var convertControlsListToMap = function (controls) {
        // convert to map
        var controlsMap = {};
        for (var i = 0; i < controls.length; i++) {
            var control = angular.copy(controls[i]);

            // convert attributes to map
            control.theAttributes = {};
            if (controls[i].theAttributes) {
                for (var j = 0; j < controls[i].theAttributes.length; j++) {
                    var attribute = angular.extend(controls[i].theAttributes[j]);
                    control.theAttributes[attribute.type] = attribute;
                }
            }
            controlsMap[controls[i].controlId] = control;
        }
        return controlsMap;
    }
    //return {

    //    formControls: function () {
    //        var api = listControls;
    //        return apiHelper.sendAPI($http, api, listCache);
    //    },
    //    formControl: function (id) {
    //        var api = getControl + id;
    //        return apiHelper.sendAPI($http, api, null);
    //    },
    //    //save: function(data) {
    //    //    return $http.post( myFooUrl, { cache: fooCache }).then(function() {
    //    //        listCache.removeAll() ;
    //    //    });


    //    //}
    //}

    return {
        formControls: function (useCache) {
            var deferred = $q.defer();

            if (useCache) {
                if (controlCache.get("list")) {
                    var data = controlCache.get("list");
                    data.cached = true;
                    deferred.resolve(data);
                    return deferred.promise;
                }
            }
            var api = listControls;
            $http({
                method: "GET",
                url: api,
                data: '',
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function success(response) {         
                var controlsResponse = apiHelper.processResponse(response);
                if (controlsResponse.status == 200) {
                    controlsResponse.data = convertControlsListToMap(controlsResponse.data);
                    controlCache.put("list", controlsResponse);
                }
                deferred.resolve(controlsResponse);
            }, function error(reason) {
                deferred.reject(reason);
            });

            return deferred.promise;
        },

        formControl: function (id) {
            var api = getControl + id;
            return apiHelper.sendAPI($http, api, null);
        },
        //save: function(data) {
        //    return $http.post( myFooUrl, { cache: fooCache }).then(function() {
        //        listCache.removeAll() ;
        //    });


        //}
    };
});
