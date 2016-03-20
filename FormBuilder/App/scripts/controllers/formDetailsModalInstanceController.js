'use strict';


app.controller('FormPropertiesModalInstanceCtrl', function ($scope, $uibModalInstance, item) {
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

app.filter('conditionSrcIdFilter', function () {
    return function (input, id) {
        var tmp = {};
        angular.forEach(input, function (val, key) {
            if(val.conditionSrcId == id)
            {
                tmp[key] = val;
            }
        });
        return tmp;
    };
})

