App = angular.module('airBerlinApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate','pascalprecht.translate'])
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
    $scope.goOffers = function() {
      $location.path('/offers');
    }
    $scope.goServices = function() {
      $location.path('/services');
    }
    $scope.goTeam = function(){
      $location.path('/team');
    }
  })
  .config(function($animateProvider,$locationProvider,$translateProvider) {
    //  $locationProvider.html5Mode(true);
    $animateProvider.classNameFilter(/page/);
  });

App.controller('404Ctrl',function($scope,$location){
  $scope.goToTeam = function(){
    $location.path('/team');
  }
})
