// @mirna
App.controller('paymentCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-payment';
  $scope.title = "Choose your payment option";

  $scope.buttonTextNxt = "Pay!";
  $scope.buttonTextBk = "Back";

  $scope.form = {
    number: null,
    cvc: null,
    exp_month: null,
    exp_year: null
  };
  $scope.goNext = function() {
    $scope.form.exp_year = $scope.yearsBtnText
    $scope.form.exp_month = parseInt($scope.months.indexOf($scope.monthsBtnText)) + 1
    Stripe.card.createToken($scope.form, function(status, response) {
      api.setStripeToken(response.id)
      api.submitBooking(api.IsOtherHosts()).then(function(data) {
        $location.path('/confirmation');
        // api.clearLocal();
      }, function(err) {

      })
    });

    // if (!api.IsOtherHosts())
  }
  $scope.goBack = function() {
    $location.path('/seating');
  }

  if (Type == 'desktop') {

    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
      $location.path('/flights');
      return;
    }
    if (!api.getPassenger()) {
      $location.path('/passenger-details');
      return;
    }
    var price = 0;
    if (api.getCabinetOutgoingClass() == 'Economy')
      price = api.getChosenOutGoingFlight().economyFare
    else
      price = api.getChosenOutGoingFlight().businessFare

    if (api.getChosenReturningFlight()) {

      if (api.getCabinetReturningClass() == 'Economy')
        price = price + api.getChosenReturningFlight().economyFare
      else
        price = price + api.getChosenReturningFlight().businessFare


    }


    $scope.price = price;
    $scope.years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    $scope.yearsBtnText = $scope.years[0];
    $scope.changeYear = function(text) {
      $scope.yearsBtnText = text;
    }

    $scope.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.monthsBtnText = $scope.months[0];
    $scope.changeMonth = function(text) {
      $scope.monthsBtnText = text;
      $scope.monthsBtnNo = $scope.months.indexOf(text);
    }
  }

});
