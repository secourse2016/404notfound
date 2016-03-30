// @yassmine
App.controller('passengerDetailsCtrl',function($scope,$location) {
    $scope.title = "Fill in your details";
    $scope.buttonText = "Next";
    $scope.goNext = function(){
        $location.path('/seating');
    }
    //yasmine you're not expecting any parameters. You're only creating a form and you will have
    // the resulting object ready to be sent to the server

});
