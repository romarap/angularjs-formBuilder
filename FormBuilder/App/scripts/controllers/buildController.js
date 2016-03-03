'use strict';

app.controller('buildController', function ($scope, $uibModal) {
    $scope.items = ['item1', 'item2', 'item3'];


    $scope.models = {
        selected: null,
        templates: [
            { type: "textfield", id: 3, displayName: "Text Field", fieldTitle: 'textField', fieldRequired: true, fieldDisabled: false },
            { type: "radio", id: 2, displayName: "Radio Buttons", fieldTitle: 'option', fieldRequired: true, fieldDisabled: false, fieldOptions: [{ optionValue: 0, optionTitle: "0" }, { optionValue: 1, optionTitle: "1" }] },
            { type: "container", id: 1, displayName: "Group", fieldTitle: 'container', fieldRequired: true, fieldDisabled: false, columns: [[], []] }
        ],
         tabs: [
            {
                tabLabel: "Tab 1",
                active: true,
                controls: [{
                    "type": "textfield",
                    "id": "6",
                    "fieldRequired" : false
                },
                {
                    "type": "textfield",
                    "id": "8"
                }]
            },
            {
                tabLabel: "Tab 2",
                controls: [{
                    "type": "textfield",
                    "id": "7"
                }]
            }
        ]
    };

    $scope.$watch('models.tabs', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    // create new field button click
    $scope.addTab = function (event, index) {
        event.preventDefault();
        event.stopPropagation();

        var newTab = {
            tabLabel: "New Tab",
            active: true,
            controls: []
        };

        $scope.models.tabs.push(newTab);
    }

    // create new field button click
    $scope.removeTab = function (event, index) {
        event.preventDefault();
        event.stopPropagation();
        $scope.models.tabs.splice(index, 1);
    };

    $scope.selectItem = function (item) {
        $scope.models.selected = item; 
        $scope.open('lg',item);
    }
    
    // Dialog open
    $scope.open = function (size, item) {
        $scope.models.selected = item;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'fieldPropertiesDialog.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                item : function () {
                    return angular.copy(item);
                }
            }
        });


        modalInstance.result.then(function (selectedItem) {
            angular.copy(selectedItem, $scope.models.selected);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
        

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item) {

    $scope.item = item;
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
