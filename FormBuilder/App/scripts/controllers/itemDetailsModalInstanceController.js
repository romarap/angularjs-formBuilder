'use strict';

app.controller('ItemDetailsModalInstanceCtrl', function ($scope, $uibModalInstance, item, fields, controls) {
    $scope.formUIHelper = formUIHelper;
    $scope.fields = fields;
    $scope.item = item;
    $scope.controls = [];
    $scope.text1Label = "Text1";
    $scope.text2Label = "Text2";
    $scope.text1values = ["<blank>","sys.client.fullName", "sys.device.mac", "sys.device.id"];

    // only concerned with relevant controls ie. those with same type
    var itemType = item.type & 0xFFFF;
    for (var key in controls) {
        if ((controls[key].type & 0xFFFF) == itemType) {
            $scope.controls.push(angular.copy(controls[key]));
        }
    }

    $scope.dependents = [];
    for (var key in fields) { 
        if (fields[key].conditionSrcId == item.tieId)
        {
            $scope.dependents.push(angular.copy(fields[key]));
        }
    }

    $scope.item_type = formUIHelper.getItemType(item);
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
        return 'views/includes/field-properties/' + type.properties_template + '.html';
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

            //case "Muliple":
            //    if (['photo'].indexOf($scope.item_type) > -1) {
            //        return false;
            //    }
            //    break;
           
            case "Text1":
                if (['static'].indexOf($scope.item_type) > -1) {
                    return false;
                }
                break;
            case "Text1DDL":
                if (['static'].indexOf($scope.item_type) > -1) {
                    return true;
                }
                return false;
                break;
            case "Int Value":
                if (['group', 'validatorsave'].indexOf($scope.item_type) > -1) {
                    return false;
                }
                break;
            case "Text Value":
                if (['group', 'validatorsave'].indexOf($scope.item_type) > -1) {
                    return false;
                }
                break;
            case "Control":
                if (['group', 'validatorsave'].indexOf($scope.item_type) > -1) {
                    return false;
                }
                break;
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

    $scope.SetTextLabels = function (subType) {
        switch (subType) {
            case 0x000: // Group
                $scope.text1Label = "Description";
                $scope.text2Label = "Long Descrip.";
                break;
            case 0x001: // Group
                $scope.text1Label = "Description";
                $scope.text2Label = "Long Descrip.";
                break;
            case 0x022: // Group
                $scope.text1Label = "Complaint title";
                $scope.text2Label = "Complaint info";
                break;
            case 0x023: // Group
                $scope.text1Label = "Complaint title";
                $scope.text2Label = "Complaint info";
                break;
            default:
                $scope.text1Label = "Text1";
                $scope.text2Label = "Text2";
                break;
        }
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

    $scope.SetTextLabels($scope.subType);
});
