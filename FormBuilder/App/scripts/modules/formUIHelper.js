'use strict';
const BASIC_CONTROL = 0x100;
const BASIC_TYPE_MASK = 0xF00;
const BASIC_SUBTYPE_MASK = 0xFF0;

var formUIHelper = new function () {

    this.newForm = { id: "", status: CREATED, type: 0x4010, label: '--New Form--', text1: '_GROUP', text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null, controls: [] };
    this.tools = {
        //{ type: "item", id: 2, display_name: "Item" },
        0x0110: { id: "", status: CREATED, type: 0x0110, label: 'no/yes', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null},
        0x0120: { id: "", status: CREATED, type: 0x0120, label: 'textField', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0130: { id: "", status: CREATED, type: 0x0130, label: 'dropdown', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0140: { id: "", status: CREATED, type: 0x0140, label: 'reflector', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0150: { id: "", status: CREATED, type: 0x0150, label: 'static', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0180: { id: "", status: CREATED, type: 0x0180, label: 'photo', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0400: { id: "", status: CREATED, type: 0x0400, label: 'condition', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0500: { id: "", status: CREATED, type: 0x0500, label: 'selector', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0800: { id: "", status: CREATED, type: 0x0800, label: 'data', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0200: { id: "", status: CREATED, type: 0x0200, label: 'layout', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x4000: { id: "", status: CREATED, type: 0x4000, label: 'group', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null, controls: [] }

    //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
    //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
    //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
    //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "table", display_name: "Table", field_label: 'table', field_required: true, field_disabled: false, controls: [] },
};

    this.tieTypeBasicTypes = {
        0x000: { type: 0x000, item_type: "group", display_name: "Group" },
        0x100: {
            type: 0x100, item_type: "control", subTypes: {
                0x0110: { type: 0x0110, item_type: "noyes", display_name: "No/Yes" },
                0x0120: { type: 0x0120, item_type: "textfield", display_name: "Text Field" },
                0x0130: { type: 0x0130, item_type: "dropdown", display_name: "Dropdown" },
                0x0140: { type: 0x0140, item_type: "reflector", display_name: "Reflector" },
                0x0150: { type: 0x0150, item_type: "static", display_name: "Static" },
                0x0180: { type: 0x0180, item_type: "photo", display_name: "Photo" }
            }
        },
        0x200: { type: 0x200, item_type: "layout", display_name: "Layout" },
        0x400: { type: 0x400, item_type: "condition", display_name: "Condition" },
        0x500: { type: 0x500, item_type: "selector", display_name: "Selector" },
        0x800: { type: 0x800, item_type: "data", display_name: "Data" }
    };

    this.tieTypeFlags= {
        "grp": 0x4000,
        "multiple": 0x8000,
        "readonlyWriteLock": 0x01000000,
        "readonlyAppendLock": 0x02000000,
        "noZapd": 0x04000000,
        "invisibleWhenOff": 0x08000000,
        "negateSrcCondition": 0x40000000
    };


    this.textboxSubTypes= [
        { value: 0x120, label: "Alpha" },
        { value: 0x121, label: "Multi-line" },
        { value: 0x123, label: "Auto Complete" },
        { value: 0x124, label: "Date" },
        { value: 0x128, label: "Numeric" },
        { value: 0x129, label: "Numeric (non-zero)" }
    ];

    this.photoSubTypes= [
        { value: 0x180, label: "Photo" },
        { value: 0x181, label: "Photo (with Thumbs)" }
    ];

    this.conditionSubTypes= [
        { value: 0x400, label: "Non-Zero" },
        { value: 0x401, label: "Equal" },
        { value: 0x402, label: "Less Than" },
        { value: 0x403, label: "Greater Than" }
    ];

    this.selectorSubTypes= [
        { value: 0x500, label: "Selector" },
        { value: 0x510, label: "Selector with child" }
    ];

    this.formatSubTypes = [
        { value: 0x200, label: "Page Break" }
    ];

    this.groupSubTypes = [
        { value: 0x4000, label: "Basic Group" },
        { value: 0x4022, label: "Validator Save" },
        { value: 0x4023, label: "Validator Save List" },
        { value: 0x4040, label: "Table" },
        { value: 0x4080, label: "Score" }
    ];

    // get a flat list of fields but ignore fields in the ignore list
    this.getFieldList = function (root, ignoreFields, flattenFieldList) {
        // ensure valid ignore fields - not null
        if (!ignoreFields) {
            ignoreFields = {};
        }

        if (Array.isArray(root)) {
            for (var i = 0; i < root.length; i++) {
                flattenFieldList = this.getFieldList(root[i], ignoreFields, flattenFieldList);
            }
        }
        else {
            if (!(root.id in ignoreFields)) {
                var copy = angular.copy(root);
                // we don't want the controls as this is a flat list
                if (copy.controls) {
                    copy.controls = null;
                }
                flattenFieldList[root.id] = copy;
            }
            // the current field 
            if (root.controls) {
                flattenFieldList = this.getFieldList(root.controls, ignoreFields, flattenFieldList);
            }
        }
        return flattenFieldList;
    };


    //var containsItem = function (itemList, item) {
    //    if (Array.isArray(itemList)) {
    //        for (var i = 0; i < itemList.length; i++) {
    //            if (item === itemList[i]) {
    //                return true;
    //            }
    //        }
    //    }
    //    return false;
    //}

    //var containsItemById = function (itemList, id) {

    //    if (Array.isArray(itemList)) {
    //        for (var i = 0; i < itemList.length; i++) {
    //            if (id == itemList[i].id) {
    //                return true;
    //            }
    //        }
    //    }
    //    return false;
    //}
}