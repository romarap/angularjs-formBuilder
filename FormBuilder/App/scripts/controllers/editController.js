'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('editController', function ($scope, $uibModal) {

    $scope.models = {
        selected: null,
        templates: [
            //{ type: "item", id: 2, display_name: "Item" },
            { id: "", type: "textfield",  display_name: "Text Field", field_label: 'textField', field_required: true, field_disabled: false },
            { id: "", type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
            { id: "", type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
            { id: "", type: "dropdown", display_name: "Dropdown", field_label: 'dropdown', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "option 0" }, { value: 1, label: "option 1" }] },
            { id: "", type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
            { id: "", type: "pagebreak", display_name: "Page Break", field_label: 'pagebreak' }
        ],
        newId: 1,
        forms: 
             [
                {
                    "id": "1",
                    "type": "container",
                    "field_label": "container",
                    "controls": [
                            {
                                "id": "2",
                                "type": "textfield",
                                "field_label": "textField"
                            },
                            {
                                "id": "3",
                                "type": "textfield",
                                "field_label": "textField"
                            }
                        ]
                },
                {
                    "id": "4",
                    "type": "textfield",
                    "field_label": "textField"
                },
                {
                    "id": "5",
                    "type": "textfield",
                    "field_label": "textField"
                },
                {
                    "id": "6",
                    "type": "textfield",
                    "field_label": "textField"
                }
            ]
 
        
    };

    $scope.dropCallback = function (event, index, item) {
        if (!item.id) {
            item.id = "newid-" + $scope.models.newId++;
        }
        return item;
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
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item, fields) {
    $scope.fields = fields;
    $scope.item = item;

    // function to submit the form after all validation has occurred            
    $scope.submitForm = function (isValid) {

        // check to make sure the form is completely valid
        if (isValid) {
            $uibModalInstance.close($scope.item);
        }

    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

