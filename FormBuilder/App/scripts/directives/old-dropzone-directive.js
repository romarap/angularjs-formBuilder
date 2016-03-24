'use strict';

app.directive('dropzoneDirective', function () {
    return {
        controller: function ($scope) {

            $scope.dropCallback = function (event, index, item) {
                if (item) {
                    if (!item.tieId) {
                        item.tieId = "newid-" + $scope.newId++;
                        item.status = CREATED;
                    }
                    if (item.status != CREATED) {
                        item.status = UPDATED;
                    }
                    $scope.dirty = true;
                }
                return item;
            };

            $scope.dblClick = function ($event, item) {
                event.preventDefault();
                event.stopPropagation();
                $scope.ondblclick({ item: item });
            }

        },
        templateUrl: './views/directive-templates/dropzone.html',
        restrict: 'E',
        scope: {
            list: '=list',
            newId: '=newId',
            dirty: '=dirty',
            ondblclick: '&'
        }
    };
  });
