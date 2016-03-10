'use strict';

//constants
var CREATED = 'create';
var UPDATED = 'update';
var DELETE = 'delete';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('editController', function ($scope, FormService, $routeParams, $uibModal) {
    
    $scope.models = {
        selected: null,
        delected: [],
        newId: 1,
        dirty: false,
        form: {} 
    };

    $scope.models.form.id = $routeParams.id;
    if ($scope.models.form.id) {
        // read form with given id
	    FormService.form($routeParams.id).then(function(form) {
		    $scope.models.form = form;
        });
    }
    else
    {
        $scope.models.form = {
            "name": "--New--",
            "controls": []
        };
    }


    $scope.save = function () {
        if ($scope.models.dirty)
        {
            $scope.showMessage("Saving Form.....");

            FormService.save($scope.models.form).then(function () {
                $scope.hideMessage();
            });
        }
    };

    $scope.showMessage = function (message) {
        var $modal = $('.message-bar'),
            $alertinfo = $('.alert-info');
        $alertinfo[0].innerHTML = message;
        $modal.modal({backdrop: 'static', keyboard: false});
    }

    $scope.hideMessage = function () {
        var $modal = $('.message-bar');
        $modal.modal('hide');
    }




    $scope.dropCallback = function (event, index, item) {
        if (item) {
            if (!item.id) {
                item.id = "newid-" + $scope.models.newId++;
                item.status = CREATED;
            }
            if (item.status != CREATED) {
                item.status = UPDATED;
            }
            $scope.models.dirty = true;
        }
        return item;
    };

    $scope.trashedCallback = function (event, index, item) {
        if (item) {
            var deletedItems = getFieldList(item, null, {});
            var conflicts = getDeleteConflicts(deletedItems);
 
            if (conflicts.length > 0) {
                var msg = "Deleting this item will cause conflicts \n\n";
                for (var i=0; i < conflicts.length; i++)
                {
                    msg += conflicts[i] + "\n";
                }
                alert(msg);
                return null;
            } else {
                // place items in deleted list
                for (var key in deletedItems) {
                    $scope.models.delected.push(deletedItems[key]);
                }
            }
        }
        $scope.models.dirty = true;
        return item;
    };

    var getDeleteConflicts = function (deletedItems) {
        var conflicts = [];
        var remainingItems = getFieldList($scope.models.form, deletedItems, {});
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

 

    $scope.$watch('models.form', function (model) {
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
                    return getFieldList($scope.models.form.controls, ignoreItem, {});
                }
            },
        });

        modalInstance.result.then(function (selectedItem) {
            // has item changed ?
            if (JSON.stringify(selectedItem) !== JSON.stringify(angular.copy($scope.models.selected))) {
                angular.copy(selectedItem, $scope.models.selected);

                if ($scope.models.selected.status != CREATED) {
                    $scope.models.selected.status = UPDATED;
                }
                $scope.models.dirty = true;
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

    $scope.CommonFieldRequired = function (field, item) {
        switch (field)
        {
            case "Sub-Label":
                if (['container', 'pagebreak'].indexOf(item.type) > -1) {
                    return false;
                }
                break;
            case "Tool Tip":
                if (['container', 'pagebreak'].indexOf(item.type) > -1) {
                    return false;
                }
                break;
            case "Field Required":
                if (['container', 'static', 'pagebreak'].indexOf(item.type) > -1) {
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    }
});

