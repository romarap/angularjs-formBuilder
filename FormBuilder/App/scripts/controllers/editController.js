'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('editController', function ($scope, $uibModal) {
    //constants
    var CREATED = 'create';
    var UPDATED = 'update';
    var DELETE = 'delete';

    $scope.models = {
        selected: null,
        templates: [
            //{ type: "item", id: 2, display_name: "Item" },
            { id: "", status: CREATED, type: "textfield", display_name: "Text Field", field_label: 'textField', field_required: true, field_disabled: false },
            { id: "", status: CREATED, type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
            { id: "", status: CREATED, type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
            { id: "", status: CREATED, type: "dropdown", display_name: "Dropdown", field_label: 'dropdown', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "option 0" }, { value: 1, label: "option 1" }] },
            { id: "", status: CREATED, type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
            { id: "", status: CREATED, type: "pagebreak", display_name: "Page Break", field_label: 'pagebreak' }
        ],
        delected: [],
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
                                "field_type": "text",
                                "field_label": "text a",

                            },
                            {
                                "id": "3",
                                "type": "textfield",
                                "field_label": "text b"
                            }
                    ]
                },
                {
                    "id": "4",
                    "type": "textfield",
                    "field_label": "text c"
                },
                {
                    "id": "5",
                    "type": "textfield",
                    "field_label": "text d"
                },
                {
                    "id": "6",
                    "type": "textfield",
                    "field_label": "text e"
                }
             ]
 
        
    };

    $scope.dropCallback = function (event, index, item) {
        if (item) {
            if (!item.id) {
                item.id = "newid-" + $scope.models.newId++;
                item.status = CREATED;
            }
            if (item.status != CREATED) {
                item.status = UPDATED;
            }
        }
        return item;
    };

    $scope.trashedCallback = function (event, index, item) {
        if (item) {
            var deletedItems = getFieldList(item, null, {});
            var conflicts = getDeleteConflicts(deletedItems);
            if (conflicts.length > 0) {
                var msg = "Deleting this item will cause conflicts \n\n";
                for (i=0; i < conflicts.length; i++)
                {
                    msg += conflicts[i] + "\n";
                }
                alert(msg);
                return null;
            } else {
                // place items in deleted list
                for (var i = 0; i < deletedItems.length; i++) {
                    $scope.models.delected.push(deletedItems[i]);
                }
                return item;
            }
        }
        return item;
    };

    var getDeleteConflicts = function (deletedItems) {
        var conflicts = [];
        var remainingItems = getFieldList($scope.models.forms, deletedItems, {});
        for (var key in remainingItems) {
            var item = remainingItems[key];
            if (item.conditions) {
                for (var j = 0; j < item.conditions.length; j++) {
                    var field_id = item.conditions[j].field_id;
                    if (field_id in deletedItems) {
                        conflicts.push("item '" + item.field_label + "' has condition on the deleted item '" + deletedItems[field_id].field_label + "'");
                    }
                }
            }
        }
        return conflicts;
    }

 

    $scope.$watch('models.forms', function (model) {
        $scope.formAsJson = angular.toJson(model, true);
    }, true);

    $scope.$watch('models.delected', function (model) {
        $scope.deletedItemsAsJson = angular.toJson(model, true);
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
                    var ignoreItem = {};
                    ignoreItem[item.id] = item;
                    return getFieldList($scope.models.forms, ignoreItem, {});
                }
            },
        });

        modalInstance.result.then(function (selectedItem) {
            // has item changed ?
            if (JSON.stringify(selectedItem) !== JSON.stringify(angular.copy($scope.models.selected))) {
                angular.copy(selectedItem, $scope.models.selected);
                $scope.models.selected.status = UPDATED;
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    // get a flat list of fields but ignore fields in the ignore list
    var getFieldList = function (root, ignoreFields, flattenFieldList) {
        // ensure valid ignore fields - not null
        if (!ignoreFields)
        {
            ignoreFields = {};
        }

        if (Array.isArray(root)) {
            for (var i = 0; i < root.length; i++) {
                flattenFieldList = getFieldList(root[i], ignoreFields, flattenFieldList);
            }
        }
        else {
            if (!(root.id in ignoreFields)) { 
               flattenFieldList[root.id] = angular.copy(root);
            }
            // the current field 
            if (root.controls) {
                flattenFieldList = getFieldList(root.controls, ignoreFields, flattenFieldList);
            }
        }
        return flattenFieldList;
    };


    //var containsItem = function (itemList, item) {
    //    if (Array.isArray(itemList)) {
    //        for (var i = 0; i < itemList.length; i++) {
    //            if (item === itemList[i]) {
    //                return true;
    //            }
    //        }
    //    }
    //    return false;
    //}

    //var containsItemById = function (itemList, id) {

    //    if (Array.isArray(itemList)) {
    //        for (var i = 0; i < itemList.length; i++) {
    //            if (id == itemList[i].id) {
    //                return true;
    //            }
    //        }
    //    }
    //    return false;
    //}
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

