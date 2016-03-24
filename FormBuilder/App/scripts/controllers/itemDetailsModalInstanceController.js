'use strict';

app.controller('ItemDetailsModalInstanceCtrl', function ($scope, $uibModalInstance, item, fields, controls) {
    $scope.formUIHelper = formUIHelper;
    $scope.fields = fields;
    $scope.item = item;
    $scope.controls = [];
    
    // only concerned with relevant controls ie. those with same type
    var itemType = item.type & 0xFFFF;
    for (var i = 0 ; i < controls.length; i++)
    {
        if ((controls[i].type & 0xFFFF) == itemType) {
            $scope.controls.push(angular.copy(controls[i]));
        }
    }

    $scope.dependents = [];
    for (var key in fields) { 
        if (fields[key].conditionSrcId == item.tieId)
        {
            $scope.dependents.push(angular.copy(fields[key]));
        }
    }

    $scope.subType = item.type & formUIHelper.mask["subtype"];
    $scope.multiple = (item.type & formUIHelper.tieTypeFlags["multiple"]) > 0;
    $scope.readonlyWriteLock = (item.type & formUIHelper.tieTypeFlags["readonlyWriteLock"]) > 0;
    $scope.readonlyAppendLock = (item.type & formUIHelper.tieTypeFlags["readonlyAppendLock"]) > 0;
    $scope.noZapd = (item.type & formUIHelper.tieTypeFlags["noZapd"]) > 0;
    $scope.invisibleWhenOff = (item.type & formUIHelper.tieTypeFlags["invisibleWhenOff"]) > 0;
    $scope.negateSrcCondition = (item.type & formUIHelper.tieTypeFlags["negateSrcCondition"]) > 0;

 
    $scope.getFieldPropertiesTemplate = function (item) {
        var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/includes/field-properties/' + type.item_type + '.html';
    }

    $scope.getItemTypeDisplayName = function (item_type) {
        var type = formUIHelper.tieTypeBasicTypes[item_type & BASIC_TYPE_MASK];
        if (type.subTypes != null) {
            type = type.subTypes[item_type & BASIC_SUBTYPE_MASK];
        }
        return type.display_name;
    }

    $scope.CommonFieldRequired = function (field, item) {
        switch (field)
        {

            case "Muliple":
                if (['photo'].indexOf(item.item_type) > -1) {
                    return false;
                }
                break;
           
            //case "Field Required":
            //    if (['container', 'static', 'pagebreak'].indexOf(item.item_type) > -1) {
            //        return false;
            //    }
            //    break;
            default:
                return true;
        }
        return true;
    }

    $scope.SetTypeBit = function (value, mask, setFlag) {
        if (setFlag) {
            value |= mask;
        } else {
            value &= ~mask;
        }
        return value;
    }

    $scope.SetSubType = function (subType , mask) {
        $scope.item.type &= ~mask;
        $scope.item.type |= subType;
    }

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
