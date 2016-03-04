'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('buildController2', function ($scope, $uibModal) {

    $scope.models = {
        selected: null,
        templates: [
            //{ type: "item", id: 2, display_name: "Item" },
            { type: "textfield", id: 3, display_name: "Text Field", field_label: 'textField', field_required: true, field_disabled: false },
            { type: "radio", id: 2, display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ option_value: 0, option_title: "0" }, { option_value: 1, option_title: "1" }] },
            { type: "dropdown", id: 2, display_name: "Dropdown", field_label: 'dropdown', field_required: true, field_disabled: false, field_options: [{ option_value: 0, option_title: "option 0" }, { option_value: 1, option_title: "option 1" }] },
            { type: "container", id: 1, display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls : [] }
        ],
        forms: 
             [
                {
                    "type": "container",
                    "id": 1,
                    "field_label": "container",
                    "controls": [
                            {
                                "type": "textfield",
                                "id": "1", 
                                "field_label": "textField"
                            },
                            {
                                "type": "textfield",
                                "id": "2",
                                "field_label": "textField"
                            }
                        ]
                },
                {
                    "type": "textfield",
                    "id": "4",
                    "field_label": "textField"
                },
                {
                    "type": "textfield",
                    "id": "5",
                    "field_label": "textField"
                },
                {
                    "type": "textfield",
                    "id": "6",
                    "field_label": "textField"
                }
            ]
 
        
    };

    $scope.$watch('models.forms', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

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
                item: function () {
                    return angular.copy(item);
                },
                fields: function () {
                    // return all the fields on the form
                    return getFieldList($scope.models.forms, item, []);
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            // remove invalid conditions
            if (selectedItem.conditions) {
                var i = selectedItem.conditions.length
                while (i--) {
                    if (selectedItem.conditions[i].field_id == 0) {
                        selectedItem.conditions.splice(i, 1);
                    }
                }
            }
            angular.copy(selectedItem, $scope.models.selected);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    // get a flat list of fields
    var getFieldList = function (item, ignoreField, flattenFieldList ) {
        if (Array.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                flattenFieldList = getFieldList(item[i], ignoreField, flattenFieldList);
            }
        }
        else {
            if (item !== ignoreField) {
                flattenFieldList.push({
                    id: item.id,
                    type: item.type,
                    label: item.field_label
                });
            }
            // the current field 
            if (item.controls) {
                flattenFieldList = getFieldList(item.controls, ignoreField, flattenFieldList);
            }
        }
        return flattenFieldList;
    }


    $scope.remove = function (list, index) {
        list.splice(index, 1);
    };
});

//// Please note that $uibModalInstance represents a modal window (instance) dependency.
//// It is not the same as the $uibModal service used above.

//app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item) {

//    $scope.item = item;

//    $scope.ok = function () {
//        $uibModalInstance.close($scope.item);
//    };

//    $scope.cancel = function () {
//        $uibModalInstance.dismiss('cancel');
//    };
//});