App = angular.module('airBerlinApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate'])
  .controller('parentCtrl', function($scope, $location) {
    $scope.goHome = function() {
      $location.path('/');
    }
    $scope.goAboutUs = function() {
      $location.path('/about');
    }
    $scope.goContactUs = function() {
      $location.path('/contact-us');
    }
  })
  .config(function($animateProvider) {
    $animateProvider.classNameFilter(/page/);
  });
