'use strict';

var ViewCtrl = app.controller('viewController', function ($scope, FormService, $routeParams) {
    $scope.form = {};
	// read form with given id
	FormService.form($routeParams.id).then(function(form) {
		$scope.form = form;
	});
});
