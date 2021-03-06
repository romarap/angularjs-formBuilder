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

            // check that the selected item 
            $scope.validId = function (id, fields) {
                if (id) {
                    if (id in fields) {
                        return id;
                    }
                }
                return '';
            }
        },
        templateUrl: './views/directive-templates/conditions.html',
        restrict: 'E',
        scope: {
            item: '=',
            fields: '=',
            form: '='
        }
    };
});
