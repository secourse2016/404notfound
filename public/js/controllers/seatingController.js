// @ahmed-essmat
App.controller('seatingCtrl', function($scope, $location) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";
    $scope.goNext = function() {
        $location.path('/payment');
    }
    $scope.goBack = function() {
        $location.path('/passenger-details');
    }

    var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
    var schema = [2, 5, 2, 50];

    $scope.array1 = [];

    $scope.array2 = [];

    $scope.array3 = [];

    $scope.bob = [];

    for (var i = 0; i < schema[0]; i++) {
        $scope.array1.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[1]; i++) {
        $scope.array2.push(alphabits[0]);
        alphabits.splice(0, 1);
    }
    for (var i = 0; i < schema[2]; i++) {
        $scope.array3.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[3]; i++) {
        $scope.bob.push(i);

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

        }
    ]
    $scope.searchColor = function(text) {
        for (var i = 0; i < seatmap.length; i++) {
            if (seatmap[i]['number'] == text) {
                if (seatmap[i]['isEmpty']) {
                    return 'seatEmpty';
                } else {
                    return 'seatOcu';
                }
            }
        }
    }
    console.log($scope.searchColor('D1'));
    $scope.alert = function(text) {

        alert(text);

    };
});
