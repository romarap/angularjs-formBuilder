'use strict';

app.controller('aboutController', function ($scope) {
    $scope.message = "Now viewing about!";
    $scope.models = {
        selected: null,
        templates: [
            { type: "item", id: 2 },
            { type: "container", id: 1, columns: [[], []] }
        ],
    //    dropzones: {
    //        "A": [

    //            {
    //                "type": "item",
    //                "id": "6"
    //            }
    //        ],
    //        "B": [
    //            {
    //                "type": "item",
    //                "id": "8"
    //            },

    //            {
    //                "type": "item",
    //                "id": 16
    //            }
    //        ]
    //    }
    //};
        dropzones: [
            {
                tabLabel: "A",
                controls: [{
                    "type": "item",
                    "id": "6"
                },
                {
                    "type": "item",
                    "id": "8"
                }]
            },
            {
                tabLabel: "B",
                controls: [{
                    "type": "item",
                    "id": "7"
                }]
            }
        ]
    };

    $scope.$watch('models.dropzones', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    // create new field button click
    $scope.addNewTab = function () {
        var newTab = {
            tabLabel: "C",
            controls: [{
                "type": "item",
                "id": "6"
            }]
        };

        $scope.models.dropzones.push(newTab);
    }

});