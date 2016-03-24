'use strict';

app.directive('attributeDirective', function ($http, $compile) {

    var getTemplateUrl = function (attribute) {
        var type = attribute.type;
        var templateUrl = './views/directive-templates/attributes/';
        var supported_attributes = {
            0x0363: 'hint',
            0x0362: 'leftPrompt',
            0x030C: 'width',
            0x030E: 'maxValue',
            0x030A: 'text',
            0x0361: 'rightPrompt',
            0x031E: 'topMargin',
            0x0328: 'fontStyle1',
            0x0315: 'emptiness',
            0x0314: 'title',
            0x0301: 'footerRule'
        };

        if (supported_attributes[type]) {
            return templateUrl += supported_attributes[type] + '.html';
        }
    }

    var linker = function (scope, element) {
        // GET template content from path
        var templateUrl = getTemplateUrl(scope.attribute);
        $http.get(templateUrl).success(function (data) {
            element.html(data);
            $compile(element.contents())(scope);
        });
    }

    return {
        restrict: 'EA',
        scope: {
            attribute: '=',
            enabled: '='
        },
        link: linker
    };
});