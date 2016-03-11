'use strict';

app.directive('trashcanDirective', function () {
    return {
        controller: function($scope){
            $scope.trashedCallback = function (event, index, item) {
                if (item) {
                    var deletedItems = getFieldList(item, null, {});
                    var conflicts = getDeleteConflicts(deletedItems);

                    if (conflicts.length > 0) {
                        var msg = "Deleting this item will cause conflicts \n\n";
                        for (var i = 0; i < conflicts.length; i++) {
                            msg += conflicts[i] + "\n";
                        }
                        alert(msg);
                        return null;
                    } else {
                        // place items in deleted list
                        for (var key in deletedItems) {
                            $scope.models.delected.push(deletedItems[key]);
                        }
                    }
                }
                return item;
            };

            var getDeleteConflicts = function (deletedItems) {
                var conflicts = [];
                var remainingItems = getFieldList($scope.models.form, deletedItems, {});
                for (var key in remainingItems) {
                    var item = remainingItems[key];
                    if (item.conditions) {
                        for (var j = 0; j < item.conditions.length; j++) {
                            var field_id = item.conditions[j].field_id;
                            if (field_id in deletedItems) {
                                conflicts.push("item '" + item.field_label + "' has condition on the deleted item '" + deletedItems[field_id].field_label + "'");
                            }
                        }
                    }
                }
                return conflicts;
            }

        },
        templateUrl: './views/directive-templates/trashcan.html',
        restrict: 'E',
        scope: false  // shared scope
    };
  });
