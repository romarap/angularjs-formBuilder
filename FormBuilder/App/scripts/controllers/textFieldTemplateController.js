'use strict';

/**
 * The controller doesn't do much more than setting the initial data model
 */
app.controller('textFieldTemplateController', function ($scope, controlsService) {
    $scope.models = {
        controls: {},
        leftPrompt : null,

    };
  
    //if (controls[item.controlId])
    controlsService.formControls(true).then(function (response) {
        if (response.status == 200) {
            $scope.models.controls = response.data;
        }
    });


        //$scope.hasLeftPrompt = function(item)
        //{
        //    try{
        //        if (controls[item.controlId]) {
        //            if 
        //            controls[item.control]
        //        }
        //    }catch(e){}
        //    return false
        //}
});

