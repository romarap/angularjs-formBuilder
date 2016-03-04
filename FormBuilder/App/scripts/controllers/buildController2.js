'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('buildController2', function ($scope, $uibModal) {

    $scope.models = {
        selected: null,
        templates: [
            { type: "item", id: 2 },
            { type: "container", id: 1, columns: [[]] }
        ],
        dropzones: 
             [
                {
                    "type": "container",
                    "id": 1,
                    "columns": [
                        [
                            {
                                "type": "item",
                                "id": "1"
                            },
                            {
                                "type": "item",
                                "id": "2"
                            }
                        ]
                    ]
                },
                {
                    "type": "item",
                    "id": "4"
                },
                {
                    "type": "item",
                    "id": "5"
                },
                {
                    "type": "item",
                    "id": "6"
                }
            ]
 
        
    };

    $scope.$watch('models.dropzones', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});