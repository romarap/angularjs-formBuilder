'use strict';

//constants
var CREATED = 'create';
var UPDATED = 'update';
var DELETE = 'delete';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formsController', function ($scope, FormService, $routeParams, $uibModal) {
    
    $scope.models = {
        selected: null,
        delected: [],
        dirty: false,
        form: {} 
    };

    // reset ids for new items.
    FormService.resetNewId();

   if ($routeParams.id) {
       // read form with given id
       FormService.form($routeParams.id).then(function (form) {
           $scope.models.form = form;
       }, function myError(response) {
           // form failed to load so clear details but set id so that the user can see the selected item in the menu
           $scope.models.form = { "id": $routeParams.id };
           
           showMessage({
               message: "Failed to load form.....<br>" + response.status + ":" + response.statusText,
               alertStyle: "alert-danger",
               okButton: true
           });
       });
    }
    else
    {
       $scope.models.form = {
           "id": FormService.getNewId(),
           "name": "--New--",
           "controls": []
       };
    }


    $scope.editForm = function ($event) {
        event.preventDefault();
        event.stopPropagation();

        var formDetails = {
            "id": $scope.models.form.id,
            "name": $scope.models.form.name
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'formPropertiesDialog.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            resolve: {
                item: function () {
                    return angular.copy(formDetails);
                }
                ,
                fields: null
            },
        });

        modalInstance.result.then(function (item) {
            // has item changed ?
            if (JSON.stringify(item) !== JSON.stringify(formDetails)) {
                angular.merge($scope.models.form, item);
                $scope.models.dirty = true;
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.save = function () {
        if ($scope.models.dirty)
        {
            showMessage({
                message: "Saving Form.....",
                alertStyle: "alert-info"
            });

            FormService.save($scope.models.form).then(function () {
                hideMessage();
            });
        }
    };

    //$scope.showMessage = function (message) {
    //    var $modal = $('.message-bar'),
    //        $alertinfo = $('.alert-info .msg');
    //        $alertinfo[0].innerHTML = message;
    //    $modal.modal({backdrop: 'static', keyboard: false});
    //}

    //$scope.hideMessage = function () {
    //    var $modal = $('.message-bar');
    //    $modal.modal('hide');
    //}

        
    $scope.dropCallback = function (event, index, item) {
        if (item) {
            if (!item.id) {
                item.id = FormService.getNewId();
                item.status = CREATED;
            }
            if (item.status != CREATED) {
                item.status = UPDATED;
            }
            $scope.models.dirty = true;
        }
        return item;
    };
     

    $scope.$watch('models.form', function (model) {
        $scope.formAsJson = angular.toJson(model, true);
    }, true);

    $scope.$watch('models.delected', function (model) {
        $scope.deletedItemsAsJson = angular.toJson(model, true);
        if (model.length > 0){
            $scope.models.dirty = true;
        }
    }, true);

    // Dialog open
    $scope.editItemDetails = function ($event, size, item) {
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
});




// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, FormService, item, fields) {
    $scope.fields = fields;
    $scope.item = item;
    $scope.textboxSubTypes = FormService.textboxSubTypes;
    $scope.photoSubTypes = FormService.photoSubTypes;
    $scope.conditionSubTypes = FormService.conditionSubTypes;
    $scope.selectorSubTypes = FormService.selectorSubTypes;
    $scope.formatSubTypes = FormService.formatSubTypes;
    $scope.groupSubTypes = FormService.groupSubTypes;


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

            case "Muliple":
                if (['photo'].indexOf(item.item_type) > -1) {
                    return false;
                }
                break;
           
            case "Field Required":
                if (['container', 'static', 'pagebreak'].indexOf(item.item_type) > -1) {
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    }
});

