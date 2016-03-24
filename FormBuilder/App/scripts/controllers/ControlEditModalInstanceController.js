'use strict';


app.controller('ControlEditModalInstanceCtrl', function ($scope, $uibModalInstance, modalOptions, item, isNew) {

    $scope.models = {
            attributes: {},
            item: item,
            controls: {},
            selectOptions: [],
            selectOptionsType: "0x0381",
            types: formUIHelper.getControlTypesList(),
            modalOptions: modalOptions,
            isNew: isNew
        }

  
    $scope.hideAttributes = function () {
        var flag = jQuery.isEmptyObject($scope.models.attributes);
        return flag;
    }

    $scope.hideValues = function () {
        return !(item.type == 0x0130 || item.type == 0x0122 || item.type == 0x0123);
    }

    $scope.addAttribute = function (settings, enabled) {
        if (!(settings.type in $scope.models.attributes)) {
            $scope.models.attributes[settings.type] = { enabled: enabled, settings: settings };
        }
    }


    $scope.setupAttributes = function () {
        $scope.models.attributes = {};

        if (item.theAttributes) {
            // add existing attributes
            for (var i = 0 ; i < item.theAttributes.length; i++) {
                $scope.addAttribute(item.theAttributes[i], true);
            }
        }

        switch (item.type & 0x0FFF) {
            case 0x0110: // noYes
            case 0x0111: // noYesNa
                break;
            case 0x0120: // Text Alpha
            case 0x0121: // Text Alpha Multiline
            case 0x0122: // Text AutoComplete
            case 0x0123: // Text AutoComplete Any
            case 0x0124: // Text Date
            case 0x0128: // Text Numeric
            case 0x0129: // Text NumericNZ
                $scope.addAttribute({ type: 0x0363, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0362, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x030C, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x030E, text1: "", intValue: 0 }, false);
                break;
            case 0x0130: // dropDown
                break;
            case 0x0180: // Photo
            case 0x0181: // Photo with Thumbs
                $scope.addAttribute({ type: 0x030A, text1: "", intValue: 0 }, false);
                break;
            case 0x0140: // Reflector
                $scope.addAttribute({ type: 0x0362, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0361, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x030C, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x031E, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0328, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0315, text1: "", intValue: 0 }, false);
                break;
            case 0x0150: // Static Data
                $scope.addAttribute({ type: 0x0362, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0361, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x030C, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x031E, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0328, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0315, text1: "", intValue: 0 }, false);
                $scope.addAttribute({ type: 0x0314, text1: "", intValue: 0 }, false);
                break;
            case 0x0200: // Page Break
                $scope.addAttribute({ type: 0x0301, text1: "", intValue: 0 }, false);
                break;
            default:
                break;
        }
    }

    $scope.typeChanged = function () {
        $scope.setupAttributes();
    }

    $scope.addSelectOption = function () {
        $scope.models.selectOptions.push({ type: $scope.models.selectOptionsType, text1: '', text2: '' });
    }

    $scope.removeSelectOption = function (event, index) {
        $scope.models.selectOptions.splice(index, 1);
    };

 
    // function to submit the form after all validation has occurred            
    $scope.submitForm = function (isValid) {
        // check to make sure the form is completely valid
        if (isValid) {
            $scope.models.item.theAttributes = [];
            for (var key in $scope.models.attributes)
            {
                if ($scope.models.attributes[key].enabled) {
                    $scope.models.item.theAttributes.push(angular.copy($scope.models.attributes[key].settings));
                }
            }
            $uibModalInstance.close($scope.models.item);
        }
    };

    $scope.ok = function () {

        $uibModalInstance.close($scope.models.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.setupAttributes();

});



