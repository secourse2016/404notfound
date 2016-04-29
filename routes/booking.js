var db = require('../db.js');
var express = require('express');
var router = express.Router();


/*this function is the core of our app, it inserts the passenger data into the database,
  updates the selected seat and inserts the booking object into the database*/

router.post("/booking", function(req, res) {

  if (req.headers['other-hosts'] == 'false') {

    var passenger = req.body.passenger;
    var booking = req.body.booking;
    var exitFlightID = booking.refExitFlightID;
    var returnFlightID = booking.refReEntryFlightID;
    var bookingID;
    var passengersIDs = [];
    var exitIsEconomy, reEntryIsEconomy;
    var outgoingSeatNumber, returnSeatNumber;

    db.postPassengers(passenger, function(err, data) {

      if (!err) {

        passengersIDs.push(data.ops[0]._id);
        booking.refPassengerID.push(passengersIDs[0]);

        db.postBooking(booking, function(err, data) {

          if (!err) {

            bookingID = data.ops[0]._id;
            exitIsEconomy = booking.exitIsEconomy;
            outgoingSeatNumber = req.body.outgoingSeatNumber;

            res.send("Your booking was submitted successfully");

            db.updateFlight(false, exitFlightID, exitIsEconomy, outgoingSeatNumber, passengersIDs, bookingID, function(err, data) {

              if (!err) {

                if (returnFlightID) {

                  reEntryIsEconomy = booking.reEntryIsEconomy;
                  returnSeatNumber = req.body.returnSeatNumber;

                  db.updateFlight(false, returnFlightID, reEntryIsEconomy, returnSeatNumber, passengersIDs, bookingID, function(err, data) {

                    if (!err) {

                      res.send({
                        refNum: booking.receiptNumber,
                        errorMessage: err
                      });

                      console.log('successfully added your booking');
                      return;

                    } else {

                      res.send({
                        refNum: booking.receiptNumber,
                        errorMessage: err
                      });

                      console.log('error occured while adding your booking');
                      return;

                    }

                  });

                }

              } else {

                res.send({
                  refNum: booking.receiptNumber,
                  errorMessage: err
                });

                console.log('error occured while adding your booking');
                return;

              }

            });

          }

        });

      }

    });

  } else {

    var booking = {
      "refPassengerID": null,
      "issueDate": (new Date()).toUTCString(),
      "isOneWay": req.body.returnFlightId ? false : true,
      "refExitFlightID": req.body.outgoingFlightId,
      "refReEntryFlightID": req.body.returnFlightId,
      "exitIsEconomy": req.body.class === "economy" ? true : false,
      "reEntryIsEconomy": req.body.class === "economy" ? true : false,
      "receiptNumber": null
    };

    var passengers = [];

    req.body.passengerDetails.forEach(function(passenger) {

        passengers.push({
            type: null,
            countryCode: null,
            nationality: passenger.nationality,
            sex: null,
            birthDate: passenger.dateOfBirth,
            birthPlace: null,
            nationalID: null,
            authority: null,
            issueDate: null,
            expiryDate: passenger.passportExpiryDate,
            points: null,
            membership: null,
            title: null,
            firstName: passenger.firstName,
            middleName: null,
            lastName: passenger.lastName,
            passportNumber: passenger.passportNum,
            phoneNumber: null,
            email: passenger.email
          };
        });

    );

  }

});

module.exports = router;
