'use strict';

app.directive('toolboxDirective', function () {
    return {
        controller: function ($scope, FormService) {
            $scope.tools = FormService.tools;
         },
        templateUrl: './views/directive-templates/toolbox.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
