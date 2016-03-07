'use strict';


app.directive('fieldConditionDirective', function () {
    return {
        controller: function ($scope) {
            $scope.addCondition = function () {
                if (!$scope.item.conditions) {
                    $scope.item.conditions = [];
                }
                $scope.item.conditions.push({ field_id: 0, value: "" });
            };
            $scope.removeCondition = function (event,index) {
               
                    $scope.item.conditions.splice(index,1);
            };
        },
        templateUrl: './views/directive-templates/field/conditions.html',
        restrict: 'E',
        scope: {
            item: '=',
            fields: '=',
            form: '='
        }
    };
});
