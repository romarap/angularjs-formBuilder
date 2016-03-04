'use strict';

app.controller('buildController', function ($scope, $uibModal) {
    $scope.models = {
        // field
        selected: null,
        templates: [
            { type: "textfield", id: 3, display_name: "Text Field", field_label: 'textField', field_required: true, field_disabled: false },
            { type: "radio", id: 2, display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ option_value: 0, option_title: "0" }, { option_value: 1, option_title: "1" }] },
            { type: "dropdown", id: 2, display_name: "Dropdown", field_label: 'dropdown', field_required: true, field_disabled: false, field_options: [{ option_value: 0, option_title: "option 0" }, { option_value: 1, option_title: "option 1" }] },
            { type: "container", id: 1, display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, fields : [] }
        ],
         tabs: [
            {
                properties: {
                    tabLabel: "First Tab",
                    active: true
                },
                controls: [{
                    "type": "textfield",
                    "id": "6",
                    "field_label" : "label 1",
                    "field_required" : false
                },
                {
                    "type": "textfield",
                    "id": "8",
                    "field_label" : "label 2",
                }]
            },
            {
                properties: {
                    tabLabel: "Second Tab",
                    active: true
                },
                controls: [{
                    "type": "textfield",
                    "id": "7",
                    "field_label" : "label 3",
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
            properties: {
                tabLabel: "New Tab",
                active: true
            },
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


    // create new field button click
    $scope.editTab = function (event, index) {
        event.preventDefault();
        event.stopPropagation();
        var selectedTab = $scope.models.tabs[index];
        $scope.openTabDlg("sm", selectedTab.properties);
    };
    
    // Dialog open
    $scope.open = function ($event, size, item) {
        event.preventDefault();
        event.stopPropagation();

        $scope.models.selected = item;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'fieldPropertiesDialog.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                item : function () {
                    return angular.copy(item);
                },
                fields : null
            }
        });

        modalInstance.result.then(function (selectedItem) {
            angular.copy(selectedItem, $scope.models.selected);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Dialog open
    $scope.openTabDlg = function (size, item) {
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'tabPropertiesDialog.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                item: function () {
                    return angular.copy(item);
                },
                fields : null
            }
        });

        modalInstance.result.then(function (selectedItem) {
            angular.copy(selectedItem, item);
        });
    };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, fields) {
    $scope.fields = fields;
    $scope.item = item;
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addCondition = function () {
        if (!$scope.item.conditions) {
            $scope.item.conditions = [];
        }
        $scope.item.conditions.push({ field_id: 0, value: "" });
    };
});
