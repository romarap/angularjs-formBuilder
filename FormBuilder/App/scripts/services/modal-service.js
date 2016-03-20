'use strict';


app.service('modalService', function modalService($uibModal) {

    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'views/modals/modal.html'
    };

    var modalOptions = {
        closeButtonText: 'Close',
        actionButtonText: 'OK',
        headerText: 'Proceed?',
        bodyText: 'Perform this action?'
    };

    this.showModal = function (customModalDefaults, customModalOptions) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return this.show(customModalDefaults, customModalOptions);
    };

    this.show = function (customModalDefaults, customModalOptions) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function () {
                    $uibModalInstance.close('ok');
                };
                $scope.modalOptions.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        }

        return $uibModal.open(tempModalDefaults).result;
    };

    this.showMessage = function (params) {
        var defaults = {
            message: "blank",
            alertStyle: "alert-warning",
            allowDismiss: true,
            okButton: false,
        }
        angular.merge(defaults, params);

        var $modal = $('.message-bar .modal'),
            $alert = $('.message-bar .modal .alert'),
            $alertFooter = $('.message-bar .modal .alert-footer'),
            $alertinfo = $('.message-bar .modal .msg');

        // Styles - update styles
        $alert.removeClass();
        $alert.addClass('alert');
        $alert.addClass(defaults.alertStyle);
        if (defaults.okButton) {
            $alertFooter.show();
        } else {
            $alertFooter.hide();
        }


        $alertinfo[0].innerHTML = defaults.message;
        $modal.modal({ backdrop: 'static', keyboard: defaults.allowDismiss });
    }

    this.hideMessage = function () {
        var $modal = $('.message-bar .modal');
        $modal.modal('hide');
    }


});
