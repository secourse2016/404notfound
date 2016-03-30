App.controller('passengerDetailsCtrl',function($scope,$location) {
    $scope.title = "Fill in your details";
    $scope.buttonText = "Next";
    $scope.goNext = function(){
        $location.path('/seating');
    }
});
