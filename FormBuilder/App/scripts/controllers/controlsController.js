'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('controlsController', function ($scope,FormService, $routeParams, modalService) {

    $scope.models = {
        controls: {}
    };


    FormService.formControls().then(function (response) {
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


    $scope.refreshControls = function () {
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
    }



    // Dialog open
    $scope.editControlDetails = function (control) {
        FormService.formControl(control.controlId).then(function (response) {
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
                item: {
                    controlId: FormService.getNewId()
                },
                isNew: true
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (item) {

        });

    };

    function reportControlLoadFailure(response) {
        $scope.models.controls = {};


        modalService.showMessage({
            message: "Failed to load control.....<br>" + response.status + ":" + response.statusText,
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


});

