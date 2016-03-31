// @abdelrahman-maged
App.controller('flightsCtrl',function($scope,$location){
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.isCollapsed = true;
  $scope.goNext = function(){
      $location.path('/exit-flight');
  }
  $scope.goBack = function(){
      $location.path('/');
  }

  $scope.flights = [
    {
      "number": "1000",
      "departureUTC": "2016-04-01T07:00:00Z",
      "arrivalUTC": "2016-04-01T09:00:00Z",
      "duration": 2.0,
      "status": "On Time",
      "refAircraftTailNumber": "D-AAAA",
      "refAircraftModel": "Airbus A330", // nonexistent in flight schema, needed however in view
      "operatorAirline": "Air Berlin",
      "refOriginAirport": "CAI",
      "refOriginAirportName": "Cairo International Airport", // nonexistent in flight schema, needed however in view
      "refDestinationAirport": "TXL",
      "refDestinationAirportName": "Berlin-Tegel Airport", // nonexistent in flight schema, needed however in view
      "boardingGate": "40",
      "boardingPeriod": 45.0,
      "boardingTerminal": "3",
      "arrivalTerminal": "1",
      "economyFare": 200.0,
      "businessFare": 300.0,
      "emptyEconomySeatsCount": 320, // retrieved in backend from aircrafts collection
      "emptyBusinessSeatsCount": 24, // retrieved in backend from aircrafts collection
      "economySeatSchema": null,
      "buisnessSeatSchema": null,
      "seatmap": null
    }
  ];

});
