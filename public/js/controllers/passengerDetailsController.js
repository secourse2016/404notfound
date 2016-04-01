// @yassmine
App.controller('passengerDetailsCtrl',function($scope,$location) {
    $scope.title = "Fill in your details";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.goNext = function(){
      ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");
      console.log($scope.passenger);
        $location.path('/seating');
    }
    $scope.goBack = function(){
        $location.path('/exit-flight');
    }
    //yasmine you're not expecting any parameters. You're only creating a form and you will have
    // the resulting object ready to be sent to the server


    $scope.passenger = {
      firstName: passenger.firstName,
      middleName: passenger.middleName,
      lastName: passenger.lastName,
      passportNumber: passenger.passportNumber,
      phoneNumber: passenger.phoneNumber,
      email: passenger.email
      //i couldn't extract the value of the country nor the title.

     };
});
