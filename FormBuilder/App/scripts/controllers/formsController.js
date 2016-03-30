'use strict';

//constants
var CREATED = 'create';
var UPDATED = 'update';
var DELETE = 'delete';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formsController', function ($scope, $http, $location, $sessionStorage, $localStorage, FormService, controlsService, $routeParams, modalService) {
    try{

        $scope.$storage = $sessionStorage;

        $scope.models = {
            selected: null,
            deleted: [],
            dirty: false,
            form: {},
            controls: {}
        };

        //$scope.$on('$viewContentLoaded', function () {
        //    $scope.msg = $route.current.templateUrl + ' is loaded !!';
        //});


        //$scope.$on('$locationChangeStart', routeChange);
        var onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);

        // reset ids for new items.
        FormService.resetNewId();

        controlsService.formControls(true).then(function (response) {
            if (response.status == 200) {
                $scope.models.controls = response.data;
            }
            else {
                reportControlsLoadFailure(response);
            }
        }, function myError(response) {
            // controls failed to load 
            reportControlsLoadFailure(response);
        });

        if ($routeParams.debug != null) {
            $scope.$storage.debug = $routeParams.debug;
        }

        if ($routeParams.id) {
            // read form with given id
            FormService.form($routeParams.id).then(function (response) {
                if (response.status == 200) {
                    $scope.models.form = response.data;
                    // initial validations
                    if (!$scope.models.form.rootTie){
                        $scope.models.form.rootTie = angular.copy(formUIHelper.newForm.rootTie);
                        $scope.models.form.rootTie.tieId = FormService.getNewId();
                    }
                    if (!$scope.models.form.rootTie.theChildren)
                    {
                        $scope.models.form.rootTie.theChildren = [];
                    }

                }
                else {
                    reportFormLoadFailure(response);
                }
            }, function myError(response) {
                reportFormLoadFailure(response);
            });

        }
        else {
            angular.copy(formUIHelper.newForm, $scope.models.form);
            $scope.models.form.formId = FormService.getNewId();
            $scope.models.form.rootTie.tieId = FormService.getNewId();
        }
    }
    catch (e) {
        modalService.showMessage({
            message: "Failed first page.....<br>" + e,
            alertStyle: "alert-danger",
            okButton: true
        });
    }

    function reportFormLoadFailure(response) {
        // form failed to load so clear details but set id so that the user can see the selected item in the menu
        $scope.models.form = { "tieId": $routeParams.id };

        modalService.showMessage({
            message: "Failed to load form.....<br>" + response.status + ":" + response.statusText,
            alertStyle: "alert-danger",
            okButton: true
        });
    }

    function reportControlsLoadFailure(response) {
        $scope.models.controls = {};

        modalService.showMessage({
            message: "Failed to load form controls.....<br>" + response.status + ":" + response.statusText,
            alertStyle: "alert-danger",
            okButton: true
        });
    }

    function routeChange(event, newUrl) {
        //Navigate to newUrl if the form isn't dirty
        //if (!$scope.editForm.$dirty) return;
        if (!$scope.models.dirty) return;

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK',
            headerText: 'Unsaved Changes',
            bodyText: 'You have unsaved changes. Leave the page?'
        };

        modalService.showModal({}, modalOptions).then(function (result) {
            if (result === 'ok') {
                onRouteChangeOff(); //Stop listening for location changes
                $location.path($location.url(newUrl).hash()); //Go to page they're interested in
            }
        });

        //prevent navigation by default since we'll handle it
        //once the user selects a dialog option
        event.preventDefault();
        return;
    };

    $scope.editForm = function ($event) {
        event.preventDefault();
        event.stopPropagation();

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK'
        };

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modals/formPropertiesDialog.html',
            controller: 'FormPropertiesModalInstanceCtrl',
            resolve: {
                item: function () {
                    return angular.copy($scope.models.form);
                },
                fields: null,
                controls: null
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (item) {
            // has item changed ?
            if (JSON.stringify(item) !== JSON.stringify($scope.models.form)) {
                angular.merge($scope.models.form, item);
                $scope.models.dirty = true;
            }
        });
    };

    $scope.save = function () {
        if ($scope.models.dirty) {
            modalService.showMessage({
                message: "Saving Form.....",
                alertStyle: "alert-info"
            });

            FormService.save($scope.models.form).then(function (response) {
                modalService.hideMessage();
                $scope.models.dirty = false;
            }, function myError(response) {
                // modalService.hideMessage();
                modalService.showMessage({
                    message: "Failed to save form.....<br>" + response.status + ":" + response.statusText,
                    alertStyle: "alert-danger",
                    okButton: true
                });
            });
        }
    };

    $scope.dropCallback = function (event, index, item, external, type) {
        var itemToDrop = item;
        if (itemToDrop) {
            if (type == "new-control") {
                // this is a control so need to convert to a tool
                var control = item;
                itemToDrop = angular.copy(formUIHelper.tools[control.type & 0xFF0]);
                itemToDrop.controlId = control.controlId;
                itemToDrop.label = control.label;
            }
            if (!itemToDrop.tieId) {
                itemToDrop.tieId = FormService.getNewId();
                itemToDrop.status = CREATED;
            }
            if (itemToDrop.status != CREATED) {
                itemToDrop.status = UPDATED;
            }
            $scope.models.dirty = true;
        }
        return itemToDrop;
    };


    $scope.$watch('models.form', function (model) {
        $scope.formAsJson = angular.toJson(model, true);
    }, true);

    $scope.$watch('models.deleted', function (model) {
        $scope.deletedItemsAsJson = angular.toJson(model, true);
        if (model.length > 0) {
            $scope.models.dirty = true;
        }
    }, true);

    $scope.getFieldTemplate = function (item) {
        var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];
        var isGroup = type.type == 0x000;

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        if (type === undefined) {
            return 'views/includes/field-templates/unknownField.html';
        }

        if (isGroup) {
            // Group - ensure it can accept children
            if (!item.theChildren) {
                item.theChildren = [];
            }
            return 'views/includes/field-templates/' + type.field_template + '.html';
        }

        return 'views/includes/field-templates/formItem.html';
        //return 'views/includes/field-templates/' + type.item_type + '.html';

        //var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];
        //if (type.subTypes != null) {
        //    type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        //}
        //return 'views/includes/field-templates/' + type.item_type + '.html';
    }

    $scope.getItemTypeDisplayName = function (item_type) {
        var type = formUIHelper.tieTypeBasicTypes[item_type & BASIC_TYPE_MASK];
        if (type.subTypes != null) {
            type = type.subTypes[item_type & BASIC_SUBTYPE_MASK];
        }
        return type.display_name;
    }


    // Dialog open
    $scope.editItemDetails = function ($event, size, item) {
        event.preventDefault();
        event.stopPropagation();

        $scope.models.selected = item;

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK'
        };

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modals/fieldPropertiesDialog.html',
            controller: 'ItemDetailsModalInstanceCtrl',
            resolve: {
                item: function () {
                    return angular.copy(item);
                },
                fields: function () {
                    // return all the fields on the form
                    var ignoreItem = {};
                    ignoreItem[item.tieId] = item;
                    return formUIHelper.getFieldList($scope.models.form.rootTie.theChildren, ignoreItem, {});
                },
                controls: function () {
                    return $scope.models.controls;
                }
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (selectedItem) {
            // has item changed ?
            if (JSON.stringify(selectedItem) !== JSON.stringify(angular.copy($scope.models.selected))) {
                angular.copy(selectedItem, $scope.models.selected);

                if ($scope.models.selected.status != CREATED) {
                    $scope.models.selected.status = UPDATED;
                }
                $scope.models.dirty = true;
            }
        });

    };
});


//app.filter('dictoryOrder', function () {
//    return function (object, reverse) {
//        var keys = Object.keys(object || {}).sort();
//        if (reverse) keys.reverse();
//        for (var ordered = {}, i = 0; keys[i]; i++) {
//            ordered[keys[i]] = object[keys[i]];
//        }
//        return ordered;
//    }
//})

app.filter('conditionSrcIdFilter', function () {
    return function (input, tieId) {
        var tmp = {};
        angular.forEach(input, function (val, key) {
            if (val.conditionSrcId == tieId) {
                tmp[key] = val;
            }
        });
        return tmp;
    };
})

