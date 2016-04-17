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
var outgoingFlight= api.getChosenOutGoingFlight();
var returFlight= api.getChosenReturningFlight();


  var booking = api.getBooking();

var facilities = ["Smoking areas available", "Wi-Fi availability",
"4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
 "Screens to show your flight pattern, aircraft altitude and speed"];

var departureDate = new Date(outgoingFlight.departureUTC);
     outgoingFlight.departureUTC = departureDate.toUTCString();
var arrivalDate = new Date(outgoingFlight.arrivalUTC);
     outgoingFlight.arrivalUTC = arrivalDate.toUTCString();
var aircrafthasSmoking;
var aircrafthasWifi;
// var aircraftModel;
var aircrafts = [];
api.getAircrafts().then(function mySucces(response) {
  aircrafts = response.data;
  for (var i = 0; i < aircrafts.length; i++) {
    if(aircrafts[i].tailNumber === outgoingFlight.refAircraftTailNumber)
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
      if(airports[i].iata === outgoingFlight.refOriginAirport){
            $scope.refOriginAirportName = airports[i].name;
      }
      if(airports[i].iata === outgoingFlight.refDestinationAirport){
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
  fare = outgoingFlight.economyFare;
}
else{
  businessOrEcon = "Business";
  fare = outgoingFlight.businessFare;
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
$scope.outgoingFlight = outgoingFlight;
$scope.businessOrEcon = businessOrEcon ;
$scope.fare = fare;
$scope.facilitiesResult = facilitiesResult;
// $scope.refDestinationAirportName =refDestinationAirportName;
// $scope.refOriginAirportName=refOriginAirportName;
$scope.aircrafthasSmoking = aircrafthasSmoking;
$scope.aircrafthasWifi = aircrafthasWifi;
// $scope.aircraftModel = aircraftModel;
});
