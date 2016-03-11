'use strict';

var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'dndLists'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/home.html',
          controller: 'homeController'
      })
      .when('/forms', {
          templateUrl: 'views/forms.html',
          controller: 'formsController'
      })
      .when('/forms/:id', {
          templateUrl: 'views/forms.html',
          controller: 'formsController'
      })
      .otherwise({
          redirectTo: '/'
      });
}])
.controller('mainController', function ($scope) {

});





