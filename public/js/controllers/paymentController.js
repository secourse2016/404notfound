// @mirna
App.controller('paymentCtrl', function($scope, $location,api) {
      $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function() {
    $location.path('/confirmation');
  }
  $scope.goBack = function() {
    $location.path('/seating');
  }


  if(!api.getChosenOutGoingFlight() || !api.getBooking()){
    $location.path('/flights');
    return;
  }
  if(!api.getPassenger()){
    $location.path('/passenger-details');
      return;
  }

  if(api.getCabinetClass() == 'Economy')
    $scope.price = api.getChosenFlight().economyFare
  else
    $scope.price = api.getChosenFlight().businessFare

  $scope.years = ['2016','2017','2018','2019','2020','2021','2022','2023','2024'];
  $scope.yearsBtnText = $scope.years[0];
  $scope.changeYear = function(text) {
    $scope.yearsBtnText = text;
  }

  $scope.months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
  $scope.monthsBtnText = $scope.months[0];
  $scope.changeMonth = function(text) {
    $scope.monthsBtnText = text;
  }
  //mirna nty gaya thazary l sprint deh bs khoshy ma3a Ahmed fel seatings bta3to
});
