'use strict';


app.directive('fieldOptionsDirective', function () {
    return {
        controller: function ($scope) {
            $scope.addOption = function () {
                if (!$scope.item.field_options) {
                    $scope.item.field_options = [];
                }
                $scope.item.field_options.push({ label: "", value: "" });
            };
            $scope.removeOption = function (event,index) {
               
                $scope.item.field_options.splice(index, 1);
            };
        },
        templateUrl: './views/directive-templates/options.html',
        restrict: 'E',
        scope: {
            item: '=',
            form: '='
        }
    };
});
