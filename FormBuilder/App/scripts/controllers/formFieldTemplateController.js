'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('formFieldTemplateController', function ($scope, controlsService) {

    $scope.leftPrompt = null;
    $scope.hint = null;
    $scope.width = null;
    $scope.maxValue = null;
    $scope.text = null;
    $scope.rightPrompt = null;
    $scope.topMargin = null;
    $scope.fontStyle1 = null;
    $scope.emptiness = null;
    $scope.title = null;
    $scope.footerRule = null;

    $scope.text1 = $scope.item.text1;
    $scope.text2 = $scope.item.text2;
    $scope.textValue = $scope.item.textValue;
    $scope.intValue = $scope.item.intValue;
    $scope.conditionSrcId = $scope.item.conditionSrcId;
    $scope.controlId = $scope.item.controlId;



    $scope.initAttributes = function () {
        try {
            if ($scope.item.controlId && $scope.controls) {
                if ($scope.item.controlId && $scope.controls) {
                    var control = $scope.controls[$scope.item.controlId];
                    if (control) {
                        if (control.text1) {
                            $scope.text1 = control.text1;
                        }
                        if (control.text2) {
                            $scope.text2 = control.text2;
                        }

                        for (var key in control.theAttributes) {
                            switch (parseInt(key, 10)) {
                                case 0x0363: //'hint'
                                    $scope.hint = control.theAttributes[key].text1;
                                    break;
                                case 0x0362: // Left Prompt
                                    $scope.leftPrompt = {
                                        label: control.theAttributes[key].text1,
                                        width: 0
                                    };
                                    break;
                                case 0x030C: //'width',
                                    $scope.width = control.theAttributes[key].intValue;
                                    break;
                                case 0x030E: //'maxValue',
                                    $scope.maxValue = control.theAttributes[key].intValue;
                                    break;
                                case 0x030A: //'text',
                                    $scope.text = control.theAttributes[key].text1;
                                    break;
                                case 0x0361: //'rightPrompt',
                                    $scope.rightPrompt = control.theAttributes[key].text1;
                                    break;
                                case 0x031E: //'topMargin',
                                    $scope.topMargin = control.theAttributes[key].intValue;
                                    break;
                                case 0x0328: //'fontStyle1',
                                    $scope.fontStyle1 = control.theAttributes[key].intValue;
                                    break;
                                case 0x0315: //'emptiness',
                                    $scope.emptiness = control.theAttributes[key].text1;
                                    break;
                                case 0x0314: //'title',
                                    $scope.title = control.theAttributes[key].text1;
                                    break;
                                case 0x0301: //'footerRule
                                    $scope.footerRule = control.theAttributes[key].intValue;
                                    break;
                            }

                        }
                    }
                }
            }
        }
        catch (e) { }
    }

    $scope.init = function (controls) {
        $scope.controls = controls;
        $scope.initAttributes();
    };

    //initAttributes();
});

