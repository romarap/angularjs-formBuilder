'use strict';

//constants
var CREATED = 'create';
var UPDATED = 'update';
var DELETE = 'delete';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formsController', function ($scope, $http, $location, FormService, $routeParams, modalService) {

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

    //$scope.$on('$locationChangeStart', routeChange);
    var onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);

    // reset ids for new items.
    FormService.resetNewId();

    FormService.formControls().then(function (controls) {
        $scope.models.controls = controls
    }, function myError(response) {
        // controls failed to load 

        modalService.showMessage({
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

            modalService.showMessage({
                message: "Failed to load form.....<br>" + response.status + ":" + response.statusText,
                alertStyle: "alert-danger",
                okButton: true
            });
        });
    }
    else {
        angular.copy(formUIHelper.newForm, $scope.models.form);
        $scope.models.form.id = FormService.getNewId();
    }

    function routeChange(event, newUrl) {
        //Navigate to newUrl if the form isn't dirty
        //if (!$scope.editForm.$dirty) return;
        if (!$scope.models.dirty) return;

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Ignore Changes',
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

            FormService.save($scope.models.form).then(function () {
                modalService.hideMessage();
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
        if (model.length > 0) {
            $scope.models.dirty = true;
        }
    }, true);

    $scope.getFieldTemplate = function (item) {
        var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/includes/field-templates/' + type.item_type + '.html';
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
                    ignoreItem[item.id] = item;
                    return formUIHelper.getFieldList($scope.models.form.controls, ignoreItem, {});
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

