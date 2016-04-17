// @Nabila
App.controller('exitFlightCtrl',function($scope,$location,api){
  $scope.pageClass = 'page-flight';
  $scope.title = "Flight Details";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";
  $scope.goNext = function(){
      $location.path('/passenger-details');
  }
  $scope.goBack = function(){
      $location.path('/flights');
  }



  if(!api.getChosenFlight() || !api.getBooking()){
    $location.path('/flights');
    return;
  }
var outgoingFlight = api.getChosenOutGoingFlight();
var returnFlight = api.getChosenReturningFlight();
// {
//     "number": "1000",
//     "departureUTC": "2016-04-01T07:00:00Z",
//     "arrivalUTC": "2016-04-01T09:00:00Z",
//     "duration": 120.0,
//     "status": "On Time",
//     "refAircraftTailNumber": "D-AAAA",
//     "operatorAirline": "Air Berlin",
//     "refOriginAirport": "CAI",
//     "refOriginAirportName": "Cairo International Airport", // nonexistent in flight schema, needed however in view
//     "refDestinationAirport": "TXL",
//     "refDestinationAirportName": "Berlin-Tegel Airport",  // nonexistent in flight schema, needed however in view
//     "boardingGate": "40",
//     "boardingPeriod": 45.0,
//     "boardingTerminal": "3",
//     "arrivalTerminal": "1",
//     "economyFare": 200.0,
//     "businessFare": 300.0,
//     "emptyEconomySeatsCount": null,
//     "emptyBusinessSeatsCount": null,
//     "economySeatSchema": null,
//     "buisnessSeatSchema": null,
//     "seatmap": null
//   };
  var booking = api.getBooking();
//   {
//   "_id": "A235647925",
//   "refPassengerID": ["C673482992G"],
//   "exitDepartureUTC": "2016-04-01T07:00:00Z",
//   "reEntryDepartureUTC": null,
//   "issueDate": "2016-03-30T06:00:00Z",
//   "isEconomy": true,
//   "isOneWay": true,
//   "refExitFlightNumber": "1000",
//   "refReEntryFlightNumber": null,
//   "receiptNumber": "054"
// };
var facilities = ["Smoking areas available", "Wi-Fi availability",
"4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
 "Screens to show your flight pattern, aircraft altitude and speed"];

var departureDate = new Date(flight.departureUTC);
     flight.departureUTC = departureDate.toUTCString();
var arrivalDate = new Date(flight.arrivalUTC);
     flight.arrivalUTC = arrivalDate.toUTCString();
var aircrafthasSmoking;
var aircrafthasWifi;
// var aircraftModel;
var aircrafts = [];
api.getAircrafts().then(function mySucces(response) {
  aircrafts = response.data;
  for (var i = 0; i < aircrafts.length; i++) {
    if(aircrafts[i].tailNumber === flight.refAircraftTailNumber)
    {
    aircrafthasSmoking = aircrafts[i].hasSmoking;
    aircrafthasWifi = aircrafts[i].hasWifi;
    $scope.aircraftModel =aircrafts[i].model;
}
  }
}, function myError(response) {
  console.log(response.statusText);
});
//  {
//   "tailNumber": "D-AAAA",
//   "model": "Airbus A330",
//   "economySeatCount": 320,
//   "businessSeatCount": 24,
//   "hasWifi": true,
//   "hasSmoking": false
// };
 $scope.refOriginAirportName;
$scope.refDestinationAirportName;
 var airports = [];
  api.getAirports().then(function mySucces(response) {
    airports = response.data;
    for (var i = 0; i < airports.length; i++) {
      if(airports[i].iata === flight.refOriginAirport){
            $scope.refOriginAirportName = airports[i].name;
      }
      if(airports[i].iata === flight.refDestinationAirport){
          $scope.refDestinationAirportName = airports[i].name;
      }


    }
  }, function myError(response) {
    console.log(response.statusText);
  });
var businessOrEcon ="";
var fare = 0;
if(booking.isEconomy){
  businessOrEcon = "Economy";
  fare = flight.economyFare;
}
else{
  businessOrEcon = "Business";
  fare = flight.businessFare;
}
var facilitiesResult = [];
if(aircrafthasSmoking)
  facilitiesResult.push( facilities[0]);
if(aircrafthasWifi)
  facilitiesResult.push( facilities[1]);
if(!booking.isEconomy){
  facilitiesResult.push( facilities[2]);
  facilitiesResult.push( facilities[3]);
  facilitiesResult.push( facilities[4]);
}
facilitiesResult.push( facilities[5]);
$scope.flight = flight;
$scope.businessOrEcon = businessOrEcon ;
$scope.fare = fare;
$scope.facilitiesResult = facilitiesResult;
// $scope.refDestinationAirportName =refDestinationAirportName;
// $scope.refOriginAirportName=refOriginAirportName;
$scope.aircrafthasSmoking = aircrafthasSmoking;
$scope.aircrafthasWifi = aircrafthasWifi;
// $scope.aircraftModel = aircraftModel;
});
