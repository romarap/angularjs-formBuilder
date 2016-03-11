'use strict';

   
var showMessage = function (params) {
    var defaults = {
        message: "blank",
        alertStyle: "alert-warning",
        allowDismiss: true,
        okButton : false,
    }
    angular.merge(defaults, params);

    var $modal = $('.message-bar'),
        $alert = $('.message-bar .alert'),
        $alertFooter = $('.message-bar .alert-footer'),
        $alertinfo = $('.message-bar .msg');

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

var hideMessage = function () {
    var $modal = $('.message-bar');
    $modal.modal('hide');
}
