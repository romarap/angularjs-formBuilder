'use strict';

app.directive('formsShortListDirective', function () {
    return {
        controller: function ($scope, FormService, modalService) {
            $scope.models = {};

         


            $scope.refresh = function () {
                $scope.models.forms = [];
                $scope.refreshSpin(true);

                FormService.forms().then(function (response) {
                    if (response.status == 200) {
                        $scope.models.forms = response.data;
                        $scope.refreshSpin(false);
                    }
                    else {
                        $scope.reportFormsListFailure(response);
                    }
                }, function myError(response) {
                    $scope.reportFormsListFailure(response);
                });
            };

            $scope.refreshSpin = function (flag) {
                if (flag) {
                    $('#refresh').addClass('gly-spin');
                } else {
                    $('#refresh').removeClass('gly-spin');
                }
            }

            $scope.reportFormsListFailure = function (response) {
                $scope.refreshSpin(false);

                modalService.showMessage({
                    message: "Failed to refresh forms" + response.status + ":" + response.statusText,
                    alertStyle: "alert-danger",
                    okButton: true
                });
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
