'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('controlsController', function ($scope,FormService, $routeParams, modalService) {

    $scope.models = {
        controls: {}
    };

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
    $scope.editControlDetails = function (item) {

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK'
        };

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modals/controlEditDialog.html',
            controller: 'ControlEditModalInstanceCtrl',
            resolve: {
                item: function () {
                    return angular.copy(item);
                }
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (item) {
           
        });

    };

    $scope.newControl = function () {

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK'
        };

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/modals/controlEditDialog.html',
            controller: 'ControlEditModalInstanceCtrl',
            resolve: {
                item: null
            },
        };

        modalService.showModal(modalDefaults, modalOptions).then(function (item) {

        });

    };
    

});

