'use strict';

app.directive('messageBarDirective', function () {
    return {
        controller: function($scope){
           

        },
        templateUrl: './views/directive-templates/messageBar.html',
        restrict: 'E',
        scope: false,  // shared scope
        //link: function(scope) {

        //    scope.itemClick = function (value) {
        //        var $modal = $('.message-bar'),
        //        $alertinfo = $('.alert-info .msg');
        //        $alertinfo[0].innerHTML = "hello";
        //        $modal.modal({ backdrop: 'static', keyboard: false });
        //    }
        //}
    };
  });
