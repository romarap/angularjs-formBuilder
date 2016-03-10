'use strict';

app.directive('toolboxDirective', function () {
    return {
        controller: function($scope){
            $scope.models = {
                tools: [
                    //{ type: "item", id: 2, display_name: "Item" },
                    { id: "", status: CREATED, type: "textfield", display_name: "Text Field", field_label: 'textField', field_required: true, field_disabled: false },
                    { id: "", status: CREATED, type: "static", display_name: "Static", field_label: 'static' },
                    { id: "", status: CREATED, type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
                    { id: "", status: CREATED, type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
                    { id: "", status: CREATED, type: "dropdown", display_name: "Dropdown", field_label: 'dropdown', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "option 0" }, { value: 1, label: "option 1" }] },
                    { id: "", status: CREATED, type: "photo", display_name: "Photo", field_label: 'photo', field_required: true, field_disabled: false },
                    { id: "", status: CREATED, type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
                    { id: "", status: CREATED, type: "pagebreak", display_name: "Page Break", field_label: 'pagebreak' }
                ]
            };
        },
        templateUrl: './views/directive-templates/toolbox.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
