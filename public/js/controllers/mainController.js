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
});
