'use strict';

app.directive('formItemDirective', function ($http, $compile, controlsService) {


    var getTemplateUrl = function (item) {
        var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/directive-templates/form-items/' + type.item_type + '.html';

    }

    //var createControl = function()
    //{
    //    var templateUrl = getTemplateUrl($scope.item);
    //    $http.get(templateUrl).success(function (data) {
    //        element.html(data);
    //        $compile(element.contents())($scope);
    //    });
    //}

    var processAttributes = function (scope) {
        scope.leftPrompt = null;
        scope.hint = null;
        scope.width = null;
        scope.maxValue = null;
        scope.text = null;
        scope.rightPrompt = null;
        scope.topMargin = null;
        scope.fontStyle1 = null;
        scope.emptiness = null;
        scope.title = null;
        scope.footerRule = null;

        scope.text1 = scope.item.text1;
        scope.text2 = scope.item.text2;
        try {

            if (scope.item.controlId && scope.controls) {
                if (scope.item.controlId && scope.controls) {
                    var control = scope.controls[scope.item.controlId];
                    scope.text1 = control.text1 ? control.text1 : scope.item.text1;
                    scope.text2 = control.text2 ? control.text2 : scope.item.text2;
                    for (var key in control.theAttributes) {
                        switch (parseInt(key, 10)) {
                            case 0x0363: //'hint'
                                scope.hint = control.theAttributes[key].text1;
                                break;
                            case 0x0362: // Left Prompt
                                scope.leftPrompt = {
                                    label: control.theAttributes[key].text1,
                                    width: 0
                                };
                                break;
                            case 0x030C: //'width',
                                scope.width = control.theAttributes[key].intValue;
                                break;
                            case 0x030E: //'maxValue',
                                scope.maxValue = control.theAttributes[key].intValue;
                                break;
                            case 0x030A: //'text',
                                scope.text = control.theAttributes[key].text1;
                                break;
                            case 0x0361: //'rightPrompt',
                                scope.rightPrompt = control.theAttributes[key].text1;
                                break;
                            case 0x031E: //'topMargin',
                                scope.topMargin = control.theAttributes[key].intValue;
                                break;
                            case 0x0328: //'fontStyle1',
                                scope.fontStyle1 = control.theAttributes[key].intValue;
                                break;
                            case 0x0315: //'emptiness',
                                scope.emptiness = control.theAttributes[key].text1;
                                break;
                            case 0x0314: //'title',
                                scope.title = control.theAttributes[key].text1;
                                break;
                            case 0x0301: //'footerRule
                                scope.footerRule = control.theAttributes[key].intValue;
                                break;
                        }

                    }
                }
            }
        }
        catch (e) { }
    }

    var linker = function (scope, element) {
        scope.$watch('item', function () {
            processAttributes(scope);
            var templateUrl = getTemplateUrl(scope.item);
            $http.get(templateUrl).success(function (data) {
                element.html(data);
                $compile(element.contents())(scope);
            });
        }, true);
    }

    var controller = function ($scope, controlsService) {
        //$scope.leftPrompt = null;

        ////if (controls[item.controlId])
        //controlsService.formControls(true).then(function (response) {
        //    if (response.status == 200) {
        //        var controls = response.data;
        //        if ($scope.item.controlId && controls) {
        //            var control = controls[$scope.item.controlId];
        //            for (var key in control.theAttributes) {
        //                switch (key) {
        //                    case "866":
        //                        $scope.leftPrompt = {
        //                            label: control.theAttributes[key].text1,
        //                            width: 0
        //                        };
        //                        break;
        //                }

        //            }
        //        }
        //    }
        //});
    }

    return {
        controller: controller,
        restrict: 'E',
        scope: {
            item: '=',
            controls: '='
        },
        link: linker
    };
});