App = angular
.module('airberlin', ['ui.bootstrap', 'ngRoute', 'pascalprecht.translate'])
.controller('parentCtrl', function ($scope, $location, $translate) {
    $scope.goHome = function () {
        $location.path('/');
    }
    $scope.goAboutUs = function () {
        $location.path('/about');
    }
    $scope.goContactUs = function () {
        $location.path('/contact-us');
    }
    $scope.goOffers = function () {
        $location.path('/offers');
    }
    $scope.goServices = function () {
        $location.path('/services');
    }
    $scope.goTeam = function () {
        $location.path('/team');
    }
    $scope.changeLangauge = function (code) {
        $translate.use(code);
    }
});
