var db = require('../db.js');
var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_7OmjPhkDeNnP4d41dR5hteUC');



router.get('/stripe/pubkey', function(req, res) {
  res.send('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
})

/*this function is the core of our app, it inserts the passenger data into the database,
  updates the selected seat and inserts the booking object into the database*/

router.post("/booking", function(req, res) {
  var price = parseInt(req.body.price) * 100;
  if (req.headers['other-hosts'] == 'false') {
    stripe.charges.create({
      amount: price,
      currency: "usd",
      source: req.body.token,
      description: "test"
    }, function(err, data) {
      if (err) res.send({
        refNum: null,
        errorMessage: err
      });
      else {
        var passenger = req.body.passenger;
        var booking = req.body.booking;
        var exitFlightID = booking.refExitFlightID;
        if (booking.refReEntryFlightID)
          var returnFlightID = booking.refReEntryFlightID;
        var bookingID;
        var passengersIDs = [];
        var exitIsEconomy, reEntryIsEconomy;
        var outgoingSeatNumber, returnSeatNumber;

        db.postPassengers(passenger, function(err, data) {

          if (!err) {

            passengersIDs.push(data[0]);
            booking.refPassengerID = []
            booking.refPassengerID.push(passengersIDs[0]);

            db.postBooking(booking, function(err, data) {

              if (!err) {

                bookingID = data.ops[0]._id;
                exitIsEconomy = booking.exitIsEconomy;
                outgoingSeatNumber = req.body.outgoingSeatNumber;

                db.updateFlight(false, exitFlightID, exitIsEconomy, outgoingSeatNumber, passengersIDs, bookingID, function(err, data) {

                  if (!err) {

                    if (returnFlightID) {

                      reEntryIsEconomy = booking.reEntryIsEconomy;
                      returnSeatNumber = req.body.returnSeatNumber;

                      db.updateFlight(false, returnFlightID, reEntryIsEconomy, returnSeatNumber, passengersIDs, bookingID, function(err, data) {

                        if (!err) {

                          res.send({
                            refNum: bookingID,
                            errorMessage: err
                          });

                          console.log('successfully updated flight');
                          return;

                        } else {

                          res.send({
                            refNum: null,
                            errorMessage: err
                          });

                          console.log('error occured while updating the flight');
                          return;

                        }

                      });

                    } else {
                      res.send({
                        refNum: bookingID,
                        errorMessage: err
                      });

                      console.log('successfully added your booking');
                      return;
                    }

                  } else {

                    res.send({
                      refNum: null,
                      errorMessage: err
                    });

                    console.log('error occured while updating the flight');
                    return;

                  }

                });

              }

            });

          }

        });

      }
    });

  } else {
    var price = parseInt(req.body.cost) *100;
    // Conforming alien booking into air-berlin-valid objects
    stripe.charges.create({
      amount: price,
      currency: "usd",
      source: req.body.paymentToken,
      description: "test"
    }, function(err, data) {
      if (err) res.send({
        refNum: null,
        errorMessage: err
      });
      else {
        var booking = {
          "refPassengerID": [],
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
          });

        });

        // Post passengers & update flight(s)

        db.postPassengers(passengers, function(err, data) {

          if (!err) {

            data.forEach(function(passengerID) {
              booking.refPassengerID.push(passengerID);
            });

            db.postBooking(booking, function(err, data) {

              if (!err) {

                var bookingID = data.ops[0]._id;

                db.updateFlight(true, booking.refExitFlightID, booking.exitIsEconomy, null, booking.refPassengerID, bookingID, function(err, data) {

                  if (!err) {

                    if (!booking.isOneWay) {

                      db.updateFlight(true, booking.refReEntryFlightID, booking.reEntryIsEconomy, null, booking.refPassengerID, bookingID, function(err, data) {
                        if (!err) {
                          res.send({
                            refNum: bookingID,
                            errorMessage: err
                          });
                          console.log('successfully added your booking');
                          return;
                        } else {
                          res.send({
                            refNum: bookingID,
                            errorMessage: err
                          });
                          console.log('error occured while updating the flight');
                          return;
                        }
                      });
                    } else {
                      res.send({
                        refNum: bookingID,
                        errorMessage: err
                      });
                      console.log('successfully added your booking');
                      return;
                    }
                  } else {

                    res.send({
                      refNum: bookingID,
                      errorMessage: err
                    });

                    console.log('error occured while updating the flight');
                    return;

                  }

                });

              }

            });

          }

        });


      }
    })


    // Finding empty seats for passengers

    // var outgoingSeatNumbers = [];
    // var returnSeatNumbers = [];
    //
    // function findEmptyEconomySeat(seat) {
    //   return seat.isEconomy === true && seat.isEmpty === true;
    // }
    //
    // function findEmptyBusinessSeat(seat) {
    //   return seat.isEconomy === false && seat.isEmpty === true;
    // }
    //
    // db.getFlight(booking.refExitFlightID, function(err, flight) {
    //
    //   if (booking.exitIsEconomy) {
    //
    //     if (flight.emptyEconomySeatsCount < passengers.length) {
    //       // TODO: Send back error
    //     } else {
    //       for (var i = 0; i < passengers.length; i++) {
    //         outgoingSeatNumbers.push(flight.seatmap.find(findEmptyEconomySeat).number);
    //       }
    //     }
    //
    //   } else {
    //
    //     if (flight.emptyBusinessSeatsCount < passengers.length) {
    //       // TODO: Send back error
    //     } else {
    //       for (var i = 0; i < passengers.length; i++) {
    //         outgoingSeatNumbers.push(flight.seatmap.find(findEmptyBusinessSeat).number);
    //       }
    //     }
    //
    //   }
    //
    // });
    //
    // if (!booking.isOneWay) {
    //
    //   db.getFlight(booking.refReEntryFlightID, function(err, flight) {
    //
    //     if (booking.reEntryIsEconomy) {
    //
    //       if (flight.emptyEconomySeatsCount < passengers.length) {
    //         // TODO: Send back error
    //       } else {
    //         for (var i = 0; i < passengers.length; i++) {
    //           returnSeatNumbers.push(flight.seatmap.find(findEmptyEconomySeat).number);
    //         }
    //       }
    //
    //     } else {
    //
    //       if (flight.emptyBusinessSeatsCount < passengers.length) {
    //         // TODO: Send back error
    //       } else {
    //         for (var i = 0; i < passengers.length; i++) {
    //           returnSeatNumbers.push(flight.seatmap.find(findEmptyBusinessSeat).number);
    //         }
    //       }
    //
    //     }
    //
    //   });
    //
    // }

    // TODO: Complete stripe payment to procede



  }

});

module.exports = router;
