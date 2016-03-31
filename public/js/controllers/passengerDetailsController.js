// @yassmine
App.controller('passengerDetailsCtrl',function($scope,$location) {
    $scope.title = "Fill in your details";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.goNext = function(){
        $location.path('/seating');
    }
    $scope.goBack = function(){
        $location.path('/exit-flight');
    }
    //yasmine you're not expecting any parameters. You're only creating a form and you will have
    // the resulting object ready to be sent to the server

});
