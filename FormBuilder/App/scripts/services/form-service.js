'use strict';
var itemId = 1;

app.service('FormService', function FormService($http, $q, $timeout) {

    var formsJsonPath = './static-data/fulldetails.json';
    var listFormsJsonPath = './static-data/list_forms.json';

    return {
            
            tools: [
                //{ type: "item", id: 2, display_name: "Item" },
                { id: "", status: CREATED, type: 0x0110, item_type: "noyes", display_name: "No/Yes", label: 'no/yes'},
                { id: "", status: CREATED, type: 0x0120, item_type: "textfield", display_name: "Text Field", label: 'textField'},
                { id: "", status: CREATED, type: 0x0130, item_type: "dropdown", display_name: "Dropdown", label: 'dropdown', field_options: [{ value: 0, label: "option 0" }, { value: 1, label: "option 1" }] },
                { id: "", status: CREATED, type: 0x0140, item_type: "reflector", display_name: "Reflector", label: 'reflector' },
                { id: "", status: CREATED, type: 0x0150, item_type: "static", display_name: "Static", label: 'static' },
                { id: "", status: CREATED, type: 0x0180, item_type: "photo", display_name: "Photo", label: 'photo' },
                { id: "", status: CREATED, type: 0x0400, item_type: "condition", display_name: "Condition", label: 'condition' },
                { id: "", status: CREATED, type: 0x0500, item_type: "selector", display_name: "Selector", label: 'selector' },
                { id: "", status: CREATED, type: 0x0800, item_type: "hidden", display_name: "Hidden", label: 'hidden' },
                { id: "", status: CREATED, type: 0x0200, item_type: "format", display_name: "Format", label: 'format' },
                { id: "", status: CREATED, type: 0x4000, item_type: "group", display_name: "Group", label: 'group', controls: [] }

                //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
                //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
                //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
                //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "table", display_name: "Table", field_label: 'table', field_required: true, field_disabled: false, controls: [] },
            ],
            textboxSubTypes: [
                { value: 0x120, label: "Alpha" },
                { value: 0x121, label: "Multi-line" },
                { value: 0x123, label: "Auto Complete" },
                { value: 0x124, label: "Date" },
                { value: 0x128, label: "Numeric" },
                { value: 0x129, label: "Numeric (non-zero)" }
            ],
            photoSubTypes: [
                { value: 0x180, label: "Photo" },
                { value: 0x181, label: "Photo (with Thumbs)" }
            ],
            conditionSubTypes: [
                { value: 0x400, label: "Non-Zero" },
                { value: 0x401, label: "Equal" },
                { value: 0x402, label: "Less Than" },
                { value: 0x403, label: "Greater Than" }
            ],
            selectorSubTypes: [
                { value: 0x500, label: "Selector" },
                { value: 0x510, label: "Selector with child" }
            ],
            formatSubTypes: [
                { value: 0x200, label: "Page Break" }
            ],
            groupSubTypes: [
                { value: 0x4000, label: "Basic Group" },
                { value: 0x4022, label: "Validator" },
                { value: 0x4023, label: "Validator List" },
                { value: 0x4040, label: "Table" },
                { value: 0x4080, label: "Score" }
            ],
        

         form: function (id) {
            // added error injection for testing 
            var path = formsJsonPath;
            if (id == 3)
            {
                path += "00";
            }
            var promise = $http.get(path),
                deferObject =  deferObject || $q.defer();
 
            promise.then(
              // OnSuccess function
              function (response) {
                  // This code will only run if we have a successful promise.
                  var requestedForm = {};
                  angular.forEach(response.data, function (form) {
                      if (form.id == id) requestedForm = form;
                  });
                  deferObject.resolve(requestedForm);
              },
              // OnFailure function
              function(reason){
                  // This code will only run if we have a failed promise.
                  deferObject.reject(reason);
              });
 
            return deferObject.promise;
        },
        forms: function() {
            //return $http.get(listFormsJsonPath).then(function (response) {
            //    return response.data;;
            //});
            // currently just dummy function
            return $timeout(function () { }, 500).then(function () {
                return $http.get(listFormsJsonPath).then(function (response) {
                    return response.data;;
                });
            });
        },
        save: function (form) {
            // currently just dummy function
            return $timeout(function () { }, 2000).then(function () {
                return;
            });
        }
        ,
        getNewId: function () {
            return "newid -" + itemId++;
        }
        ,
        resetNewId: function () {
            itemId=1;
        }
    };
});
