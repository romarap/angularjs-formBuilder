'use strict';

var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'dndLists'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/home.html',
          controller: 'homeController'
      })
      .when('/edit', {
          templateUrl: 'views/edit.html',
          controller: 'editController'
      })
      .otherwise({
          redirectTo: '/'
      });
}])
.controller('mainController', function ($scope) {

});





