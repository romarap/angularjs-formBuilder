'use strict';

app.directive('toolboxDirective', function () {
    return {
        controller: function ($scope) {
            $scope.tools = formUIHelper.tools;

            $scope.getItemTypeDisplayName = function (item_type) {
                var type = formUIHelper.tieTypeBasicTypes[item_type & BASIC_TYPE_MASK];
                if (type.subTypes != null) {
                    type = type.subTypes[item_type & BASIC_SUBTYPE_MASK];
                }
                return type.display_name;
            }

         },
        templateUrl: './views/directive-templates/toolbox.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
