'use strict';


app.controller('ControlEditModalInstanceCtrl', function ($scope, $uibModalInstance, item) {
    $scope.item = item;
 
    // function to submit the form after all validation has occurred            
    $scope.submitForm = function (isValid) {
        // check to make sure the form is completely valid
        if (isValid) {
            $uibModalInstance.close($scope.item);
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});



