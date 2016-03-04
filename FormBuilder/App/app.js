'use strict';

var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'dndLists'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/home.html',
          controller: 'homeController'
      })
      .when('/create', {
          templateUrl: 'views/create.html',
          controller: 'createController'
      })
      .when('/:id/view', {
          templateUrl: 'views/view.html',
          controller: 'viewController'
      })
        .when('/tryIt', {
            templateUrl: 'views/tryIt.html',
            controller: 'tryItController'
        })
      .when('/build', {
          templateUrl: 'views/build.html',
          controller: 'buildController'
      })
      .when('/build2', {
          templateUrl: 'views/build2.html',
          controller: 'buildController2'
      })
      .otherwise({
          redirectTo: '/'
      });
}])
.controller('mainController', function ($scope) {

});





