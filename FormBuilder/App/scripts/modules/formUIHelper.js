'use strict';
const BASIC_CONTROL = 0x100;
const BASIC_TYPE_MASK = 0xF00;
const BASIC_SUBTYPE_MASK = 0xFF0;

var formUIHelper = new function () {

    this.newForm = {
        formId: "", label: "--New Form--", status: CREATED,
        rootTie: { tieId: "", status: CREATED, type: 0xC010, label: '--Root--', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null, theChildren: [] }
    };
    this.tools = {
        //{ type: "item", id: 2, display_name: "Item" },
        0x0110: { tieId: "", status: CREATED, type: 0x0110, label: 'no/yes', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0120: { tieId: "", status: CREATED, type: 0x0120, label: 'textField', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0130: { tieId: "", status: CREATED, type: 0x0130, label: 'dropdown', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0140: { tieId: "", status: CREATED, type: 0x0140, label: 'reflector', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0150: { tieId: "", status: CREATED, type: 0x0150, label: 'static', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0180: { tieId: "", status: CREATED, type: 0x0180, label: 'photo', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0400: { tieId: "", status: CREATED, type: 0x0400, label: 'condition', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0500: { tieId: "", status: CREATED, type: 0x0500, label: 'selector', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0800: { tieId: "", status: CREATED, type: 0x0800, label: 'data', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x0200: { tieId: "", status: CREATED, type: 0x0200, label: 'layout', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null },
        0x4000: { tieId: "", status: CREATED, type: 0x4000, label: 'group', text1: null, text2: null, intValue: null, textValue: null, conditionSrcId: null, controlId: null, theChildren: [] }

        //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "radio", display_name: "Radio Buttons", field_label: 'radio', field_required: true, field_disabled: false, field_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }] },
        //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "checkbox", display_name: "Checkbox", field_label: 'checkbox', field_required: true, field_disabled: false },
        //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "container", display_name: "Group", field_label: 'container', field_required: true, field_disabled: false, controls: [] },
        //{ id: "", status: CREATED, type: 0xFF, subtype: 0x00, subsubtype: 0x00, item_type: "table", display_name: "Table", field_label: 'table', field_required: true, field_disabled: false, controls: [] },
    };

    this.tieTypeBasicTypes = {
        0x000: {
            type: 0x000, item_type: "group", display_name: "Group", subTypes: {
                0x0000: { type: 0x000, item_type: "group", display_name: "Group", properties_template: "group" },
                0x0010: { type: 0x010, item_type: "reportheader", display_name: "Report Header", properties_template: "reportheader" },
                0x0022: { type: 0x022, item_type: "validatorsave", display_name: "Validator Save", properties_template: "group" },
                0x0023: { type: 0x023, item_type: "validatorsavelist", display_name: "Validator Save List", properties_template: "group" },
                0x0040: { type: 0x040, item_type: "table", display_name: "Table", properties_template: "group" },
                0x0080: { type: 0x080, item_type: "Score", display_name: "Score", properties_template: "group" }
            }
        },
        0x100: {
            type: 0x100, item_type: "control", subTypes: {
                0x0110: { type: 0x0110, item_type: "noyes", display_name: "No/Yes", properties_template: "noyes" },
                0x0120: { type: 0x0120, item_type: "textfield", display_name: "Text Field", properties_template: "textfield" },
                0x0130: { type: 0x0130, item_type: "dropdown", display_name: "Dropdown", properties_template: "dropdown" },
                0x0140: { type: 0x0140, item_type: "reflector", display_name: "Reflector", properties_template: "reflector" },
                0x0150: { type: 0x0150, item_type: "static", display_name: "Static", properties_template: "static" },
                0x0180: { type: 0x0180, item_type: "photo", display_name: "Photo", properties_template: "photo" }
            }
        },
        0x200: { type: 0x200, item_type: "layout", display_name: "Layout", properties_template: "layout" },
        0x400: { type: 0x400, item_type: "condition", display_name: "Condition", properties_template: "condition" },
        0x500: { type: 0x500, item_type: "selector", display_name: "Selector", properties_template: "selector" },
        0x800: { type: 0x800, item_type: "data", display_name: "Data", properties_template: "data" }
    };

    this.mask = {
        "subtype": 0xFFF,
        "group": 0x4FFF
    };

    this.tieTypeFlags = {
        "grp": 0x4000,
        "multiple": 0x8000,
        "readonlyWriteLock": 0x01000000,
        "readonlyAppendLock": 0x02000000,
        "noZapd": 0x04000000,
        "invisibleWhenOff": 0x08000000,
        "negateSrcCondition": 0x40000000
    };


    this.noyesSubTypes = [
        { value: 0x110, label: "No/Yes" },
        { value: 0x111, label: "No/Yes/Na" }
    ];

    this.reflectorSubTypes = [
        { value: 0x140, label: "Reflector" }
    ];

    this.staticSubTypes = [
        { value: 0x150, label: "Static" }
    ];

    this.layoutSubTypes = [
        { value: 0x200, label: "pageBreak" }
    ];

    this.textboxSubTypes = [
        { value: 0x120, label: "Textbox Alpha" },
        { value: 0x121, label: "Textbox Multi-line" },
        { value: 0x122, label: "Textbox Auto Complete" },
        { value: 0x123, label: "Textbox Auto Complete Any" },
        { value: 0x124, label: "Textbox Date" },
        { value: 0x128, label: "Textbox Numeric" },
        { value: 0x129, label: "Textbox Numeric (non-zero)" }
    ];

    this.dropdownSubTypes = [
       { value: 0x130, label: "Dropdown" }
    ];

    this.photoSubTypes = [
        { value: 0x180, label: "Photo" },
        { value: 0x181, label: "Photo (with Thumbs)" }
    ];

    this.conditionSubTypes = [
        { value: 0x400, label: "Non-Zero" },
        { value: 0x401, label: "Equal" },
        { value: 0x402, label: "Less Than" },
        { value: 0x403, label: "Greater Than" }
    ];

    //this.conditionSubTypes = [
    //    { value: 0x400, label: "Basic Condition" },
    //    { value: 0x410, label: "Disabled-Is-Zero" },
    //    { value: 0x420, label: "Other-Value" },
    //];

    this.selectorSubTypes = [
        { value: 0x500, label: "Selector" },
        { value: 0x510, label: "Selector with child" }
    ];

    this.formatSubTypes = [
        { value: 0x200, label: "Page Break" }
    ];

    this.groupSubTypes = [
        { value: 0x000, label: "Basic Group - and" },
        { value: 0x001, label: "Basic Group - or" },
        { value: 0x022, label: "Validator Save" },
        { value: 0x023, label: "Validator Save List" },
        { value: 0x040, label: "Table" },
        { value: 0x080, label: "Score" }
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
            if (!(root.tieId in ignoreFields)) {
                var copy = angular.copy(root);
                // we don't want the controls as this is a flat list
                if (copy.theChildren) {
                    copy.theChildren = null;
                }
                flattenFieldList[root.tieId] = copy;
            }
            // the current field 
            if (root.theChildren) {
                flattenFieldList = this.getFieldList(root.theChildren, ignoreFields, flattenFieldList);
            }
        }
        return flattenFieldList;
    };

    this.getControlTypesList = function () {
        var types = [];
        $.merge(types, this.noyesSubTypes);
        $.merge(types, this.textboxSubTypes);
        $.merge(types, this.dropdownSubTypes);
        $.merge(types, this.photoSubTypes);
        $.merge(types, this.reflectorSubTypes);
        $.merge(types, this.staticSubTypes);
        $.merge(types, this.layoutSubTypes);
        return types;
    }


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