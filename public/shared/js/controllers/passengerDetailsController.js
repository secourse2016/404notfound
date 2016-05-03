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






    var complete = false;
    $scope.goNext = function() {



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



      // if (complete == false) {
      //   $scope.alertData = false;
      //   if (($scope.firstName == null) || ($scope.middleName == null) || ($scope.lastName == null) || ($scope.phoneNumber == null) || ($scope.passportNumber == null) || ($scope.email1 == null) || ($scope.emailver == null)) {
      //     $scope.alertData = true;
      //
      //   } else {
      //     $scope.alertConfirm = false;
      //     if ($scope.email1 != $scope.emailver)
      //       $scope.alertConfirm = true;
      //     else {
      //       $scope.alertCheck = false;
      //       if (($scope.check == null))
      //         $scope.alertCheck = true;
      //       else {
      //         complete = true;
      //       }
      //     }
      //
      //   }
      //
      //
      // }
      // if (complete == true) {
      //   api.setPassenger($scope.passenger);
      //   if (!api.isOtherHosts)
      //     $location.path('/seating/outgoing');
      //   else $location.path('/payment')
      // }

var fields = [true, true, true, true, true,true, true, true, true,true];

$scope.alertFName = false;
$scope.alertMName = false;
$scope.alertLName = false;
$scope.alertPhNumber = false;
$scope.alertPNumber= false;
$scope.alertCountry=false;
$scope.alertEmail = false;
$scope.alertConfirm = false;
$scope.alertCheck = false;


if($scope.firstName==null){
fields[0]=false;
$scope.alertFName = true;
}
if($scope.middleName==null){
fields[1]=false;
$scope.alertMName = true;
}
if($scope.lastName==null){
fields[2]=false;
$scope.alertLName = true;
}
if($scope.phoneNumber==null){
fields[3]=false;
$scope.alertPhNumber = true;
}
if($scope.passportNumber==null){
fields[4]=false;
$scope.alertPNumber= true;
}
if($scope.nationality==null){
fields[5]=false;
$scope.alertCountry = true;
}
if($scope.email1==null){
fields[6]=false;
$scope.alertEmail = true;
}
if($scope.emailver==null){
fields[7]=false;
$scope.alertEmail = true;
}
if($scope.email1!=$scope.emailver){
fields[8]=false;
$scope.alertConfirm = true;
}
if($scope.check==null){
fields[9]=false;
$scope.alertCheck = true;
}

var allpassing = true;

for(var i = 0; i<fields.length;i++)
{
  if(fields[i]==false)
  {
    allpassing=false;
    break;
  }
}

if (allpassing == true) {
   api.setPassenger($scope.passenger);
   if (!api.isOtherHosts)
     $location.path('/seating/outgoing');
   else $location.path('/payment')
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




      // if (complete1 == false) {
      //
      //   if (($scope.firstNameMob == null) || ($scope.middleNameMob == null) || ($scope.lastNameMob == null) || ($scope.phoneNumberMob == null) || ($scope.passportNumberMob == null) || ($scope.email1Mob == null) || ($scope.emailverMob == null)) {
      //     alert("Please fill in data:" + "\n" + "Passport Number must be 8 numbers" + "\n" +
      //       "Phone Number must be 10 numbers" + "\n" + "Emails must be in a@xyz.com format");
      //
      //   } else {
      //
      //     if ($scope.email1Mob != $scope.emailverMob)
      //       alert("The entered emails do not match");
      //     else {
      //
      //       if (($scope.checkMob == null))
      //         alert("Please verify the information you entered")
      //       else {
      //         complete1 = true;
      //
      //       }
      //     }
      //
      //   }
      //
      //
      // }
      //
      // if (complete1 == true) {
      //   api.setPassenger($scope.passenger);
      //
      //   $location.path('/tab/seating/outgoing');
      // }



      var fieldsMob = [true, true, true, true, true,true, true, true, true];




      if($scope.firstNameMob==null){
      fieldsMob[0]=false;
      alert("Please Enter your first name.")
      }
      if($scope.middleNameMob==null){
      fieldsMob[1]=false;
    alert("Please enter your middle name.");
      }
      if($scope.lastNameMob==null){
      fieldsMob[2]=false;
      alert("Please enter your last name.");

      }
      if($scope.phoneNumberMob==null){
      fieldsMob[3]=false;
      alert("Please enter your phone number, it must be 10 digits");
      }
      if($scope.passportNumberMob==null){
      fieldsMob[4]=false;
    alert("Please enter your passport number, it must be 8 digits.");
      }
      if($scope.email1==null){
      fieldsMob[5]=false;
alert("Please enter your email, it must be in this format 'a@xyz.com' ");
      }
      if($scope.emailver==null){
      fieldsMob[6]=false;
      alert("Please confirm your email, it must be in this format 'a@xyz.com' ");

      }
      if($scope.email1!=$scope.emailver){
      fieldsMob[7]=false;
alert("The entered emails do not match");
      }
      if($scope.check==null){
      fieldsMob[8]=false;
alert("Please verify the information you've entered");
      }

      var allpassingMob = true;

      for(var i = 0; i<fieldsMob.length;i++)
      {
        if(fieldsMob[i]==false)
        {
          allpassingMob=false;
          break;
        }
      }

      if (allpassingMob == true) {
         api.setPassenger($scope.passenger);

        $location.path('/tab/seating/outgoing');
      }

    };
  }



});
