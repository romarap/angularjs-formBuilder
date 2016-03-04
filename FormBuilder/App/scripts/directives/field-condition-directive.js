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
        },
        templateUrl: './views/directive-templates/field/conditions.html',
        restrict: 'E',
        scope: {
            item: '=',
            fields: '='
        }
    };
});
