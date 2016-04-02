App.controller('mainCtrl', function($scope, $location, api) {
  $('#main-text').typeIt({
    strings: [
      "We as a company care about nothing but money....", "But you will enjoy it....", "Bgd bgd hamada...", "Msh mesada2? ta3ala garab....."
    ],
    speed: 120,
    breakLines: false,
    loop: true
  });

  $scope.goToFlights = function() {
    $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination',$scope.selectedDest).search('exitDate',$scope.exitData);
  };

  setUpDate($scope);

  $scope.children = ['0 children', '1 child', '2 children', '3 children', '4 children'];
  $scope.childrenBtnText = $scope.children[0];
  $scope.changeChildren = function(text) {
    $scope.childrenBtnText = text;
  }



  $scope.adults = ['1 adult', '2 adults', '3 adults', '4 adults'];
  $scope.adultBtnText = $scope.adults[0];
  $scope.changeAdult = function(text) {
    $scope.adultBtnText = text;
  }

  $scope.infants = ['0 infants', '1 infant'];
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

  $scope.buttonState = function(){
    return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitData;
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
