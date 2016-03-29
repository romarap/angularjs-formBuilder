'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('controlsController', function ($scope, FormService, controlsService, $routeParams, modalService) {

    $scope.models = {
        controls: controlsService.controls
    };

    $scope.refreshControls = function (refresh) {
        $scope.refreshSpin(true);
        var useCache = !refresh;
        controlsService.formControls(useCache).then(function (response) {

            if (response.status == 200) {
                $scope.models.controls = response.data;
                $scope.refreshSpin(false);
            }
            else {

                $scope.refreshSpin(false);
                $scope.reportControlsLoadFailure(response);
            }
        }, function myError(response) {
            // controls failed to load 

            $scope.refreshSpin(false);
            $scope.reportControlsLoadFailure(response);
        });
    }

    $scope.refreshSpin = function (flag) {
        if (flag) {
            $('#refreshControls').addClass('gly-spin');
        } else {
            $('#refreshControls').removeClass('gly-spin');
        }
    }



    // Dialog open
    $scope.editControlDetails = function (control) {
        controlsService.formControl(control.controlId).then(function (response) {
            if (response.status == 200) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Save'
                };

                var modalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'views/modals/controlEditDialog.html',
                    controller: 'ControlEditModalInstanceCtrl',
                    resolve: {
                        item: function () {
                            return response.data;
                        },
                        isNew: false
                    },
                };
                modalService.showModal(modalDefaults, modalOptions).then(function (item) {
                });
            }
            else {
                reportControlLoadFailure(response);
            }
        }, function myError(response) {
            // controls failed to load 
            reportControlLoadFailure(response);
        });
    };

    $scope.newControl = function () {

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Create'
        };

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modals/controlEditDialog.html',
            controller: 'ControlEditModalInstanceCtrl',
            resolve: {
                item: function () {
                    return {
                        controlId: FormService.getNewId()
                    }
                },
                isNew: true
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (item) {

        });

    };

    $scope.reportControlsLoadFailure = function (response) {
        $scope.models.controls = {};


        modalService.showMessage({
            message: "Failed to load controls.....<br>" + response.status + ":" + response.statusText,
            alertStyle: "alert-danger",
            okButton: true
        });
    }

    $scope.refreshControls(false);
});

