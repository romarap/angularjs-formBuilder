'use strict';

app.directive('formsShortListDirective', function () {
    return {
        controller: function($scope, FormService){
            $scope.models = {};


            $scope.refresh = function () {
                $scope.refreshSpin(true);
                $scope.models.forms = [];
                FormService.forms().then(function (forms) {
                    $scope.models.forms = forms;
                    $scope.refreshSpin(false);
                });
            };

            $scope.refreshSpin = function (flag) {
                if (flag) {
                    $('#refresh').addClass('gly-spin');
                } else {
                    $('#refresh').removeClass('gly-spin');
                }
            }


            $scope.refresh();
            
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
