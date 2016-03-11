'use strict';

   
// get a flat list of fields but ignore fields in the ignore list
var getFieldList = function (root, ignoreFields, flattenFieldList) {
    // ensure valid ignore fields - not null
    if (!ignoreFields)
    {
        ignoreFields = {};
    }

    if (Array.isArray(root)) {
        for (var i = 0; i < root.length; i++) {
            flattenFieldList = getFieldList(root[i], ignoreFields, flattenFieldList);
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
            flattenFieldList = getFieldList(root.controls, ignoreFields, flattenFieldList);
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