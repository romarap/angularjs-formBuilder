'use strict';

app.directive('formsShortListDirective', function () {
    return {
        controller: function($scope, FormService){
            $scope.models = {};

            FormService.forms().then(function (forms) {
                $scope.models.forms = forms;
            });

            $scope.refresh = function () {
                $scope.models.forms = [];
                FormService.forms().then(function (forms) {
                    $scope.models.forms = forms;
                });
            };
            
        },
        templateUrl: './views/directive-templates/formsShortList.html',
        restrict: 'E',
        scope: {
            selectedid: '@selectedid' 
            //text: "@myText",
            //twoWayBind: "=myTwoWayBind",
            //oneWayBind: "&myOneWayBind"
        }
    };
  });
