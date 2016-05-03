App = angular.module('airBerlinApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate','pascalprecht.translate','angular-stripe'])
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
  .config(function($animateProvider,stripeProvider) {
    $animateProvider.classNameFilter(/page/);
     stripeProvider.setPublishableKey('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
  });

App.controller('404Ctrl',function($scope,$location){
  $scope.goToTeam = function(){
    $location.path('/team');
  }
})
