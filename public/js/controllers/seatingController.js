

// @ahmed-essmat

App.controller('seatingCtrl',function($scope,$location){

  $scope.title = "Where would you like to sit?";

  $scope.buttonText = "Next";

  $scope.goNext = function(){

      $location.path('/payment');

  };

  //ahmed you will get the whole flight object refer back to the schema to make sure you understand

  //everything

  // use this schema for now

  var alphabits =['A','B','C','D','E','F','G','H','I','J','K','L',"M","N"];

  var schema = [2,5,2,50];

   $scope.array1 = [];

   $scope.array2 = [];

   $scope.array3 = [];

   $scope.bob = [];

​

​

​

​

​

  for (var i = 0; i < schema[0]; i++) {

    $scope.array1.push(alphabits[0]);

    alphabits.splice(0, 1);

  }

  for (var i = 0; i < schema[1]; i++) {

    $scope.array2.push(alphabits[0]);

    alphabits.splice(0, 1);

  }for (var i = 0; i < schema[2]; i++) {

    $scope.array3.push(alphabits[0]);

    alphabits.splice(0, 1);

  }

  for (var i = 0; i < schema[3]; i++) {

    $scope.bob.push(i);

    // alphabits.splice(0, 1);

  }

  var seatmap = [

        {

          "number": "A1",

          "isEmpty": false,

          "isEconomy": false,

          "isAisle": false,

          "hasSmoking": false,

          "hasScreen": true,

          "refBookingID": null,

          "refPassengerID": null

        }, {

          "number": "D1",

          "isEmpty": true,

          "isEconomy": false,

          "isAisle": true,

          "hasSmoking": false,

          "hasScreen": true,

          "refBookingID": null,

          "refPassengerID": null

        }, {

          "number": "G1",

          "isEmpty": true,

          "isEconomy": false,

          "isAisle": true,

          "hasSmoking": false,

          "hasScreen": true,

          "refBookingID": null,

          "refPassengerID": null

        }]

​

​

​

  $scope.searchColor = function(text){

      for (var i = 0; i < seatmap.length; i++) {

        if(seatmap[i]['number'] == text){

          if(seatmap[i]['isEmpty']){

            return 'seatEmpty';

            }

            else{

              return 'seatOcu';

            }

        }

      }}

​

console.log($scope.searchColor('D1'));

​

​

  $scope.alert = function (text) {

    alert(text);

  };

​

});
