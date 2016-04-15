App.controller('mainCtrl', function($scope, $location, api,$translate) {
      $scope.pageClass = 'page-main';

  $('#main-text').typeIt({
    strings: [$translate.instant('MAIN.QUOTES_HOME.1'),$translate.instant('MAIN.QUOTES_HOME.2'),$translate.instant('MAIN.QUOTES_HOME.3'),$translate.instant('MAIN.QUOTES_HOME.4')],
    speed: 120,
    breakLines: false,
    loop: true
  });


  $scope.goToFlights = function() {
    $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination',$scope.selectedDest).search('exitDate',($scope.exitData.getTime()/1000).toFixed(0));
  };
  $location.url($location.path());
  setUpDate($scope);

  $scope.children = ['0 ' + $translate.instant('MAIN.CHILDREN'), '1 ' + $translate.instant('MAIN.CHILD'), '2 ' + $translate.instant('MAIN.CHILDREN'), '3 ' + $translate.instant('MAIN.CHILDREN'), '4 ' + $translate.instant('MAIN.CHILDREN')];
  $scope.childrenBtnText = $scope.children[0];
  $scope.changeChildren = function(text) {
    $scope.childrenBtnText = text;
  }



  $scope.adults = ['1 '+$translate.instant('MAIN.ADULT') , '2 '+$translate.instant('MAIN.ADULTS'), '3 ' + $translate.instant('MAIN.ADULTS'), '4 '+$translate.instant('MAIN.ADULTs')];
  $scope.adultBtnText = $scope.adults[0];
  $scope.changeAdult = function(text) {
    $scope.adultBtnText = text;
  }

  $scope.infants = ['0 '+$translate.instant('MAIN.INFANT'), '1 '+$translate.instant('MAIN.INFANTS')];
  $scope.infantBtnText = $scope.infants[0];
  $scope.changeInfant = function(text) {
    $scope.infantBtnText = text;
  }

  api.getAirports().then(function mySucces(response) {
    $scope.airports = response.data;
  }, function myError(response) {
    console.log(response.statusText);
  });
  $scope.selectedOrigin = undefined;
  $scope.selectedDest = undefined;

  function airporsContains(iata) {
    for (var i = 0; i < $scope.airports.length; i++) {
      if(iata == $scope.airports[i]['iata'])
        return true;
    }
    return false;
  }

  $scope.buttonState = function(){
    return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitData || $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin ) || !airporsContains($scope.selectedDest);
  }
});

function setUpDate($scope) {
  $scope.today = function() {
    $scope.exitData = new Date();
  };
  $scope.today();

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };
  $scope.setDate = function(year, month, day) {
    $scope.exitData = new Date(year, month, day);
  };

  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }
  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };
  $scope.popup2 = {
    opened: false
  };
}
