// @yassmine
App.controller('passengerDetailsCtrl', function($scope, $location, api) {
    $scope.title = "Fill in your details";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    $scope.passenger = {
        type: null,
        countryCode: null,
        nationality: null,
        sex: null,
        birthDate: null,
        birthPlace: null,
        nationalID: null,
        authority: null,
        issueDate: null,
        expiryDate: null,
        points: null,
        membership: null,
        firstName: null,
        middleName: null,
        lastName: null,
        passportNumber: null,
        phoneNumber: null,
        email: null

    };

    if (Type == 'desktop') {
        if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
            $location.path('/flights');
            return;
        }

        $scope.titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
        $scope.titlesBtnText = $scope.titles[0];
        $scope.changeTitle = function(text) {
            $scope.titlesBtnText = text;
        }

        api.getCountries().then(function mySucces(response) {
            $scope.countries = response.data;
        }, function myError(response) {
            console.log(response.statusText);
        });




        // ---------------------------------------- Now you have $scope.nationality and $scope.titlesBtnText you can use them in your object
        var complete = false;
        $scope.goNext = function() {

            /*if(!api.getChosenFlight())
            {
            $location.path('/flights');
            alert("You have to choose a flight");
            }*/
            //The reverting to the flights page

            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.nationality,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.titlesBtnText,
                firstName: $scope.firstName,
                middleName: $scope.middleName,
                lastName: $scope.lastName,
                passportNumber: $scope.passportNumber,
                phoneNumber: $scope.phoneNumber,
                email: $scope.email1


            };
            ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");



            if (complete == false) {
                $scope.alertData = false;
                if (($scope.firstName == null) || ($scope.middleName == null) || ($scope.lastName == null) || ($scope.phoneNumber == null) || ($scope.passportNumber == null)) {
                    $scope.alertData = true;

                } else {
                    $scope.alertConfirm = false;
                    if ($scope.email1 != $scope.emailver)
                        $scope.alertConfirm = true;
                    else {
                        $scope.alertCheck = false;
                        if (($scope.check == null))
                            $scope.alertCheck = true;
                        else {
                            complete = true;
                        }
                    }

                }


            }
            if (complete == true) {
                api.setPassenger($scope.passenger);
                $location.path('/seating/outgoing');
            }

        }
        $scope.goBack = function() {
            $location.path('/exit-flight');
        }
    } else {



        var complete1 = false;
        $scope.Next = function() {


            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.countriesMob,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.TitleMob,
                firstName: $scope.firstNameMob,
                middleName: $scope.middleNameMob,
                lastName: $scope.lastNameMob,
                passportNumber: $scope.passportNumberMob,
                phoneNumber: $scope.phoneNumberMob,
                email: $scope.email1Mob


            };




            if (complete1 == false) {

                if (($scope.firstNameMob == null) || ($scope.middleNameMob == null) || ($scope.lastNameMob == null) || ($scope.phoneNumberMob == null) || ($scope.passportNumberMob == null) || ($scope.email1Mob == null) || ($scope.emailverMob == null)) {
                    alert("Please fill in data");

                } else {

                    if ($scope.email1Mob != $scope.emailverMob)
                        alert("The entered emails do not match");
                    else {

                        if (($scope.checkMob == null))
                            alert("Please verify the information you entered")
                        else {
                            complete1 = true;

                        }
                    }

                }


            }
            if (complete1 == true) {
                api.setPassenger($scope.passenger);
                alert($scope.passenger)
                $location.path('/tab/seating/outgoing');
            }

        };
    }



});
