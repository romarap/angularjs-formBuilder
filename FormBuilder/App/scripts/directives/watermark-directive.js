'use strict';

app.directive('watermarkDirective', function($http, $compile) {
    
    return {
        scope: false,  // shared scope
        template: '<div class="watermark"><p>{{item.label + " (" + item.type + ","+ item.tieId + ")"}}</p></div>',
        restrict: 'E',
        //link: function (scope, iElement, iAttrs) {
        //    var svg = $compile(angular.element('<div class="watermark"><p>{{scope.item.label}}</p></div>'));
        //    iElement.append(svg);
        //}

        
    };
});