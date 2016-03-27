'use strict';

app.directive('droppedItemDirective', function ($http, $compile) {


    var getTemplateUrl = function (item) {
        var type = formUIHelper.tieTypeBasicTypes[item.type & BASIC_TYPE_MASK];

        if (type.subTypes != null) {
            type = type.subTypes[item.type & BASIC_SUBTYPE_MASK];
        }
        return 'views/directive-templates/fields/' + type.item_type + '.html';

    }

    var linker = function (scope, element) {
        scope.$watch('item.controlId', function () {
            var templateUrl = getTemplateUrl(scope.item);
            $http.get(templateUrl).success(function (data) {
                element.html(data);
                $compile(element.contents())(scope);
            });

        });


    }

    var controller = function ($scope, controlsService) {
        $scope.leftPrompt = null;

        //if (controls[item.controlId])
        controlsService.formControls(true).then(function (response) {
            if (response.status == 200) {
                var controls = response.data;
                if ($scope.item.controlId && controls) {
                    var control = controls[$scope.item.controlId];
                    for (var key in control.theAttributes) {
                        switch (key) {
                            case "866":
                                $scope.leftPrompt = {
                                    label: control.theAttributes[key].text1,
                                    width: 0
                                };
                                break;
                        }

                    }
                }
            }
        });
    }

    return {
        controller: controller,
        restrict: 'E',
        scope: {
            item: '='
        },
        link: linker
    };
});