'use strict';

//constants
var CREATED = 'create';
var UPDATED = 'update';
var DELETE = 'delete';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formsController', function ($scope, $http, FormService, $routeParams, $uibModal) {
    
    //$http({
    //    method: "GET",
    //    url: "http://81.109.89.222/QansMark/Anon/Services.asmx/Test"
    //}).then(function mySucces(response) {
    //    $scope.myWelcome = response.data;
    //}, function myError(response) {
    //    $scope.myWelcome = response.statusText;
    //});
  
    $scope.models = {
        selected: null,
        delected: [],
        dirty: false,
        form: {},
        controls: {}
    };

    // reset ids for new items.
    FormService.resetNewId();

    FormService.formControls().then(function (controls) {
        $scope.models.controls = controls
    }, function myError(response) {
        // controls failed to load 

        showMessage({
            message: "Failed to load form controls.....<br>" + response.status + ":" + response.statusText,
            alertStyle: "alert-danger",
            okButton: true
        });
    });


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
           "label": "--New Form--",
           "type": 16,
           "controls": []
       };
    }


    $scope.editForm = function ($event) {
        event.preventDefault();
        event.stopPropagation();

        var formDetails = {
            "id": $scope.models.form.id,
            "label": $scope.models.form.label
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'formPropertiesDialog.html',
            controller: 'FormPropertiesModalInstanceCtrl',
            size: '',
            resolve: {
                item: function () {
                    return angular.copy(formDetails);
                }
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

    $scope.getFieldTemplate = function (item) {
        var type = FormService.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];
        
        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/includes/field-templates/' + type.item_type + '.html';
    }

    $scope.getItemTypeDisplayName = function (item_type) {
        var type = FormService.tieTypeBasicTypes[item_type & BASIC_TYPE_MASK];
        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return type.display_name;
    }


    // Dialog open
    $scope.editItemDetails = function ($event, size, item) {
        event.preventDefault();
        event.stopPropagation();

        $scope.models.selected = item;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'fieldPropertiesDialog.html',
            controller: 'ItemDetailsModalInstanceCtrl',
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
                },
                controls: function () {
                    return $scope.models.controls;
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


//////////////////////////////////////////////////////

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ItemDetailsModalInstanceCtrl', function ($scope, $uibModalInstance, FormService, item, fields, controls) {
    $scope.formService = FormService;
    $scope.fields = fields;
    $scope.item = item;
    $scope.controls = [];
    
    // only concerned with relevant controls ie. those with same type
    var itemType = item.type & 0xFFFF;
    for (var i = 0 ; i < controls.length; i++)
    {
        if ((controls[i].type & 0xFFFF) == itemType) {
            $scope.controls.push(angular.copy(controls[i]));
        }
    }

    $scope.dependents = [];
    for (var key in fields) { 
        if(fields[key].conditionSrcId == item.id)
        {
            $scope.dependents.push(angular.copy(fields[key]));
        }
    }

    //$scope.multiple = (item.type & FormService.tieTypeFlags["multiple"]) > 0;
    $scope.readonlyWriteLock = (item.type & FormService.tieTypeFlags["readonlyWriteLock"]) > 0;
    $scope.readonlyAppendLock = (item.type & FormService.tieTypeFlags["readonlyAppendLock"]) > 0;
    $scope.noZapd = (item.type & FormService.tieTypeFlags["noZapd"]) > 0;
    $scope.invisibleWhenOff = (item.type & FormService.tieTypeFlags["invisibleWhenOff"]) > 0;
    $scope.negateSrcCondition = (item.type & FormService.tieTypeFlags["negateSrcCondition"]) > 0;


    $scope.getFieldPropertiesTemplate = function (item) {
        var type = FormService.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/includes/field-properties/' + type.item_type + '.html';
    }

    $scope.getItemTypeDisplayName = function (item_type) {
        var type = FormService.tieTypeBasicTypes[item_type & BASIC_TYPE_MASK];
        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return type.display_name;
    }

    $scope.CommonFieldRequired = function (field, item) {
        switch (field)
        {

            case "Muliple":
                if (['photo'].indexOf(item.item_type) > -1) {
                    return false;
                }
                break;
           
            //case "Field Required":
            //    if (['container', 'static', 'pagebreak'].indexOf(item.item_type) > -1) {
            //        return false;
            //    }
            //    break;
            default:
                return true;
        }
        return true;
    }

    $scope.SetTypeBit = function (value, mask, setFlag) {
        if (setFlag) {
            value |= mask;
        } else {
            value &= ~mask;
        }
        return value;
    }

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

///////////////////////////////////////////////////////
app.controller('FormPropertiesModalInstanceCtrl', function ($scope, $uibModalInstance, FormService, item) {
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

app.filter('conditionSrcIdFilter', function () {
    return function (input, id) {
        var tmp = {};
        angular.forEach(input, function (val, key) {
            if(val.conditionSrcId == id)
            {
                tmp[key] = val;
            }
        });
        return tmp;
    };
})

