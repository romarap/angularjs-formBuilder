'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formFieldTemplateController', function ($scope, controlsService) {

    

    $scope.$on('field-details-Updated-' + $scope.item.tieId, function (event, args) {
        // refresh field
        $scope.initField();
    });

    $scope.init = function (controls) {
        $scope.controls = controls;
        $scope.initField();
    };

    $scope.initField = function () {
        $scope.fieldDisplayValues = {
            text1: $scope.item.text1,
            text2: $scope.item.text2,
            textValue: $scope.item.textValue,
            intValue: $scope.item.intValue,
            conditionSrcId: $scope.item.conditionSrcId,
            controlId: $scope.item.controlId,
            tmpSelectedItem: -1,

        }

        try {
            if ($scope.item.controlId > 0 && $scope.controls) {
                var control = $scope.controls[$scope.item.controlId];
                if (control) {
                    if (control.text1) {
                        $scope.fieldDisplayValues.text1 = control.text1;
                    }
                    if (control.text2) {
                        $scope.fieldDisplayValues.text2 = control.text2;
                    }

                    $scope.setupDisplayAttributes(control);

                    if (formUIHelper.isDDL($scope.item)) {
                        try {
                            $scope.fieldDisplayValues.tmpSelectedItem = $scope.displayAttributes.listItems[0];
                        }
                        catch (h) { }
                    }
                }
            }
        }
        catch (e) { }
    }



    $scope.setupDisplayAttributes = function (control) {
        if (!(control.controlId in formUIHelper.displayAttributesCache)) {
            var displayAttributes = {
                leftPrompt: null,
                hint: null,
                width: null,
                maxValue: null,
                text: null,
                rightPrompt: null,
                topMargin: null,
                fontStyle1: null,
                emptiness: null,
                title: null,
                footerRule: null,
                listItems: []
            };

            if (control.theListItems) {
                displayAttributes.listItems = control.theListItems;
            }

            for (var key in control.theAttributes) {
                switch (parseInt(key, 10)) {
                    case 0x0363: //'hint'
                        displayAttributes.hint = control.theAttributes[key].text1;
                        break;
                    case 0x0362: // Left Prompt
                        displayAttributes.leftPrompt = {
                            label: control.theAttributes[key].text1,
                            width: 0
                        };
                        break;
                    case 0x030C: //'width',
                        displayAttributes.width = control.theAttributes[key].intValue;
                        break;
                    case 0x030E: //'maxValue',
                        displayAttributes.maxValue = control.theAttributes[key].intValue;
                        break;
                    case 0x030A: //'text',
                        displayAttributes.text = control.theAttributes[key].text1;
                        break;
                    case 0x0361: //'rightPrompt',
                        displayAttributes.rightPrompt = control.theAttributes[key].text1;
                        break;
                    case 0x031E: //'topMargin',
                        displayAttributes.topMargin = control.theAttributes[key].intValue;
                        break;
                    case 0x0328: //'fontStyle1',
                        displayAttributes.fontStyle1 = control.theAttributes[key].intValue;
                        break;
                    case 0x0315: //'emptiness',
                        displayAttributes.emptiness = control.theAttributes[key].text1;
                        break;
                    case 0x0314: //'title',
                        displayAttributes.title = control.theAttributes[key].text2;
                        break;
                    case 0x0301: //'footerRule
                        displayAttributes.footerRule = control.theAttributes[key].intValue;
                        break;
                }

            }
            formUIHelper.displayAttributesCache[control.controlId] = displayAttributes;
        }
        $scope.displayAttributes = formUIHelper.displayAttributesCache[control.controlId];
    }

});

