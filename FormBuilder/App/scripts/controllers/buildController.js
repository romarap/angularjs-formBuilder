'use strict';

app.controller('buildController', function ($scope) {
    $scope.models = {
        selected: null,
        templates: [
            { type: "textfield", id: 3, displayName: "Text Field", fieldTitle: 'textField', fieldRequired: true, fieldDisabled: false },
            { type: "radio", id: 2, displayName: "Radio Buttons", fieldTitle: 'option', fieldRequired: true, fieldDisabled: false, fieldOptions: [{ optionValue: 0, optionTitle: "0" }, { optionValue: 1, optionTitle: "1" }] },
            { type: "container", id: 1, displayName: "Group", fieldTitle: 'container', fieldRequired: true, fieldDisabled: false, columns: [[], []] }
        ],
         tabs: [
            {
                tabLabel: "Tab 1",
                active: true,
                controls: [{
                    "type": "textfield",
                    "id": "6"
                },
                {
                    "type": "textfield",
                    "id": "8"
                }]
            },
            {
                tabLabel: "Tab 2",
                controls: [{
                    "type": "textfield",
                    "id": "7"
                }]
            }
        ]
    };

    $scope.$watch('models.tabs', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    // create new field button click
    $scope.addTab = function (event, index) {
        event.preventDefault();
        event.stopPropagation();

        var newTab = {
            tabLabel: "New Tab",
            active: true,
            controls: []
        };

        $scope.models.tabs.push(newTab);
    }

    // create new field button click
    $scope.removeTab = function (event, index) {
        event.preventDefault();
        event.stopPropagation();
        $scope.models.tabs.splice(index, 1);
    };
        

});