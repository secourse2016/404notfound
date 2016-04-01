App.controller('mainCtrl',function($scope,$location){
  $('#main-text').typeIt({
    strings: [
      "We as a company care about nothing but money....", "But you will enjoy it....", "Bgd bgd hamada...", "Msh mesada2? ta3ala garab....."
    ],
    speed: 120,
    breakLines: false,
    loop: true
  });

  $scope.goToFlights = function(){
    $location.path('/flights');
  };

setUpDate($scope);

});

function setUpDate($scope){
  $scope.today = function() {
  $scope.dt = new Date();
  };
  $scope.today();

  $scope.open2 = function() {
   $scope.popup2.opened = true;
  };
  $scope.setDate = function(year, month, day) {
     $scope.dt = new Date(year, month, day);
   };
   function disabled(data) {
     var date = data.date,
       mode = data.mode;
     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
   }
   $scope.dateOptions = {
     dateDisabled: disabled,
     formatYear: 'yy',
     maxDate: new Date(2020, 5, 22),
     minDate: new Date(),
     startingDay: 1
   };
   $scope.popup2 = {
     opened: false
   };
}
